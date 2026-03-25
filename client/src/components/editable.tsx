import { useRef, useState, useEffect } from "react";
import { useEditMode } from "@/lib/edit-context";

interface EditableProps {
  value: string;
  table: string;
  id: string;
  field: string;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  "data-testid"?: string;
}

export function Editable({
  value,
  table,
  id,
  field,
  as: Tag = "span",
  className = "",
  ...props
}: EditableProps) {
  const { isEditMode, addChange } = useEditMode();
  const [isEditing, setIsEditing] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (ref.current && !isEditing) {
      ref.current.textContent = value;
    }
  }, [value, isEditing]);

  if (!isEditMode) {
    return <Tag className={className} {...props}>{value}</Tag>;
  }

  const handleBlur = () => {
    setIsEditing(false);
    const newValue = ref.current?.textContent ?? "";
    if (newValue !== value) {
      addChange({
        type: "update",
        table,
        id,
        data: { [field]: newValue },
      });
    }
  };

  return (
    <Tag
      ref={ref as any}
      className={`${className} ${isEditing ? "outline outline-2 outline-primary/50 bg-primary/5 rounded px-1" : "hover:outline-dashed hover:outline-1 hover:outline-muted-foreground/30 hover:rounded cursor-text"}`}
      contentEditable={isEditing}
      suppressContentEditableWarning
      onClick={() => setIsEditing(true)}
      onBlur={handleBlur}
      onKeyDown={(e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          (e.target as HTMLElement).blur();
        }
        if (e.key === "Escape") {
          if (ref.current) ref.current.textContent = value;
          setIsEditing(false);
        }
      }}
    />
  );
}
