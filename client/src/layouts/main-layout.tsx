import { useAuth } from "@/lib/hooks";
import { Footer, Header } from "@/widgets";
import { Outlet } from "react-router";

export const MainLayout = () => {
  const { isAuth } = useAuth();

  return (
    <>
      <Header isLogined={isAuth} />
      <Outlet />
      <Footer />
    </>
  );
};
