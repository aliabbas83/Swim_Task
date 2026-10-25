import { cx } from "@/lib/cx";
import styles from "./ProgressSteps.module.css";

interface ProgressStepsProps {
  /** 1-based number of the current step. */
  current: number;
  total: number;
}

export function ProgressSteps({ current, total }: ProgressStepsProps) {
  return (
    <div
      className={styles.track}
      role="progressbar"
      aria-label="Registration progress"
      aria-valuemin={1}
      aria-valuemax={total}
      aria-valuenow={current}
      aria-valuetext={`Step ${current} of ${total}`}
    >
      {Array.from({ length: total }, (_, index) => (
        <span key={index} className={cx(styles.segment, index < current && styles.done)} />
      ))}
    </div>
  );
}
