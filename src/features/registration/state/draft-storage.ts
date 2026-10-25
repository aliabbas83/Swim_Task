import { CLUB } from "../config";
import type { Child, RegistrationDraft } from "../types";
import { isAgeGroupId, isGender, isPeriodId } from "../lib/validation";

const STORAGE_KEY = "dolphins:registration-draft:v1";

const asString = (value: unknown) => (typeof value === "string" ? value : "");
const isObject = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null;

/** Never trust stored data: rebuild a valid draft field by field, or return `null`. */
function sanitizeDraft(raw: unknown): RegistrationDraft | null {
  if (!isObject(raw)) return null;

  const rawChildren: unknown[] = Array.isArray(raw.children) ? raw.children : [];
  const children: Child[] = rawChildren
    .slice(0, CLUB.maxChildren)
    .filter(isObject)
    .map((child, index) => ({
      id: asString(child.id) || `child-restored-${index}`,
      name: asString(child.name),
      gender: isGender(child.gender) ? child.gender : null,
      ageGroupId: isAgeGroupId(child.ageGroupId) ? child.ageGroupId : null,
    }));
  if (children.length === 0) return null;

  const parent = isObject(raw.parent) ? raw.parent : {};
  const nextChildSeq = typeof raw.nextChildSeq === "number" ? raw.nextChildSeq : children.length + 1;

  return {
    periodId: isPeriodId(raw.periodId) ? raw.periodId : null,
    children,
    parent: { name: asString(parent.name), phone: asString(parent.phone), email: asString(parent.email) },
    nextChildSeq: Math.max(nextChildSeq, children.length + 1),
  };
}

// sessionStorage can throw (private mode, disabled storage): persistence is best-effort.

export function loadDraft(): RegistrationDraft | null {
  try {
    const stored = window.sessionStorage.getItem(STORAGE_KEY);
    return stored ? sanitizeDraft(JSON.parse(stored)) : null;
  } catch {
    return null;
  }
}

export function saveDraft(draft: RegistrationDraft): void {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  } catch {
    /* ignore */
  }
}

export function clearDraft(): void {
  try {
    window.sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}
