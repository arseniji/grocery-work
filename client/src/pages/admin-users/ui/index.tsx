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
import type { GetUsersRes } from "@/lib/api/admin/types";
import { Loader, Button, ComboBox } from "@/shared/ui";
import { TitleM, TitleXS } from "@/shared/ui/captions";
import { useNavigate, useSearchParams } from "react-router";
import { getSortingOptions } from "../utils";
import {
  AdminUserAddSchema,
  type AdminUserAddType,
  type AdminUserEditType,
} from "@/entities/user/schemas";
import type { ShortUser } from "@/lib/api/admin/types";
import type { IProfile } from "@/entities/profile/types";
import { AdminUserForm } from "./admin-user-form";

export const AdminUsersPage = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const page = parseInt(params.get("page") || "1", 10);
  const sort = params.get("sort") || undefined;
  const itemsPerPage = 10;

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [data, setData] = useState<GetUsersRes>();
  const [selected, setSelected] = useState<Record<string, any>>();
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<IProfile>();
  const [editingUserId, setEditingUserId] = useState<number>();
  const [isLoadingEdit, setIsLoadingEdit] = useState<boolean>(false);

  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await adminApi.getUsers(page, itemsPerPage, sort);
      if (response.success) {
        setData(response);
      }
    } catch (err) {
      const error = err as AxiosError;
      console.log(error);
      Toast.show({
        type: "error",
        title: "Ошибка!",
        msg: "Ошибка получения пользователей",
      });
    }
    setIsLoading(false);
  }, [page, itemsPerPage, sort]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handlePrevPage = () => {
    if (page > 1) {
      const newParams = new URLSearchParams(params);
      newParams.set("page", (page - 1).toString());
      navigate(`/admin/users?${newParams.toString()}`);
    }
  };

  const handleNextPage = () => {
    if (data?.users && data.users.length === itemsPerPage) {
      const newParams = new URLSearchParams(params);
      newParams.set("page", (page + 1).toString());
      navigate(`/admin/users?${newParams.toString()}`);
    }
  };

  const handleSort = (sort?: string) => {
    if (sort) {
      const newParams = new URLSearchParams(params);
      newParams.set("sort", sort);
      navigate(`/admin/users?${newParams.toString()}`);
    } else {
      const newParams = new URLSearchParams(params);
      newParams.delete("sort");
      navigate(`/admin/users?${newParams.toString()}`);
      return;
    }
  };

  const handleAddUser = () => {
    setIsEditing(false);
    setEditingUser(undefined);
    setIsFormOpen(true);
  };

  const handleEditUser = async () => {
    if (selected) {
      setIsEditing(true);
      setEditingUserId((selected as ShortUser).userId);
      setIsLoadingEdit(true);
      try {
        const response = await adminApi.getUser((selected as ShortUser).userId);
        setEditingUser((response as any).data || response);
        setIsFormOpen(true);
      } catch (err) {
        const error = err as AxiosError;
        console.log(error);
        Toast.show({
          type: "error",
          title: "Ошибка!",
          msg: "Ошибка получения данных пользователя",
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
      if (isEditing && editingUserId) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...updateData } = data;
        await adminApi.updateUser(
          editingUserId,
          updateData as AdminUserEditType
        );
        Toast.show({
          type: "msg",
          title: "Успех!",
          msg: "Пользователь обновлен",
        });
      } else {
        await adminApi.addUser(data as AdminUserAddType);
        Toast.show({
          type: "msg",
          title: "Успех!",
          msg: "Пользователь добавлен",
        });
      }
      loadUsers();
      setIsFormOpen(false);
    } catch (err) {
      const error = err as AxiosError;
      console.log(error);
      Toast.show({
        type: "error",
        title: "Ошибка!",
        msg: isEditing
          ? "Ошибка обновления пользователя"
          : "Ошибка добавления пользователя",
      });
    }
  };

  const handleDeleteUser = async () => {
    if (selected) {
      try {
        await adminApi.deleteUser((selected as ShortUser).userId);
        Toast.show({
          type: "msg",
          title: "Успех!",
          msg: "Пользователь удален",
        });
        loadUsers();
        setSelected(undefined);
      } catch (err) {
        const error = err as AxiosError;
        console.log(error);
        Toast.show({
          type: "error",
          title: "Ошибка!",
          msg: "Ошибка удаления пользователя",
        });
      }
    }
  };

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
            <RowWrapper style={{ justifyContent: "space-between" }}>
              <ComboBox
                placeholder="Сортировать по:"
                options={getSortingOptions(data?.users?.at(0))}
                onChange={handleSort}
              />
            </RowWrapper>
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
                isEditing={isEditing}
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
              <Button variant="border" onClick={handlePrevPage}>
                Предыдущая
              </Button>
            )}

            {data?.meta && (
              <TitleXS>
                {page} / {data.meta.totalPages}
              </TitleXS>
            )}

            {data?.users && data.users.length === itemsPerPage && (
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
