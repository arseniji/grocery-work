import { useCallback, useEffect, useState } from "react";
import {
  ControlsWrapper,
  LoaderWrapper,
  Main,
  PaginationContainer,
  RowWrapper,
} from "./styled";
import type { AxiosError } from "axios";
import { DataTable, Toast } from "@/feat";
import { adminApi } from "@/lib/api/admin";
import type { GetProductsRes } from "@/lib/api/admin/types";
import { Loader, Button, ComboBox } from "@/shared/ui";
import { TitleM, TitleXS } from "@/shared/ui/captions";
import { useNavigate, useSearchParams } from "react-router";
import { getSortingOptions } from "../utils";
import {
  AdminProductAddSchema,
  type AdminProductAddType,
  type AdminProductEditType,
} from "@/entities/product/schemas";
import type { ShortProduct } from "@/lib/api/admin/types";
import type { Product } from "@/entities/product/types";
import { AdminProductForm } from "./admin-product-form";

export const AdminProductsPage = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const page = parseInt(params.get("page") || "1", 10);
  const sort = params.get("sort") || undefined;
  const itemsPerPage = 10;

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [data, setData] = useState<GetProductsRes>();
  const [selected, setSelected] = useState<Record<string, any>>();
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product>();
  const [editingProductId, setEditingProductId] = useState<number>();
  const [isLoadingEdit, setIsLoadingEdit] = useState<boolean>(false);

  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await adminApi.getProducts(page, itemsPerPage, sort);
      if (response.success) {
        setData(response);
      }
    } catch (err) {
      const error = err as AxiosError;
      console.log(error);
      Toast.show({
        type: "error",
        title: "Ошибка!",
        msg: "Ошибка получения продуктов",
      });
    }
    setIsLoading(false);
  }, [page, itemsPerPage, sort]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handlePrevPage = () => {
    if (page > 1) {
      const newParams = new URLSearchParams(params);
      newParams.set("page", (page - 1).toString());
      navigate(`/admin/products?${newParams.toString()}`);
    }
  };

  const handleNextPage = () => {
    if (data?.products && data.products.length === itemsPerPage) {
      const newParams = new URLSearchParams(params);
      newParams.set("page", (page + 1).toString());
      navigate(`/admin/products?${newParams.toString()}`);
    }
  };

  const handleSort = (sort?: string) => {
    if (sort) {
      const newParams = new URLSearchParams(params);
      newParams.set("sort", sort);
      navigate(`/admin/products?${newParams.toString()}`);
    } else {
      const newParams = new URLSearchParams(params);
      newParams.delete("sort");
      navigate(`/admin/products?${newParams.toString()}`);
      return;
    }
  };

  const handleAddProduct = () => {
    setIsEditing(false);
    setEditingProduct(undefined);
    setIsFormOpen(true);
  };

  const handleEditProduct = async () => {
    if (selected) {
      setIsEditing(true);
      setEditingProductId((selected as ShortProduct).id);
      setIsLoadingEdit(true);
      try {
        const response = await adminApi.getProduct(
          (selected as ShortProduct).id
        );
        setEditingProduct((response as any).data || response);
        setIsFormOpen(true);
      } catch (err) {
        const error = err as AxiosError;
        console.log(error);
        Toast.show({
          type: "error",
          title: "Ошибка!",
          msg: "Ошибка получения данных продукта",
        });
      } finally {
        setIsLoadingEdit(false);
      }
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
  };

  const handleSubmit = async (data: any) => {
    try {
      if (isEditing && editingProductId) {
        await adminApi.updateProduct(
          editingProductId,
          data as AdminProductEditType
        );
        Toast.show({
          type: "msg",
          title: "Успех!",
          msg: "Продукт обновлен",
        });
      } else {
        await adminApi.addProduct(data as AdminProductAddType);
        Toast.show({
          type: "msg",
          title: "Успех!",
          msg: "Продукт добавлен",
        });
      }
      loadProducts();
      setIsFormOpen(false);
    } catch (err) {
      const error = err as AxiosError;
      console.log(error);
      Toast.show({
        type: "error",
        title: "Ошибка!",
        msg: isEditing
          ? "Ошибка обновления продукта"
          : "Ошибка добавления продукта",
      });
    }
  };

  const handleDeleteProduct = async () => {
    if (selected) {
      try {
        await adminApi.deleteProduct((selected as ShortProduct).id);
        Toast.show({
          type: "msg",
          title: "Успех!",
          msg: "Продукт удален",
        });
        loadProducts();
        setSelected(undefined);
      } catch (err) {
        const error = err as AxiosError;
        console.log(error);
        Toast.show({
          type: "error",
          title: "Ошибка!",
          msg: "Ошибка удаления продукта",
        });
      }
    }
  };

  return (
    <Main>
      <TitleM>Продукты</TitleM>
      {isLoading ? (
        <LoaderWrapper>
          <Loader />
        </LoaderWrapper>
      ) : (
        <>
          <ControlsWrapper>
            <RowWrapper style={{ justifyContent: "space-between" }}>
              <ComboBox
                placeholder="Сортировать по:"
                options={getSortingOptions(data?.products?.at(0))}
                onChange={handleSort}
              />
            </RowWrapper>
            <RowWrapper>
              <Button variant={"border"} onClick={handleAddProduct}>
                Добавить
              </Button>
              <Button
                variant={"border"}
                disabled={!selected}
                onClick={handleEditProduct}
              >
                Изменить
              </Button>
              <Button
                variant={"border"}
                disabled={!selected}
                onClick={handleDeleteProduct}
              >
                Удалить
              </Button>
            </RowWrapper>
          </ControlsWrapper>
          {(isFormOpen || isLoadingEdit) &&
            (isLoadingEdit ? (
              <LoaderWrapper>
                <Loader />
              </LoaderWrapper>
            ) : (
              <AdminProductForm
                key={isEditing ? "edit" : "add"}
                schema={AdminProductAddSchema}
                initialValues={
                  isEditing && editingProduct
                    ? {
                        product_name: editingProduct.name,
                        price: parseFloat(editingProduct.price),
                        rating: editingProduct.rating,
                        category: editingProduct.category,
                        description: editingProduct.details.description,
                        measurement_unit: editingProduct.details.unit,
                        quantity: editingProduct.details.quantity,
                      }
                    : {}
                }
                onSubmit={handleSubmit}
                onCancel={handleCloseForm}
                title={isEditing ? "Изменить продукт" : "Добавить продукт"}
                submitLabel={isEditing ? "Сохранить" : "Добавить"}
              />
            ))}
          <DataTable data={data?.products} onSelect={setSelected} />
          <PaginationContainer>
            {page > 1 && (
              <Button variant="border" onClick={handlePrevPage}>
                Предыдущая
              </Button>
            )}

            {data?.meta && (
              <TitleXS>
                {page} / {data.meta.totalPages}
              </TitleXS>
            )}

            {data?.products && data.products.length === itemsPerPage && (
              <Button variant="border" onClick={handleNextPage}>
                Следующая
              </Button>
            )}
          </PaginationContainer>
        </>
      )}
    </Main>
  );
};
