import { useState } from "react";

export const useAuth = () => {
  const [isAuth, setIsAuth] = useState<boolean>(() => {
    const token = localStorage.getItem("token");
    return !!token;
  });

  // TODO: Add token validation request

  return { isAuth };
};
