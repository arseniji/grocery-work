import { LogoIcon, TelegramIcon, VkIcon } from "@/shared/icons";
import {
  FooterWrapper,
  FooterTop,
  LogoSection,
  LargeLogoWrapper,
  ContactsSection,
  ContactItem,
  SocialSection,
  SocialLinks,
  NavSection,
  FooterNavContainer,
  FooterBottom,
  FooterContainer,
} from "./styled";
import { BodyM, TitleXS } from "@/shared/ui/captions";
import { routes } from "../../header/contants/routes";
import { NavLink } from "react-router";

export const Footer = () => {
  return (
    <FooterWrapper>
      <FooterContainer>
        <FooterTop>
          <LogoSection>
            <LargeLogoWrapper to={"/"}>
              <LogoIcon />
              <TitleXS>Green Grocer</TitleXS>
            </LargeLogoWrapper>
          </LogoSection>

          <ContactsSection>
            <BodyM style={{ fontWeight: "bold" }}>Контакты</BodyM>
            <ContactItem>
              <BodyM>Телефон: +7 (123) 456-78-90</BodyM>
            </ContactItem>
            <ContactItem>
              <BodyM>Email: info@greengrocer.ru</BodyM>
            </ContactItem>
            <ContactItem>
              <BodyM>Адрес: г. Краснодар, ул. Примерная, д. 1</BodyM>
            </ContactItem>
          </ContactsSection>

          <SocialSection>
            <BodyM style={{ fontWeight: "bold" }}>Мы в соцсетях</BodyM>
            <SocialLinks>
              <TelegramIcon />
              <VkIcon />
            </SocialLinks>
          </SocialSection>

          <NavSection>
            <BodyM style={{ fontWeight: "bold" }}>Навигация</BodyM>
            <FooterNavContainer>
              {routes.map((route) => (
                <NavLink key={route.to} to={route.to}>
                  <BodyM>{route.text}</BodyM>
                </NavLink>
              ))}
            </FooterNavContainer>
          </NavSection>
        </FooterTop>

        <FooterBottom>
          <BodyM>© 2025 Green Grocer. Все права защищены.</BodyM>
        </FooterBottom>
      </FooterContainer>
    </FooterWrapper>
  );
};
