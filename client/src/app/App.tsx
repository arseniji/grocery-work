import { Header } from "@/widgets";
import { BrowserRouter, Route, Routes } from "react-router";
import styled from "styled-components";

function App() {
  return (
    <Container>
      <Header />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<></>} />
        </Routes>
      </BrowserRouter>
    </Container>
  );
}

const Container = styled.div`
  max-width: 1440px;
  margin: 0 auto;
`;

export default App;
