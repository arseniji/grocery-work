import { AdminHeader, AdminNav } from "@/widgets";
import { Outlet, useNavigate } from "react-router";
import styled from "styled-components";
import { Container as ShContainer } from "@/shared/ui/container";
import { manager, NavigateCommand } from "@/lib/command";
import { useLayoutEffect } from "react";

export const AdminLayout = () => {
  const navigate = useNavigate();
  manager.add("navigate", new NavigateCommand(navigate));

  useLayoutEffect(() => {
    manager.add("navigate", new NavigateCommand(navigate));
    return () => {
      manager.remove("navigate");
    };
  }, [navigate]);

  return (
    <Container>
      <AdminHeader />
      <Wrapper>
        <AdminNav />
        <Outlet />
      </Wrapper>
    </Container>
  );
};

const Container = styled.div`
  ${ShContainer};
  max-width: 1800px;
  width: 100vw;
  height: 100vh;
  padding: 0 15px;
  display: flex;
  flex-direction: column;
`;

const Wrapper = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 3fr;
  gap: 30px;
  padding: 50px 0;
`;
