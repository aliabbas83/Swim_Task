import { AGE_GROUPS, CLUB, GENDERS, PERIODS, type AgeGroupId, type Gender, type PeriodId } from "../config";
import type { Child } from "../types";

const moneyFormatter = new Intl.NumberFormat("en-US", { maximumFractionDigits: 3 });

export const formatMoney = (amount: number) => `${moneyFormatter.format(amount)} ${CLUB.currency}`;
export const formatPercent = (rate: number) => `${Math.round(rate * 100)}%`;
export const formatChildCount = (count: number) => (count === 1 ? "1 child" : `${count} children`);

export const getPeriod = (id: PeriodId | null) => PERIODS.find((period) => period.id === id) ?? null;
export const getAgeGroup = (id: AgeGroupId | null) => AGE_GROUPS.find((group) => group.id === id) ?? null;
export const getGender = (id: Gender | null) => GENDERS.find((gender) => gender.id === id) ?? null;

/** "Boys, ages 9–11" */
export function formatTrainingGroup(child: Pick<Child, "gender" | "ageGroupId">): string {
  const ageGroup = getAgeGroup(child.ageGroupId);
  if (!ageGroup) return "Choose an age group";
  const gender = getGender(child.gender);
  return gender ? `${gender.groupLabel}, ages ${ageGroup.label}` : `Ages ${ageGroup.label}`;
}
