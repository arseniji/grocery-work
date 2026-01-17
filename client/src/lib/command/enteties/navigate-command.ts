import type { Command } from "./command";

export class NavigateCommand implements Command<string, void> {
  private readonly navigate: (path: string) => void;
  private history: string[];

  constructor(navFunc: (path: string) => void) {
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
