import styled, { css } from "styled-components";

export const Container = styled.div`
  flex: 1;
  overflow-x: auto;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
`;

export const Th = styled.th`
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
  background-color: #f4f4f4;
  font-weight: 600;
`;

export const Td = styled.td`
  border: 1px solid #ddd;
  padding: 12px;
`;

export const Tr = styled.tr<{ isActive: boolean }>`
  ${({ isActive }) =>
    isActive &&
    css`
      background-color: #e0e0e0;
    `}
`;
