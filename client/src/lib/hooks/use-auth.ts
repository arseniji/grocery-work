import type { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { authApi } from "../api/auth";

export const useAuth = () => {
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const validateToken = async () => {
    setIsLoading(true);
    const token = localStorage.getItem("token");

    if (!token) {
      setIsAuth(false);
      return;
    }

    try {
      const response = await authApi.validToken();

      if (response.expired) {
        setIsAuth(false);
        localStorage.removeItem("token");
        setIsLoading(false);
        return;
      }

      setIsAuth(true);
      setIsLoading(false);
    } catch (err) {
      const error = err as AxiosError;
      setIsAuth(false);
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    validateToken();
  }, []);

  return { isAuth, isLoading };
};
