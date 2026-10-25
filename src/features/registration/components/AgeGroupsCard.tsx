import { Card } from "@/components/ui/Card";
import { AGE_GROUPS } from "../config";
import styles from "./AgeGroupsCard.module.css";

export function AgeGroupsCard() {
  return (
    <Card
      title="Age groups"
      description="Boys and girls train in separate groups. You'll choose each child's group during registration."
    >
      <ul className={styles.ageGroups}>
        {AGE_GROUPS.map((group) => (
          <li key={group.id} className={styles.ageGroup} aria-label={group.ariaLabel}>
            {group.label}
          </li>
        ))}
      </ul>
    </Card>
  );
}
