import { TitleM } from "@/shared/ui/captions";
import {
  Main,
  ShopContainer,
  ProductsList,
  PaginationContainer,
  LoaderWrapper,
} from "./styled";
import { Loader, ProductCard, Button } from "@/shared/ui";
import type { AxiosError } from "axios";
import { useEffect, useState, useCallback } from "react";
import { productsApi } from "@/lib/api/products";
import type { Product } from "@/entities/product/types";
import { useNavigate, useSearchParams } from "react-router";

export const ShopPage = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const page = parseInt(params.get("page") || "1", 10);

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const itemsPerPage = 12;

  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await productsApi.get(page, itemsPerPage);
      if (response.success) {
        setProducts(response.products);
      }
    } catch (err) {
      const error = err as AxiosError;
      console.log(error);
    }
    setIsLoading(false);
  }, [page]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handlePrevPage = () => {
    if (page > 1) navigate(`/shop?page=${page - 1}`);
  };

  const handleNextPage = () => {
    if (products.length === itemsPerPage) navigate(`/shop?page=${page + 1}`);
  };

  return (
    <Main>
      <ShopContainer>
        <TitleM>Магазин</TitleM>
        {isLoading ? (
          <LoaderWrapper>
            <Loader />
          </LoaderWrapper>
        ) : (
          <>
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
            <PaginationContainer>
              {page > 1 && (
                <Button variant="border" onClick={handlePrevPage}>
                  Предыдущая
                </Button>
              )}

              {products.length === itemsPerPage && (
                <Button variant="border" onClick={handleNextPage}>
                  Следующая
                </Button>
              )}
            </PaginationContainer>
          </>
        )}
      </ShopContainer>
    </Main>
  );
};
