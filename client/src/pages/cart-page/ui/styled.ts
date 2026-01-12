import { Container } from "@/shared/ui/container";
import styled from "styled-components";

export const Main = styled.main`
  ${Container}
  width: 100%;
  margin-top: 100px;
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 50px;
`;

export const LoaderWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const CartList = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 50px;
`;

export const CartWrapper = styled.div`
  width: 100%;
  height: 100%;
`;

export const Empty = styled.div`
  align-items: center;
  justify-self: center;
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 10px;
  justify-content: center;
`;

export const MetaContainer = styled.div`
  align-items: center;
  display: flex;
  align-items: center;
  margin-top: 20px;
  margin-bottom: 40px;
`;
