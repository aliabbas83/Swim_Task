import { CLUB, DISCOUNT_TIERS } from "../config";
import type { PriceBreakdown } from "../types";

/** KWD has three decimals; round to avoid float noise like 0.30000000000000004. */
const roundKwd = (amount: number) => Math.round(amount * 1000) / 1000;

const tiersAscending = [...DISCOUNT_TIERS].sort((a, b) => a.minChildren - b.minChildren);

export function getDiscountRate(childCount: number): number {
  return DISCOUNT_TIERS.find((tier) => childCount >= tier.minChildren)?.rate ?? 0;
}

export function calculatePrice(childCount: number, unitPrice: number = CLUB.pricePerChild): PriceBreakdown {
  const count = Math.max(0, Math.floor(childCount));
  const subtotal = roundKwd(count * unitPrice);
  const discountRate = getDiscountRate(count);
  const discount = roundKwd(subtotal * discountRate);
  return { childCount: count, unitPrice, subtotal, discountRate, discount, total: roundKwd(subtotal - discount) };
}

/** "2 children: 10% off · 3 or more: 20% off" */
export function describeDiscountTiers(): string {
  return tiersAscending
    .map((tier, index) => {
      const range = index === tiersAscending.length - 1 ? `${tier.minChildren} or more` : `${tier.minChildren} children`;
      return `${range}: ${Math.round(tier.rate * 100)}% off`;
    })
    .join(" · ");
}

/** Nudges the parent toward the next discount tier. */
export function getDiscountHint(childCount: number): { message: string; isBestRate: boolean } {
  const next = tiersAscending.find((tier) => tier.minChildren > childCount);
  if (!next) {
    const best = tiersAscending[tiersAscending.length - 1];
    return { message: `Best family rate applied: ${Math.round((best?.rate ?? 0) * 100)}% off`, isBestRate: true };
  }
  const missing = next.minChildren - childCount;
  return {
    message: `Add ${missing} more ${missing === 1 ? "child" : "children"} and save ${Math.round(next.rate * 100)}%`,
    isBestRate: false,
  };
}
