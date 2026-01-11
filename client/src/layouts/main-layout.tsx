import { useAuth } from "@/lib/hooks";
import { Footer, Header } from "@/widgets";
import { Loader } from "@/shared/ui";
import { Outlet, useNavigate, useLocation } from "react-router";
import styled from "styled-components";
import { useEffect } from "react";

const securePaths = ["/cart"];

export const MainLayout = () => {
  const { isAuth, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuth && securePaths.includes(location.pathname)) {
      navigate("/login");
    }
  }, [isAuth, isLoading, navigate, location]);

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
  height: 100%;
  align-items: start;
  grid-template-rows: min-content 1fr min-content;
`;
