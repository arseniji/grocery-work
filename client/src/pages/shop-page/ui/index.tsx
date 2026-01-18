import { TitleM, TitleXS } from "@/shared/ui/captions";
import {
  Main,
  ShopContainer,
  ProductsList,
  PaginationContainer,
  LoaderWrapper,
  CategoryContainer,
  SortContainer,
} from "./styled";
import { Loader, ProductCard, Button, ComboBox } from "@/shared/ui";
import type { AxiosError } from "axios";
import { useEffect, useState, useCallback } from "react";
import { productsApi } from "@/lib/api/products";
import type { Category, Product } from "@/entities/product/types";
import { Toast } from "@/feat";
import { sortOptions } from "../constants/sort-options";
import { usePagination } from "@/lib/hooks";
import { useSearchParams } from "react-router";

export const ShopPage = () => {
  const [params] = useSearchParams();
  const page = parseInt(params.get("page") || "1", 10);
  const search = params.get("search") || undefined;
  const sort = params.get("sort") || undefined;
  const category = params.get("category") || undefined;
  const { handlePrevPage, handleNextPage, handleSort, handleCategory } =
    usePagination("/shop");

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const itemsPerPage = 12;

  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await productsApi.get(
        page,
        itemsPerPage,
        sort,
        category,
        search,
      );
      if (response.success) {
        setProducts(response.products);
        setTotalPages(response.meta.totalPages);
      }
    } catch (err) {
      const error = err as AxiosError;
      Toast.show({
        msg: "Ошибка при получении товаров",
        title: "Ошибка!",
        type: "error",
      });
      console.log(error);
    }
    setIsLoading(false);
  }, [category, page, search, sort]);

  const loadCategories = useCallback(async () => {
    try {
      const response = await productsApi.categories();

      if (response.success) {
        setCategories(response.items);
      }
    } catch (err) {
      const error = err as AxiosError;
      console.log(error);
      Toast.show({
        title: "Ошибка",
        type: "error",
        msg: "Ошибка при получении категорий",
      });
    }
  }, []);

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, [loadProducts, loadCategories]);

  return (
    <Main>
      <ShopContainer>
        <TitleM>Магазин</TitleM>

        <CategoryContainer>
          {categories.map((c) => (
            <Button
              variant="border"
              key={c.categoryName}
              onClick={() => handleCategory(c.categoryName)}
              active={category === c.categoryName}
            >
              {c.categoryName}
            </Button>
          ))}
        </CategoryContainer>

        <SortContainer>
          <ComboBox
            value={sort}
            options={sortOptions}
            placeholder="Сортировать по: "
            onChange={handleSort}
          />
        </SortContainer>

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
                  productName={product.productName}
                  price={product.price}
                  rating={product.rating}
                  image={product.details.imageUrl}
                />
              ))}
            </ProductsList>
            <PaginationContainer>
              {page > 1 && (
                <Button variant="border" onClick={() => handlePrevPage(page)}>
                  Предыдущая
                </Button>
              )}

              {totalPages && (
                <TitleXS>
                  {page} / {totalPages}
                </TitleXS>
              )}

              {products.length === itemsPerPage && (
                <Button
                  variant="border"
                  onClick={() => handleNextPage(page, page <= totalPages)}
                >
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
