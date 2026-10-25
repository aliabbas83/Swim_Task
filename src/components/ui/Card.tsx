import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import styles from "./Card.module.css";

interface CardProps {
  title?: string;
  description?: string;
  /** Rendered before the title (e.g. an icon). */
  leading?: ReactNode;
  /** Rendered at the end of the header (e.g. an Edit button). */
  action?: ReactNode;
  className?: string;
  children?: ReactNode;
}

export function Card({ title, description, leading, action, className, children }: CardProps) {
  const hasHeader = Boolean(title || action || leading);

  return (
    <section className={cx(styles.card, className)}>
      {hasHeader && (
        <header className={styles.header}>
          <div className={styles.heading}>
            {leading}
            {title && <h2 className={styles.title}>{title}</h2>}
          </div>
          {action}
        </header>
      )}
      {description && <p className={styles.description}>{description}</p>}
      {children}
    </section>
  );
}
