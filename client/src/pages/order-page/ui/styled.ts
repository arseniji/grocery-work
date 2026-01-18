import styled from "styled-components";

export const Main = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  min-height: 100vh;
`;

export const OrderContainer = styled.div`
  width: 100%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const OrderHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
  border-radius: 10px;
  background-color: #f9f9f9;
  box-shadow: 0px 0px 15px 0px rgba(34, 60, 80, 0.2);
`;

export const ProductsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

export const ProductItem = styled.div`
  display: flex;
  gap: 15px;
  padding: 15px;
  border-radius: 10px;
  background-color: #fff;
  box-shadow: 0px 0px 10px 0px rgba(34, 60, 80, 0.1);
`;

export const ProductImage = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
`;

export const ProductInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  flex: 1;
`;

export const Summary = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
  border-radius: 10px;
  background-color: #f0f0f0;
  box-shadow: 0px 0px 15px 0px rgba(34, 60, 80, 0.2);
  align-self: flex-end;
  min-width: 300px;
`;
