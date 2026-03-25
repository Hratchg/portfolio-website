import { Save, LogOut, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEditMode } from "@/lib/edit-context";

export function EditBar() {
  const { isEditMode, changes, save, isSaving, logout } = useEditMode();

  if (!isEditMode) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 h-14 bg-background/90 backdrop-blur-lg border-t border-border">
      <div className="max-w-6xl mx-auto h-full px-6 flex items-center justify-between">
        <span className="text-sm font-medium text-primary">Edit Mode</span>

        <div className="flex items-center gap-3">
          <Button
            size="sm"
            onClick={save}
            disabled={changes.length === 0 || isSaving}
          >
            {isSaving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {changes.length > 0 ? `Save (${changes.length} changes)` : "Save"}
          </Button>

          <Button size="sm" variant="outline" onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" />
            Exit
          </Button>
        </div>
      </div>
    </div>
  );
}
