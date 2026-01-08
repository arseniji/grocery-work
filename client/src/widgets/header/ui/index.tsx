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
import { Toast } from "@/feat";
import { useState, type FormEventHandler } from "react";

interface HeaderProps {
  isLogined: boolean;
}

export const Header = ({ isLogined }: HeaderProps) => {
  const navigate = useNavigate();

  const [search, setSearch] = useState<string>("");

  const handleLogout = async () => {
    try {
      const response = await authApi.logout(
        {},
        {},
        {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      );
      if (response.success) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }
      Toast.show({
        title: "Ошибка выхода",
        msg: `Неизвестная ошибка`,
        type: "error",
      });
    } catch (err) {
      const error = err as AxiosError;

      Toast.show({
        title: "Ошибка выхода",
        msg:
          (error.response?.data as { error?: string })?.error ||
          `Неизвестная ошибка ${error.code}`,
        type: "error",
      });
      console.log(error);
    }
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    navigate(`/shop?search=${search}`);
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

        <form onSubmit={handleSubmit}>
          <Input
            icon={SearchIcon}
            placeholder="Поиск..."
            value={search}
            onChange={setSearch}
          />
        </form>

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
