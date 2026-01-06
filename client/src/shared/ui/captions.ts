import styled, { css } from "styled-components";

export const TitleXS = styled.h6`
  color: #000;
  font-weight: 700;
  font-size: 20px;
  line-height: 30px;
  font-family: Nunito;
`;

export const TitleXL = styled.h1`
  color: #000;
  font-weight: 700;
  font-size: 88px;
  font-family: Nunito;
  line-height: 90px;
`;

export const BaseBodyM = css`
  color: #000;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  font-family: Nunito;
`;

export const BodyM = styled.p`
  ${BaseBodyM}
`;

export const BaseBodyL = css`
  color: #000;
  font-weight: 700;
  font-size: 24px;
  line-height: 34px;
  font-family: Nunito;
`;

export const BodyL = styled.p`
  ${BaseBodyL}
`;

export const BaseTextM = css`
  color: #000;
  font-weight: 500;
  font-size: 20px;
  line-height: 26px;
  font-family: Nunito;
`;

export const TextM = styled.p`
  ${BaseTextM}
`;

export const BaseTextXL = css`
  color: #000;
  font-weight: 500;
  font-size: 32px;
  line-height: 34px;
  font-family: Nunito;
`;

export const TextXL = styled.p`
  ${BaseTextXL}
`;

export const PrimarySpan = styled.span`
  color: #517907;
`;
