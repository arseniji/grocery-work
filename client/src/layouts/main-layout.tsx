import { useAuth } from "@/lib/hooks";
import { Footer, Header } from "@/widgets";
import { Loader } from "@/shared/ui";
import { Outlet } from "react-router";
import styled from "styled-components";

export const MainLayout = () => {
  const { isAuth, isLoading } = useAuth();

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
