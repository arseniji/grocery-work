import { useState, useMemo, useEffect } from "react";
import { LoaderWrapper, Main } from "./styled";
import { Loader } from "@/shared/ui";
import { TitleM } from "@/shared/ui/captions";
import { useSearchParams } from "react-router";
import { AdminProductAddSchema } from "@/entities/product/schemas";
import { AdminProductForm } from "./admin-product-form";
import { useProducts } from "../hooks/useProducts";
import { usePagination } from "@/lib/hooks";
import { useProductActions } from "../hooks/useProductActions";
import { ProductControls } from "./product-controls";
import { ProductTable } from "./product-table";
import { PaginationControls } from "@/shared/ui";
import type { ShortProduct } from "@/lib/api/admin/types";
import { manager } from "@/lib/command";
import { ApiCommand } from "@/lib/command/entities/api-command";

export const AdminProductsPage = () => {
  const [params] = useSearchParams();
  const page = parseInt(params.get("page") || "1", 10);
  const sort = params.get("sort") || undefined;
  const search = params.get("search") || undefined;
  const itemsPerPage = 10;

  const [selected, setSelected] = useState<ShortProduct | undefined>();

  const { isLoading, data, refetch } = useProducts(
    page,
    itemsPerPage,
    sort,
    search,
  );
  const { handlePrevPage, handleNextPage, handleSort, handleSearch } =
    usePagination("/admin/products");
  const {
    isFormOpen,
    isEditing,
    editingProduct,
    isLoadingEdit,
    handleAddProduct,
    handleEditProduct,
    handleCloseForm,
    handleSubmit,
    handleDeleteProduct,
  } = useProductActions(refetch, selected);

  const initialValues = useMemo(
    () =>
      isEditing && editingProduct
        ? {
            productName: editingProduct.productName,
            price: parseFloat(editingProduct.price),
            rating: editingProduct.rating,
            category: editingProduct.category,
            description: editingProduct.details.description,
            measurementUnit: editingProduct.details.unit,
            quantity: editingProduct.details.quantity,
          }
        : {},
    [isEditing, editingProduct],
  );

  const onSubmit = (data: any) => {
    manager.execute("api", () => handleSubmit(data));
  };

  const onDelete = () => {
    manager.execute("api", handleDeleteProduct);
  };

  useEffect(() => {
    const command = new ApiCommand();
    manager.add("api", command);
  }, []);

  return (
    <Main>
      <TitleM>Продукты</TitleM>
      {isLoading ? (
        <LoaderWrapper>
          <Loader />
        </LoaderWrapper>
      ) : (
        <>
          <ProductControls
            data={data}
            sort={sort}
            search={search}
            onAdd={handleAddProduct}
            onEdit={handleEditProduct}
            onDelete={onDelete}
            onSort={handleSort}
            onSearch={handleSearch}
            selected={!!selected}
          />
          {(isFormOpen || isLoadingEdit) &&
            (isLoadingEdit ? (
              <LoaderWrapper>
                <Loader />
              </LoaderWrapper>
            ) : (
              <AdminProductForm
                key={isEditing ? "edit" : "add"}
                schema={AdminProductAddSchema}
                initialValues={initialValues}
                onSubmit={onSubmit}
                onCancel={handleCloseForm}
                title={isEditing ? "Изменить продукт" : "Добавить продукт"}
                submitLabel={isEditing ? "Сохранить" : "Добавить"}
              />
            ))}
          <ProductTable data={data?.products} onSelect={setSelected} />
          <PaginationControls
            page={page}
            totalPages={data?.meta?.totalPages}
            hasNext={
              !!(data?.products && data.products.length === itemsPerPage)
            }
            onPrev={() => handlePrevPage(page)}
            onNext={() =>
              handleNextPage(
                page,
                !!(data?.products && data.products.length === itemsPerPage),
              )
            }
          />
        </>
      )}
    </Main>
  );
};
