export interface Command<P, R> {
  execute: (params: P) => R;
  undo?: () => void;
}
