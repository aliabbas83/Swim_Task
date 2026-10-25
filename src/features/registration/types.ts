import type { AgeGroupId, Gender, PeriodId } from "./config";

export interface Child {
  id: string;
  name: string;
  gender: Gender | null;
  ageGroupId: AgeGroupId | null;
}

export interface Parent {
  name: string;
  phone: string;
  email: string;
}

export type ParentErrors = Partial<Record<keyof Parent, string>>;

/** The part of the state that survives a page refresh. */
export interface RegistrationDraft {
  periodId: PeriodId | null;
  children: Child[];
  parent: Parent;
  /** Monotonic counter so child ids stay unique after removals. */
  nextChildSeq: number;
}

export interface RegistrationReceipt {
  reference: string;
  total: number;
  currency: string;
}

export type SubmissionState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success"; receipt: RegistrationReceipt }
  | { status: "error"; message: string };

export interface RegistrationState extends RegistrationDraft {
  submission: SubmissionState;
}

/** Wire format shared by the client and `POST /api/registrations`. */
export interface RegistrationPayload {
  periodId: PeriodId;
  children: { name: string; gender: Gender; ageGroupId: AgeGroupId }[];
  parent: Parent;
}

export interface PriceBreakdown {
  childCount: number;
  unitPrice: number;
  subtotal: number;
  discountRate: number;
  discount: number;
  total: number;
}
