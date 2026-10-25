import { useId, type CSSProperties } from "react";
import { cx } from "@/lib/cx";
import { CheckIcon } from "./Icons";
import styles from "./ChoiceGroup.module.css";

export interface ChoiceOption<T extends string | number> {
  value: T;
  label: string;
  description?: string;
  /** Spoken label when the visible one is terse (e.g. "6–8" -> "Ages 6 to 8"). */
  ariaLabel?: string;
}

interface ChoiceGroupProps<T extends string | number> {
  label: string;
  hideLabel?: boolean;
  options: readonly ChoiceOption<T>[];
  value: T | null;
  onChange: (value: T) => void;
  /** Columns on mobile. */
  columns?: number;
  /** Columns from the tablet breakpoint up; defaults to `columns`. */
  columnsWide?: number;
  size?: "md" | "lg";
  showCheck?: boolean;
}

/** Single-select group of toggle buttons (`aria-pressed`), usable for any option set. */
export function ChoiceGroup<T extends string | number>({
  label,
  hideLabel,
  options,
  value,
  onChange,
  columns = 2,
  columnsWide,
  size = "md",
  showCheck,
}: ChoiceGroupProps<T>) {
  const labelId = useId();
  const gridStyle = { "--cols": columns, "--cols-wide": columnsWide ?? columns } as CSSProperties;

  return (
    <div role="group" aria-labelledby={labelId} className={styles.group}>
      <div id={labelId} className={cx(styles.label, hideLabel && "visually-hidden")}>
        {label}
      </div>
      <div className={styles.grid} style={gridStyle}>
        {options.map((option) => {
          const selected = option.value === value;
          return (
            <button
              key={String(option.value)}
              type="button"
              aria-pressed={selected}
              aria-label={option.ariaLabel}
              className={cx(styles.choice, styles[size])}
              onClick={() => onChange(option.value)}
            >
              <span className={styles.choiceLabel}>
                {showCheck && selected && <CheckIcon size={18} />}
                {option.label}
              </span>
              {option.description && <span className={styles.description}>{option.description}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
