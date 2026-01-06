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
              Ваш идеальный -<PrimarySpan>магазин продуктов</PrimarySpan>
            </TitleXL>
            <TextXL>
              Ощутите удобство покупок продуктов и быструю доставку на дом с
              нашим широким ассортиментом свежих продуктов и необходимых товаров
            </TextXL>
            <Button as="link" href="/about" type="primary">
              Узнать больше
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
              <TitleXS style={{ textWrap: "nowrap" }}>{adj.title}</TitleXS>
              <TextM>{adj.text}</TextM>
            </AdjTextWrapper>
          </Adj>
        ))}
      </AdjContainer>
    </Main>
  );
};
