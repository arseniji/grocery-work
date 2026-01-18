import { Container } from "@/shared/ui/container";
import styled from "styled-components";

export const Main = styled.main`
  display: flex;
  flex-direction: column;
  gap: 100px;
`;

export const Introduce = styled.div`
  padding: 245px 0;
  background: linear-gradient(180deg, #ffffff 0%, #fcfcf7 6%, #f5eead 100%);
`;

export const MainContainer = styled.div`
  ${Container}
  display: flex;
  justify-content: space-between;
  align-items: start;
`;

export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
  max-width: 700px;
`;

export const Image = styled.img`
  width: 605px;
  height: 500px;
`;

export const AdjContainer = styled.section`
  ${Container}
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
`;

export const Adj = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;
`;

export const AdjTextWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export const EcoContainer = styled.div`
  ${Container}
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 70px 120px;
  background: linear-gradient(45deg, #def1bd 0%, #f5eead 100%);
  border-radius: 10px;
  transform: rotate(-1deg);
  gap: 100px;
`;

export const EcoImage = styled.img`
  width: 420px;
  height: 400px;
`;

export const TopSellerrsContainer = styled.section`
  ${Container}
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 50px;
`;

export const ProductsList = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  justify-content: space-between;
  gap: 20px;
`;
