import type { ReactNode } from "react";
import { getPreviousStep, getStep, getStepIndex, REGISTRATION_STEPS, ROUTES, type StepId } from "../lib/steps";
import { StepLayout } from "./StepLayout";

interface RegistrationStepProps {
  stepId: StepId;
  subtitle?: string;
  footer: ReactNode;
  children: ReactNode;
}

/** `StepLayout` wired to the step definitions, so screens only say which step they are. */
export function RegistrationStep({ stepId, subtitle, footer, children }: RegistrationStepProps) {
  const step = getStep(stepId);

  return (
    <StepLayout
      stepNumber={getStepIndex(stepId) + 1}
      totalSteps={REGISTRATION_STEPS.length}
      title={step.title}
      subtitle={subtitle}
      backHref={getPreviousStep(stepId)?.path ?? ROUTES.home}
      footer={footer}
    >
      {children}
    </StepLayout>
  );
}
