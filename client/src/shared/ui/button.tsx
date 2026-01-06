import { type ReactNode } from "react";
import { Link } from "react-router";
import styled, { css } from "styled-components";
import { BaseBodyL } from "./captions";

type BtnType = "ghost" | "primary";

type ButtonProps =
  | {
      children: string | ReactNode;
      type?: BtnType;
      as?: "button";
      onClick?: () => void;
    }
  | {
      children: string | ReactNode;
      type?: BtnType;
      as: "link";
      href: string;
    };

interface ButtonNativeProps {
  variant: BtnType;
}

const colors = (variant: BtnType) => {
  switch (variant) {
    case "ghost":
      return css`
        background: none;
        color: #000;
        border: 1px solid transparent;
        :hover {
          border-color: #000;
        }
      `;
    case "primary":
      return css`
        background: #000;
        color: #fff;
        border: none;
        :hover {
          color: #000;
          background: #fff;
        }
      `;
  }
};

const ButtonNative = styled.button<ButtonNativeProps>`
  ${BaseBodyL};
  text-align: center;
  padding: 10px 16px;
  transition: all 0.2s ease-in;
  ${({ variant }) => colors(variant)};
`;

export const Button = (props: ButtonProps) => {
  const { children, type = "ghost", as } = props;

  if (as === "link") {
    const { href } = props as { href: string };
    return (
      <ButtonNative variant={type} as={Link} to={href}>
        {children}
      </ButtonNative>
    );
  }

  const { onClick } = props as { onClick?: () => void };
  return (
    <ButtonNative variant={type} onClick={onClick}>
      {children}
    </ButtonNative>
  );
};
