import type { JSX } from "react";
import styled from "styled-components";
import { BaseBodyM } from "./captions";

interface InputProps {
  icon?: () => JSX.Element;
}

export const Input = ({ icon }: InputProps) => {
  return (
    <Container>
      {icon && icon()}
      <NativeInput placeholder="поиск" />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 20px;
  border-radius: 5px;
  border: 1px solid #000;
  gap: 5px;
  min-width: 400px;
`;

const NativeInput = styled.input`
  ${BaseBodyM}
  width: 100%;
`;
