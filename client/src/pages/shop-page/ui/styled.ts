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

export const ShopContainer = styled.section`
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

export const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
`;

export const LoaderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 800px;

  @media (max-width: 768px) {
    height: 400px;
  }
`;

export const CategoryContainer = styled.div`
  max-width: 100%;
  overflow-x: auto;
  display: flex;
  gap: 20px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 10px;
  }
`;

export const SortContainer = styled.div`
  max-width: 100%;
  display: flex;
  gap: 20px;
`;
