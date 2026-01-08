import { useAuth } from "@/lib/hooks";
import { Footer, Header } from "@/widgets";
import { Outlet } from "react-router";

export const MainLayout = () => {
  const { isAuth, isLoading } = useAuth();

  if (isLoading) return;

  return (
    <>
      <Header isLogined={isAuth} />
      <Outlet />
      <Footer />
    </>
  );
};
