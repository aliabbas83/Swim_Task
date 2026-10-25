import { useId } from "react";
import { DolphinShape } from "./Dolphin";

interface LogoProps {
  size?: number;
  className?: string;
}

export function Logo({ size = 168, className }: LogoProps) {
  const uid = useId().replace(/:/g, "");
  const ids = { clip: `${uid}-clip`, blue: `${uid}-blue`, pink: `${uid}-pink`, bg: `${uid}-bg` };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      role="img"
      aria-label="The Dolphins logo: a blue dolphin and a pink dolphin leaping over a wave"
    >
      <defs>
        <clipPath id={ids.clip}>
          <circle cx="50" cy="50" r="46" />
        </clipPath>
        <linearGradient id={ids.blue} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3FA9F5" />
          <stop offset="1" stopColor="#0D4FA8" />
        </linearGradient>
        <linearGradient id={ids.pink} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FF8FC4" />
          <stop offset="1" stopColor="#C2185B" />
        </linearGradient>
        <radialGradient id={ids.bg} cx="0.5" cy="0.35" r="0.7">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#E6F5FC" />
        </radialGradient>
      </defs>

      <circle cx="50" cy="50" r="49" fill="#FFB547" />
      <circle cx="50" cy="50" r="46" fill={`url(#${ids.bg})`} />

      <g clipPath={`url(#${ids.clip})`}>
        <path d="M0 72 C 12 64, 24 64, 36 70 S 62 78, 76 70 S 94 64, 100 68 V100 H0 Z" fill="#7CC4E8" />
        <path d="M0 82 C 14 76, 26 76, 40 81 S 66 88, 80 81 S 96 76, 100 79 V100 H0 Z" fill="#1584C7" />
      </g>

      <g transform="translate(-5 6) scale(0.9)">
        <DolphinShape
          palette={{ body: `url(#${ids.blue})`, belly: "#DDF1FF", fin: "#0D4FA8", eye: "#08254D", outline: "#0A3D82" }}
        />
      </g>
      <g transform="translate(100 0) scale(-1 1)">
        <g transform="translate(-5 6) scale(0.9)">
          <DolphinShape
            palette={{ body: `url(#${ids.pink})`, belly: "#FFE3F0", fin: "#C2185B", eye: "#5A0A2C", outline: "#8E0E44" }}
          />
        </g>
      </g>

      <circle cx="50" cy="20" r="3" fill="#7CC4E8" />
      <circle cx="43" cy="14" r="2" fill="#7CC4E8" />
      <circle cx="57" cy="14" r="2" fill="#7CC4E8" />
    </svg>
  );
}
