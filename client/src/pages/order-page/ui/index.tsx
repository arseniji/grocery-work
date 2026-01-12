import { Toast } from "@/feat";
import { orderApi } from "@/lib/api/order";
import type { AxiosError } from "axios";
import { useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router";

export const OrderPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const loadOrder = useCallback(async () => {
    try {
      if (!id) throw Error;
      const response = await orderApi.getDetails(parseInt(id));
      if (response.success) {
      }
    } catch (err) {
      const error = err as AxiosError;
      console.log(error);
      Toast.show({
        type: "error",
        title: "Ошибка!",
        msg: "Ошибка получения заказа, вы будете перенаправленны",
      });

      setTimeout(() => {
        navigate("/");
      }, 1000);
    }
  }, [navigate, id]);

  useEffect(() => {
    loadOrder();
  }, [loadOrder]);

  return <></>;
};
