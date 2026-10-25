"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { StickyFooter } from "@/components/ui/StickyFooter";
import { TextField } from "@/components/ui/TextField";
import { RegistrationStep } from "../components/RegistrationStep";
import { getNextStep } from "../lib/steps";
import { getParentErrors } from "../lib/validation";
import { useRegistration } from "../state/RegistrationProvider";
import { useStepGuard } from "../state/useStepGuard";
import type { Parent } from "../types";
import styles from "./ParentScreen.module.css";

export function ParentScreen() {
  const { ready } = useStepGuard("parent");
  const { state, actions } = useRegistration();
  // Errors only appear once a field has been left, so the form doesn't shout on first render.
  const [touched, setTouched] = useState<Partial<Record<keyof Parent, boolean>>>({});
  if (!ready) return null;

  const { parent } = state;
  const errors = getParentErrors(parent);
  const canContinue = Object.keys(errors).length === 0;
  const next = getNextStep("parent");

  const errorFor = (field: keyof Parent) => (touched[field] ? errors[field] : undefined);
  const markTouched = (field: keyof Parent) => () => setTouched((prev) => ({ ...prev, [field]: true }));

  return (
    <RegistrationStep
      stepId="parent"
      footer={
        <StickyFooter
          action={
            canContinue && next ? (
              <Button href={next.path} size="lg" fullWidth>
                Review registration
              </Button>
            ) : (
              <Button size="lg" fullWidth disabled>
                Enter your name and mobile number
              </Button>
            )
          }
        />
      }
    >
      <Card className={styles.narrow}>
        <p className={styles.formNote}>
          We&apos;ll use these details to confirm the registration and contact you about training.
        </p>
        <TextField
          label="Father's or mother's name"
          value={parent.name}
          onChange={(name) => actions.updateParent({ name })}
          onBlur={markTouched("name")}
          error={errorFor("name")}
          placeholder="Full name"
          autoComplete="name"
          maxLength={80}
        />
        <TextField
          label="Mobile number"
          type="tel"
          inputMode="tel"
          value={parent.phone}
          onChange={(phone) => actions.updateParent({ phone })}
          onBlur={markTouched("phone")}
          error={errorFor("phone")}
          placeholder="+965 ____ ____"
          autoComplete="tel"
          maxLength={20}
        />
        <TextField
          label="Email (optional)"
          type="email"
          value={parent.email}
          onChange={(email) => actions.updateParent({ email })}
          onBlur={markTouched("email")}
          error={errorFor("email")}
          placeholder="name@example.com"
          autoComplete="email"
          maxLength={80}
        />
      </Card>
    </RegistrationStep>
  );
}
