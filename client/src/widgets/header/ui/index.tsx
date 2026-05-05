import { CartIcon, LogoIcon, SearchIcon, UserIcon } from "@/shared/icons";
import {
  AuthWrapper,
  HeaderContainer,
  HeaderWrapper,
  LogoWrapper,
  NavContainer,
  SearchWrapper,
  UserWrapper,
} from "./styled";
import { BodyM, TitleXS } from "@/shared/ui/captions";
import { routes } from "../contants/routes";
import {
  NavLink,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router";
import { Button, Input } from "@/shared/ui";
import type { AxiosError } from "axios";
import { authApi } from "@/lib/api/auth";
import { Toast } from "@/feat";
import { type FormEventHandler } from "react";
import { usePagination } from "@/lib/hooks";

interface HeaderProps {
  isLogined: boolean;
}

export const Header = ({ isLogined }: HeaderProps) => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const locale = useLocation();
  const search = params.get("search") || "";

  const { handleSearch } = usePagination(locale.pathname);

  const handleLogout = async () => {
    try {
      const response = await authApi.logout(
        {},
        {},
        {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
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

        <SearchWrapper>
          <form onSubmit={handleSubmit}>
            <Input
              icon={SearchIcon}
              placeholder="Поиск..."
              value={search}
              onChange={handleSearch}
            />
          </form>
        </SearchWrapper>

        {isLogined && (
          <UserWrapper>
            <button onClick={() => navigate("profile")}>
              <UserIcon />
            </button>
            <button onClick={() => navigate("cart")}>
              <CartIcon />
            </button>
          </UserWrapper>
        )}

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
