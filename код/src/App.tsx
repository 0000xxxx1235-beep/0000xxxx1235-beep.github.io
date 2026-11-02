import { useEffect, useMemo, useState, type FormEvent, type MouseEvent } from "react";
import Brick from "./components/Brick";
import Reveal from "./components/Reveal";
import { compare, faq, marquee, reviews, sales, specs, tiers, uses } from "./data";

const dodgeLabels = [
  "Не хочу кирпич",
  "Ну точно не хочу",
  "Эй, не убегай... это я",
  "Серьёзно?",
  "Ладно...",
  "Последний шанс",
  "Сдаюсь, беру!",
];

const rub = (n: number) => n.toLocaleString("ru-RU") + " ₽";

function wallComment(n: number) {
  if (n === 1) return "Скромно, со вкусом. Минимализм.";
  if (n < 5) return "Уже начало коллекции.";
  if (n < 10) return "Это фундамент. Мы чувствуем.";
  if (n < 20) return "Можно строить сарай. Скидка 10% включена!";
  return "Соседи начинают переживать. Скидка 10% — держитесь.";
}

function Marquee() {
  const items = [...marquee, ...marquee];
  return (
    <div className="overflow-hidden border-b-[3px] border-ink bg-ink py-2 text-cream">
      <div className="flex w-max animate-marquee gap-10 whitespace-nowrap font-display text-xs font-bold tracking-wider">
        {items.concat(items).map((t, i) => (
          <span key={i} className="flex items-center gap-10">
            {t} <span className="text-sun">★</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function Header({ qty }: { qty: number }) {
  return (
    <header className="sticky top-0 z-40 border-b-[3px] border-ink bg-cream/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <a href="#top" className="flex items-center gap-2 font-display text-lg font-black tracking-tight">
          <span className="inline-block h-6 w-10 rounded-sm border-[3px] border-ink bg-brick" />
          КИРПИЧ<span className="text-brick">®</span>
        </a>
        <nav className="hidden gap-6 text-sm font-extrabold md:flex">
          {[
            ["#uses", "Зачем"],
            ["#specs", "ТТХ"],
            ["#reviews", "Отзывы"],
            ["#buy", "Цены"],
            ["#faq", "Вопросы"],
          ].map(([h, t]) => (
            <a key={h} href={h} className="relative hover:text-brick">
              {t}
            </a>
          ))}
        </nav>
        <a href="#buy" className="hard-btn flex items-center gap-2 rounded-xl bg-sun px-4 py-2 text-sm font-extrabold">
          🛒 Корзина
          <span className="grid h-6 min-w-6 place-items-center rounded-full bg-ink px-1 text-xs text-cream">{qty}</span>
        </a>
      </div>
    </header>
  );
}

function Hero() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [attempts, setAttempts] = useState(0);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const onMove = (e: MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setTilt({
      x: ((e.clientX - r.left) / r.width - 0.5) * 2,
      y: ((e.clientY - r.top) / r.height - 0.5) * 2,
    });
  };

  const dodge = (e: MouseEvent) => {
    if (attempts >= dodgeLabels.length - 1) return;
    e.preventDefault();
    setAttempts((a) => a + 1);
    setPos({ x: (Math.random() - 0.5) * 220, y: (Math.random() - 0.5) * 90 });
  };

  const surrendered = attempts >= dodgeLabels.length - 1;

  return (
    <section id="top" onMouseMove={onMove} className="bg-dots relative overflow-hidden border-b-[3px] border-ink">
      {["🧱", "🧱", "🧱", "🧱", "🧱"].map((e, i) => (
        <span
          key={i}
          className="pointer-events-none absolute animate-floaty select-none text-4xl opacity-60 md:text-5xl"
          style={{ left: `${8 + i * 21}%`, top: `${[12, 70, 25, 78, 8][i]}%`, animationDelay: `${i * 0.8}s` }}
        >
          {e}
        </span>
      ))}

      <div className="relative mx-auto grid max-w-6xl items-center gap-8 px-4 py-14 md:grid-cols-[1.1fr_1fr] md:py-20">
        <div>
          <div className="mb-5 inline-block -rotate-2 rounded-full border-[3px] border-ink bg-sun px-4 py-1 text-xs font-extrabold uppercase tracking-wide shadow-[4px_4px_0_#151210]">
            🔥 Новинка тысячелетия (и всех предыдущих)
          </div>
          <h1 className="font-display text-[2.6rem] font-black uppercase leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
            Один <br />
            <span className="relative inline-block text-brick">
              кирпич.
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" preserveAspectRatio="none">
                <path d="M2 8 Q 30 0 60 7 T 120 6 T 198 5" stroke="#151210" strokeWidth="4" fill="none" strokeLinecap="round" />
              </svg>
            </span>
            <br />
            <span className="stroke-text">Ноль</span> проблем.
          </h1>
          <p className="mt-7 max-w-xl text-lg font-semibold leading-relaxed text-ink/80">
            Не гнётся. Не глючит. Не просит обновиться. Единственный гаджет, который{" "}
            <mark className="bg-sun px-1">становится только крепче</mark> после падения с пятого этажа.
          </p>

          <div className="relative mt-9 flex flex-wrap items-center gap-5">
            <a href="#buy" className="hard-btn rounded-2xl bg-brick px-7 py-4 font-display text-sm font-black uppercase text-cream">
              Купить кирпич →
            </a>
            <button
              onMouseEnter={dodge}
              onClick={(e) => {
                if (surrendered) {
                  document.getElementById("buy")?.scrollIntoView();
                } else dodge(e);
              }}
              style={{ transform: `translate(${pos.x}px, ${pos.y}px)`, transition: "transform .25s cubic-bezier(.2,1.4,.4,1)" }}
              className={`hard-btn rounded-2xl px-6 py-4 text-sm font-extrabold ${surrendered ? "bg-sun" : "bg-white"}`}
            >
              {dodgeLabels[attempts]}
            </button>
          </div>

          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm font-extrabold">
            <span>⭐ 4,9 из 5 (мнение кота)</span>
            <span>🚚 Доставка: «когда-нибудь»</span>
            <span>💪 1000+ довольных рук</span>
          </div>
        </div>

        <div className="relative mx-auto aspect-square w-full max-w-[520px]" style={{ perspective: 900 }}>
          <div className="rays hard absolute inset-4 rounded-full" />
          <div
            className="absolute inset-0 grid place-items-center"
            style={{
              transform: `rotateY(${tilt.x * 14}deg) rotateX(${-tilt.y * 12}deg)`,
              transition: "transform .15s ease-out",
            }}
          >
            <Brick className="w-[92%] animate-floaty drop-shadow-[0_18px_0_rgba(21,18,16,0.15)]" />
          </div>

          <div className="absolute -left-1 top-6 rotate-[-10deg] animate-wiggle rounded-xl border-[3px] border-ink bg-white px-3 py-2 text-center text-xs font-extrabold shadow-[4px_4px_0_#151210]">
            Без Wi-Fi!
            <div className="font-display text-lg text-brick">ЭТО ПЛЮС</div>
          </div>
          <div className="absolute -right-1 bottom-10 rotate-[8deg] rounded-full border-[3px] border-ink bg-brick px-4 py-5 text-center font-display text-cream shadow-[4px_4px_0_#151210]">
            <div className="text-2xl font-black leading-none">199₽</div>
            <div className="text-[10px] font-bold">всего-то</div>
          </div>
          <div className="absolute bottom-2 left-4 -rotate-3 rounded-lg border-[3px] border-ink bg-sun px-3 py-1 text-xs font-extrabold shadow-[3px_3px_0_#151210]">
            Ударопрочность 100%
          </div>
        </div>
      </div>
    </section>
  );
}

function Stats() {
  const items = [
    ["0", "обновлений прошивки"],
    ["∞", "срок службы, ну почти"],
    ["3,6 кг", "чистой надёжности"],
    ["100%", "кирпичности"],
  ];
  return (
    <section className="border-b-[3px] border-ink bg-brick text-cream">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-10 md:grid-cols-4">
        {items.map(([n, t], i) => (
          <Reveal key={t} delay={i * 80} className="text-center">
            <div className="font-display text-4xl font-black md:text-5xl">{n}</div>
            <div className="mt-1 text-sm font-bold opacity-90">{t}</div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function SectionTitle({ kicker, children }: { kicker: string; children: React.ReactNode }) {
  return (
    <Reveal className="mb-12 max-w-3xl">
      <div className="mb-3 inline-block rotate-1 border-[3px] border-ink bg-ink px-3 py-1 text-xs font-extrabold uppercase tracking-widest text-sun">
        {kicker}
      </div>
      <h2 className="font-display text-3xl font-black uppercase leading-[1.05] sm:text-5xl">{children}</h2>
    </Reveal>
  );
}

function Uses() {
  return (
    <section id="uses" className="mx-auto max-w-6xl px-4 py-20">
      <SectionTitle kicker="Применение">
        8 причин, <span className="text-brick">зачем</span> вам кирпич
      </SectionTitle>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {uses.map((u, i) => (
          <Reveal key={u.title} delay={(i % 4) * 90}>
            <div
              className={`hard group h-full rounded-2xl bg-white p-5 transition-transform hover:-translate-y-2 ${
                i % 2 ? "hover:rotate-1" : "hover:-rotate-1"
              }`}
            >
              <div className="mb-3 grid h-14 w-14 place-items-center rounded-xl border-[3px] border-ink bg-sun text-3xl transition-transform group-hover:scale-110 group-hover:rotate-6">
                {u.emoji}
              </div>
              <h3 className="font-display text-base font-extrabold uppercase">{u.title}</h3>
              <p className="mt-2 text-sm font-semibold leading-relaxed text-ink/70">{u.text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Specs() {
  return (
    <section id="specs" className="bg-bricks border-y-[3px] border-ink">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-20 lg:grid-cols-[1fr_1.1fr]">
        <Reveal>
          <div className="mb-3 inline-block -rotate-1 border-[3px] border-ink bg-sun px-3 py-1 text-xs font-extrabold uppercase tracking-widest">
            Технические характеристики
          </div>
          <h2 className="font-display text-3xl font-black uppercase leading-[1.05] text-cream sm:text-5xl">
            Железо? <br /> Нет. <span className="text-sun">Глина.</span>
          </h2>
          <p className="mt-5 max-w-md font-semibold text-cream/90">
            Мы потратили на разработку несколько тысячелетий. Все баги исправлены ещё в Древнем Египте.
          </p>
          <div className="mx-auto mt-8 max-w-[320px] lg:mx-0">
            <Brick tone="gold" label="ТТХ" sub="Проверено веками" className="w-full animate-wiggle" />
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="hard overflow-hidden rounded-2xl bg-cream">
            {specs.map(([k, v], i) => (
              <div
                key={k}
                className={`grid grid-cols-[110px_1fr] gap-3 px-5 py-3.5 text-sm sm:grid-cols-[150px_1fr] ${
                  i % 2 ? "bg-white" : "bg-cream"
                } ${i ? "border-t-2 border-ink/20" : ""}`}
              >
                <span className="font-display text-xs font-extrabold uppercase text-brick">{k}</span>
                <span className="font-bold">{v}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Compare() {
  const Cell = ({ ok }: { ok: boolean }) => (
    <span className={`inline-grid h-8 w-8 place-items-center rounded-full border-[3px] border-ink text-sm font-black ${ok ? "bg-[#7ed957]" : "bg-[#ff6b6b]"}`}>
      {ok ? "✓" : "✕"}
    </span>
  );
  return (
    <section className="mx-auto max-w-6xl px-4 py-20">
      <SectionTitle kicker="Битва титанов">
        Кирпич против <span className="stroke-text">смартфона</span>
      </SectionTitle>
      <Reveal>
        <div className="hard overflow-x-auto rounded-2xl bg-white">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="border-b-[3px] border-ink bg-sun font-display text-xs uppercase">
                <th className="p-4">Критерий</th>
                <th className="p-4 text-center text-brick">🧱 Кирпич</th>
                <th className="p-4 text-center">📱 Смартфон</th>
                <th className="p-4 text-center">🔊 Умная колонка</th>
              </tr>
            </thead>
            <tbody>
              {compare.map((r, i) => (
                <tr key={r.feature} className={i % 2 ? "bg-cream/60" : ""}>
                  <td className="p-4 font-bold">{r.feature}</td>
                  <td className="p-4 text-center">
                    <Cell ok={r.brick} />
                  </td>
                  <td className="p-4 text-center">
                    <Cell ok={r.phone} />
                  </td>
                  <td className="p-4 text-center">
                    <Cell ok={r.speaker} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs font-bold text-ink/60">* «Нужен чехол» — единственный пункт, где у кирпича нет преимуществ. И это тоже преимущество.</p>
      </Reveal>
    </section>
  );
}

function Reviews() {
  return (
    <section id="reviews" className="bg-dots border-y-[3px] border-ink bg-mortar/50">
      <div className="mx-auto max-w-6xl px-4 py-20">
        <SectionTitle kicker="Отзывы (почти настоящие)">
          Люди <span className="text-brick">в восторге.</span> Кот тоже.
        </SectionTitle>
        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r, i) => (
            <Reveal key={r.name} delay={(i % 3) * 100}>
              <figure className={`hard h-full rounded-2xl p-6 transition-transform hover:rotate-0 hover:scale-[1.03] ${r.bg} ${r.rot}`}>
                <div className="text-lg tracking-widest text-brick">
                  {"★".repeat(r.stars)}
                  <span className="text-ink/20">{"★".repeat(5 - r.stars)}</span>
                </div>
                <blockquote className="mt-3 font-bold leading-relaxed">«{r.text}»</blockquote>
                <figcaption className="mt-4 border-t-2 border-dashed border-ink/30 pt-3 text-sm font-extrabold">— {r.name}</figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Wall({ n }: { n: number }) {
  const perRow = 6;
  const rows: number[] = [];
  let left = n;
  while (left > 0) {
    rows.push(Math.min(perRow, left));
    left -= perRow;
  }
  return (
    <div className="flex min-h-[170px] flex-col-reverse items-center justify-start gap-[3px] pb-2">
      {rows.map((count, r) => (
        <div key={r} className="flex gap-[3px]" style={{ marginLeft: r % 2 ? 26 : 0 }}>
          {Array.from({ length: count }).map((_, i) => (
            <div
              key={i}
              className="h-6 w-[50px] animate-pop rounded-[3px] border-2 border-ink bg-brick shadow-[inset_0_-4px_0_rgba(0,0,0,.25),inset_0_3px_0_rgba(255,255,255,.2)]"
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function Buy({
  qty,
  setQty,
  onOrder,
}: {
  qty: number;
  setQty: (n: number) => void;
  onOrder: (name: string, total: number, tierName: string) => void;
}) {
  const [tierId, setTierId] = useState("pro");
  const [name, setName] = useState("");
  const [addr, setAddr] = useState("");
  const [promo, setPromo] = useState("");
  const tier = tiers.find((t) => t.id === tierId)!;

  const { subtotal, discount, promoOff, total } = useMemo(() => {
    const subtotal = tier.price * qty;
    const discount = qty >= 10 ? subtotal * 0.1 : 0;
    const promoOff = promo.trim().toUpperCase() === "КИРПИЧ" ? (subtotal - discount) * 0.05 : 0;
    return { subtotal, discount, promoOff, total: Math.round(subtotal - discount - promoOff) };
  }, [tier, qty, promo]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    onOrder(name.trim() || "Дорогой друг", total, tier.name);
    setName("");
    setAddr("");
  };

  return (
    <section id="buy" className="mx-auto max-w-6xl px-4 py-20">
      <SectionTitle kicker="Цены. Приятные.">
        Выбирайте <span className="text-brick">свой</span> кирпич
      </SectionTitle>

      <div className="grid gap-7 md:grid-cols-3">
        {tiers.map((t, i) => {
          const active = tierId === t.id;
          return (
            <Reveal key={t.id} delay={i * 100}>
              <button
                onClick={() => setTierId(t.id)}
                className={`hard relative flex h-full w-full flex-col rounded-2xl p-6 text-left transition-all hover:-translate-y-1 ${
                  active ? "bg-sun" : "bg-white"
                } ${t.hit ? "md:-translate-y-3" : ""}`}
                aria-pressed={active}
              >
                {t.hit && (
                  <span className="absolute -right-3 -top-4 rotate-6 rounded-full border-[3px] border-ink bg-brick px-3 py-1 text-xs font-extrabold text-cream">
                    ХИТ!
                  </span>
                )}
                <Brick tone={t.tone} label={t.id === "pro" ? "PRO" : t.id === "collector" ? "RARE" : "КИРПИЧ"} sub={t.id === "collector" ? "Ограниченно" : "Оригинал"} className="mx-auto mb-2 w-40" />
                <h3 className="font-display text-lg font-black uppercase">{t.name}</h3>
                <p className="mb-3 text-xs font-bold text-ink/60">{t.tag}</p>
                <div className="mb-4 font-display text-4xl font-black">{rub(t.price)}</div>
                <ul className="mb-5 space-y-2 text-sm font-bold">
                  {t.perks.map((p) => (
                    <li key={p} className="flex gap-2">
                      <span className="text-brick">✓</span> {p}
                    </li>
                  ))}
                </ul>
                <span
                  className={`mt-auto rounded-xl border-[3px] border-ink px-4 py-2 text-center text-sm font-extrabold ${
                    active ? "bg-ink text-sun" : "bg-cream"
                  }`}
                >
                  {active ? "✓ Выбрано" : "Выбрать"}
                </span>
              </button>
            </Reveal>
          );
        })}
      </div>

      {/* Конструктор + форма */}
      <Reveal className="mt-14">
        <div className="hard grid overflow-hidden rounded-3xl bg-cream lg:grid-cols-2">
          <div className="bg-dots border-b-[3px] border-ink bg-white p-6 lg:border-b-0 lg:border-r-[3px]">
            <div className="mb-1 font-display text-xs font-extrabold uppercase text-brick">Конструктор стены</div>
            <h3 className="font-display text-2xl font-black uppercase">Сколько кирпичей надо?</h3>
            <div className="mt-6 flex items-center gap-4">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="hard-btn h-12 w-12 rounded-xl bg-white font-display text-2xl font-black"
                aria-label="Меньше"
              >
                −
              </button>
              <div className="min-w-16 text-center font-display text-5xl font-black">{qty}</div>
              <button
                onClick={() => setQty(Math.min(30, qty + 1))}
                className="hard-btn h-12 w-12 rounded-xl bg-sun font-display text-2xl font-black"
                aria-label="Больше"
              >
                +
              </button>
              <input
                type="range"
                min={1}
                max={30}
                value={qty}
                onChange={(e) => setQty(+e.target.value)}
                className="ml-2 hidden flex-1 accent-brick sm:block"
                aria-label="Количество"
              />
            </div>
            <p className="mt-4 min-h-6 text-sm font-extrabold text-brick">💬 {wallComment(qty)}</p>
            <div className="mt-4 overflow-hidden rounded-xl border-[3px] border-ink bg-mortar/60 p-3">
              <Wall n={qty} />
              <div className="-mx-3 -mb-3 h-3 border-t-[3px] border-ink bg-[#6b8e3a]" />
            </div>
          </div>

          <form onSubmit={submit} className="p-6">
            <div className="mb-1 font-display text-xs font-extrabold uppercase text-brick">Оформление</div>
            <h3 className="font-display text-2xl font-black uppercase">Заказать прямо сейчас</h3>
            <div className="mt-5 space-y-4">
              <label className="block">
                <span className="mb-1 block text-xs font-extrabold uppercase">Как вас зовут?</span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Например, Будущий Владелец Кирпича"
                  className="w-full rounded-xl border-[3px] border-ink bg-white px-4 py-3 font-bold outline-none focus:bg-sun/30"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-extrabold uppercase">Куда падать? (адрес)</span>
                <input
                  value={addr}
                  onChange={(e) => setAddr(e.target.value)}
                  required
                  placeholder="Город, улица, дом, подъезд, этаж"
                  className="w-full rounded-xl border-[3px] border-ink bg-white px-4 py-3 font-bold outline-none focus:bg-sun/30"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-extrabold uppercase">Промокод (подсказка: «КИРПИЧ»)</span>
                <input
                  value={promo}
                  onChange={(e) => setPromo(e.target.value)}
                  placeholder="Секретное слово"
                  className="w-full rounded-xl border-[3px] border-ink bg-white px-4 py-3 font-bold outline-none focus:bg-sun/30"
                />
              </label>
            </div>

            <div className="mt-5 space-y-1 rounded-xl border-[3px] border-dashed border-ink bg-white p-4 text-sm font-bold">
              <div className="flex justify-between">
                <span>
                  {tier.name} × {qty}
                </span>
                <span>{rub(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-brick">
                  <span>Скидка «Строитель»</span>
                  <span>−{rub(Math.round(discount))}</span>
                </div>
              )}
              {promoOff > 0 && (
                <div className="flex justify-between text-brick">
                  <span>Промокод сработал 🎉</span>
                  <span>−{rub(Math.round(promoOff))}</span>
                </div>
              )}
              <div className="flex justify-between border-t-2 border-ink pt-2 font-display text-xl font-black">
                <span>Итого</span>
                <span>{rub(total)}</span>
              </div>
            </div>

            <button type="submit" className="hard-btn mt-5 w-full rounded-2xl bg-brick px-6 py-4 font-display text-sm font-black uppercase text-cream">
              Оформить и обнять кирпич 🧱
            </button>
            <p className="mt-3 text-center text-xs font-bold text-ink/50">Оплата при получении. Деньги принимаем, кирпичами не берём.</p>
          </form>
        </div>
      </Reveal>
    </section>
  );
}

function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="border-t-[3px] border-ink bg-sun">
      <div className="mx-auto max-w-3xl px-4 py-20">
        <SectionTitle kicker="FAQ">
          Частые <span className="text-brick">вопросы</span>
        </SectionTitle>
        <div className="space-y-4">
          {faq.map((f, i) => (
            <Reveal key={f.q} delay={i * 50}>
              <div className="hard overflow-hidden rounded-2xl bg-white">
                <button onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-center justify-between gap-4 p-5 text-left font-display text-sm font-extrabold uppercase">
                  {f.q}
                  <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border-[3px] border-ink bg-cream text-lg transition-transform ${open === i ? "rotate-45 bg-brick text-cream" : ""}`}>+</span>
                </button>
                <div className={`grid transition-all duration-300 ${open === i ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                  <div className="overflow-hidden">
                    <p className="border-t-2 border-dashed border-ink/30 p-5 font-semibold leading-relaxed text-ink/80">{f.a}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="bg-bricks border-y-[3px] border-ink">
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <h2 className="font-display text-3xl font-black uppercase leading-tight text-cream sm:text-6xl">
          Не будь <span className="text-sun">кирпичом.</span>
          <br />
          Купи кирпич.
        </h2>
        <p className="mx-auto mt-5 max-w-lg font-bold text-cream/90">Жизнь слишком короткая, чтобы жить без кирпича. Особенно по цене чашки кофе.</p>
        <a href="#buy" className="hard-btn mt-8 inline-block rounded-2xl bg-sun px-8 py-4 font-display text-sm font-black uppercase">
          Хочу кирпич прямо сейчас
        </a>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-ink text-cream">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-center text-sm font-bold md:flex-row md:text-left">
        <div>
          <div className="font-display text-lg font-black">
            КИРПИЧ<span className="text-brick">®</span> & КО
          </div>
          <div className="text-cream/60">© 2026 Все права защищены. Как кирпичи.</div>
        </div>
        <div className="max-w-md text-xs text-cream/50">
          Сайт является шуткой. Но кирпич — самый настоящий (мысленно). Кирпичи не вызывают привыкания, но вызывают уважение. Не бросайте в людей.
        </div>
        <a href="#top" className="rounded-xl border-[3px] border-cream px-4 py-2 transition hover:bg-cream hover:text-ink">
          Наверх ↑
        </a>
      </div>
    </footer>
  );
}

export default function App() {
  const [qty, setQty] = useState(1);
  const [order, setOrder] = useState<null | { name: string; total: number; tier: string; code: string }>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    let i = 0;
    let hide: number;
    const show = () => {
      setToast(sales[i++ % sales.length]);
      hide = window.setTimeout(() => setToast(null), 4200);
    };
    const first = window.setTimeout(show, 4000);
    const iv = window.setInterval(show, 11000);
    return () => {
      clearTimeout(first);
      clearTimeout(hide);
      clearInterval(iv);
    };
  }, []);

  return (
    <div>
      <Marquee />
      <Header qty={qty} />
      <main>
        <Hero />
        <Stats />
        <Uses />
        <Specs />
        <Compare />
        <Reviews />
        <Buy
          qty={qty}
          setQty={setQty}
          onOrder={(name, total, tier) =>
            setOrder({ name, total, tier, code: "КРП-" + Math.random().toString(36).slice(2, 8).toUpperCase() })
          }
        />
        <Faq />
        <FinalCta />
      </main>
      <Footer />

      {toast && (
        <div key={toast} className="hard fixed bottom-4 left-4 z-50 max-w-[280px] animate-slide rounded-xl bg-white px-4 py-3 text-sm font-extrabold">
          {toast}
        </div>
      )}

      {order && (
        <div className="fixed inset-0 z-[60] grid place-items-center bg-ink/70 p-4" onClick={() => setOrder(null)}>
          <div onClick={(e) => e.stopPropagation()} className="hard relative w-full max-w-md animate-pop rounded-3xl bg-cream p-7 text-center">
            <Brick tone="gold" label="УРА!" sub="Заказ принят" className="mx-auto w-44 animate-wiggle" />
            <h3 className="mt-2 font-display text-2xl font-black uppercase">Спасибо, {order.name}!</h3>
            <p className="mt-3 font-semibold leading-relaxed text-ink/80">
              «{order.tier}» уже собирает вещи и выезжает к вам. Едет медленно, но неотвратимо — как любой хороший кирпич.
            </p>
            <div className="mt-4 rounded-xl border-[3px] border-dashed border-ink bg-white p-3 text-sm font-extrabold">
              Трек-номер: <span className="text-brick">{order.code}</span>
              <br />К оплате при получении: {rub(order.total)}
            </div>
            <button onClick={() => setOrder(null)} className="hard-btn mt-5 rounded-2xl bg-brick px-6 py-3 font-display text-sm font-black uppercase text-cream">
              Ждём кирпич
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
