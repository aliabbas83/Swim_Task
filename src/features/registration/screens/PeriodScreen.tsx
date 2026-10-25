"use client";

import { Button } from "@/components/ui/Button";
import { StickyFooter } from "@/components/ui/StickyFooter";
import { PeriodPicker } from "../components/PeriodPicker";
import { RegistrationStep } from "../components/RegistrationStep";
import { SummaryLine } from "../components/Summary";
import { CLUB } from "../config";
import { getPeriod } from "../lib/format";
import { getNextStep } from "../lib/steps";
import { useRegistration } from "../state/RegistrationProvider";
import { useStepGuard } from "../state/useStepGuard";
import styles from "./PeriodScreen.module.css";

export function PeriodScreen() {
  const { ready } = useStepGuard("period");
  const { state, actions } = useRegistration();
  if (!ready) return null;

  const period = getPeriod(state.periodId);
  const next = getNextStep("period");

  return (
    <RegistrationStep
      stepId="period"
      footer={
        <StickyFooter
          summary={period && <SummaryLine label="Selected period" value={period.label} />}
          action={
            period && next ? (
              <Button href={next.path} size="lg" fullWidth>
                Continue
              </Button>
            ) : (
              <Button size="lg" fullWidth disabled>
                Choose a period to continue
              </Button>
            )
          }
        />
      }
    >
      <p className={styles.intro}>
        Each course lasts {CLUB.course.weeks} weeks, {CLUB.course.days}, {CLUB.course.hoursPerDay} hours a day. Tap the
        period that suits your family.
      </p>
      <PeriodPicker value={state.periodId} onChange={actions.selectPeriod} />
    </RegistrationStep>
  );
}
