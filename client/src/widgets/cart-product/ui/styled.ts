import styled from "styled-components";
import { BodyM } from "@/shared/ui/captions";

export const CartProductContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 20px 60px 20px 20px;
  border-radius: 10px;
  box-shadow: 0px 0px 15px 0px rgba(34, 60, 80, 0.2);
  gap: 40px;

  @media (max-width: 768px) {
    padding: 15px;
    gap: 16px;
    flex-wrap: wrap;
  }
`;

export const Image = styled.img`
  width: 200px;
  height: 100px;
  object-fit: contain;

  @media (max-width: 768px) {
    width: 100px;
    height: 70px;
  }
`;

export const InfoWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const QuantityWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const Quantity = styled.span`
  font-size: 18px;
  font-weight: bold;
`;

export const TotalPrice = styled(BodyM)`
  font-weight: bold;
`;
