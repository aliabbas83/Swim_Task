import { AGE_GROUPS, CLUB, GENDERS, PERIODS, type AgeGroupId, type Gender, type PeriodId } from "../config";
import type { Child, Parent, ParentErrors, RegistrationPayload, RegistrationState } from "../types";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PHONE_DIGITS = 8;
const MAX_TEXT_LENGTH = 80;

export const isPeriodId = (value: unknown): value is PeriodId => PERIODS.some((period) => period.id === value);
export const isGender = (value: unknown): value is Gender => GENDERS.some((gender) => gender.id === value);
export const isAgeGroupId = (value: unknown): value is AgeGroupId => AGE_GROUPS.some((group) => group.id === value);

const countPhoneDigits = (phone: string) => phone.replace(/\D/g, "").length;

export const isChildComplete = (child: Child) =>
  child.name.trim().length > 0 && child.gender !== null && child.ageGroupId !== null;

export const areChildrenComplete = (children: Child[]) => children.length > 0 && children.every(isChildComplete);

export function getParentErrors(parent: Parent): ParentErrors {
  const errors: ParentErrors = {};
  if (parent.name.trim().length < 2) errors.name = "Please enter your full name.";
  if (countPhoneDigits(parent.phone) < MIN_PHONE_DIGITS) {
    errors.phone = `Please enter a mobile number with at least ${MIN_PHONE_DIGITS} digits.`;
  }
  if (parent.email.trim() !== "" && !EMAIL_PATTERN.test(parent.email.trim())) {
    errors.email = "Please check the email address.";
  }
  return errors;
}

export const isParentComplete = (parent: Parent) => Object.keys(getParentErrors(parent)).length === 0;

/** Builds the API payload from form state, or `null` while anything is incomplete. */
export function toRegistrationPayload(
  state: Pick<RegistrationState, "periodId" | "children" | "parent">,
): RegistrationPayload | null {
  const { periodId, children, parent } = state;
  if (!periodId || !areChildrenComplete(children) || !isParentComplete(parent)) return null;

  return {
    periodId,
    children: children.map((child) => ({
      name: child.name.trim(),
      gender: child.gender as Gender,
      ageGroupId: child.ageGroupId as AgeGroupId,
    })),
    parent: { name: parent.name.trim(), phone: parent.phone.trim(), email: parent.email.trim() },
  };
}

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null;
const isText = (value: unknown, min = 0): value is string =>
  typeof value === "string" && value.trim().length >= min && value.length <= MAX_TEXT_LENGTH;

export type ValidationResult = { ok: true; value: RegistrationPayload } | { ok: false; errors: string[] };

/** Server-side validation of untrusted input. */
export function validateRegistrationPayload(input: unknown): ValidationResult {
  if (!isRecord(input)) return { ok: false, errors: ["Body must be a JSON object."] };

  const errors: string[] = [];

  if (!isPeriodId(input.periodId)) errors.push("periodId is not a valid course period.");

  const children: unknown[] = Array.isArray(input.children) ? input.children : [];
  if (children.length < 1 || children.length > CLUB.maxChildren) {
    errors.push(`children must contain between 1 and ${CLUB.maxChildren} entries.`);
  }
  children.forEach((child, index) => {
    if (!isRecord(child) || !isText(child.name, 1) || !isGender(child.gender) || !isAgeGroupId(child.ageGroupId)) {
      errors.push(`children[${index}] needs a name, a valid gender and a valid age group.`);
    }
  });

  const parent = isRecord(input.parent) ? input.parent : null;
  if (!parent || !isText(parent.name, 2) || !isText(parent.phone) || typeof parent.email !== "string") {
    errors.push("parent needs a name, phone and email field.");
  } else {
    errors.push(...Object.values(getParentErrors({ name: parent.name, phone: parent.phone, email: parent.email })));
  }

  return errors.length > 0 ? { ok: false, errors } : { ok: true, value: input as unknown as RegistrationPayload };
}
