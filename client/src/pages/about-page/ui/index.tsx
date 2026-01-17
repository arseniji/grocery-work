import { TitleXL, TextXL } from "@/shared/ui/captions";
import { AboutContainer, ContentWrapper, Image, Main } from "./styled";

export const AboutPage = () => {
  return (
    <Main>
      <AboutContainer>
        <ContentWrapper>
          <TitleXL>О нас</TitleXL>
          <TextXL>
            Добро пожаловать в наш интернет-магазин продуктов! Мы стремимся
            предоставить вам удобный и качественный сервис по доставке свежих
            продуктов прямо к вашему порогу. Наша миссия - сделать покупки
            простыми, быстрыми и экологичными, поддерживая местных
            производителей и заботясь о планете.
          </TextXL>
          <TextXL>
            С широким ассортиментом товаров, от свежих овощей и фруктов до
            экологически чистых продуктов, мы гарантируем высокое качество и
            свежесть. Присоединяйтесь к нам и наслаждайтесь удобством онлайн-
            покупок!
          </TextXL>
        </ContentWrapper>
        <Image src="/static/groceries.png" alt="Продукты" />
      </AboutContainer>
    </Main>
  );
};
