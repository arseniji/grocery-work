import { useCallback, useState } from "react";
import { adminApi } from "@/lib/api/admin";
import { Toast } from "@/feat";
import type { ShortOrder } from "@/lib/api/admin/types";
import type {
  AdminOrderAddType,
  AdminOrderEditType,
} from "@/entities/order/schemas";

export const useOrderActions = (
  onSuccess: () => void,
  selected?: ShortOrder,
  onDeselect?: () => void,
) => {
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingOrder, setEditingOrder] = useState<ShortOrder>();

  const handleAddOrder = useCallback(() => {
    setIsEditing(false);
    setEditingOrder(undefined);
    setIsFormOpen(true);
  }, []);

  const handleEditOrder = useCallback(async () => {
    if (!selected) return;
    setIsEditing(true);
    setEditingOrder(selected);
    setIsFormOpen(true);
  }, [selected]);

  const handleCloseForm = useCallback(() => {
    setIsFormOpen(false);
  }, []);

  const handleSubmit = useCallback(
    async (data: AdminOrderAddType | AdminOrderEditType) => {
      try {
        if (isEditing && editingOrder) {
          await adminApi.updateOrder(
            editingOrder.id,
            data as AdminOrderEditType,
          );
          Toast.show({
            type: "msg",
            title: "Успех!",
            msg: "Заказ обновлен",
          });
        } else {
          await adminApi.addOrder(data as AdminOrderAddType);
          Toast.show({
            type: "msg",
            title: "Успех!",
            msg: "Заказ добавлен",
          });
        }
        onSuccess();
        setIsFormOpen(false);
        onDeselect?.();
      } catch {
        Toast.show({
          type: "error",
          title: "Ошибка!",
          msg: isEditing
            ? "Ошибка обновления заказа"
            : "Ошибка добавления заказа",
        });
      }
    },
    [isEditing, editingOrder, onSuccess, onDeselect],
  );

  const handleDeleteOrder = useCallback(async () => {
    if (!selected) return;
    try {
      await adminApi.deleteOrder(selected.id);
      Toast.show({
        type: "msg",
        title: "Успех!",
        msg: "Заказ удален",
      });
      onSuccess();
      onDeselect?.();
    } catch {
      Toast.show({
        type: "error",
        title: "Ошибка!",
        msg: "Ошибка удаления заказа",
      });
    }
  }, [selected, onSuccess, onDeselect]);

  return {
    isFormOpen,
    isEditing,
    editingOrder,
    handleAddOrder,
    handleEditOrder,
    handleCloseForm,
    handleSubmit,
    handleDeleteOrder,
  };
};
