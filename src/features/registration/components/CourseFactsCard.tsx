import { Card } from "@/components/ui/Card";
import { CalendarIcon, CheckIcon, ClockIcon } from "@/components/ui/Icons";
import { CLUB, COURSE_HOURS, COURSE_SESSIONS } from "../config";
import { formatMoney } from "../lib/format";
import styles from "./CourseFactsCard.module.css";

const FACTS = [
  { icon: <CalendarIcon size={24} />, value: `${CLUB.course.weeks} weeks`, label: "per course" },
  {
    icon: <CheckIcon size={24} strokeWidth={2} />,
    value: CLUB.course.daysShort,
    label: `${CLUB.course.daysPerWeek} days a week`,
  },
  { icon: <ClockIcon size={24} />, value: `${CLUB.course.hoursPerDay} hours`, label: "each day" },
];

export function CourseFactsCard() {
  return (
    <Card title="The course">
      <div className={styles.facts}>
        {FACTS.map((fact) => (
          <div key={fact.value} className={styles.fact}>
            <span className={styles.factIcon}>{fact.icon}</span>
            <div className={styles.factValue}>{fact.value}</div>
            <div className={styles.factLabel}>{fact.label}</div>
          </div>
        ))}
      </div>
      <div className={styles.priceRow}>
        <p className={styles.factLabel}>
          {COURSE_SESSIONS} sessions &middot; {COURSE_HOURS} hours of training
          <br />
          Courses run {CLUB.season.label}
        </p>
        <div className={styles.price}>{formatMoney(CLUB.pricePerChild)}</div>
      </div>
    </Card>
  );
}
