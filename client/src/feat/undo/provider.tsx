import type { CommandManager } from "@/lib/command";
import type { ReactElement } from "react";
import { useEffect } from "react";

interface UndoProviderProps {
  children: ReactElement | ReactElement[];
  manager: CommandManager;
}

export const UndoProvider = ({ children, manager }: UndoProviderProps) => {
  const handleUndo = (event: KeyboardEvent) => {
    if (event.ctrlKey && (event.key === "z" || event.key === "я")) {
      manager.undo();
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleUndo);
    return () => document.removeEventListener("keydown", handleUndo);
  }, []);

  return <>{children}</>;
};
