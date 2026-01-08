import {
  TextXL,
  PrimarySpan,
  TitleXL,
  TitleXS,
  TextM,
  TitleL,
} from "@/shared/ui/captions";
import {
  Adj,
  AdjContainer,
  AdjTextWrapper,
  ContentWrapper,
  EcoContainer,
  EcoImage,
  Image,
  Introduce,
  Main,
  MainContainer,
} from "./styled";
import { Button } from "@/shared/ui";
import { adjList } from "../constants/adj-list";
import { useEffect } from "react";
import { Toast } from "@/feat/toast/ui";

export const HomePage = () => {
  useEffect(() => {
    Toast.show({
      type: "msg",
      title: "Тест",
      msg: "тест тест",
    });
  }, []);

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
            <Button as="link" href="/about" variant="primary">
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

      <EcoContainer>
        <EcoImage src="\static\eco.png" />
        <ContentWrapper>
          <TitleL>
            <PrimarySpan>ECO</PrimarySpan>-Friendly
            <TextXL>
              Откройте для себя широкий ассортимент экологически чистых
              продуктов местного производства в нашем интернет-магазине, где вы
              найдете экологичные варианты, поддерживающие как местное
              сообщество, так и планету.
            </TextXL>
          </TitleL>
        </ContentWrapper>
      </EcoContainer>
    </Main>
  );
};
