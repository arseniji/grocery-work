import { useState } from "react";
import { LogoIcon } from "@/shared/icons";
import {
  RegistrationContainer,
  LogoContainer,
  Form,
  InputGroup,
  Label,
  ErrorMsg,
} from "./styled";
import { Button, Input } from "@/shared/ui";
import { TitleL } from "@/shared/ui/captions";
import { useForm } from "@/lib/hooks";
import { UserSchema } from "@/entities/user/user.schema";

export const RegistrationPage = () => {
  const [loading] = useState(false);
  const { register, data, isValid, errors, touched } = useForm(UserSchema);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(data);
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
          <Input {...register("password")} />
          {touched.has("password") && errors.password && (
            <ErrorMsg>{errors.password.message}</ErrorMsg>
          )}
        </InputGroup>
        <Button variant="primary" disabled={loading || !isValid} type="submit">
          {loading ? "Регистрация..." : "Зарегистрироваться"}
        </Button>
      </Form>
    </RegistrationContainer>
  );
};
