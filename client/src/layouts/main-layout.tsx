import { useAuth } from "@/lib/hooks";
import { Footer, Header } from "@/widgets";
import { Loader } from "@/shared/ui";
import { Outlet, useNavigate, useLocation } from "react-router";
import styled from "styled-components";
import { useEffect } from "react";

const securePaths = ["/cart", "/profile"];

export const MainLayout = () => {
  const { isAuth, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuth && securePaths.includes(location.pathname)) {
        navigate("/login", { state: { from: location.pathname } });
      } else if (isAuth && location.pathname === "/login") {
        navigate("/", { replace: true });
      }
    }
  }, [isAuth, isLoading, navigate, location.pathname]);

  if (isLoading)
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Loader />
      </div>
    );

  return (
    <Container>
      <Header isLogined={isAuth} />
      <Outlet />
      <Footer />
    </Container>
  );
};

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  min-height: 100vh;
  align-items: start;
  grid-template-rows: min-content 1fr min-content;
`;
