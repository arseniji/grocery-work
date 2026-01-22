import { ReportView } from "@/feat";
import { adminApi } from "@/lib/api/admin";
import type { AxiosError } from "axios";
import { useCallback, useEffect, useState } from "react";
import { Container } from "./styled";
import { Button, Loader } from "@/shared/ui";
import { TitleL } from "@/shared/ui/captions";

export const ReportPage = () => {
  const [data, setData] = useState<Record<string, any>>({});
  const [domain, setDomain] = useState<string>("products");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const loadReport = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await adminApi.reports({}, { domain });
      setData(response.metrics);
    } catch (err) {
      const error = err as AxiosError;
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [domain]);

  useEffect(() => {
    loadReport();
  }, [loadReport]);

  return (
    <Container>
      <TitleL>Отчет: {domain}</TitleL>
      <div>
        <Button onClick={() => setDomain("products")}>Products</Button>
        <Button onClick={() => setDomain("orders")}>Orders</Button>
        <Button onClick={() => setDomain("users")}>Users</Button>
      </div>
      {isLoading ? <Loader /> : <ReportView data={data} />}
    </Container>
  );
};
