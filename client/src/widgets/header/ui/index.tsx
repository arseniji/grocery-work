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
import { NavLink, useNavigate } from "react-router";
import { Button, Input } from "@/shared/ui";
import type { AxiosError } from "axios";
import { authApi } from "@/lib/api/auth";

interface HeaderProps {
  isLogined: boolean;
}

export const Header = ({ isLogined }: HeaderProps) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await authApi.logout();
      if (response.success) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      // TODO: Кастомные ошибки
      throw Error("Ошибка выхода");
    } catch (err) {
      // TODO: Обработка ошибок
      const error = err as AxiosError;
      console.log(error);
    }
  };

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
        {isLogined && <CartIcon />}

        <AuthWrapper>
          {!isLogined ? (
            <>
              <Button as="link" href="/login">
                Войти
              </Button>
              <Button as="link" href="/registration">
                Регистрация
              </Button>
            </>
          ) : (
            <Button as={"button"} onClick={handleLogout}>
              Выйти
            </Button>
          )}
        </AuthWrapper>
      </HeaderWrapper>
    </HeaderContainer>
  );
};
