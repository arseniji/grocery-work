import { LogoIcon } from "@/shared/icons";
import {
  LoginContainer,
  LogoContainer,
  Form,
  Input,
  SubmitButton,
} from "./styled";

export const LoginPage = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log("Login submitted");
  };

  return (
    <LoginContainer>
      <LogoContainer>
        <LogoIcon />
      </LogoContainer>
      <Form onSubmit={handleSubmit}>
        <Input type="email" placeholder="Email" required />
        <Input type="password" placeholder="Password" required />
        <SubmitButton type="submit">Войти</SubmitButton>
      </Form>
    </LoginContainer>
  );
};
