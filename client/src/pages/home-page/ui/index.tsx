import {
  TextXL,
  PrimarySpan,
  TitleXL,
  TitleXS,
  TextM,
} from "@/shared/ui/captions";
import {
  Adj,
  AdjContainer,
  AdjTextWrapper,
  ContentWrapper,
  Image,
  Introduce,
  Main,
  MainContainer,
} from "./styled";
import { Button } from "@/shared/ui";
import { adjList } from "../constants/adj-list";

export const HomePage = () => {
  return (
    <Main>
      <Introduce>
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
      </Introduce>

      <AdjContainer>
        {adjList.map((adj) => (
          <Adj key={adj.title}>
            {adj.icon()}
            <AdjTextWrapper>
              <TitleXS>{adj.title}</TitleXS>
              <TextM>{adj.text}</TextM>
            </AdjTextWrapper>
          </Adj>
        ))}
      </AdjContainer>
    </Main>
  );
};
