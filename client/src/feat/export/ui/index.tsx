import { Button } from "@/shared/ui";
import { adminApi } from "@/lib/api/admin";

interface ExportButtonsProps {
  type: "orders" | "products" | "users";
}

export const ExportButtons = ({ type }: ExportButtonsProps) => {
  const handleExport = async (format: "json" | "xml") => {
    try {
      let response;
      switch (type) {
        case "orders":
          response = await adminApi.exportOrders(format);
          break;
        case "products":
          response = await adminApi.exportProducts(format);
          break;
        case "users":
          response = await adminApi.exportUsers(format);
          break;
      }

      if (response) {
        let content: string;
        if (format === "json") {
          content = JSON.stringify(response, null, 2);
        } else {
          content = response as string;
        }
        const blob = new Blob([content], { type: `application/${format}` });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${type}.${format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ display: "flex", gap: "8px" }}>
      <Button variant="border" onClick={() => handleExport("json")}>
        Экспорт JSON
      </Button>
      <Button variant="border" onClick={() => handleExport("xml")}>
        Экспорт XML
      </Button>
    </div>
  );
};
