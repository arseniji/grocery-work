import styled from "styled-components";
import { TitleS, TitleXS } from "@/shared/ui/captions";

export const ToastContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  background: #fff;
  border-radius: 10px;
  padding: 0 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  min-width: 300px;
  max-width: 500px;
  position: relative;
  overflow: hidden;
`;

export const ToastTitle = styled(TitleS)`
  font-weight: 700;
`;

export const ToastMessage = styled(TitleXS)`
  padding: 8px 25px 10px;
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
  padding: 10px 15px 5px;
`;

export const ErrorTitleWrapper = styled(TitleWrapper)`
  border-bottom: 1px solid red;
`;

export const MsgTitleWrapper = styled(TitleWrapper)`
  border-bottom: 1px solid #517907;
`;
