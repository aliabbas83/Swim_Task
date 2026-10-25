import { ChoiceGroup, type ChoiceOption } from "@/components/ui/ChoiceGroup";
import { CLUB } from "../config";
import { formatChildCount } from "../lib/format";

const OPTIONS: ChoiceOption<number>[] = Array.from({ length: CLUB.childCountOptions }, (_, index) => ({
  value: index + 1,
  label: String(index + 1),
  ariaLabel: formatChildCount(index + 1),
}));

interface ChildCountPickerProps {
  value: number;
  onChange: (count: number) => void;
  label?: string;
}

/** Quick picker for 1..N children. Counts above N (added via "Add another child") show no selection. */
export function ChildCountPicker({ value, onChange, label = "Number of children" }: ChildCountPickerProps) {
  return (
    <ChoiceGroup
      label={label}
      options={OPTIONS}
      value={value <= CLUB.childCountOptions ? value : null}
      onChange={onChange}
      columns={CLUB.childCountOptions}
      size="lg"
    />
  );
}
