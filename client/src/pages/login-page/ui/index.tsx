import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { LogoIcon } from "@/shared/icons";
import {
  LoginContainer,
  LogoContainer,
  Form,
  InputGroup,
  Label,
} from "./styled";
import { Button, Input } from "@/shared/ui";
import { BodyM, ErrorMsg, TitleL } from "@/shared/ui/captions";
import { authApi } from "@/lib/api/auth";
import { useForm } from "@/lib/hooks";
import {
  UserLoginSchema,
  type UserLoginType,
} from "@/entities/user/schemas/user-login.schema";
import type { AxiosError } from "axios";
import { Toast } from "@/feat";

export const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register, data, isValid, errors, touched } = useForm(UserLoginSchema);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authApi.login(data as UserLoginType);

      localStorage.setItem("token", response.session.sessionId);
      console.log(response);
      navigate("/");
    } catch (err) {
      const error = err as AxiosError;
      Toast.show({
        title: "Ошибка входа",
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
    <LoginContainer>
      <LogoContainer>
        <LogoIcon />
        <TitleL>Вход</TitleL>
      </LogoContainer>
      <Form onSubmit={handleSubmit}>
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
          <Label htmlFor="password">Пароль</Label>
          <Input
            id="password"
            type="password"
            placeholder="Пароль"
            {...register("password")}
          />
          {touched.has("password") && errors.password && (
            <ErrorMsg>{errors.password.message}</ErrorMsg>
          )}
        </InputGroup>
        <Button variant="primary" disabled={loading || !isValid} type="submit">
          {loading ? "Вход..." : "Войти"}
        </Button>
        <Link to={"/registration"} style={{ textAlign: "center" }}>
          <BodyM>Нет аккаунта?</BodyM>
        </Link>
      </Form>
    </LoginContainer>
  );
};
