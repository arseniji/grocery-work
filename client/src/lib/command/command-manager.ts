import type { Command } from "./enteties/command";

export class CommandManager {
  bank: Record<string, Command<any, any>>;
  history: string[];

  constructor() {
    this.bank = {};
    this.history = [];
  }

  public execute(name: string, params: any) {
    const command = this.bank[name];
    if (!command) return;
    command.execute(params);
    this.history.push(name);
  }

  public undo() {
    const name = this.history.pop();
    if (!name) return;
    const command = this.bank[name];
    if (!command.undo) return;
    command.undo();
  }
}
