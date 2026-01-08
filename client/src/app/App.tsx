import { HomePage } from "@/pages/home-page";
import { LoginPage } from "@/pages/login-page";
import { MainLayout } from "@/layouts/main-layout";
import { BrowserRouter, Route, Routes } from "react-router";
import { RegistrationPage } from "@/pages/registration-page";
import { ToastProvider } from "@/feat/toast/ui";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
          </Route>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registration" element={<RegistrationPage />} />
        </Routes>
      </BrowserRouter>
      <ToastProvider />
    </>
  );
}

export default App;
