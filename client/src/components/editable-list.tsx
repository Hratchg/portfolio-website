import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEditMode } from "@/lib/edit-context";

interface EditableListProps {
  table: string;
  onAdd: () => void;
  addLabel: string;
  children: React.ReactNode;
}

export function EditableList({ table, onAdd, addLabel, children }: EditableListProps) {
  const { isEditMode } = useEditMode();

  return (
    <>
      {children}
      {isEditMode && (
        <Button
          variant="outline"
          className="border-dashed border-2 border-muted-foreground/30 hover:border-primary/50 w-full h-24 flex items-center justify-center gap-2 text-muted-foreground hover:text-primary"
          onClick={onAdd}
        >
          <Plus className="h-5 w-5" />
          {addLabel}
        </Button>
      )}
    </>
  );
}

interface DeleteButtonProps {
  table: string;
  id: string;
  label: string;
}

export function DeleteButton({ table, id, label }: DeleteButtonProps) {
  const { isEditMode, addChange } = useEditMode();

  if (!isEditMode) return null;

  const handleDelete = () => {
    if (confirm(`Delete this ${label}?`)) {
      addChange({ type: "delete", table, id });
    }
  };

  return (
    <Button
      size="icon"
      variant="ghost"
      className="absolute top-2 right-2 h-7 w-7 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
      onClick={handleDelete}
      aria-label={`Delete ${label}`}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
