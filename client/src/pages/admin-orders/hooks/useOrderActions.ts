import { useCallback, useState } from "react";
import { adminApi } from "@/lib/api/admin";
import { Toast } from "@/feat";
import type { ShortOrder } from "@/lib/api/admin/types";
import type {
  AdminOrderAddType,
  AdminOrderEditType,
} from "@/entities/order/schemas";
import { useNavigate } from "react-router";

export const useOrderActions = (
  onSuccess: () => void,
  selected?: ShortOrder,
  onDeselect?: () => void,
) => {
  const navigate = useNavigate();

  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingOrder, setEditingOrder] = useState<ShortOrder>();

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
            editingOrder.userId,
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

  const handleDetails = useCallback(async () => {
    if (!selected) return;
    navigate(`/admin/orders/${selected.userId}/${selected.id}`);
  }, [selected, navigate]);

  return {
    isFormOpen,
    isEditing,
    editingOrder,
    handleEditOrder,
    handleCloseForm,
    handleSubmit,
    handleDetails,
  };
};
