import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { LogoIcon } from "@/shared/icons";
import {
  RegistrationContainer,
  LogoContainer,
  Form,
  InputGroup,
  Label,
} from "./styled";
import { Button, Input } from "@/shared/ui";
import { BodyM, ErrorMsg, TitleL } from "@/shared/ui/captions";
import { useForm } from "@/lib/hooks";
import {
  UserRegisterSchema,
  type UserRegisterType,
} from "@/entities/user/schemas/user-register.schema";
import type { AxiosError } from "axios";
import { authApi } from "@/lib/api/auth";
import { Toast } from "@/feat";

export const RegistrationPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register, data, isValid, errors, touched } =
    useForm(UserRegisterSchema);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    try {
      const response = await authApi.register(data as UserRegisterType);

      localStorage.setItem("token", response.session.sessionId);
      console.log(response);
      navigate("/");
    } catch (err) {
      const error = err as AxiosError;

      Toast.show({
        title: "Ошибка регистрации",
        msg:
          (error.response?.data as { error?: string })?.error ||
          `Неизвестная ошибка ${error.code}`,
        type: "error",
      });
      console.log(error);
    }

    setLoading(false);
  };

  return (
    <RegistrationContainer>
      <LogoContainer>
        <LogoIcon />
        <TitleL>Регистрация</TitleL>
      </LogoContainer>
      <Form onSubmit={handleSubmit}>
        <InputGroup>
          <Label htmlFor="firstname">Имя</Label>
          <Input {...register("firstname")} />
          {touched.has("firstname") && errors.firstname && (
            <ErrorMsg>{errors.firstname.message}</ErrorMsg>
          )}
        </InputGroup>
        <InputGroup>
          <Label htmlFor="lastname">Фамилия</Label>
          <Input {...register("lastname")} />
          {touched.has("lastname") && errors.lastname && (
            <ErrorMsg>{errors.lastname.message}</ErrorMsg>
          )}
        </InputGroup>
        <InputGroup>
          <Label htmlFor="patronymic">Отчество</Label>
          <Input {...register("patronymic")} />
          {touched.has("patronymic") && errors.patronymic && (
            <ErrorMsg>{errors.patronymic.message}</ErrorMsg>
          )}
        </InputGroup>
        <InputGroup>
          <Label htmlFor="login">Логин</Label>
          <Input {...register("login")} />
          {touched.has("login") && errors.login && (
            <ErrorMsg>{errors.login.message}</ErrorMsg>
          )}
        </InputGroup>
        <InputGroup>
          <Label htmlFor="phone">Телефон</Label>
          <Input {...register("phone")} />
          {touched.has("phone") && errors.phone && (
            <ErrorMsg>{errors.phone.message}</ErrorMsg>
          )}
        </InputGroup>
        <InputGroup>
          <Label htmlFor="password">Пароль</Label>
          <Input {...register("password")} type="password" />
          {touched.has("password") && errors.password && (
            <ErrorMsg>{errors.password.message}</ErrorMsg>
          )}
        </InputGroup>
        <Button variant="primary" disabled={loading || !isValid} type="submit">
          {loading ? "Регистрация..." : "Зарегистрироваться"}
        </Button>
        <Link to={"/login"} style={{ textAlign: "center" }}>
          <BodyM>Уже есть аккаунт?</BodyM>
        </Link>
      </Form>
    </RegistrationContainer>
  );
};
