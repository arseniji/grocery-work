import { useState } from "react";
import { Button } from "@/shared/ui";
import { adminApi } from "@/lib/api/admin";
import { Toast } from "@/feat/toast";

interface ImportButtonsProps {
  type: "orders" | "products" | "users";
  onImportSuccess?: () => void;
}

export const ImportButtons = ({
  type,
  onImportSuccess,
}: ImportButtonsProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleImport = async (format: "json" | "xml") => {
    if (!selectedFile) return;

    setIsImporting(true);
    try {
      let response;
      switch (type) {
        case "orders":
          response = await adminApi.importOrders(selectedFile, format);
          break;
        case "products":
          response = await adminApi.importProducts(selectedFile, format);
          break;
        case "users":
          response = await adminApi.importUsers(selectedFile, format);
          break;
      }

      if (response) {
        Toast.show({
          type: "msg",
          title: "Успех",
          msg: "Импорт выполнен успешно",
        });
        onImportSuccess?.();
        setSelectedFile(null);
        const input = document.getElementById(
          `file-input-${type}`,
        ) as HTMLInputElement;
        if (input) input.value = "";
      }
    } catch (error) {
      console.error("Import failed:", error);
      Toast.show({
        type: "error",
        title: "Ошибка!",
        msg: "Ошибка импорта данных",
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
      <input
        id={`file-input-${type}`}
        type="file"
        accept=".json,.xml"
        onChange={handleFileSelect}
        style={{ display: "none" }}
      />
      <Button
        variant="border"
        onClick={() => document.getElementById(`file-input-${type}`)?.click()}
      >
        {selectedFile ? selectedFile.name : "Выбрать файл"}
      </Button>
      <Button
        variant="border"
        onClick={() => handleImport("json")}
        disabled={!selectedFile || isImporting}
      >
        Импорт JSON
      </Button>
      <Button
        variant="border"
        onClick={() => handleImport("xml")}
        disabled={!selectedFile || isImporting}
      >
        Импорт XML
      </Button>
    </div>
  );
};
