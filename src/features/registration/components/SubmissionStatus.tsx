import { DOLPHIN_PALETTES, DOLPHIN_VIEWBOX, DolphinShape } from "@/components/brand/Dolphin";
import { Button } from "@/components/ui/Button";
import { LaneRope, Wave } from "@/components/ui/Decorations";
import { AlertIcon, RetryIcon } from "@/components/ui/Icons";
import { StickyFooter } from "@/components/ui/StickyFooter";
import { CLUB } from "../config";
import styles from "./SubmissionStatus.module.css";

export function SubmissionLoading({ summary }: { summary: string }) {
  return (
    <div className={styles.loading} role="status" aria-live="polite">
      <div className={styles.loadingBody}>
        <div className={styles.spinner}>
          <span className={styles.ring} aria-hidden="true" />
          <svg aria-hidden="true" width="92" height="68" viewBox={DOLPHIN_VIEWBOX} className={styles.bob}>
            <DolphinShape palette={DOLPHIN_PALETTES.light} detailed={false} />
          </svg>
        </div>
        <h1 className={styles.loadingTitle}>
          Registering your children
          <span className={styles.dots} aria-hidden="true">
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </span>
        </h1>
        <p className={styles.loadingText}>Please wait a moment and keep this screen open.</p>
        <p className={styles.chip}>{summary}</p>
      </div>
      <div className={styles.loadingWater} aria-hidden="true">
        <LaneRope />
        <Wave fill="var(--color-water-deep)" height={40} />
      </div>
    </div>
  );
}

interface SubmissionErrorProps {
  message: string;
  onRetry: () => void;
  onBack: () => void;
}

export function SubmissionError({ message, onRetry, onBack }: SubmissionErrorProps) {
  return (
    <div className={styles.errorPage}>
      <header className={styles.errorHeader}>
        <p className={styles.errorBrand}>{CLUB.name}</p>
        <Wave height={36} />
      </header>
      <main className={styles.errorMain}>
        <section role="alert" className={styles.errorCard}>
          <div className={styles.errorIcon}>
            <AlertIcon size={52} />
          </div>
          <h1 className={styles.errorTitle}>Something went wrong</h1>
          <p className={styles.errorText}>{message}</p>
          <p className={styles.errorNote}>Your details are still filled in &mdash; you won&apos;t need to type them again.</p>
        </section>
      </main>
      <StickyFooter
        action={
          <>
            <Button size="lg" fullWidth icon={<RetryIcon size={20} />} onClick={onRetry}>
              Try again
            </Button>
            <Button variant="secondary" fullWidth onClick={onBack}>
              Back to review
            </Button>
          </>
        }
      />
    </div>
  );
}
