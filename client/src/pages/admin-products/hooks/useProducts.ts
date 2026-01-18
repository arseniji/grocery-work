import { useCallback, useEffect, useState } from "react";
import { adminApi } from "@/lib/api/admin";
import type { GetProductsRes } from "@/lib/api/admin/types";
import { Toast } from "@/feat";

export const useProducts = (
  page: number,
  itemsPerPage: number,
  sort?: string,
  search?: string
) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [data, setData] = useState<GetProductsRes>();

  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await adminApi.getProducts(
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
        msg: "Ошибка получения продуктов",
      });
    }
    setIsLoading(false);
  }, [page, itemsPerPage, sort, search]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  return { isLoading, data, refetch: loadProducts };
};
