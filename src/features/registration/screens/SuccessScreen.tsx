"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { DolphinIcon } from "@/components/brand/Dolphin";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { LaneRope, Wave } from "@/components/ui/Decorations";
import { CheckIcon } from "@/components/ui/Icons";
import { StickyFooter } from "@/components/ui/StickyFooter";
import { MetaText, ReceiptItem, ReceiptList, TotalRow, Totals } from "../components/ReceiptParts";
import { CLUB } from "../config";
import { formatChildCount, formatMoney, formatTrainingGroup, getPeriod } from "../lib/format";
import { ROUTES } from "../lib/steps";
import { useRegistration } from "../state/RegistrationProvider";
import styles from "./SuccessScreen.module.css";

export function SuccessScreen() {
  const { state, actions, isHydrated } = useRegistration();
  const router = useRouter();
  const { submission } = state;
  const hasReceipt = submission.status === "success";

  // Landing here without a confirmed registration (refresh, deep link) sends you home.
  useEffect(() => {
    if (isHydrated && !hasReceipt) router.replace(ROUTES.home);
  }, [isHydrated, hasReceipt, router]);

  if (submission.status !== "success") return null;
  const { receipt } = submission;

  const finish = () => {
    actions.reset();
    router.push(ROUTES.home);
  };

  return (
    <div className={styles.page}>
      <header className={styles.successHero}>
        <div className={styles.successBadge}>
          <CheckIcon size={44} strokeWidth={3} />
        </div>
        <h1 className={styles.successTitle}>You&apos;re registered!</h1>
        <p className={styles.successText}>
          We&apos;ve received the registration for {formatChildCount(state.children.length)}. Welcome to {CLUB.name}{" "}
          &mdash; see you at the pool.
        </p>
        <div className={styles.successWater}>
          <LaneRope />
          <Wave height={36} />
        </div>
      </header>

      <main className={styles.successMain}>
        <Card>
          <ReceiptList>
            {state.children.map((child) => (
              <ReceiptItem
                key={child.id}
                icon={child.gender && <DolphinIcon variant={child.gender} width={34} />}
                name={child.name}
                trailing={<MetaText>{formatTrainingGroup(child)}</MetaText>}
              />
            ))}
          </ReceiptList>
          <Totals>
            <TotalRow label="Course period" value={getPeriod(state.periodId)?.label} />
            <TotalRow label="Reference" value={receipt.reference} />
            <TotalRow variant="grand" label="Amount due" value={formatMoney(receipt.total)} />
          </Totals>
        </Card>
      </main>

      <StickyFooter
        action={
          <Button variant="secondary" size="lg" fullWidth onClick={finish}>
            Back to home
          </Button>
        }
      />
    </div>
  );
}
