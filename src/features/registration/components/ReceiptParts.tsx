import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import styles from "./ReceiptParts.module.css";

/** Secondary text (grey, small). */
export function MetaText({ as: Tag = "span", children }: { as?: "span" | "p"; children: ReactNode }) {
  return <Tag className={styles.meta}>{children}</Tag>;
}

export function ReceiptList({ children }: { children: ReactNode }) {
  return <ul className={styles.list}>{children}</ul>;
}

interface ReceiptItemProps {
  icon?: ReactNode;
  name: string;
  /** Second line under the name. */
  detail?: string;
  trailing?: ReactNode;
}

export function ReceiptItem({ icon, name, detail, trailing }: ReceiptItemProps) {
  return (
    <li className={styles.listItem}>
      <div className={styles.who}>
        {icon}
        <div>
          <div className={styles.name}>{name}</div>
          {detail && <div className={styles.meta}>{detail}</div>}
        </div>
      </div>
      {trailing}
    </li>
  );
}

export function ReceiptAmount({ children }: { children: ReactNode }) {
  return <span className={styles.amount}>{children}</span>;
}

export function Totals({ children }: { children: ReactNode }) {
  return <div className={styles.totals}>{children}</div>;
}

interface TotalRowProps {
  label: ReactNode;
  value: ReactNode;
  variant?: "default" | "discount" | "grand";
}

export function TotalRow({ label, value, variant = "default" }: TotalRowProps) {
  if (variant === "default") {
    return (
      <div className={styles.totalRow}>
        <span className={styles.meta}>{label}</span>
        <strong>{value}</strong>
      </div>
    );
  }

  return (
    <div className={cx(styles.totalRow, variant === "discount" ? styles.discountRow : styles.grandTotal)}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
