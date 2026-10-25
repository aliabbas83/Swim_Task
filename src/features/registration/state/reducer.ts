import { CLUB } from "../config";
import type { Child, Parent, RegistrationDraft, RegistrationReceipt, RegistrationState } from "../types";
import type { PeriodId } from "../config";

export type RegistrationAction =
  | { type: "periodSelected"; periodId: PeriodId }
  | { type: "childCountSet"; count: number }
  | { type: "childAdded" }
  | { type: "childRemoved"; id: string }
  | { type: "childUpdated"; id: string; patch: Partial<Omit<Child, "id">> }
  | { type: "parentUpdated"; patch: Partial<Parent> }
  | { type: "submitStarted" }
  | { type: "submitSucceeded"; receipt: RegistrationReceipt }
  | { type: "submitFailed"; message: string }
  | { type: "submissionDismissed" }
  | { type: "draftRestored"; draft: RegistrationDraft }
  | { type: "reset" };

export const createChild = (seq: number): Child => ({ id: `child-${seq}`, name: "", gender: null, ageGroupId: null });

export const initialRegistrationState: RegistrationState = {
  periodId: null,
  children: [createChild(1)],
  parent: { name: "", phone: "", email: "" },
  nextChildSeq: 2,
  submission: { status: "idle" },
};

/** Grows or shrinks the child list to `requested`, clamped to 1..maxChildren. Existing entries are kept. */
function resizeChildren(state: RegistrationState, requested: number): RegistrationState {
  const count = Math.min(CLUB.maxChildren, Math.max(1, Math.floor(requested)));
  if (count === state.children.length) return state;
  if (count < state.children.length) return { ...state, children: state.children.slice(0, count) };

  const children = [...state.children];
  let seq = state.nextChildSeq;
  while (children.length < count) children.push(createChild(seq++));
  return { ...state, children, nextChildSeq: seq };
}

export function registrationReducer(state: RegistrationState, action: RegistrationAction): RegistrationState {
  switch (action.type) {
    case "periodSelected":
      return { ...state, periodId: action.periodId };
    case "childCountSet":
      return resizeChildren(state, action.count);
    case "childAdded":
      return resizeChildren(state, state.children.length + 1);
    case "childRemoved":
      if (state.children.length <= 1) return state;
      return { ...state, children: state.children.filter((child) => child.id !== action.id) };
    case "childUpdated":
      return {
        ...state,
        children: state.children.map((child) => (child.id === action.id ? { ...child, ...action.patch } : child)),
      };
    case "parentUpdated":
      return { ...state, parent: { ...state.parent, ...action.patch } };
    case "submitStarted":
      return { ...state, submission: { status: "submitting" } };
    case "submitSucceeded":
      return { ...state, submission: { status: "success", receipt: action.receipt } };
    case "submitFailed":
      return { ...state, submission: { status: "error", message: action.message } };
    case "submissionDismissed":
      return { ...state, submission: { status: "idle" } };
    case "draftRestored":
      return { ...state, ...action.draft, submission: { status: "idle" } };
    case "reset":
      return initialRegistrationState;
  }
}
