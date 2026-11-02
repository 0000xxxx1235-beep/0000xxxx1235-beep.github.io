import { useId } from "react";

type Props = {
  className?: string;
  label?: string;
  sub?: string;
  tone?: "red" | "gold" | "dark";
};

const tones = {
  red: { top: "#e0562f", left: "#c0391b", right: "#8e2711", hole: "#5a1608" },
  gold: { top: "#ffe27a", left: "#f2b705", right: "#b88700", hole: "#6b4e00" },
  dark: { top: "#5a5550", left: "#3a3632", right: "#211e1b", hole: "#0b0a09" },
};

export default function Brick({ className = "", label = "КИРПИЧ", sub = "№1 в мире", tone = "red" }: Props) {
  const id = useId().replace(/:/g, "");
  const c = tones[tone];
  const holes = [
    [99.5, 90],
    [143, 115],
    [186.5, 140],
  ];
  return (
    <svg viewBox="0 0 300 270" className={className} role="img" aria-label="Кирпич">
      <defs>
        <pattern id={`n${id}`} width="14" height="14" patternUnits="userSpaceOnUse">
          <circle cx="3" cy="4" r="1" fill="#000" opacity=".18" />
          <circle cx="10" cy="9" r="1.2" fill="#fff" opacity=".15" />
          <circle cx="6" cy="12" r=".8" fill="#000" opacity=".15" />
        </pattern>
      </defs>
      {/* тень */}
      <ellipse cx="150" cy="252" rx="130" ry="14" fill="#151210" opacity=".18" />
      {/* левая грань */}
      <polygon points="13,90 186,190 186,245 13,145" fill={c.left} stroke="#151210" strokeWidth="4" strokeLinejoin="round" />
      <polygon points="13,90 186,190 186,245 13,145" fill={`url(#n${id})`} />
      {/* правая грань */}
      <polygon points="186,190 273,140 273,195 186,245" fill={c.right} stroke="#151210" strokeWidth="4" strokeLinejoin="round" />
      <polygon points="186,190 273,140 273,195 186,245" fill={`url(#n${id})`} />
      {/* верх */}
      <polygon points="100,40 273,140 186,190 13,90" fill={c.top} stroke="#151210" strokeWidth="4" strokeLinejoin="round" />
      <polygon points="100,40 273,140 186,190 13,90" fill={`url(#n${id})`} />
      {/* отверстия */}
      {holes.map(([x, y], i) => (
        <g key={i}>
          <ellipse cx={x} cy={y} rx="21" ry="12" fill={c.hole} stroke="#151210" strokeWidth="3" />
          <ellipse cx={x} cy={y + 3} rx="15" ry="7" fill="#000" opacity=".35" />
        </g>
      ))}
      {/* блик */}
      <polyline points="30,98 100,58" stroke="#fff" strokeOpacity=".5" strokeWidth="4" strokeLinecap="round" fill="none" />
      {/* надпись на левой грани */}
      <g transform="translate(13,90) skewY(30)">
        <text x="86" y="36" textAnchor="middle" fontFamily="Unbounded, Impact, sans-serif" fontWeight="900" fontSize="22" fill="#f6ecd6" stroke="#151210" strokeWidth="1">
          {label}
        </text>
        <text x="86" y="52" textAnchor="middle" fontFamily="Manrope, sans-serif" fontWeight="800" fontSize="10" fill="#f6ecd6" letterSpacing="2">
          {sub.toUpperCase()}
        </text>
      </g>
    </svg>
  );
}
