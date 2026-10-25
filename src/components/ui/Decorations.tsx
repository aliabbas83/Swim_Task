import { useId } from "react";
import { cx } from "@/lib/cx";
import styles from "./Decorations.module.css";

interface WaveProps {
  fill?: string;
  height?: number;
  className?: string;
}

/** Wavy edge that blends a coloured header into the page background. */
export function Wave({ fill = "var(--color-water)", height = 32, className }: WaveProps) {
  return (
    <svg
      aria-hidden="true"
      className={cx(styles.wave, className)}
      style={{ height }}
      viewBox="0 0 390 36"
      preserveAspectRatio="none"
    >
      <path d="M0 18 C 65 0, 130 36, 195 18 S 325 0, 390 18 V36 H0 Z" fill={fill} />
    </svg>
  );
}

/** Orange/white swimming-lane rope. */
export function LaneRope({ className }: { className?: string }) {
  const patternId = `${useId().replace(/:/g, "")}-rope`;

  return (
    <svg aria-hidden="true" className={cx(styles.rope, className)} height="14">
      <defs>
        <pattern id={patternId} width="26" height="14" patternUnits="userSpaceOnUse">
          <rect x="1" y="2" width="11" height="10" rx="5" fill="var(--color-rope)" />
          <rect x="14" y="2" width="11" height="10" rx="5" fill="#fff" />
        </pattern>
      </defs>
      <rect x="0" y="6" width="100%" height="2" fill="#fff" fillOpacity="0.5" />
      <rect x="0" y="0" width="100%" height="14" fill={`url(#${patternId})`} />
    </svg>
  );
}
