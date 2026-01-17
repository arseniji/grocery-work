import { UpdateProfileSchema } from "@/entities/profile/schemas";
import { Toast } from "@/feat";
import { profileApi } from "@/lib/api/profile";
import { useForm } from "@/lib/hooks";
import type { AxiosError } from "axios";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  Main,
  ProfileContainer,
  Form,
  InputGroup,
  Label,
  ButtonGroup,
  LoaderWrapper,
  OrdersList,
  PaginationContainer,
  StatusContainer,
} from "./styled";
import { Button, Input, Loader, OrderCard } from "@/shared/ui";
import { ErrorMsg, TitleM, TitleXS } from "@/shared/ui/captions";
import { orderApi } from "@/lib/api/order";
import type { IOrder, IOrderStatus } from "@/entities/order/types";
import type { IRole } from "@/entities/profile/types";

export const ProfilePage = () => {
  const navigate = useNavigate();

  const { isValid, data, errors, register, touched, setData } =
    useForm(UpdateProfileSchema);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [updating, setUpdating] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>();
  const [statuses, setStatuses] = useState<IOrderStatus[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>();
  const [role, setRole] = useState<IRole | null>(null);

  const loadProfile = useCallback(async () => {
    try {
      const response = await profileApi.get();
      setData(response);
      setRole(response.role);
    } catch (err) {
      const error = err as AxiosError;
      console.log(error);
      Toast.show({
        type: "error",
        msg: "Ошибка получения пользователя, вы будете перенаправленны",
        title: "Ошибка",
      });

      setTimeout(() => {
        navigate("/");
      }, 1000);
    }
    setIsLoading(false);
  }, [navigate, setData]);

  const loadOrders = useCallback(async (page: number, status?: string) => {
    try {
      const params: any = {
        page: page.toString(),
        page_size: "10",
      };
      if (status) params.status = status;
      const response = await orderApi.get(params);
      if (response.success) {
        setOrders(response.orders);
        setTotalPages(response.meta.totalPages);
      }
    } catch (err) {
      const error = err as AxiosError;
      console.log(error);
      Toast.show({
        type: "error",
        title: "Ошибка",
        msg: "Ошибка получения заказов",
      });
    }
  }, []);

  const loadStatuses = useCallback(async () => {
    try {
      const response = await orderApi.getStatuses();
      if (response.success) {
        setStatuses(response.items);
      }
    } catch (err) {
      const error = err as AxiosError;
      console.log(error);
      Toast.show({
        title: "Ошибка",
        type: "error",
        msg: "Ошибка при получении статусов",
      });
    }
  }, []);

  useEffect(() => {
    loadProfile();
    loadStatuses();
  }, [loadProfile, loadStatuses]);

  useEffect(() => {
    loadOrders(currentPage, selectedStatus);
  }, [loadOrders, currentPage, selectedStatus]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);

    try {
      await profileApi.update(data);
      Toast.show({
        type: "msg",
        msg: "Профиль обновлен",
        title: "Успех",
      });
    } catch (err) {
      const error = err as AxiosError;
      Toast.show({
        type: "error",
        msg:
          (error.response?.data as { error?: string })?.error ||
          "Ошибка обновления профиля",
        title: "Ошибка",
      });
    }

    setUpdating(false);
  };

  const handleDelete = async () => {
    if (!confirm("Вы уверены, что хотите удалить профиль?")) return;
    setDeleting(true);

    try {
      await profileApi.delete();
      Toast.show({
        type: "msg",
        msg: "Профиль удален",
        title: "Успех",
      });
      localStorage.removeItem("token");
      navigate("/");
    } catch (err) {
      const error = err as AxiosError;
      Toast.show({
        type: "error",
        msg:
          (error.response?.data as { error?: string })?.error ||
          "Ошибка удаления профиля",
        title: "Ошибка",
      });
    }

    setDeleting(false);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (orders.length === 10) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleStatus = (statusName: string) => {
    if (selectedStatus === statusName) {
      setSelectedStatus(undefined);
      setCurrentPage(1);
      return;
    }
    setSelectedStatus(statusName);
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <Main>
        <LoaderWrapper>
          <Loader />
        </LoaderWrapper>
      </Main>
    );
  }

  return (
    <Main>
      <ProfileContainer>
        <TitleM style={{ alignSelf: "self-start" }}>Профиль</TitleM>
        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label htmlFor="firstname">Имя</Label>
            <Input
              id="firstname"
              type="text"
              placeholder="Имя"
              {...register("firstname")}
            />
            {touched.has("firstname") && errors.firstname && (
              <ErrorMsg>{errors.firstname.message}</ErrorMsg>
            )}
          </InputGroup>
          <InputGroup>
            <Label htmlFor="lastname">Фамилия</Label>
            <Input
              id="lastname"
              type="text"
              placeholder="Фамилия"
              {...register("lastname")}
            />
            {touched.has("lastname") && errors.lastname && (
              <ErrorMsg>{errors.lastname.message}</ErrorMsg>
            )}
          </InputGroup>
          <InputGroup>
            <Label htmlFor="patronymic">Отчество</Label>
            <Input
              id="patronymic"
              type="text"
              placeholder="Отчество"
              {...register("patronymic")}
            />
            {touched.has("patronymic") && errors.patronymic && (
              <ErrorMsg>{errors.patronymic.message}</ErrorMsg>
            )}
          </InputGroup>
          <InputGroup>
            <Label htmlFor="login">Логин</Label>
            <Input
              id="login"
              type="text"
              placeholder="Логин"
              {...register("login")}
            />
            {touched.has("login") && errors.login && (
              <ErrorMsg>{errors.login.message}</ErrorMsg>
            )}
          </InputGroup>
          <InputGroup>
            <Label htmlFor="phone">Телефон</Label>
            <Input
              id="phone"
              type="text"
              placeholder="Телефон"
              {...register("phone")}
            />
            {touched.has("phone") && errors.phone && (
              <ErrorMsg>{errors.phone.message}</ErrorMsg>
            )}
          </InputGroup>
          <ButtonGroup>
            <Button
              variant="primary"
              disabled={updating || !isValid}
              type="submit"
            >
              {updating ? "Обновление..." : "Обновить"}
            </Button>
            <Button variant="border" disabled={deleting} onClick={handleDelete}>
              {deleting ? "Удаление..." : "Удалить профиль"}
            </Button>
          </ButtonGroup>
        </Form>
        {role === "admin" && (
          <Button as="link" href="/admin">
            Перейти в админ панель
          </Button>
        )}
      </ProfileContainer>
      <ProfileContainer>
        <TitleM style={{ alignSelf: "self-start" }}>Мои заказы</TitleM>
        <StatusContainer>
          {statuses.map((s) => (
            <Button
              variant="border"
              key={s.statusName}
              onClick={() => handleStatus(s.statusName)}
              active={selectedStatus === s.statusName}
            >
              {s.statusName}
            </Button>
          ))}
        </StatusContainer>
        {orders.length === 0 ? (
          <div>
            <TitleM style={{ marginBottom: 16 }}>Заказов нет</TitleM>
            <Button variant={"primary"} as={"link"} href="/shop">
              Перейти к покупкам
            </Button>
          </div>
        ) : (
          <OrdersList>
            {orders.map((order) => (
              <OrderCard
                key={order.id}
                id={order.id}
                description={order.description}
                status={order.status}
                timestamps={order.timestamps}
              />
            ))}
          </OrdersList>
        )}
        {Number(totalPages) > 1 && (
          <PaginationContainer>
            {currentPage > 1 && (
              <Button variant="border" onClick={handlePrevPage}>
                Предыдущая
              </Button>
            )}

            {totalPages && (
              <TitleXS>
                {currentPage} / {totalPages}
              </TitleXS>
            )}

            {orders.length === 10 && (
              <Button variant="border" onClick={handleNextPage}>
                Следующая
              </Button>
            )}
          </PaginationContainer>
        )}
      </ProfileContainer>
    </Main>
  );
};
