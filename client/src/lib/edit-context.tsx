import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "./queryClient";
import { useToast } from "@/hooks/use-toast";

interface Change {
  type: "update" | "create" | "delete";
  table: string;
  id?: string;
  data?: Record<string, unknown>;
}

interface EditModeContextType {
  isEditMode: boolean;
  changes: Change[];
  addChange: (change: Change) => void;
  removeChange: (index: number) => void;
  clearChanges: () => void;
  save: () => Promise<void>;
  isSaving: boolean;
  logout: () => Promise<void>;
}

const EditModeContext = createContext<EditModeContextType | undefined>(undefined);

export function EditModeProvider({ children }: { children: React.ReactNode }) {
  const [changes, setChanges] = useState<Change[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: authStatus } = useQuery<{ authenticated: boolean }>({
    queryKey: ["/api/auth/status"],
    staleTime: Infinity,
  });

  const isEditMode = authStatus?.authenticated ?? false;

  useEffect(() => {
    if (changes.length === 0) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [changes.length]);

  const addChange = useCallback((change: Change) => {
    setChanges((prev) => {
      const existing = prev.findIndex(
        (c) => c.type === "update" && c.table === change.table && c.id === change.id && change.type === "update"
      );
      if (existing !== -1) {
        const updated = [...prev];
        updated[existing] = {
          ...updated[existing],
          data: { ...updated[existing].data, ...change.data },
        };
        return updated;
      }
      return [...prev, change];
    });
  }, []);

  const removeChange = useCallback((index: number) => {
    setChanges((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const clearChanges = useCallback(() => {
    setChanges([]);
  }, []);

  const save = useCallback(async () => {
    if (changes.length === 0) return;
    setIsSaving(true);
    try {
      const payload = {
        updates: changes.filter((c) => c.type === "update").map(({ table, id, data }) => ({ table, id: id!, data: data! })),
        creates: changes.filter((c) => c.type === "create").map(({ table, data }) => ({ table, data: data! })),
        deletes: changes.filter((c) => c.type === "delete").map(({ table, id }) => ({ table, id: id! })),
      };
      await apiRequest("PUT", "/api/content/batch", payload);
      setChanges([]);
      queryClient.invalidateQueries({ queryKey: ["/api/content"] });
      toast({ title: "Changes saved!", description: "Your changes are now live." });
    } catch (error) {
      toast({ title: "Save failed", description: "Your changes are preserved. Please try again.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  }, [changes, queryClient, toast]);

  const logout = useCallback(async () => {
    await apiRequest("POST", "/api/auth/logout");
    queryClient.setQueryData(["/api/auth/status"], { authenticated: false });
    setChanges([]);
  }, [queryClient]);

  return (
    <EditModeContext.Provider value={{ isEditMode, changes, addChange, removeChange, clearChanges, save, isSaving, logout }}>
      {children}
    </EditModeContext.Provider>
  );
}

export function useEditMode() {
  const context = useContext(EditModeContext);
  if (!context) {
    throw new Error("useEditMode must be used within EditModeProvider");
  }
  return context;
}
