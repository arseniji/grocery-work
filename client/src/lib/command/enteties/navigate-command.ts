import type { NavigateFunction } from "react-router";
import type { Command } from "./command";

export class NavigateCommand implements Command<string, void> {
  private readonly navigate: NavigateFunction;
  private history: string[];

  constructor(navFunc: NavigateFunction) {
    this.navigate = navFunc;
    this.history = [];
  }

  public execute(path: string) {
    this.history.push(path);
    this.navigate(path);
  }

  public undo(): void {
    const recent = this.history.pop();
    if (!recent) return;
    this.navigate(recent);
  }
}
