import { useEditMode } from "@/lib/edit-context";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface EditableSelectProps {
  value: string;
  options: string[];
  table: string;
  id: string;
  field: string;
  className?: string;
}

export function EditableSelect({ value, options, table, id, field, className }: EditableSelectProps) {
  const { isEditMode, addChange } = useEditMode();

  if (!isEditMode) {
    return <span className={className}>{value}</span>;
  }

  return (
    <Select
      value={value}
      onValueChange={(newValue) => {
        addChange({ type: "update", table, id, data: { [field]: newValue } });
      }}
    >
      <SelectTrigger className={`w-auto h-auto inline-flex ${className}`}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((opt) => (
          <SelectItem key={opt} value={opt}>{opt}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

interface EditableToggleProps {
  value: boolean;
  table: string;
  id: string;
  field: string;
  label: string;
}

export function EditableToggle({ value, table, id, field, label }: EditableToggleProps) {
  const { isEditMode, addChange } = useEditMode();

  if (!isEditMode) return null;

  return (
    <div className="flex items-center gap-2">
      <Switch
        checked={value}
        onCheckedChange={(checked) => {
          addChange({ type: "update", table, id, data: { [field]: checked } });
        }}
      />
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}
