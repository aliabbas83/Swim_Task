import type { ReactNode } from "react";
import styles from "./StickyFooter.module.css";

interface StickyFooterProps {
  /** Left side on wide screens, stacked above the action on mobile. */
  summary?: ReactNode;
  action: ReactNode;
}

export function StickyFooter({ summary, action }: StickyFooterProps) {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        {summary && <div className={styles.summary}>{summary}</div>}
        <div className={styles.action}>{action}</div>
      </div>
    </footer>
  );
}
