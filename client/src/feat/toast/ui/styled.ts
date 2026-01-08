import styled from "styled-components";
import { BaseBodyM, BodyXS } from "@/shared/ui/captions";

export const ToastContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  background: #fff;
  border-radius: 10px;
  padding: 0 5px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  min-width: 300px;
  max-width: 500px;
  position: relative;
  overflow: hidden;
`;

export const ToastTitle = styled.div`
  ${BaseBodyM}
  font-weight: 700;
`;

export const ToastMessage = styled.div`
  padding: 5px 10px 10px;
  ${BodyXS};
`;

export const ProgressBar = styled.div<{ duration: number }>`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background: #517907;
  animation: shrink linear forwards;
  animation-duration: ${({ duration }) => duration}ms;

  @keyframes shrink {
    from {
      width: 100%;
    }
    to {
      width: 0%;
    }
  }
`;

export const ErrorProgressBar = styled(ProgressBar)`
  background: red;
`;

export const TitleWrapper = styled.div`
  padding: 5px 10px 3px;
`;

export const ErrorTitleWrapper = styled(TitleWrapper)`
  border-bottom: 1px solid red;
`;

export const MsgTitleWrapper = styled(TitleWrapper)`
  border-bottom: 1px solid #517907;
`;
