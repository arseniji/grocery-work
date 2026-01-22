import type { AxiosError } from "axios";
import type { Command } from "./entities/command";
import { adminApi } from "../api/admin";

export class CommandManager {
  bank: Record<string, Command<any, any>>;
  history: string[];

  private loadHistory = async () => {
    try {
      const { history } = (await adminApi.history()) as { history: Array<any> };
      this.history = history.map(() => "api");
    } catch (err) {
      const error = err as AxiosError;
      console.error(error);
    }
  };

  constructor() {
    this.bank = {};
    this.history = [];
    this.loadHistory();
  }

  public add(name: string, command: Command<any, any>) {
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
