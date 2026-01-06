import type { ReactNode } from "react";
import styled from "styled-components";
import { BaseBodyL } from "./captions";

interface ButtonProps {
  children: string | ReactNode;
  onClick: () => void;
}

export const Button = ({ children, onClick }: ButtonProps) => {
  return <ButtonNative onClick={onClick}>{children}</ButtonNative>;
};

const ButtonNative = styled.button`
  ${BaseBodyL};
  background: none;
  padding: 10px 16px;
  border: 1px solid transparent;
  transition: border-color 0.2s ease-in;

  :hover {
    border-color: #000;
  }
`;
