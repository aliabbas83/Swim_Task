/**
 * Single source of truth for club data: prices, discounts, course schedule and
 * the option lists the form is built from. Change a number here and every
 * screen, validator and the API route follows.
 */

export const CLUB = {
  name: "The Dolphins",
  tagline: "Swim club",
  currency: "KWD",
  pricePerChild: 120,
  season: { label: "1 June – 31 August" },
  course: {
    weeks: 2,
    days: "Sunday to Thursday",
    daysShort: "Sun–Thu",
    daysPerWeek: 5,
    hoursPerDay: 2,
  },
  /** How many quick-pick buttons the child-count picker shows. */
  childCountOptions: 5,
  maxChildren: 10,
} as const;

export const COURSE_SESSIONS = CLUB.course.weeks * CLUB.course.daysPerWeek;
export const COURSE_HOURS = COURSE_SESSIONS * CLUB.course.hoursPerDay;

export interface DiscountTier {
  minChildren: number;
  rate: number;
  label: string;
}

/** Ordered from the best tier to the worst: the first match wins. */
export const DISCOUNT_TIERS: readonly DiscountTier[] = [
  { minChildren: 3, rate: 0.2, label: "for 3 or more" },
  { minChildren: 2, rate: 0.1, label: "for 2 children" },
];

export const AGE_GROUPS = [
  { id: "6-8", label: "6–8", ariaLabel: "Ages 6 to 8" },
  { id: "9-11", label: "9–11", ariaLabel: "Ages 9 to 11" },
  { id: "12-14", label: "12–14", ariaLabel: "Ages 12 to 14" },
  { id: "15-18", label: "15–18", ariaLabel: "Ages 15 to 18" },
] as const;

export const GENDERS = [
  { id: "boy", label: "Boy", groupLabel: "Boys" },
  { id: "girl", label: "Girl", groupLabel: "Girls" },
] as const;

export const PERIODS = [
  { id: "jun-1", month: "June", range: "1 – 15", label: "1–15 June", ariaLabel: "1 to 15 June" },
  { id: "jun-2", month: "June", range: "16 – 30", label: "16–30 June", ariaLabel: "16 to 30 June" },
  { id: "jul-1", month: "July", range: "1 – 15", label: "1–15 July", ariaLabel: "1 to 15 July" },
  { id: "jul-2", month: "July", range: "16 – 31", label: "16–31 July", ariaLabel: "16 to 31 July" },
  { id: "aug-1", month: "August", range: "1 – 15", label: "1–15 August", ariaLabel: "1 to 15 August" },
  { id: "aug-2", month: "August", range: "16 – 31", label: "16–31 August", ariaLabel: "16 to 31 August" },
] as const;

export type PeriodId = (typeof PERIODS)[number]["id"];
export type Period = (typeof PERIODS)[number];
export type AgeGroupId = (typeof AGE_GROUPS)[number]["id"];
export type Gender = (typeof GENDERS)[number]["id"];
