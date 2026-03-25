import { useRef, useState, useEffect } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEditMode } from "@/lib/edit-context";

interface EditableBulletsProps {
  bullets: string[];
  table: string;
  id: string;
  field: string;
  className?: string;
}

export function EditableBullets({ bullets, table, id, field, className }: EditableBulletsProps) {
  const { isEditMode, addChange } = useEditMode();
  const [localBullets, setLocalBullets] = useState<string[]>(bullets);

  // Sync with prop changes when not editing
  useEffect(() => {
    setLocalBullets(bullets);
  }, [bullets]);

  const updateBullets = (newBullets: string[]) => {
    setLocalBullets(newBullets);
    addChange({ type: "update", table, id, data: { [field]: newBullets } });
  };

  const addBullet = () => {
    updateBullets([...localBullets, "New bullet point"]);
  };

  const removeBullet = (index: number) => {
    updateBullets(localBullets.filter((_, i) => i !== index));
  };

  return (
    <ul className={`space-y-3 ml-1 ${className ?? ""}`}>
      {localBullets.map((bullet, idx) => (
        <li key={idx} className="text-muted-foreground flex items-start gap-3 group/bullet">
          <span className="text-primary mt-1.5 flex-shrink-0">•</span>
          {isEditMode ? (
            <EditableBulletItem
              value={bullet}
              onChange={(newValue) => {
                const updated = [...localBullets];
                updated[idx] = newValue;
                updateBullets(updated);
              }}
            />
          ) : (
            <span>{bullet}</span>
          )}
          {isEditMode && (
            <Button
              size="icon"
              variant="ghost"
              className="h-5 w-5 flex-shrink-0 text-muted-foreground hover:text-destructive opacity-0 group-hover/bullet:opacity-100 transition-opacity mt-1"
              onClick={() => removeBullet(idx)}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </li>
      ))}
      {isEditMode && (
        <li>
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-primary text-xs"
            onClick={addBullet}
          >
            <Plus className="h-3 w-3 mr-1" />
            Add bullet
          </Button>
        </li>
      )}
    </ul>
  );
}

function EditableBulletItem({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (ref.current && !isEditing) {
      ref.current.textContent = value;
    }
  }, [value, isEditing]);

  return (
    <span
      ref={ref}
      className={`flex-1 ${isEditing ? "outline outline-2 outline-primary/50 bg-primary/5 rounded px-1" : "hover:outline-dashed hover:outline-1 hover:outline-muted-foreground/30 hover:rounded cursor-text"}`}
      contentEditable={isEditing}
      suppressContentEditableWarning
      onClick={() => setIsEditing(true)}
      onBlur={() => {
        setIsEditing(false);
        const newValue = ref.current?.textContent ?? "";
        if (newValue !== value) {
          onChange(newValue);
        }
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
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
