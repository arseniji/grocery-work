import { HomePage } from "@/pages/home-page";
import { LoginPage } from "@/pages/login-page";
import { MainLayout } from "@/layouts/main-layout";
import { BrowserRouter, Route, Routes } from "react-router";
import { RegistrationPage } from "@/pages/registration-page";
import { ToastProvider } from "@/feat/toast";
import { ShopPage } from "@/pages/shop-page";
import { ProductPage } from "@/pages/product-page";
import { CartPage } from "@/pages/cart-page";
import { ProfilePage } from "@/pages/profile-page";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="shop" element={<ShopPage />} />
            <Route path="product/:id" element={<ProductPage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="profile" element={<ProfilePage />} />
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
