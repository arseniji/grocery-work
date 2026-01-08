import React, { type JSX } from "react";
import styled from "styled-components";
import { BaseBodyM } from "./captions";

interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  icon?: () => JSX.Element;
  onChange?: (value: string) => void;
}

export const Input = ({ icon, onChange, ...props }: InputProps) => {
  return (
    <Container>
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
  min-width: 400px;
`;

const NativeInput = styled.input`
  ${BaseBodyM}
  width: 100%;
`;
