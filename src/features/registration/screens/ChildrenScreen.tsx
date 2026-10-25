"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PlusIcon } from "@/components/ui/Icons";
import { StickyFooter } from "@/components/ui/StickyFooter";
import { ChildCard } from "../components/ChildCard";
import { ChildCountPicker } from "../components/ChildCountPicker";
import { RegistrationStep } from "../components/RegistrationStep";
import { PriceSummary } from "../components/Summary";
import { CLUB } from "../config";
import { getPeriod } from "../lib/format";
import { getDiscountHint } from "../lib/pricing";
import { getNextStep } from "../lib/steps";
import { areChildrenComplete } from "../lib/validation";
import { useRegistration } from "../state/RegistrationProvider";
import { useStepGuard } from "../state/useStepGuard";
import styles from "./ChildrenScreen.module.css";

export function ChildrenScreen() {
  const { ready } = useStepGuard("children");
  const { state, actions, price } = useRegistration();
  if (!ready) return null;

  const { children } = state;
  const next = getNextStep("children");
  const canContinue = areChildrenComplete(children);
  const atLimit = children.length >= CLUB.maxChildren;

  return (
    <RegistrationStep
      stepId="children"
      subtitle={getPeriod(state.periodId)?.label}
      footer={
        <StickyFooter
          summary={<PriceSummary price={price} />}
          action={
            canContinue && next ? (
              <Button href={next.path} size="lg" fullWidth>
                Continue
              </Button>
            ) : (
              <Button size="lg" fullWidth disabled>
                Add name, category and age group
              </Button>
            )
          }
        />
      }
    >
      <Card>
        <ChildCountPicker value={children.length} onChange={actions.setChildCount} />
      </Card>

      <div className={styles.childGrid}>
        {children.map((child, index) => (
          <ChildCard
            key={child.id}
            child={child}
            index={index}
            canRemove={children.length > 1}
            onChange={(patch) => actions.updateChild(child.id, patch)}
            onRemove={() => actions.removeChild(child.id)}
          />
        ))}
      </div>

      <Button variant="dashed" fullWidth icon={<PlusIcon size={20} />} onClick={actions.addChild} disabled={atLimit}>
        {atLimit ? `Up to ${CLUB.maxChildren} children per registration` : "Add another child"}
      </Button>

      <p className={styles.nudge} aria-live="polite">
        {getDiscountHint(children.length).message}
      </p>
    </RegistrationStep>
  );
}
