import type { AxiosError } from "axios";
import type { Command } from "./command";
import { adminApi } from "@/lib/api/admin";
import { Toast } from "@/feat";

export class ApiCommand implements Command<() => void, void> {
  public execute(func: () => void) {
    func();
  }

  public undo() {
    try {
      adminApi.undo();
      Toast.show({
        title: "Отмена",
        type: "msg",
        msg: "Действие успешно отменено",
      });
      window.location.reload();
    } catch (err) {
      const error = err as AxiosError;
      console.log(error);
    }
  }
}
