import styled from "styled-components";

export const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

export const FormRow = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
`;

export const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  flex: 1;
  min-width: 200px;
`;

export const ErrorText = styled.span`
  color: red;
  font-size: 12px;
`;
