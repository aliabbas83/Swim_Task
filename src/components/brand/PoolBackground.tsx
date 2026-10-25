import styles from "./PoolBackground.module.css";

const LANE_POSITIONS = ["17%", "50%", "83%"];

/** Fixed, non-interactive pool backdrop (lane lines + ripples) behind every page. */
export function PoolBackground() {
  return (
    <div aria-hidden="true" className={styles.pool}>
      {LANE_POSITIONS.map((left) => (
        <span key={left} className={styles.lane} style={{ left }} />
      ))}
      <svg className={styles.ripples} viewBox="0 0 400 800" preserveAspectRatio="none">
        <path d="M-10 260 C 40 240, 80 280, 130 260 S 220 240, 270 262 S 360 280, 410 258" />
        <path d="M-10 460 C 50 440, 90 480, 150 460 S 240 440, 300 464 S 370 480, 410 456" />
        <path d="M-10 660 C 40 644, 100 680, 160 662 S 250 640, 310 664 S 380 680, 410 656" />
      </svg>
    </div>
  );
}
