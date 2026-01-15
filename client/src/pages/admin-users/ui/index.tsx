import { useCallback, useEffect, useState } from "react";
import {
  ControlsWrapper,
  LoaderWrapper,
  Main,
  PaginationContainer,
} from "./styled";
import type { AxiosError } from "axios";
import { DataTable, Toast } from "@/feat";
import { adminApi } from "@/lib/api/admin";
import type { GetUsersRes } from "@/lib/api/admin/types";
import { Loader, Button, ComboBox } from "@/shared/ui";
import { TitleM, TitleXS } from "@/shared/ui/captions";
import { useNavigate, useSearchParams } from "react-router";
import { getSortingOptions } from "../utils";

export const AdminUsersPage = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const page = parseInt(params.get("page") || "1", 10);
  const sort = params.get("sort") || undefined;
  const itemsPerPage = 10;

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [data, setData] = useState<GetUsersRes>();
  const [selected, setSelected] = useState<Record<string, any>>();

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
            <ComboBox
              placeholder="Сортировать по:"
              options={getSortingOptions(data?.users?.at(0))}
              onChange={handleSort}
            />
          </ControlsWrapper>
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
