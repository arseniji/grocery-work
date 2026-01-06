import { CartIcon, LogoIcon, SearchIcon } from "@/shared/icons";
import {
  AuthWrapper,
  HeaderWrapper,
  LogoWrapper,
  NavContainer,
} from "./styled";
import { BodyM, TitleXS } from "@/shared/ui/captions";
import { routes } from "../contants/routes";
import { NavLink } from "react-router";
import { Button, Input } from "@/shared/ui";
import { Container } from "@/shared/ui/container";

export const Header = () => {
  return (
    <Container style={{ position: "sticky", top: 0 }}>
      <HeaderWrapper>
        <NavContainer>
          <LogoWrapper to={"/"}>
            <LogoIcon />
            <TitleXS>Green Grocer</TitleXS>
          </LogoWrapper>
          {routes.map((route) => (
            <NavLink key={route.to} to={route.to}>
              <BodyM>{route.text}</BodyM>
            </NavLink>
          ))}
        </NavContainer>

        <Input icon={SearchIcon} />

        {/* TODO: Сделать либо переход на новую страницу либо модалку */}
        <CartIcon />

        <AuthWrapper>
          <Button onClick={() => {}}>Login</Button>
          <Button onClick={() => {}}>Sign Up</Button>
        </AuthWrapper>
      </HeaderWrapper>
    </Container>
  );
};
