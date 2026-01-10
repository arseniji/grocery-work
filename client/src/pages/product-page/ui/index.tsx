import type { Product } from "@/entities/product/types";
import { Toast } from "@/feat";
import { productsApi } from "@/lib/api/products";
import type { AxiosError } from "axios";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";

export const ProductPage = () => {
  const { id } = useParams();

  const [product, setProduct] = useState<Product>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadProduct = useCallback(async () => {
    setIsLoading(true);
    if (!id) return;
    try {
      const response = await productsApi.getById(parseInt(id));

      if (response.success) {
        setProduct(response);
        setIsLoading(false);
        return;
      }
    } catch (err) {
      const error = err as AxiosError;
      Toast.show({
        title: "Ошибка",
        msg: (error.response?.error.message as string) || "Неизетсная ошибка",
        type: "error",
      });
      console.log(error);
    }
  }, [id]);

  useEffect(() => {
    loadProduct();
  }, [loadProduct]);

  return <></>;
};
