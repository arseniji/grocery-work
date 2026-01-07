import { useEffect, useState } from "react";
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
import { UserSchema } from "@/entities/user/user.schema";

export const RegistrationPage = () => {
  const [loading] = useState(false);

  useEffect(() => {
    const result = UserSchema.safeParse({
      login: 11,
    });

    console.log(result);
  }, []);

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
          <Label htmlFor="fio">ФИО</Label>
          <Input id="fio" type="text" placeholder="ФИО" />
        </InputGroup>
        <InputGroup>
          <Label htmlFor="login">Логин</Label>
          <Input id="login" type="text" placeholder="Логин" />
        </InputGroup>
        <InputGroup>
          <Label htmlFor="phone">Телефон</Label>
          <Input id="phone" type="tel" placeholder="Телефон" />
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
