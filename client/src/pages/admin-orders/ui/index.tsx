import { useState } from "react";
import { LoaderWrapper, Main } from "./styled";
import { Loader } from "@/shared/ui";
import { TitleM } from "@/shared/ui/captions";
import { useSearchParams } from "react-router";
import { AdminOrderAddSchema } from "@/entities/order/schemas";
import { AdminOrderForm } from "./admin-order-form";
import { useOrders } from "../hooks/useOrders";
import { usePagination } from "@/lib/hooks";
import { useOrderActions } from "../hooks/useOrderActions";
import { OrderControls } from "./order-controls";
import { OrderTable } from "./order-table";
import { PaginationControls } from "@/shared/ui";
import type { ShortOrder } from "@/lib/api/admin/types";

export const AdminOrdersPage = () => {
  const [params] = useSearchParams();
  const page = parseInt(params.get("page") || "1", 10);
  const sort = params.get("sort") || undefined;
  const search = params.get("search") || undefined;
  const itemsPerPage = 10;

  const [selected, setSelected] = useState<ShortOrder | undefined>();

  const { isLoading, data, refetch } = useOrders(
    page,
    itemsPerPage,
    sort,
    search,
  );
  const { handlePrevPage, handleNextPage, handleSort, handleSearch } =
    usePagination("/admin/orders");
  const {
    isFormOpen,
    isEditing,
    editingOrder,
    handleDetails,
    handleEditOrder,
    handleCloseForm,
    handleSubmit,
  } = useOrderActions(refetch, selected, () => setSelected(undefined));

  return (
    <Main>
      <TitleM>Заказы</TitleM>
      {isLoading ? (
        <LoaderWrapper>
          <Loader />
        </LoaderWrapper>
      ) : (
        <>
          <OrderControls
            data={data}
            sort={sort}
            search={search}
            onDetails={handleDetails}
            onEdit={handleEditOrder}
            onSort={handleSort}
            onSearch={handleSearch}
            selected={!!selected}
          />
          {isFormOpen && (
            <AdminOrderForm
              key={isEditing ? "edit" : "add"}
              schema={AdminOrderAddSchema}
              initialValues={editingOrder || {}}
              onSubmit={handleSubmit}
              onCancel={handleCloseForm}
              title={isEditing ? "Изменить заказ" : "Добавить заказ"}
              submitLabel={isEditing ? "Сохранить" : "Добавить"}
            />
          )}
          <OrderTable data={data?.orders} onSelect={setSelected} />
          <PaginationControls
            page={page}
            totalPages={data?.meta?.totalPages}
            hasNext={!!(data?.orders && data.orders.length === itemsPerPage)}
            onPrev={() => handlePrevPage(page)}
            onNext={() =>
              handleNextPage(
                page,
                !!(data?.orders && data.orders.length === itemsPerPage),
              )
            }
          />
        </>
      )}
    </Main>
  );
};
