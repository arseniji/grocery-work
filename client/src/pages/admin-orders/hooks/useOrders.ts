import { useCallback, useEffect, useState } from "react";
import { adminApi } from "@/lib/api/admin";
import type { GetOrdersRes } from "@/lib/api/admin/types";
import { Toast } from "@/feat";

export const useOrders = (
  page: number,
  itemsPerPage: number,
  sort?: string,
  search?: string,
) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [data, setData] = useState<GetOrdersRes>();

  const loadOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await adminApi.getOrders(
        page,
        itemsPerPage,
        sort,
        search,
      );
      if (response.success) {
        setData(response);
      }
    } catch {
      Toast.show({
        type: "error",
        title: "Ошибка!",
        msg: "Ошибка получения заказов",
      });
    }
    setIsLoading(false);
  }, [page, itemsPerPage, sort, search]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  return { isLoading, data, refetch: loadOrders };
};
