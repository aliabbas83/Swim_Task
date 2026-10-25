"use client";

import { useRouter } from "next/navigation";
import { DolphinIcon } from "@/components/brand/Dolphin";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { StickyFooter } from "@/components/ui/StickyFooter";
import { RegistrationStep } from "../components/RegistrationStep";
import { MetaText, ReceiptAmount, ReceiptItem, ReceiptList, TotalRow, Totals } from "../components/ReceiptParts";
import { SubmissionError, SubmissionLoading } from "../components/SubmissionStatus";
import { CLUB } from "../config";
import { formatChildCount, formatMoney, formatPercent, formatTrainingGroup, getPeriod } from "../lib/format";
import { getStep, ROUTES } from "../lib/steps";
import { useRegistration } from "../state/RegistrationProvider";
import { useStepGuard } from "../state/useStepGuard";
import styles from "./ReviewScreen.module.css";

export function ReviewScreen() {
  const { ready } = useStepGuard("review");
  const { state, actions, price } = useRegistration();
  const router = useRouter();
  if (!ready) return null;

  const period = getPeriod(state.periodId);
  const { submission, parent } = state;

  const confirm = async () => {
    if (await actions.submit()) router.push(ROUTES.success);
  };

  if (submission.status === "submitting") {
    return (
      <SubmissionLoading
        summary={`${formatChildCount(price.childCount)} · ${period?.label ?? ""} · ${formatMoney(price.total)}`}
      />
    );
  }

  if (submission.status === "error") {
    return <SubmissionError message={submission.message} onRetry={confirm} onBack={actions.dismissSubmissionError} />;
  }

  return (
    <RegistrationStep
      stepId="review"
      footer={
        <StickyFooter
          action={
            <Button variant="cta" size="lg" fullWidth onClick={confirm}>
              Confirm registration &middot; {formatMoney(price.total)}
            </Button>
          }
        />
      }
    >
      <div className={styles.reviewGrid}>
        <Card
          title="Children"
          action={
            <Button href={getStep("children").path} variant="ghost">
              Edit
            </Button>
          }
        >
          <ReceiptList>
            {state.children.map((child) => (
              <ReceiptItem
                key={child.id}
                icon={child.gender && <DolphinIcon variant={child.gender} width={40} />}
                name={child.name}
                detail={formatTrainingGroup(child)}
                trailing={<ReceiptAmount>{formatMoney(price.unitPrice)}</ReceiptAmount>}
              />
            ))}
          </ReceiptList>
        </Card>

        <div className={styles.reviewSide}>
          <Card
            title="Schedule"
            action={
              <Button href={getStep("period").path} variant="ghost">
                Change
              </Button>
            }
          >
            <div className={styles.highlight}>
              <MetaText>Course period</MetaText>
              <strong>{period?.label}</strong>
            </div>
            <p>
              {CLUB.course.weeks} weeks &middot; {CLUB.course.days} &middot; {CLUB.course.hoursPerDay} hours a day
            </p>
            <MetaText as="p">Club season: {CLUB.season.label}</MetaText>
            <MetaText as="p">
              Parent: {parent.name} &middot; {parent.phone}
            </MetaText>
          </Card>

          <Card>
            <Totals>
              <TotalRow label="Subtotal" value={formatMoney(price.subtotal)} />
              {price.discountRate > 0 && (
                <TotalRow
                  variant="discount"
                  label={`Family discount ${formatPercent(price.discountRate)}`}
                  value={`− ${formatMoney(price.discount)}`}
                />
              )}
              <TotalRow variant="grand" label="Total" value={formatMoney(price.total)} />
            </Totals>
          </Card>
        </div>
      </div>
    </RegistrationStep>
  );
}
