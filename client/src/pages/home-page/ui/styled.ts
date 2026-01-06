import { Container } from "@/shared/ui/container";
import styled from "styled-components";

export const Main = styled.main`
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
