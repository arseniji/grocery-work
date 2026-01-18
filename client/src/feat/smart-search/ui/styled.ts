import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const QueryContainer = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

export const Query = styled.button`
  display: flex;
  gap: 4px;
  align-items: center;
  background: #c4c4c4;
  border-radius: 999px;
  padding: 4px 12px;
`;

export const PlusWrapper = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: #c4c4c4;
  border-radius: 999px;
  width: 40px;
  height: 40px;
`;
