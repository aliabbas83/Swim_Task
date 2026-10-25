export const DOLPHIN_VIEWBOX = "5 11 57 42";

const BODY =
  "M60 30.2 C 58 28.6, 55 27.6, 52.5 27.4 C 50 23, 44.5 20.6, 38.5 21.2 L 31 13.5 C 30.5 17, 30.2 20, 30.6 22.6 C 24 24.5, 18.5 30, 15.6 37.6 C 12.5 35.4, 9.5 34.8, 7 35.4 C 9.5 37.6, 11.5 40, 12.4 42.6 C 11.6 45.4, 11.8 48.4, 13 51 C 14.6 47.8, 16.4 45.2, 18.6 43.6 C 23 37.6, 30.5 33.4, 39.5 33 C 45 32.8, 50 33.4, 54.5 32.8 C 57 32.4, 59 31.6, 60 30.2 Z";
const BELLY = "M55 32.6 C 50 31.2, 45 30.6, 39 31 C 31 31.6, 24 35.8, 19.5 42 C 24 37.2, 31 33.6, 39.5 33 C 45 32.8, 50 33.4, 55 32.6 Z";
const SHINE = "M48 24.2 C 42 22.6, 35 24, 28 28.5";
const FLIPPER = "M41 32.6 C 40 35.5, 38 38, 35.5 39.5 C 39.5 39, 43 36.5, 44.5 33 Z";
const SMILE = "M54.5 31.7 Q 56.8 31.9 59 30.9";

export interface DolphinPalette {
  body: string;
  belly: string;
  fin: string;
  eye: string;
  outline?: string;
}

export const DOLPHIN_PALETTES = {
  boy: { body: "#1E6FD9", belly: "#DDF1FF", fin: "#0D4FA8", eye: "#08254D" },
  girl: { body: "#E0559B", belly: "#FFE3F0", fin: "#C2185B", eye: "#5A0A2C" },
  neutral: { body: "#C9DCE6", belly: "#EEF6FA", fin: "#AFC6D2", eye: "#6B8494" },
  light: { body: "#3FA9F5", belly: "#DDF1FF", fin: "#1E6FD9", eye: "#08254D" },
} satisfies Record<string, DolphinPalette>;

export type DolphinVariant = keyof typeof DOLPHIN_PALETTES;

/** Vector dolphin drawn into a `DOLPHIN_VIEWBOX` viewport. `detailed={false}` drops shine and smile for small sizes. */
export function DolphinShape({ palette, detailed = true }: { palette: DolphinPalette; detailed?: boolean }) {
  return (
    <g>
      <path
        d={BODY}
        fill={palette.body}
        stroke={palette.outline}
        strokeWidth={palette.outline ? 0.6 : undefined}
        strokeLinejoin="round"
      />
      <path d={BELLY} fill={palette.belly} />
      {detailed && (
        <path d={SHINE} fill="none" stroke="#fff" strokeOpacity={0.55} strokeWidth={1.4} strokeLinecap="round" />
      )}
      <path d={FLIPPER} fill={palette.fin} />
      <circle cx={51} cy={29.4} r={1.1} fill={palette.eye} />
      {detailed && (
        <>
          <circle cx={51.3} cy={29.1} r={0.35} fill="#fff" />
          <path d={SMILE} fill="none" stroke={palette.eye} strokeWidth={0.6} strokeLinecap="round" />
        </>
      )}
    </g>
  );
}

interface DolphinIconProps {
  variant: DolphinVariant;
  width?: number;
  /** Provide to expose the icon to assistive tech; omit when decorative. */
  title?: string;
  className?: string;
}

export function DolphinIcon({ variant, width = 52, title, className }: DolphinIconProps) {
  const height = Math.round((width * 42) / 57);

  return (
    <svg
      width={width}
      height={height}
      viewBox={DOLPHIN_VIEWBOX}
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <DolphinShape palette={DOLPHIN_PALETTES[variant]} detailed={width >= 40} />
    </svg>
  );
}
