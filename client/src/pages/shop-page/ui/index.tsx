import { TitleM } from "@/shared/ui/captions";
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
import { useNavigate, useSearchParams } from "react-router";
import { Toast } from "@/feat";
import { sortOptions } from "../constants/sort-options";

export const ShopPage = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const page = parseInt(params.get("page") || "1", 10);
  const search = params.get("search") || undefined;
  const sort = params.get("sort") || undefined;
  const category = params.get("category") || undefined;

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const itemsPerPage = 12;

  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await productsApi.get(
        page,
        itemsPerPage,
        sort,
        category,
        search
      );
      if (response.success) {
        setProducts(response.products);
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
  }, [page, search, sort, category]);

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

  const handlePrevPage = () => {
    if (page > 1) {
      const newParams = new URLSearchParams(params);
      newParams.set("page", (page - 1).toString());
      navigate(`/shop?${newParams.toString()}`);
    }
  };

  const handleNextPage = () => {
    if (products.length === itemsPerPage) {
      const newParams = new URLSearchParams(params);
      newParams.set("page", (page + 1).toString());
      navigate(`/shop?${newParams.toString()}`);
    }
  };

  const handleCategory = (name: string) => {
    if (category === name) {
      const newParams = new URLSearchParams(params);
      newParams.delete("category");
      navigate(`/shop?${newParams.toString()}`);
      return;
    }
    if (categories.length > 0) {
      const newParams = new URLSearchParams(params);
      newParams.set("category", name);
      navigate(`/shop?${newParams.toString()}`);
    }
  };

  const handleSort = (sort?: string) => {
    if (sort) {
      const newParams = new URLSearchParams(params);
      newParams.set("sort", sort);
      navigate(`/shop?${newParams.toString()}`);
    }
  };

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
