import { useId } from "react";
import type { EcoLocation } from "@/data/ecopulse";

type Props = { location: EcoLocation; value: number; onChange: (value: number) => void };

function Terrain({ location, variant }: { location: EcoLocation; variant: "before" | "after" }) {
  const id = useId().replace(/:/g, "");
  const after = variant === "after";
  const base = after ? "#536e49" : "#867657";
  const hill = after ? "#6f8753" : "#9d875f";
  const forest = after ? "#254e3d" : "#586344";
  const detail = after ? "#90a065" : "#b39c6d";
  return (
    <svg className="terrain-svg" viewBox="0 0 900 480" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id={`sky-${id}`} x2="0" y2="1"><stop stopColor={after ? "#a2ba9a" : "#c0ac82"} /><stop offset="1" stopColor={base} /></linearGradient>
        <pattern id={`grain-${id}`} width="37" height="31" patternUnits="userSpaceOnUse">
          <circle cx="4" cy="7" r="1" fill="#f5edd6" opacity=".15" /><circle cx="26" cy="20" r="1.4" fill="#18291e" opacity=".12" />
          <path d="M10 28l8-3" stroke="#eee5ca" opacity=".12" />
        </pattern>
      </defs>
      <rect width="900" height="480" fill={`url(#sky-${id})`} />
      <path d="M0 165 100 90l84 52 103-88 96 87 97-106 95 96 79-64 110 103 136-76v386H0Z" fill={hill} opacity=".86" />
      <path d="M0 245 117 167l83 47 120-96 87 98 125-80 110 91 90-80 168 67v286H0Z" fill={base} />
      <path d="M-20 405c120-120 230-93 344-180s170-82 273-15 203 6 334-109v410H-20Z" fill={after ? "#3c6047" : "#74654a"} opacity=".8" />
      <path d="M-20 343c132-83 202-44 315-120 95-63 174-68 242 3 91 94 174 31 385-68" fill="none" stroke={after ? "#668b61" : "#a28e67"} strokeWidth="20" opacity=".66" />
      <path d="M-20 343c132-83 202-44 315-120 95-63 174-68 242 3 91 94 174 31 385-68" fill="none" stroke={after ? "#a5bb8c" : "#c8ae7a"} strokeWidth="2.5" opacity=".52" />
      {Array.from({ length: 18 }, (_, i) => {
        const x = (i * 67 + location.marker.x * 2) % 940 - 20;
        const y = (i * 43 + location.marker.y * 3) % 340 + 65;
        const r = 16 + (i % 4) * 6;
        const keep = after ? i % 3 !== 0 : i % 2 === 0;
        if (!keep) return null;
        return <circle key={i} cx={x} cy={y} r={r} fill={i % 3 === 0 ? detail : forest} opacity={after ? ".76" : ".45"} />;
      })}
      <rect width="900" height="480" fill={`url(#grain-${id})`} />
      <path d="M60 380c120-29 236-18 327-65M583 107c91 30 156 35 248 16" fill="none" stroke="#f4eacb" strokeWidth="1" opacity=".27" />
    </svg>
  );
}

export default function BeforeAfter({ location, value, onChange }: Props) {
  return (
    <div className="compare-wrap">
      <div className="compare-stage" aria-label={`${location.shortName} bölgəsinin əvvəl və sonrakı demo müqayisəsi`}>
        <Terrain location={location} variant="before" />
        <div className="compare-after" style={{ clipPath: `inset(0 ${100 - value}% 0 0)` }}>
          <Terrain location={location} variant="after" />
        </div>
        <div className="compare-label compare-label-before">ƏVVƏL <span>2020-dən öncə</span></div>
        <div className="compare-label compare-label-after">SONRA <span>Demo görüntü</span></div>
        <div className="compare-divider" style={{ left: `${value}%` }}><span>↔</span></div>
        <input
          className="compare-range"
          type="range"
          min="5"
          max="95"
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          aria-label="Əvvəl və sonra görüntüləri arasında müqayisə sürgüsü"
        />
        <div className="compare-coordinate">{location.coordinates}</div>
      </div>
      <div className="compare-footnote"><span className="dot dot-amber" /> Peyk təsviri maketidir · canlı arxiv deyil</div>
    </div>
  );
}
