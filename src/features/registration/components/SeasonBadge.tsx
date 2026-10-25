import { CalendarIcon } from "@/components/ui/Icons";
import { CLUB } from "../config";
import styles from "./SeasonBadge.module.css";

export function SeasonBadge() {
  return (
    <div className={styles.season}>
      <CalendarIcon size={22} />
      <div>
        <div className={styles.seasonLabel}>Club season</div>
        <div className={styles.seasonValue}>{CLUB.season.label}</div>
      </div>
    </div>
  );
}
