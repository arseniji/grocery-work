import { useCallback, useEffect, useState } from "react";
import { LoaderWrapper, Main } from "./styled";
import type { AxiosError } from "axios";
import { DataTable, Toast } from "@/feat";
import { adminApi } from "@/lib/api/admin";
import type { GetUsersRes } from "@/lib/api/admin/types";
import { Loader } from "@/shared/ui";
import { TitleM } from "@/shared/ui/captions";

export const AdminUsersPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [data, setData] = useState<GetUsersRes>();
  const [selected, setSelected] = useState<Record<string, any>>();

  const loadUsers = useCallback(async () => {
    try {
      const response = await adminApi.getUsers();
      if (response.success) {
        setData(response);
      }
    } catch (err) {
      const error = err as AxiosError;
      console.log(error);
      Toast.show({
        type: "error",
        title: "Ошибка!",
        msg: "Ошибка получения пользователей",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  return (
    <Main>
      <TitleM>Пользователи</TitleM>
      {isLoading ? (
        <LoaderWrapper>
          <Loader />
        </LoaderWrapper>
      ) : (
        <DataTable
          data={data?.users}
          keys={["userId", "firstname", "lastname", "login", "role"]}
          onSelect={setSelected}
        />
      )}
    </Main>
  );
};
