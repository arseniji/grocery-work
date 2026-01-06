import { Footer, Header } from "@/widgets";
import { Outlet } from "react-router";

export const MainLayout = () => {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
};
