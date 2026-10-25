"use client";

import { createContext, useContext, useEffect, useMemo, useReducer, useRef, useState, type ReactNode } from "react";
import type { PeriodId } from "../config";
import { GENERIC_SUBMIT_ERROR, RegistrationRequestError, submitRegistration } from "../api/submit-registration";
import { calculatePrice } from "../lib/pricing";
import { toRegistrationPayload } from "../lib/validation";
import type { Child, Parent, PriceBreakdown, RegistrationState } from "../types";
import { clearDraft, loadDraft, saveDraft } from "./draft-storage";
import { initialRegistrationState, registrationReducer } from "./reducer";

export interface RegistrationActions {
  selectPeriod: (periodId: PeriodId) => void;
  setChildCount: (count: number) => void;
  addChild: () => void;
  removeChild: (id: string) => void;
  updateChild: (id: string, patch: Partial<Omit<Child, "id">>) => void;
  updateParent: (patch: Partial<Parent>) => void;
  dismissSubmissionError: () => void;
  /** Resolves to `true` when the registration was accepted. */
  submit: () => Promise<boolean>;
  reset: () => void;
}

interface RegistrationContextValue {
  state: RegistrationState;
  actions: RegistrationActions;
  price: PriceBreakdown;
  /** `false` until the saved draft (if any) has been read on the client. Gate redirects on this. */
  isHydrated: boolean;
}

const RegistrationContext = createContext<RegistrationContextValue | null>(null);

export function RegistrationProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(registrationReducer, initialRegistrationState);
  const [isHydrated, setIsHydrated] = useState(false);

  // Lets stable action callbacks read the latest state without being recreated.
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // Restore the draft after mount so server and first client render match.
  useEffect(() => {
    const draft = loadDraft();
    if (draft) dispatch({ type: "draftRestored", draft });
    setIsHydrated(true);
  }, []);

  // Persist the draft (never the submission status) on every change.
  useEffect(() => {
    if (!isHydrated) return;
    const { periodId, children: kids, parent, nextChildSeq } = state;
    saveDraft({ periodId, children: kids, parent, nextChildSeq });
  }, [state, isHydrated]);

  const inFlight = useRef<AbortController | null>(null);
  useEffect(() => () => inFlight.current?.abort(), []);

  const actions = useMemo<RegistrationActions>(
    () => ({
      selectPeriod: (periodId) => dispatch({ type: "periodSelected", periodId }),
      setChildCount: (count) => dispatch({ type: "childCountSet", count }),
      addChild: () => dispatch({ type: "childAdded" }),
      removeChild: (id) => dispatch({ type: "childRemoved", id }),
      updateChild: (id, patch) => dispatch({ type: "childUpdated", id, patch }),
      updateParent: (patch) => dispatch({ type: "parentUpdated", patch }),
      dismissSubmissionError: () => dispatch({ type: "submissionDismissed" }),
      reset: () => {
        inFlight.current?.abort();
        clearDraft();
        dispatch({ type: "reset" });
      },
      submit: async () => {
        const payload = toRegistrationPayload(stateRef.current);
        if (!payload) {
          dispatch({
            type: "submitFailed",
            message: "Some details are missing. Please go back and complete every step.",
          });
          return false;
        }

        inFlight.current?.abort();
        const controller = new AbortController();
        inFlight.current = controller;
        dispatch({ type: "submitStarted" });

        try {
          const receipt = await submitRegistration(payload, { signal: controller.signal });
          dispatch({ type: "submitSucceeded", receipt });
          return true;
        } catch (error) {
          if (controller.signal.aborted) return false;
          const message = error instanceof RegistrationRequestError ? error.message : GENERIC_SUBMIT_ERROR;
          dispatch({ type: "submitFailed", message });
          return false;
        } finally {
          if (inFlight.current === controller) inFlight.current = null;
        }
      },
    }),
    [],
  );

  const price = useMemo(() => calculatePrice(state.children.length), [state.children.length]);
  const value = useMemo(() => ({ state, actions, price, isHydrated }), [state, actions, price, isHydrated]);

  return <RegistrationContext.Provider value={value}>{children}</RegistrationContext.Provider>;
}

export function useRegistration(): RegistrationContextValue {
  const context = useContext(RegistrationContext);
  if (!context) throw new Error("useRegistration must be used inside <RegistrationProvider>.");
  return context;
}
