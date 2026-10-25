import { TagIcon } from "@/components/ui/Icons";
import { DISCOUNT_TIERS } from "../config";
import { formatPercent } from "../lib/format";
import styles from "./DiscountTiers.module.css";

const tiersAscending = [...DISCOUNT_TIERS].sort((a, b) => a.minChildren - b.minChildren);

export function DiscountTiers() {
  return (
    <div className={styles.discount}>
      <div className={styles.discountTitle}>
        <TagIcon size={20} />
        Family discount
      </div>
      <div className={styles.tiers}>
        {tiersAscending.map((tier) => (
          <div key={tier.minChildren} className={styles.tier}>
            <div className={styles.tierRate}>{formatPercent(tier.rate)} off</div>
            <div className={styles.tierLabel}>{tier.label}</div>
          </div>
        ))}
      </div>
      <p className={styles.discountNote}>When a father or mother registers brothers and sisters together.</p>
    </div>
  );
}
