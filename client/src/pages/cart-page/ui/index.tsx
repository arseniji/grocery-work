import type { Product } from "@/entities/product/types";
import { Toast } from "@/feat";
import { cartApi } from "@/lib/api/cart";
import type { AxiosError } from "axios";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";

export const CartPage = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadCart = useCallback(async () => {
    try {
      const response = await cartApi.get();
      if (response.success) {
        setProducts(response.items);
      }
    } catch (err) {
      const error = err as AxiosError;
      console.log(error);

      if (error.code === "401" || error.response?.status === 401) {
        Toast.show({
          type: "error",
          title: "Ошибка!",
          msg: "Необходимо войти",
        });
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      }
      Toast.show({
        type: "error",
        title: "Ошибка!",
        msg: "Ошибка получения корзины",
      });
    }
    setIsLoading(false);
  }, [navigate]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  return <></>;
};
