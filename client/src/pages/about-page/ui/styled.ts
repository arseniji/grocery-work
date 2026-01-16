import { Container } from "@/shared/ui/container";
import styled from "styled-components";

export const Main = styled.main`
  display: flex;
  flex-direction: column;
  gap: 100px;
  padding: 100px 0;
`;

export const AboutContainer = styled.section`
  ${Container}
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 100px;
`;

export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
  max-width: 700px;
`;

export const Image = styled.img`
  width: 500px;
  height: 400px;
`;
