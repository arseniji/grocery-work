import { adminApi } from "@/lib/api/admin";
import type { AxiosError } from "axios";
import { useCallback, useEffect } from "react";
import { Outlet } from "react-router";

export const ReportsLayout = () => {
  const loadReport = useCallback(async () => {
    try {
      const response = await adminApi.reports();
      console.log(response);
    } catch (err) {
      const error = err as AxiosError;
      console.log(error);
    }
  }, []);

  useEffect(() => {
    loadReport();
  }, [loadReport]);

  return (
    <>
      <Outlet />
    </>
  );
};
