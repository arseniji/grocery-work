import { BaseBodyM } from "@/shared/ui/captions";
import { Container } from "@/shared/ui/container";
import styled from "styled-components";

export const Main = styled.main`
  ${Container}
  display: flex;
  flex-direction: column;
  gap: 50px;
  padding: 50px 0;
  width: 100%;
`;

export const ProductContainer = styled.div`
  display: flex;
  gap: 50px;
  align-items: start;
`;

export const Image = styled.img`
  width: 500px;
  height: 500px;
  object-fit: contain;
  border-radius: 10px;
  box-shadow: 0px 0px 15px 0px rgba(34, 60, 80, 0.2);
`;

export const Details = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex: 1;
`;

export const Category = styled.span`
  color: #517907;
  font-weight: 500;
  font-size: 16px;
`;

export const Price = styled.span`
  font-weight: 700;
  font-size: 32px;
  color: #000;
`;

export const Description = styled.p`
  font-weight: 500;
  font-size: 20px;
  line-height: 26px;
  color: #000;
`;

export const Unit = styled.span`
  ${BaseBodyM}
  color: #666;
`;

export const Quantity = styled.span`
  ${BaseBodyM}
  color: #666;
`;

export const SimilarProducts = styled.section`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

export const ProductsList = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
`;

export const PriceRating = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const UnitQuantity = styled.div`
  display: flex;
  gap: 20px;
`;

export const QuantitySelector = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const QuantityButton = styled.button`
  width: 30px;
  height: 30px;
  border: 1px solid #ccc;
  background: #fff;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: bold;
  &:hover {
    background: #f0f0f0;
  }
`;

export const ButtonContainer = styled.div`
  align-self: center;
`;
