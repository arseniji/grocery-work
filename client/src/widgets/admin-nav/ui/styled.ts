import styled from "styled-components";

export const Nav = styled.nav`
  border-radius: 20px;
  background-color: #fcfcfc;
  height: 100%;
  box-shadow: 4px 0px 10px 0px rgba(34, 60, 80, 0.2);
  padding: 30px 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: start;

  @media (max-width: 768px) {
    flex-direction: row;
    height: auto;
    padding: 12px 15px;
    border-radius: 10px;
    flex-wrap: wrap;
    align-items: center;
  }
`;
