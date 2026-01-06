import { useState } from "react";
import { LogoIcon } from "@/shared/icons";
import {
  RegistrationContainer,
  LogoContainer,
  Form,
  InputGroup,
  Label,
} from "./styled";
import { Button, Input } from "@/shared/ui";
import { TitleL } from "@/shared/ui/captions";

export const RegistrationPage = () => {
  const [loading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <RegistrationContainer>
      <LogoContainer>
        <LogoIcon />
        <TitleL>Регистрация</TitleL>
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
        <InputGroup>
          <Label htmlFor="confirmPassword">Подтверждение пароля</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Подтверждение пароля"
          />
        </InputGroup>
        <Button variant="primary" disabled={loading}>
          {loading ? "Регистрация..." : "Зарегистрироваться"}
        </Button>
      </Form>
    </RegistrationContainer>
  );
};
