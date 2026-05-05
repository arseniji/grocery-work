import styled from "styled-components";

export const Header = styled.header`
  border-radius: 0 0 20px 20px;
  background-color: #fcfcfc;
  box-shadow: 0px 5px 8px 0px rgba(34, 60, 80, 0.2);
  padding: 20px 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 768px) {
    padding: 12px 15px;
    border-radius: 0;
    gap: 10px;
  }
`;

export const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  @media (max-width: 560px) {
    span {
      display: none;
    }
  }
`;
