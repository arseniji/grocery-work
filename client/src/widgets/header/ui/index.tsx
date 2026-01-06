import { CartIcon, LogoIcon, SearchIcon } from "@/shared/icons";
import {
  AuthWrapper,
  HeaderContainer,
  HeaderWrapper,
  LogoWrapper,
  NavContainer,
} from "./styled";
import { BodyM, TitleXS } from "@/shared/ui/captions";
import { routes } from "../contants/routes";
import { NavLink } from "react-router";
import { Button, Input } from "@/shared/ui";

export const Header = () => {
  return (
    <HeaderContainer>
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
          <Button onClick={() => {}}>Войти</Button>
          <Button onClick={() => {}}>Регистрация</Button>
        </AuthWrapper>
      </HeaderWrapper>
    </HeaderContainer>
  );
};
