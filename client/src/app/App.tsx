import { HomePage } from "@/pages/home-page";
import { Header } from "@/widgets";
import { BrowserRouter, Route, Routes } from "react-router";
import styled from "styled-components";

function App() {
  return (
    <Container>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
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
