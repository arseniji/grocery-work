import { useState } from "react";
import {
  ColWrapper,
  ControlsWrapper,
  LoaderWrapper,
  Main,
  PaginationContainer,
  RowWrapper,
} from "./styled";
import { DataTable, SmartSearch } from "@/feat";
import { Loader, Button, ComboBox } from "@/shared/ui";
import { TitleM, TitleXS } from "@/shared/ui/captions";
import { useSearchParams } from "react-router";
import { getSearchOptions, getSortingOptions } from "../utils";
import { AdminUserAddSchema } from "@/entities/user/schemas";
import { AdminUserForm } from "./admin-user-form";
import { useUsers, useUserActions, usePagination } from "../hooks";

export const AdminUsersPage = () => {
  const [params] = useSearchParams();
  const page = parseInt(params.get("page") || "1", 10);
  const sort = params.get("sort") || undefined;
  const search = params.get("search") || undefined;
  const itemsPerPage = 10;

  const [selected, setSelected] = useState<Record<string, any>>();

  const { isLoading, data, refetch } = useUsers(
    page,
    itemsPerPage,
    sort,
    search
  );
  const { handlePrevPage, handleNextPage, handleSort, handleSearch } =
    usePagination();
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
          <ControlsWrapper>
            <ColWrapper>
              <ComboBox
                placeholder="Сортировать по:"
                options={getSortingOptions(data?.users?.at(0))}
                onChange={handleSort}
              />
              <RowWrapper>
                <Button variant={"border"} onClick={handleAddUser}>
                  Добавить
                </Button>
                <Button
                  variant={"border"}
                  disabled={!selected}
                  onClick={handleEditUser}
                >
                  Изменить
                </Button>
                <Button
                  variant={"border"}
                  disabled={!selected}
                  onClick={handleDeleteUser}
                >
                  Удалить
                </Button>
              </RowWrapper>
            </ColWrapper>

            <SmartSearch
              initialValue={search}
              options={getSearchOptions(data?.users?.at(0))}
              onChange={handleSearch}
            />
          </ControlsWrapper>
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
          <DataTable data={data?.users} onSelect={setSelected} />
          <PaginationContainer>
            {page > 1 && (
              <Button variant="border" onClick={() => handlePrevPage(page)}>
                Предыдущая
              </Button>
            )}

            {data?.meta && (
              <TitleXS>
                {page} / {data.meta.totalPages}
              </TitleXS>
            )}

            {data?.users && data.users.length === itemsPerPage && (
              <Button
                variant="border"
                onClick={() =>
                  handleNextPage(
                    page,
                    !!(data?.users && data.users.length === itemsPerPage)
                  )
                }
              >
                Следующая
              </Button>
            )}
          </PaginationContainer>
        </>
      )}
    </Main>
  );
};
