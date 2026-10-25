import { DolphinIcon } from "@/components/brand/Dolphin";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ChoiceGroup, type ChoiceOption } from "@/components/ui/ChoiceGroup";
import { CloseIcon } from "@/components/ui/Icons";
import { TextField } from "@/components/ui/TextField";
import { AGE_GROUPS, GENDERS, type AgeGroupId, type Gender } from "../config";
import { formatTrainingGroup } from "../lib/format";
import type { Child } from "../types";
import styles from "./ChildCard.module.css";

const GENDER_OPTIONS: ChoiceOption<Gender>[] = GENDERS.map((gender) => ({ value: gender.id, label: gender.label }));
const AGE_OPTIONS: ChoiceOption<AgeGroupId>[] = AGE_GROUPS.map((group) => ({
  value: group.id,
  label: group.label,
  ariaLabel: group.ariaLabel,
}));

interface ChildCardProps {
  child: Child;
  index: number;
  canRemove: boolean;
  onChange: (patch: Partial<Omit<Child, "id">>) => void;
  onRemove: () => void;
}

/** Form card for one child: name, category (boy/girl) and age group. */
export function ChildCard({ child, index, canRemove, onChange, onRemove }: ChildCardProps) {
  const dolphinTitle = child.gender ? `${child.gender === "boy" ? "Blue" : "Pink"} dolphin, ${child.gender}` : undefined;

  return (
    <Card
      title={`Child ${index + 1}`}
      leading={<DolphinIcon variant={child.gender ?? "neutral"} title={dolphinTitle} />}
      action={
        canRemove && (
          <Button
            variant="ghostDanger"
            icon={<CloseIcon size={16} />}
            onClick={onRemove}
            aria-label={`Remove child ${index + 1}`}
          >
            Remove
          </Button>
        )
      }
    >
      <TextField
        label="Child's full name"
        value={child.name}
        onChange={(name) => onChange({ name })}
        placeholder="e.g. Sara Ahmad"
        autoComplete="off"
        maxLength={80}
      />
      <ChoiceGroup
        label="Category"
        options={GENDER_OPTIONS}
        value={child.gender}
        onChange={(gender) => onChange({ gender })}
        columns={2}
        showCheck
      />
      <ChoiceGroup
        label="Age group (years)"
        options={AGE_OPTIONS}
        value={child.ageGroupId}
        onChange={(ageGroupId) => onChange({ ageGroupId })}
        columns={4}
      />
      <p className={styles.group}>
        Training group: <strong>{formatTrainingGroup(child)}</strong>
      </p>
    </Card>
  );
}
