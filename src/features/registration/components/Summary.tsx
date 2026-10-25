import type { ReactNode } from "react";
import { formatChildCount, formatMoney, formatPercent } from "../lib/format";
import type { PriceBreakdown } from "../types";
import styles from "./Summary.module.css";

interface SummaryLineProps {
  label: string;
  value: ReactNode;
  note?: string;
}

/** Label on the left, large live-updating value on the right (used in the sticky footer). */
export function SummaryLine({ label, value, note }: SummaryLineProps) {
  return (
    <div className={styles.line}>
      <div>
        <div className={styles.label}>{label}</div>
        {note && <div className={styles.note}>{note}</div>}
      </div>
      <div className={styles.value} aria-live="polite">
        {value}
      </div>
    </div>
  );
}

export function PriceSummary({ price }: { price: PriceBreakdown }) {
  return (
    <SummaryLine
      label={formatChildCount(price.childCount)}
      note={price.discountRate > 0 ? `Family discount ${formatPercent(price.discountRate)}` : undefined}
      value={formatMoney(price.total)}
    />
  );
}
