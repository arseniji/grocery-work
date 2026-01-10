import type { Product } from "@/entities/product/types";
import { Toast } from "@/feat";
import { cartApi } from "@/lib/api/cart";
import type { AxiosError } from "axios";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  CartList,
  CartWrapper,
  Empty,
  LoaderWrapper,
  Main,
  MetaContainer,
} from "./styled";
import { BodyL, TitleL, TitleM } from "@/shared/ui/captions";
import { Button, Loader } from "@/shared/ui";
import { CartProduct } from "@/widgets/cart-product";

type CartProductType = Product & { quantity: number };

export const CartPage = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState<CartProductType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [total, setTotal] = useState<string>();

  const loadCart = useCallback(async () => {
    try {
      const response = await cartApi.get();
      if (response.success) {
        setProducts(response.items as CartProductType[]);
        setTotal(response.summary.totalPrice);
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

  const handleIncrease = useCallback(
    async (id: number) => {
      try {
        await cartApi.addOne(id);
        loadCart();
      } catch (err) {
        const error = err as AxiosError;
        console.log(error);
        Toast.show({
          type: "error",
          title: "Ошибка",
          msg: "Не удалось добавить товар",
        });
      }
    },
    [loadCart]
  );

  const handleDecrease = useCallback(
    async (id: number) => {
      try {
        await cartApi.removeOne(id);
        loadCart();
      } catch (err) {
        const error = err as AxiosError;
        console.log(error);
        Toast.show({
          type: "error",
          title: "Ошибка",
          msg: "Не удалось уменьшить количество",
        });
      }
    },
    [loadCart]
  );

  const handleDelete = useCallback(
    async (id: number) => {
      try {
        await cartApi.remove(id);
        loadCart();
      } catch (err) {
        const error = err as AxiosError;
        console.log(error);
        Toast.show({
          type: "error",
          title: "Ошибка",
          msg: "Не удалось удалить товар",
        });
      }
    },
    [loadCart]
  );

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  return (
    <Main>
      <TitleL>Корзина</TitleL>
      {isLoading ? (
        <LoaderWrapper>
          <Loader />
        </LoaderWrapper>
      ) : (
        <CartWrapper>
          <CartList>
            {products.length === 0 && (
              <Empty>
                <TitleM>Ваша корзина пуста</TitleM>
                <Button variant="border" onClick={() => navigate("/shop")}>
                  Перейти к покупкам
                </Button>
              </Empty>
            )}
            {products.map((pr) => (
              <CartProduct
                key={pr.id}
                total_price={pr.quantity * parseInt(pr.price)}
                {...pr}
                onIncrease={() => handleIncrease(pr.id)}
                onDecrease={() => handleDecrease(pr.id)}
                onDelete={() => handleDelete(pr.id)}
              />
            ))}
          </CartList>

          {total && (
            <MetaContainer>
              <BodyL>Общая сумма: {total}р</BodyL>
            </MetaContainer>
          )}
        </CartWrapper>
      )}
    </Main>
  );
};
