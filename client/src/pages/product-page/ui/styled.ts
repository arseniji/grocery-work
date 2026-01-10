import { Container } from "@/shared/ui/container";
import styled from "styled-components";

export const Main = styled.main`
  ${Container}
  display: flex;
  flex-direction: column;
  gap: 50px;
  padding: 50px 0;
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
  font-weight: 500;
  font-size: 16px;
  color: #666;
`;

export const Quantity = styled.span`
  font-weight: 500;
  font-size: 16px;
  color: #666;
`;
