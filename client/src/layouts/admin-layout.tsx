import { AdminHeader } from "@/widgets";
import { Outlet } from "react-router";
import styled from "styled-components";

export const AdminLayout = () => {
  return (
    <Container>
      <AdminHeader />
      <div>
        <Outlet />
      </div>
    </Container>
  );
};

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  padding: 0 15px;
`;
