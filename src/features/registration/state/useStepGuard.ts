"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getBlockingStep, type StepId } from "../lib/steps";
import { useRegistration } from "./RegistrationProvider";

/**
 * Keeps deep links honest: if an earlier step is incomplete, redirect to it.
 * `ready` is true once the draft is restored and the step may render.
 */
export function useStepGuard(stepId: StepId) {
  const { state, isHydrated } = useRegistration();
  const router = useRouter();
  const redirectTo = isHydrated ? (getBlockingStep(stepId, state)?.path ?? null) : null;

  useEffect(() => {
    if (redirectTo) router.replace(redirectTo);
  }, [redirectTo, router]);

  return { ready: isHydrated && redirectTo === null };
}
