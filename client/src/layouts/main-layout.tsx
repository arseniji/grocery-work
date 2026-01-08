import { useAuth } from "@/lib/hooks";
import { Footer, Header } from "@/widgets";
import { Loader } from "@/shared/ui";
import { Outlet } from "react-router";

export const MainLayout = () => {
  const { isAuth, isLoading } = useAuth();

  if (isLoading) return <Loader />;

  return (
    <>
      <Header isLogined={isAuth} />
      <Outlet />
      <Footer />
    </>
  );
};
