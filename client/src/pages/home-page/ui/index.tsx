import {
  TextXL,
  PrimarySpan,
  TitleXL,
  TitleXS,
  TextM,
  TitleL,
  TitleM,
} from "@/shared/ui/captions";
import {
  Adj,
  AdjContainer,
  AdjTextWrapper,
  ContentWrapper,
  EcoContainer,
  EcoImage,
  Image,
  Introduce,
  Main,
  MainContainer,
  ProductsList,
  TopSellerrsContainer,
} from "./styled";
import { Button, Loader, ProductCard } from "@/shared/ui";
import { adjList } from "../constants/adj-list";
import type { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { productsApi } from "@/lib/api/products";
import type { Product } from "@/entities/product/types";

export const HomePage = () => {
  const [products, setProducts] = useState<Product[]>([]);

  const loadProducts = async () => {
    try {
      const response = await productsApi.top(8);
      if (response.success) {
        setProducts(response.products);
      }
    } catch (err) {
      const error = err as AxiosError;
      console.log(error);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <Main>
      <Introduce>
        <MainContainer>
          <ContentWrapper>
            <TitleXL>
              Ваш идеальный -<PrimarySpan>магазин продуктов</PrimarySpan>
            </TitleXL>
            <TextXL>
              Ощутите удобство покупок продуктов и быструю доставку на дом с
              нашим широким ассортиментом свежих продуктов и необходимых товаров
            </TextXL>
            <Button as="link" href="/about" variant="primary">
              Узнать больше
            </Button>
          </ContentWrapper>
          <Image src="\static\groceries.png" />
        </MainContainer>
      </Introduce>

      <AdjContainer>
        {adjList.map((adj) => (
          <Adj key={adj.title}>
            {adj.icon()}
            <AdjTextWrapper>
              <TitleXS style={{ textWrap: "nowrap" }}>{adj.title}</TitleXS>
              <TextM>{adj.text}</TextM>
            </AdjTextWrapper>
          </Adj>
        ))}
      </AdjContainer>

      <EcoContainer>
        <EcoImage src="\static\eco.png" />
        <ContentWrapper>
          <TitleL>
            <PrimarySpan>ECO</PrimarySpan>-Friendly
            <TextXL>
              Откройте для себя широкий ассортимент экологически чистых
              продуктов местного производства в нашем интернет-магазине, где вы
              найдете экологичные варианты, поддерживающие как местное
              сообщество, так и планету.
            </TextXL>
          </TitleL>
        </ContentWrapper>
      </EcoContainer>

      <TopSellerrsContainer>
        <TitleM>Топ продаж</TitleM>
        {products.length === 0 ? (
          <Loader />
        ) : (
          <ProductsList>
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                rating={product.rating}
                image={product.details.image_url}
              />
            ))}
          </ProductsList>
        )}
      </TopSellerrsContainer>
    </Main>
  );
};
