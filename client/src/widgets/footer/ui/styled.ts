import { Container } from "@/shared/ui/container";
import { NavLink } from "react-router";
import styled from "styled-components";

export const FooterWrapper = styled.footer`
  background-color: #f8f9fa;
  border-top: 1px solid #e9ecef;
  margin-top: 100px;
  align-self: end;

  @media (max-width: 768px) {
    margin-top: 50px;
  }
`;

export const FooterContainer = styled.div`
  ${Container}
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 40px 15px;
`;

export const FooterTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 30px;

  @media (max-width: 900px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 30px;
  }

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
    gap: 25px;
  }
`;

export const LogoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const LargeLogoWrapper = styled(NavLink)`
  align-items: center;
  text-decoration: none;
  display: flex;
  gap: 15px;
  transform: scale(1.5);
  transform-origin: left;

  @media (max-width: 768px) {
    transform: scale(1.2);
  }
`;

export const ContactsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const SocialSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const SocialLinks = styled.div`
  display: flex;
  gap: 15px;
`;

export const NavSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const FooterNavContainer = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const FooterBottom = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 20px;
  border-top: 1px solid #e9ecef;
  text-align: center;
`;
