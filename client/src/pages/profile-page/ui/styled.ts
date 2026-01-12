import { BaseBodyM } from "@/shared/ui/captions";
import { Container } from "@/shared/ui/container";
import styled from "styled-components";

export const Main = styled.main`
  ${Container};
  margin-top: 100px;
  align-items: start;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 50px;
`;

export const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const LoaderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 300px;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  background: #fff;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  max-width: 500px;
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

export const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
`;
