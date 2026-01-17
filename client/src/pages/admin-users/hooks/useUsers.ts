import { useCallback, useEffect, useState } from "react";
import { adminApi } from "@/lib/api/admin";
import type { GetUsersRes } from "@/lib/api/admin/types";
import { Toast } from "@/feat";

export const useUsers = (
  page: number,
  itemsPerPage: number,
  sort?: string,
  search?: string
) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [data, setData] = useState<GetUsersRes>();

  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await adminApi.getUsers(
        page,
        itemsPerPage,
        sort,
        search
      );
      if (response.success) {
        setData(response);
      }
    } catch {
      Toast.show({
        type: "error",
        title: "Ошибка!",
        msg: "Ошибка получения пользователей",
      });
    }
    setIsLoading(false);
  }, [page, itemsPerPage, sort, search]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  return { isLoading, data, refetch: loadUsers };
};
