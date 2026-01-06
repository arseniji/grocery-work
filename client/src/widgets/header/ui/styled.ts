import { Container } from "@/shared/ui/container";
import { NavLink } from "react-router";
import styled from "styled-components";

export const HeaderWrapper = styled.header`
  ${Container}
  position: "sticky";
  top: 0;
  display: flex;
  gap: 10px;
  justify-content: space-between;
  align-items: center;
  padding: 25px 15px;
`;

export const NavContainer = styled.nav`
  display: flex;
  gap: 30px;
  align-items: center;
`;

export const LogoWrapper = styled(NavLink)`
  align-items: center;
  text-decoration: none;
  display: flex;
  gap: 10px;
`;

export const AuthWrapper = styled.div`
  align-items: center;
  display: flex;
  gap: 30px;
`;
