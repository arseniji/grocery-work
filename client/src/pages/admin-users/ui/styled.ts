import styled from "styled-components";

export const Main = styled.main`
  border-radius: 20px;
  padding: 30px;
  background-color: #fcfcfc;
  height: 100%;
  width: 100%;
  box-shadow: 4px 0px 10px 0px rgba(34, 60, 80, 0.2);
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const LoaderWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
`;

export const ControlsWrapper = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
`;
