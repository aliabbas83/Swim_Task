import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { Wave } from "@/components/ui/Decorations";
import { ChevronLeftIcon } from "@/components/ui/Icons";
import { ProgressSteps } from "@/components/ui/ProgressSteps";
import styles from "./StepLayout.module.css";

interface StepLayoutProps {
  stepNumber: number;
  totalSteps: number;
  title: string;
  subtitle?: string;
  backHref: string;
  footer: ReactNode;
  children: ReactNode;
}

/** Page chrome shared by every wizard step: header with back button + progress, content, sticky footer. */
export function StepLayout({ stepNumber, totalSteps, title, subtitle, backHref, footer, children }: StepLayoutProps) {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.titleRow}>
            <Button href={backHref} variant="onDark" aria-label="Back">
              <ChevronLeftIcon size={22} />
            </Button>
            <div>
              <p className={styles.eyebrow}>
                Step {stepNumber} of {totalSteps}
                {subtitle ? ` · ${subtitle}` : ""}
              </p>
              <h1 className={styles.title}>{title}</h1>
            </div>
          </div>
          <ProgressSteps current={stepNumber} total={totalSteps} />
        </div>
        <Wave height={28} className={styles.wave} />
      </header>
      <main className={styles.main}>{children}</main>
      {footer}
    </div>
  );
}
