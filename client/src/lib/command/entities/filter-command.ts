import type { NavigateFunction } from "react-router";
import type { Command } from "./command";

export class FilterCommand implements Command<
  { key: string; value?: string },
  void
> {
  private history: Array<{ key: string; previousValue: string | undefined }> =
    [];
  private readonly navigate: NavigateFunction;
  private readonly basePath: string;

  constructor(navigate: NavigateFunction, basePath: string) {
    this.navigate = navigate;
    this.basePath = basePath;
  }

  public execute({ key, value }: { key: string; value?: string }) {
    const currentParams = new URLSearchParams(window.location.search);
    const previousValue = currentParams.get(key) || undefined;
    this.history.push({ key, previousValue });

    if (value) {
      currentParams.set(key, value);
    } else {
      currentParams.delete(key);
    }

    this.navigate(`${this.basePath}?${currentParams.toString()}`);
  }

  public undo() {
    const lastChange = this.history.pop();
    if (!lastChange) return;

    const currentParams = new URLSearchParams(window.location.search);
    if (lastChange.previousValue) {
      currentParams.set(lastChange.key, lastChange.previousValue);
    } else {
      currentParams.delete(lastChange.key);
    }

    this.navigate(`${this.basePath}?${currentParams.toString()}`);
  }
}
