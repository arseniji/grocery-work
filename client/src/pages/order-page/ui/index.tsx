import { Toast } from "@/feat";
import { orderApi } from "@/lib/api/order";
import type { AxiosError } from "axios";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import type { GetOrderDetailsRes } from "@/lib/api/order/types";
import { Loader } from "@/shared/ui";
import { TitleM, BodyM } from "@/shared/ui/captions";
import {
  Main,
  OrderContainer,
  OrderHeader,
  ProductsList,
  ProductItem,
  ProductImage,
  ProductInfo,
  Summary,
} from "./styled";

export const OrderPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState<GetOrderDetailsRes | null>(null);
  const [loading, setLoading] = useState(true);

  const loadOrder = useCallback(async () => {
    try {
      if (!id) throw Error;
      const response = await orderApi.getDetails(parseInt(id));
      if (response.success) {
        setOrderData(response);
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
    } finally {
      setLoading(false);
    }
  }, [navigate, id]);

  useEffect(() => {
    loadOrder();
  }, [loadOrder]);

  if (loading) {
    return (
      <Main>
        <Loader />
      </Main>
    );
  }

  if (!orderData) {
    return (
      <Main>
        <TitleM>Заказ не найден</TitleM>
      </Main>
    );
  }

  const { order, products, summary } = orderData;

  return (
    <Main>
      <OrderContainer>
        <OrderHeader>
          <TitleM>Заказ #{order.id}</TitleM>
          <BodyM>Описание: {order.description}</BodyM>
          <BodyM>Статус: {order.status || "Неизвестен"}</BodyM>
          <BodyM>
            Создан: {new Date(order.timestamps.createdAt).toLocaleDateString()}
          </BodyM>
        </OrderHeader>
        <ProductsList>
          {products.map((product) => (
            <ProductItem key={product.id}>
              <ProductImage
                src={product.details?.image_url || ""}
                alt={product.name}
              />
              <ProductInfo>
                <TitleM>{product.name}</TitleM>
                <BodyM>Цена: {product.price}р</BodyM>
                <BodyM>
                  Количество: {product.metadata.orderDetails.quantityInOrder}
                </BodyM>
                <BodyM>
                  Итого: {product.metadata.orderDetails.totalPriceForItem}р
                </BodyM>
              </ProductInfo>
            </ProductItem>
          ))}
        </ProductsList>
        <Summary>
          <BodyM>Общее количество товаров: {summary.itemsCount}</BodyM>
          <BodyM>Общая сумма: {summary.totalPrice}р</BodyM>
        </Summary>
      </OrderContainer>
    </Main>
  );
};
