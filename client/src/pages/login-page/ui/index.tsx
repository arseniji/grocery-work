import { useState } from "react";
import { LogoIcon } from "@/shared/icons";
import {
  LoginContainer,
  LogoContainer,
  Form,
  InputGroup,
  Label,
} from "./styled";
import { Button, Input } from "@/shared/ui";
import { ErrorMsg, TitleL } from "@/shared/ui/captions";
import { authApi } from "@/lib/api/auth";
import { useForm } from "@/lib/hooks";
import {
  UserLoginSchema,
  type UserLoginType,
} from "@/entities/user/schemas/user-login.schema";
import type { AxiosError } from "axios";

export const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const { register, data, isValid, errors, touched } = useForm(UserLoginSchema);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authApi.login(data as UserLoginType);
      console.log(response);
    } catch (err) {
      const error = err as AxiosError;
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
      </Form>
    </LoginContainer>
  );
};
