import { Container } from "@/shared/ui/container";
import styled from "styled-components";

export const Header = styled.header`
  box-shadow: 0px 5px 8px 0px rgba(34, 60, 80, 0.2);
`;

export const HeaderContainer = styled.div`
  ${Container};
  padding: 20px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;
