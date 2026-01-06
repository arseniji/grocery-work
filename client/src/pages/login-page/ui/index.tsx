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
import { TitleL } from "@/shared/ui/captions";
import { authApi } from "@/lib/api/auth";

export const LoginPage = () => {
  const [loading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(1);
    authApi.register();
  };

  return (
    <LoginContainer>
      <LogoContainer>
        <LogoIcon />
        <TitleL>Вход</TitleL>
      </LogoContainer>
      <Form onSubmit={handleSubmit}>
        <InputGroup>
          <Label htmlFor="email">Почта</Label>
          <Input id="email" type="email" placeholder="Почта" />
        </InputGroup>
        <InputGroup>
          <Label htmlFor="password">Пароль</Label>
          <Input id="password" type="password" placeholder="Пароль" />
        </InputGroup>
        <Button variant="primary" disabled={loading} type="submit">
          {loading ? "Вход..." : "Войти"}
        </Button>
      </Form>
    </LoginContainer>
  );
};
