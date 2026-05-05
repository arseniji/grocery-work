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
  overflow: auto;

  @media (max-width: 768px) {
    padding: 15px;
    border-radius: 10px;
    gap: 12px;
  }
`;

export const LoaderWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ControlsWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  gap: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const RowWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
`;

export const ColWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #fff;

  @media (max-width: 768px) {
    padding: 12px;
    gap: 12px;
  }
`;

export const FormRow = styled.div`
  display: flex;
  gap: 16px;
  align-items: flex-start;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
`;

export const ErrorText = styled.span`
  color: red;
  font-size: 12px;
`;
