import { AdminHeader, AdminNav } from "@/widgets";
import { Outlet } from "react-router";
import styled from "styled-components";
import { Container as ShContainer } from "@/shared/ui/container";

export const AdminLayout = () => {
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
  min-height: 100vh;
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

  @media (max-width: 1024px) {
    grid-template-columns: 180px 1fr;
    gap: 20px;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    padding: 20px 0;
    gap: 15px;
  }
`;
