/**
 * Сервер мультиплеера для 3D танкового боя.
 *
 * Архитектура: relay-сервер (не авторитативная симуляция).
 * Каждый клиент сам считает физику и попадания СВОЕГО танка и танков,
 * которые он видит, а сервер только:
 *   1) распределяет игроков по комнатам и командам (ally/enemy),
 *   2) пересылает сообщения от одного клиента остальным в той же комнате.
 *
 * Это осознанное упрощение ради реалистичного объёма работы:
 * честная античит-защита требует серверной симуляции всей физики и урона,
 * что кратно больше по объёму. Для игры с друзьями (без цели защититься
 * от читеров) такой архитектуры достаточно и она гораздо быстрее
 * разворачивается на бесплатном хостинге.
 *
 * ЗАПУСК ЛОКАЛЬНО:
 *   npm install
 *   node server.js
 *   (по умолчанию слушает порт из переменной окружения PORT или 8080)
 *
 * ДЕПЛОЙ НА БЕСПЛАТНЫЙ ХОСТИНГ (см. подробности в README.md):
 *   Render.com / Railway.app / Glitch.com - подключаете репозиторий,
 *   команда запуска "node server.js", порт браузер сообщает сам через process.env.PORT.
 */

const http = require('http');
const WebSocket = require('ws');

const PORT = process.env.PORT || 8080;

// Простейшая раздача статики не нужна - клиент (index.html) можно хостить
// отдельно (например, тот же бесплатный хостинг умеет отдавать статику),
// сервер отвечает только за WebSocket. Дополнительно отдаём health-check
// на "/", чтобы бесплатные хостинги видели, что сервис "живой".
const httpServer = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Tank battle multiplayer relay server is running.\n');
});

const wss = new WebSocket.Server({ server: httpServer });

// room_code -> { players: Map(playerId -> { ws, name, team, classId }) }
const rooms = new Map();

function genId() {
  return Math.random().toString(36).slice(2, 10);
}

function getOrCreateRoom(code) {
  if (!rooms.has(code)) rooms.set(code, { players: new Map() });
  return rooms.get(code);
}

function teamCounts(room) {
  let ally = 0, enemy = 0;
  for (const p of room.players.values()) { if (p.team === 'ally') ally++; else enemy++; }
  return { ally, enemy };
}

function assignTeam(room) {
  const { ally, enemy } = teamCounts(room);
  return ally <= enemy ? 'ally' : 'enemy';
}

function broadcastToRoom(room, payload, excludeId) {
  const data = JSON.stringify(payload);
  for (const [id, p] of room.players) {
    if (id === excludeId) continue;
    if (p.ws.readyState === WebSocket.OPEN) p.ws.send(data);
  }
}

function removePlayer(roomCode, playerId) {
  const room = rooms.get(roomCode);
  if (!room) return;
  room.players.delete(playerId);
  broadcastToRoom(room, { t: 'player_left', id: playerId });
  if (room.players.size === 0) rooms.delete(roomCode);
}

wss.on('connection', (ws) => {
  let currentRoom = null;
  let playerId = null;

  ws.on('message', (raw) => {
    let msg;
    try { msg = JSON.parse(raw); } catch (e) { return; }

    // === ВХОД В КОМНАТУ ===
    if (msg.t === 'join') {
      const roomCode = String(msg.room || 'default').slice(0, 24);
      const room = getOrCreateRoom(roomCode);

      if (room.players.size >= 16) {
        ws.send(JSON.stringify({ t: 'join_error', reason: 'room_full' }));
        return;
      }

      playerId = genId();
      currentRoom = roomCode;
      const team = assignTeam(room);
      const name = String(msg.name || 'Игрок').slice(0, 20);
      const classId = msg.classId || 'medium_2';

      room.players.set(playerId, { ws, name, team, classId });

      // отвечаем новому игроку: его id/команда + список уже подключённых
      const existing = [...room.players.entries()]
        .filter(([id]) => id !== playerId)
        .map(([id, p]) => ({ id, name: p.name, team: p.team, classId: p.classId }));

      ws.send(JSON.stringify({ t: 'joined', id: playerId, team, players: existing }));

      // уведомляем остальных о новом игроке
      broadcastToRoom(room, { t: 'player_joined', id: playerId, name, team, classId }, playerId);
      return;
    }

    if (!currentRoom || !playerId) return; // сообщения без join игнорируем
    const room = rooms.get(currentRoom);
    if (!room) return;

    // === ЛЮБОЕ ДРУГОЕ СООБЩЕНИЕ (state/shot/hitResult/...) - просто ретранслируем ===
    msg.from = playerId;
    broadcastToRoom(room, msg, playerId);
  });

  ws.on('close', () => {
    if (currentRoom && playerId) removePlayer(currentRoom, playerId);
  });

  ws.on('error', () => {
    if (currentRoom && playerId) removePlayer(currentRoom, playerId);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Tank battle relay server listening on port ${PORT}`);
});
