import { useAuth } from "@/lib/hooks";
import { Footer, Header } from "@/widgets";
import { Loader } from "@/shared/ui";
import { Outlet } from "react-router";

export const MainLayout = () => {
  const { isAuth, isLoading } = useAuth();

  if (isLoading)
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Loader />
      </div>
    );

  return (
    <>
      <Header isLogined={isAuth} />
      <Outlet />
      <Footer />
    </>
  );
};
