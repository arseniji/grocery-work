import { ReportView } from "@/feat";
import { adminApi } from "@/lib/api/admin";
import type { AxiosError } from "axios";
import { useCallback, useEffect, useState } from "react";

export const ProductReportPage = () => {
  const [data, setData] = useState<Record<string, any>>({});

  const loadReport = useCallback(async () => {
    try {
      const response = await adminApi.reports({}, { domain: "products" });
      setData(response.metrics);
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
      <ReportView data={data} />
    </>
  );
};
