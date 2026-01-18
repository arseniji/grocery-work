import { useState } from "react";
import { LoaderWrapper, Main } from "./styled";
import { Loader } from "@/shared/ui";
import { TitleM } from "@/shared/ui/captions";
import { useSearchParams } from "react-router";
import { AdminUserAddSchema } from "@/entities/user/schemas";
import { AdminUserForm } from "./admin-user-form";
import { useUsers, useUserActions } from "../hooks";
import { UserControls } from "./user-controls";
import { UserTable } from "./user-table";
import { PaginationControls } from "@/shared/ui";
import type { ShortUser } from "@/lib/api/admin/types";
import { usePagination } from "@/lib/hooks";

export const AdminUsersPage = () => {
  const [params] = useSearchParams();
  const page = parseInt(params.get("page") || "1", 10);
  const sort = params.get("sort") || undefined;
  const search = params.get("search") || undefined;
  const itemsPerPage = 10;

  const [selected, setSelected] = useState<ShortUser | undefined>();

  const { isLoading, data, refetch } = useUsers(
    page,
    itemsPerPage,
    sort,
    search,
  );
  const { handlePrevPage, handleNextPage, handleSort, handleSearch } =
    usePagination("/admin/users");
  const {
    isFormOpen,
    isEditing,
    editingUser,
    isLoadingEdit,
    handleAddUser,
    handleEditUser,
    handleCloseForm,
    handleSubmit,
    handleDeleteUser,
  } = useUserActions(refetch, selected, () => setSelected(undefined));

  return (
    <Main>
      <TitleM>Пользователи</TitleM>
      {isLoading ? (
        <LoaderWrapper>
          <Loader />
        </LoaderWrapper>
      ) : (
        <>
          <UserControls
            data={data}
            sort={sort}
            search={search}
            onAdd={handleAddUser}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
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
              <AdminUserForm
                schema={AdminUserAddSchema}
                initialValues={editingUser || {}}
                onSubmit={handleSubmit}
                onCancel={handleCloseForm}
                title={
                  isEditing ? "Изменить пользователя" : "Добавить пользователя"
                }
                submitLabel={isEditing ? "Сохранить" : "Добавить"}
              />
            ))}
          <UserTable data={data?.users} onSelect={setSelected} />
          <PaginationControls
            page={page}
            totalPages={data?.meta?.totalPages}
            hasNext={!!(data?.users && data.users.length === itemsPerPage)}
            onPrev={() => handlePrevPage(page)}
            onNext={() =>
              handleNextPage(
                page,
                !!(data?.users && data.users.length === itemsPerPage),
              )
            }
          />
        </>
      )}
    </Main>
  );
};
