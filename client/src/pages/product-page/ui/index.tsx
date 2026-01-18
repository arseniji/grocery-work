import type { Product } from "@/entities/product/types";
import { Toast } from "@/feat";
import { productsApi } from "@/lib/api/products";
import type { AxiosError } from "axios";
import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import {
  Main,
  ProductContainer,
  Image,
  Details,
  Category,
  Price,
  Unit,
  Quantity,
  SimilarProducts,
  ProductsList,
  PriceRating,
  UnitQuantity,
  QuantitySelector,
  ButtonContainer,
} from "./styled";
import { TitleL, TitleM, BodyL } from "@/shared/ui/captions";
import { StarRating } from "@/shared/ui/star-rating";
import { Button, Loader, ProductCard } from "@/shared/ui";
import { cartApi } from "@/lib/api/cart";

export const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product>();
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [quantity, setQuantity] = useState<number>(1);

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

  const loadSimilarProducts = useCallback(
    async (category: string) => {
      try {
        const response = await productsApi.get(
          1,
          5,
          undefined,
          category,
          undefined,
        );
        if (response.success) {
          const filtered = response.products.filter(
            (p) => p.id !== product?.id,
          );
          setSimilarProducts(filtered.slice(0, 4));
        }
      } catch (err) {
        console.log(err);
      }
    },
    [product?.id],
  );

  const addToCart = async () => {
    if (!id) return;
    try {
      const respone = await cartApi.addMany({
        productId: parseInt(id),
        quantity: quantity,
      });
      if (respone.success) {
        Toast.show({
          type: "msg",
          title: "Успех!",
          msg: "Товар успешно добавлен",
        });
      }
    } catch (err) {
      const error = err as AxiosError;
      console.log(error);
      Toast.show({
        type: "error",
        title: "Ошибка добавления",
        msg: "Неизвестная ошибка",
      });
    }
  };

  useEffect(() => {
    loadProduct();
  }, [loadProduct]);

  useEffect(() => {
    if (product?.category) {
      loadSimilarProducts(product.category);
    }
  }, [product?.category, loadSimilarProducts]);

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
        <Image src={product.details.image_url} alt={product.productName} />
        <Details>
          <Category>{product.category}</Category>
          <TitleL>{product.productName}</TitleL>
          <PriceRating>
            <Price>{product.price}р</Price>
            <StarRating rating={parseFloat(product.rating)} />
          </PriceRating>
          <BodyL>{product.details.description}</BodyL>
          <UnitQuantity>
            <Unit>Единица: {product.details.unit}</Unit>
            <Quantity>Количество: {product.details.quantity}</Quantity>
          </UnitQuantity>
          <QuantitySelector>
            <BodyL>Выбрать количество:</BodyL>
            <Button
              variant="border"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
            >
              -
            </Button>
            <BodyL>{quantity}</BodyL>
            <Button
              variant="border"
              onClick={() =>
                setQuantity(Math.min(product.details.quantity, quantity + 1))
              }
            >
              +
            </Button>
          </QuantitySelector>
          <Button variant="primary" onClick={addToCart}>
            Добавить в корзину
          </Button>
        </Details>
      </ProductContainer>

      {similarProducts.length > 0 && (
        <SimilarProducts>
          <TitleM>Похожие товары</TitleM>
          <ProductsList>
            {similarProducts.map((p) => (
              <ProductCard
                key={p.id}
                id={p.id}
                productName={p.productName}
                price={p.price}
                rating={p.rating}
                image={p.details.image_url}
              />
            ))}
          </ProductsList>
          <ButtonContainer>
            <Button
              variant="border"
              onClick={() =>
                navigate(
                  `/shop?category=${encodeURIComponent(product.category)}`,
                )
              }
            >
              Смотреть больше
            </Button>
          </ButtonContainer>
        </SimilarProducts>
      )}
    </Main>
  );
};
