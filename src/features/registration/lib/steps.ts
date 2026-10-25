import type { RegistrationState } from "../types";
import { areChildrenComplete, isParentComplete } from "./validation";

export const REGISTRATION_STEPS = [
  { id: "period", title: "Choose your period", path: "/register/period" },
  { id: "children", title: "Your children", path: "/register/children" },
  { id: "parent", title: "Parent details", path: "/register/parent" },
  { id: "review", title: "Review and confirm", path: "/register/review" },
] as const;

export type StepId = (typeof REGISTRATION_STEPS)[number]["id"];

export const ROUTES = { home: "/", success: "/register/success" } as const;

export const getStepIndex = (id: StepId) => REGISTRATION_STEPS.findIndex((step) => step.id === id);

export function getStep(id: StepId) {
  const step = REGISTRATION_STEPS[getStepIndex(id)];
  if (!step) throw new Error(`Unknown registration step: ${id}`);
  return step;
}

export const getNextStep = (id: StepId) => REGISTRATION_STEPS[getStepIndex(id) + 1] ?? null;
export const getPreviousStep = (id: StepId) => REGISTRATION_STEPS[getStepIndex(id) - 1] ?? null;

export function isStepComplete(id: StepId, state: RegistrationState): boolean {
  switch (id) {
    case "period":
      return state.periodId !== null;
    case "children":
      return areChildrenComplete(state.children);
    case "parent":
      return isParentComplete(state.parent);
    case "review":
      return state.submission.status === "success";
  }
}

/** First earlier step that is still incomplete, i.e. where a deep-linked user must go back to. */
export function getBlockingStep(id: StepId, state: RegistrationState) {
  return REGISTRATION_STEPS.slice(0, getStepIndex(id)).find((step) => !isStepComplete(step.id, state)) ?? null;
}
