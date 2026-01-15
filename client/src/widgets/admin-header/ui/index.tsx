import { LogoIcon } from "@/shared/icons";
import { Header, HeaderContainer, LogoWrapper } from "./styled";
import { PrimarySpan, TitleS } from "@/shared/ui/captions";
import { Button } from "@/shared/ui";

export const AdminHeader = () => {
  return (
    <Header>
      <HeaderContainer>
        <LogoWrapper>
          <LogoIcon />
          <TitleS>
            Green Grocer <PrimarySpan>Admin</PrimarySpan>
          </TitleS>
        </LogoWrapper>
        <Button variant="primary" as="link" href="/">
          Вернуться в магазин
        </Button>
      </HeaderContainer>
    </Header>
  );
};
