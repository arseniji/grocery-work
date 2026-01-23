import { TextM, TitleL } from "@/shared/ui/captions";
import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

export const BLockContainer = styled.div<{ tab: number }>`
  padding-left: ${({ tab }) => tab * 24}px;
`;

export const BlockTitle = styled(TitleL)<{ tab: number }>`
  font-size: ${({ tab }) => (tab < 5 ? 36 - tab * 6 : 12)}px;
  margin-bottom: ${({ tab }) => (tab < 4 ? 24 - tab * 8 : 12)}px;
`;

export const ValueContainer = styled.div<{ tab: number }>`
  padding-left: ${({ tab }) => tab * 24}px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const ValueName = styled(TextM)`
  color: #517907;
`;
