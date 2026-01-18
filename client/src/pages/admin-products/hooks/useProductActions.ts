import { useCallback, useState } from "react";
import { adminApi } from "@/lib/api/admin";
import { Toast } from "@/feat";
import type {
  AdminProductAddType,
  AdminProductEditType,
} from "@/entities/product/schemas";
import type { ShortProduct } from "@/lib/api/admin/types";
import type { Product } from "@/entities/product/types";

export const useProductActions = (
  onSuccess: () => void,
  selected?: ShortProduct,
) => {
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product>();
  const [editingProductId, setEditingProductId] = useState<number>();
  const [isLoadingEdit, setIsLoadingEdit] = useState<boolean>(false);

  const handleAddProduct = useCallback(() => {
    setIsEditing(false);
    setEditingProduct(undefined);
    setIsFormOpen(true);
  }, []);

  const handleEditProduct = useCallback(async () => {
    if (!selected) return;
    setIsEditing(true);
    setEditingProductId(selected.id);
    setIsLoadingEdit(true);
    try {
      const response = await adminApi.getProduct(selected.id);
      if (response.success) {
        setEditingProduct(response as unknown as Product);
        setIsFormOpen(true);
      }
    } catch {
      Toast.show({
        type: "error",
        title: "Ошибка!",
        msg: "Ошибка получения данных продукта",
      });
    } finally {
      setIsLoadingEdit(false);
    }
  }, [selected]);

  const handleCloseForm = useCallback(() => {
    setIsFormOpen(false);
  }, []);

  const handleSubmit = useCallback(
    async (data: AdminProductAddType | AdminProductEditType) => {
      try {
        if (isEditing && editingProductId) {
          await adminApi.updateProduct(
            editingProductId,
            data as AdminProductEditType,
          );
          Toast.show({
            type: "msg",
            title: "Успех!",
            msg: "Продукт обновлен",
          });
        } else {
          await adminApi.addProduct(data as AdminProductAddType);
          Toast.show({
            type: "msg",
            title: "Успех!",
            msg: "Продукт добавлен",
          });
        }
        onSuccess();
        setIsFormOpen(false);
      } catch {
        Toast.show({
          type: "error",
          title: "Ошибка!",
          msg: isEditing
            ? "Ошибка обновления продукта"
            : "Ошибка добавления продукта",
        });
      }
    },
    [isEditing, editingProductId, onSuccess],
  );

  const handleDeleteProduct = useCallback(async () => {
    if (!selected) return;
    try {
      await adminApi.deleteProduct(selected.id);
      Toast.show({
        type: "msg",
        title: "Успех!",
        msg: "Продукт удален",
      });
      onSuccess();
    } catch {
      Toast.show({
        type: "error",
        title: "Ошибка!",
        msg: "Ошибка удаления продукта",
      });
    }
  }, [selected, onSuccess]);

  return {
    isFormOpen,
    isEditing,
    editingProduct,
    isLoadingEdit,
    handleAddProduct,
    handleEditProduct,
    handleCloseForm,
    handleSubmit,
    handleDeleteProduct,
  };
};
