import { TextXL, PrimarySpan, TitleXL } from "@/shared/ui/captions";
import { ContentWrapper, Image, Main, MainContainer } from "./styled";
import { Button } from "@/shared/ui";

export const HomePage = () => {
  return (
    <Main>
      <MainContainer>
        <ContentWrapper>
          <TitleXL>
            Your Ultimate Online <PrimarySpan>Grocery</PrimarySpan>
          </TitleXL>
          <TextXL>
            Experience grocery shopping and swift home delivery with our wide
            range of fresh produce and essentials
          </TextXL>
          <Button as="link" href="/about" type="primary">
            Learn More
          </Button>
        </ContentWrapper>
        <Image src="\static\groceries.png" />
      </MainContainer>
    </Main>
  );
};
