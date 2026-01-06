import styled, { css } from "styled-components";

export const TitleXS = styled.h6`
  color: #000;
  font-weight: 700;
  font-size: 20px;
  line-height: 30px;
  font-family: Nunito;
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
