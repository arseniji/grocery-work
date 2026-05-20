import { BaseBodyM } from "@/shared/ui/captions";
import styled from "styled-components";

export const RegistrationContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(180deg, #ffffff 0%, #fcfcf7 6%, #f5eead 100%);
  padding: 20px;
`;

export const LogoContainer = styled.div`
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const Form = styled.form`
  position: relative;
  display: flex;
  flex-direction: column;
  background: #fff;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 520px;

  @media (max-width: 560px) {
    padding: 24px 16px;
  }
`;

export const InputGroup = styled.div`
  margin-bottom: 20px;
  width: 100%;
`;

export const Label = styled.label`
  ${BaseBodyM}
  display: block;
  margin-bottom: 5px;
`;
