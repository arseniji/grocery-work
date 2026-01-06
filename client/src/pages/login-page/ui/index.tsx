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

export const LoginPage = () => {
  const [loading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
          <Input id="email" type="email" placeholder="Email" />
        </InputGroup>
        <InputGroup>
          <Label htmlFor="password">Пароль</Label>
          <Input id="password" type="password" placeholder="Password" />
        </InputGroup>
        <Button variant="primary" disabled={loading}>
          {loading ? "Вход..." : "Войти"}
        </Button>
      </Form>
    </LoginContainer>
  );
};
