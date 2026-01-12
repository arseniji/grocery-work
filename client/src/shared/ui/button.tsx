import { type ReactNode } from "react";
import { Link } from "react-router";
import styled, { css } from "styled-components";
import { BaseBodyL } from "./captions";

type BtnVariant = "ghost" | "primary" | "border";

type ButtonProps =
  | {
      children: string | ReactNode;
      variant?: BtnVariant;
      as?: "button";
      onClick?: () => void;
      type?: "submit" | "button";
      disabled?: boolean;
      active?: boolean;
    }
  | {
      children: string | ReactNode;
      variant?: BtnVariant;
      as: "link";
      href: string;
      disabled?: boolean;
      active?: boolean;
    };

interface ButtonNativeProps {
  variant: BtnVariant;
  active: boolean;
}

const colors = (variant: BtnVariant) => {
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
    case "border":
      return css`
        background: #fff;
        color: #000;
        border: 1px solid #000;
        :hover {
          color: #fff;
          background: #000;
        }
      `;
  }
};

const activeStyle = (variant: BtnVariant) => {
  switch (variant) {
    case "ghost":
    case "primary":
    case "border":
      return css`
        background: #000;
        color: #fff;
      `;
  }
};

const ButtonNative = styled.button<ButtonNativeProps>`
  ${BaseBodyL};
  text-align: center;
  padding: 10px 16px;
  transition: all 0.2s ease-in;
  ${({ variant }) => colors(variant)};
  ${({ variant, active }) => active && activeStyle(variant)}
`;

export const Button = (props: ButtonProps) => {
  const { children, variant = "ghost", as, disabled = false } = props;

  if (as === "link") {
    const { href } = props as { href: string };
    return (
      <ButtonNative
        variant={variant}
        as={Link}
        to={href}
        active={props.active || false}
      >
        {children}
      </ButtonNative>
    );
  }

  const { onClick } = props as { onClick?: () => void };

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    if (disabled) return;
    if (onClick) onClick();
  };

  return (
    <ButtonNative
      disabled={disabled}
      variant={variant}
      onClick={handleClick}
      type={props.type || "button"}
      active={props.active || false}
    >
      {children}
    </ButtonNative>
  );
};
