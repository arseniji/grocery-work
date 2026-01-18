import type { CommandManager } from "@/lib/command";
import type { ReactElement } from "react";
import { useCallback, useEffect } from "react";

interface UndoProviderProps {
  children: ReactElement | ReactElement[];
  manager: CommandManager;
}

export const UndoProvider = ({ children, manager }: UndoProviderProps) => {
  const handleUndo = useCallback(
    (event: KeyboardEvent) => {
      if (event.ctrlKey && (event.key === "z" || event.key === "я")) {
        manager.undo();
      }
    },
    [manager],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleUndo);
    return () => document.removeEventListener("keydown", handleUndo);
  }, [handleUndo]);

  return <>{children}</>;
};
