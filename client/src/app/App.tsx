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
import { OrderPage } from "@/pages/order-page";
import { AdminLayout } from "@/layouts/admin-layout";
import { AdminUsersPage } from "@/pages/admin-users";
import { AdminProductsPage } from "@/pages/admin-products";
import { AboutPage } from "@/pages/about-page";
import { ErrorBoundary } from "@/shared/ui";
import { UndoProvider } from "@/feat/undo";

function App() {
  return (
    <ErrorBoundary>
      <UndoProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<HomePage />} />
              <Route path="shop" element={<ShopPage />} />
              <Route path="product/:id" element={<ProductPage />} />
              <Route path="cart" element={<CartPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="order/:id" element={<OrderPage />} />
              <Route path="about" element={<AboutPage />} />
            </Route>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminUsersPage />} />
              <Route path="users" element={<AdminUsersPage />} />
              <Route path="products" element={<AdminProductsPage />} />
            </Route>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/registration" element={<RegistrationPage />} />
          </Routes>
        </BrowserRouter>
        <ToastProvider />
      </UndoProvider>
    </ErrorBoundary>
  );
}

export default App;
