import type { Command } from "./enteties/command";

export class CommandManager {
  bank: Record<string, Command<any, any>>;
  history: string[];

  constructor() {
    this.bank = {};
    this.history = [];
  }

  public add(name: string, command: Command<any, any>) {
    if (this.bank[name]) {
      throw Error("Команда с таким именем уже существует");
    }
    this.bank[name] = command;
  }

  public remove(name: string) {
    delete this.bank[name];
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

export const manager = new CommandManager();
