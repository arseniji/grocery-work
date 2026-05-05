import { Container } from "@/shared/ui/container";
import { NavLink } from "react-router";
import styled from "styled-components";

export const HeaderContainer = styled.header`
  position: sticky;
  top: 0;
  background: white;
  z-index: 100;
  border-bottom: 1px solid #f0f0f0;
`;

export const HeaderWrapper = styled.div`
  ${Container}
  position: relative;
  background: white;
  display: flex;
  gap: 10px;
  justify-content: space-between;
  align-items: center;
  padding: 25px 15px;

  @media (max-width: 1024px) {
    padding: 15px;
    gap: 8px;
  }

  @media (max-width: 768px) {
    flex-wrap: wrap;
    padding: 12px 15px;
    gap: 10px;
  }
`;

export const NavContainer = styled.nav`
  display: flex;
  gap: 30px;
  align-items: center;

  @media (max-width: 1024px) {
    gap: 15px;
  }

  @media (max-width: 768px) {
    gap: 10px;

    a:not(:first-child) {
      display: none;
    }
  }
`;

export const LogoWrapper = styled(NavLink)`
  align-items: center;
  text-decoration: none;
  display: flex;
  gap: 10px;
  white-space: nowrap;
`;

export const AuthWrapper = styled.div`
  align-items: center;
  display: flex;
  gap: 15px;

  @media (max-width: 768px) {
    gap: 8px;

    a, button {
      font-size: 14px;
      padding: 6px 12px;
    }
  }
`;

export const UserWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const SearchWrapper = styled.div`
  flex: 1;
  max-width: 400px;

  @media (max-width: 1024px) {
    max-width: 250px;
  }

  @media (max-width: 768px) {
    order: 3;
    max-width: 100%;
    width: 100%;
    flex-basis: 100%;
  }
`;
