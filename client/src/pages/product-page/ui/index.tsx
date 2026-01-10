import type { Product } from "@/entities/product/types";
import { Toast } from "@/feat";
import { productsApi } from "@/lib/api/products";
import type { AxiosError } from "axios";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import {
  Main,
  ProductContainer,
  Image,
  Details,
  Category,
  Price,
  Description,
  Unit,
  Quantity,
} from "./styled";
import { TitleL, TitleM } from "@/shared/ui/captions";
import { StarRating } from "@/shared/ui/star-rating";
import { Button, Loader } from "@/shared/ui";

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
      }
    } catch (err) {
      const error = err as AxiosError;
      Toast.show({
        title: "Ошибка",
        msg: "Неизвестная ошибка",
        type: "error",
      });
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadProduct();
  }, [loadProduct]);

  if (isLoading) {
    return (
      <Main>
        <Loader />
      </Main>
    );
  }

  if (!product) {
    return (
      <Main>
        <TitleM>Продукт не найден</TitleM>
      </Main>
    );
  }

  return (
    <Main>
      <ProductContainer>
        <Image src={product.details.image_url} alt={product.name} />
        <Details>
          <Category>{product.category}</Category>
          <TitleL>{product.name}</TitleL>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Price>{product.price}р</Price>
            <StarRating rating={parseFloat(product.rating)} />
          </div>
          <Description>{product.details.description}</Description>
          <div style={{ display: "flex", gap: "20px" }}>
            <Unit>Единица: {product.details.unit}</Unit>
            <Quantity>Количество: {product.details.quantity}</Quantity>
          </div>
          <Button variant="primary">Добавить в корзину</Button>
        </Details>
      </ProductContainer>
    </Main>
  );
};
