import React, { type JSX } from "react";
import styled from "styled-components";
import { BaseBodyM } from "./captions";

interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  icon?: () => JSX.Element;
  onChange?: (value: string) => void;
  containerStyle?: React.CSSProperties;
}

export const Input = ({
  icon,
  onChange,
  containerStyle,
  ...props
}: InputProps) => {
  return (
    <Container style={containerStyle}>
      {icon && icon()}
      <NativeInput {...props} onChange={(e) => onChange?.(e.target.value)} />
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
  min-width: 200px;
  width: 100%;

  @media (max-width: 768px) {
    min-width: 0;
    padding: 8px 12px;
  }
`;

const NativeInput = styled.input`
  ${BaseBodyM}
  width: 100%;
`;
