import { Card } from "@/components/ui/Card";
import { ChoiceGroup } from "@/components/ui/ChoiceGroup";
import { CLUB, PERIODS, type Period, type PeriodId } from "../config";
import styles from "./PeriodPicker.module.css";

const MONTHS = PERIODS.reduce<{ month: string; periods: Period[] }[]>((months, period) => {
  const existing = months.find((entry) => entry.month === period.month);
  if (existing) existing.periods.push(period);
  else months.push({ month: period.month, periods: [period] });
  return months;
}, []);

interface PeriodPickerProps {
  value: PeriodId | null;
  onChange: (periodId: PeriodId) => void;
}

/** One card per month; each holds that month's course periods. */
export function PeriodPicker({ value, onChange }: PeriodPickerProps) {
  return (
    <div className={styles.months}>
      {MONTHS.map(({ month, periods }) => (
        <Card key={month} title={month}>
          <ChoiceGroup
            label={`${month} periods`}
            hideLabel
            columns={2}
            size="lg"
            value={value}
            onChange={onChange}
            options={periods.map((period) => ({
              value: period.id,
              label: period.range,
              description: `${month} · ${CLUB.course.weeks} weeks`,
              ariaLabel: period.ariaLabel,
            }))}
          />
        </Card>
      ))}
    </div>
  );
}
