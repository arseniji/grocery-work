import { Container } from "@/shared/ui/container";
import styled from "styled-components";

export const Main = styled.main`
  display: flex;
  flex-direction: column;
  gap: 100px;

  @media (max-width: 768px) {
    gap: 50px;
  }
`;

export const Introduce = styled.div`
  padding: 245px 0;
  background: linear-gradient(180deg, #ffffff 0%, #fcfcf7 6%, #f5eead 100%);

  @media (max-width: 1024px) {
    padding: 120px 0;
  }

  @media (max-width: 768px) {
    padding: 60px 0;
  }
`;

export const MainContainer = styled.div`
  ${Container}
  display: flex;
  justify-content: space-between;
  align-items: start;
  padding: 0 15px;

  @media (max-width: 1024px) {
    flex-direction: column;
    align-items: center;
    gap: 40px;
  }
`;

export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
  max-width: 700px;

  @media (max-width: 1024px) {
    max-width: 100%;
    align-items: center;
    text-align: center;
  }

  @media (max-width: 768px) {
    gap: 20px;
  }
`;

export const Image = styled.img`
  width: 605px;
  height: 500px;

  @media (max-width: 1200px) {
    width: 400px;
    height: 330px;
  }

  @media (max-width: 1024px) {
    width: 100%;
    max-width: 500px;
    height: auto;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

export const AdjContainer = styled.section`
  ${Container}
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  padding: 0 15px;

  @media (max-width: 900px) {
    flex-direction: column;
    gap: 30px;
    align-items: flex-start;
  }
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

  @media (max-width: 1200px) {
    padding: 50px 60px;
    gap: 50px;
  }

  @media (max-width: 900px) {
    flex-direction: column;
    transform: none;
    padding: 40px 30px;
    gap: 30px;
  }
`;

export const EcoImage = styled.img`
  width: 420px;
  height: 400px;

  @media (max-width: 1200px) {
    width: 300px;
    height: 280px;
  }

  @media (max-width: 900px) {
    width: 100%;
    max-width: 350px;
    height: auto;
  }
`;

export const TopSellerrsContainer = styled.section`
  ${Container}
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 50px;
  padding: 0 15px;

  @media (max-width: 768px) {
    gap: 30px;
  }
`;

export const ProductsList = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  justify-content: space-between;
  gap: 20px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;
