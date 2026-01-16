import { useCallback, useState } from "react";
import { adminApi } from "@/lib/api/admin";
import { Toast } from "@/feat";
import type {
  AdminUserAddType,
  AdminUserEditType,
} from "@/entities/user/schemas";
import type { ShortUser } from "@/lib/api/admin/types";
import type { IProfile } from "@/entities/profile/types";

export const useUserActions = (
  onSuccess: () => void,
  selected?: ShortUser,
  onDeleteSuccess?: () => void
) => {
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<IProfile>();
  const [editingUserId, setEditingUserId] = useState<number>();
  const [isLoadingEdit, setIsLoadingEdit] = useState<boolean>(false);

  const handleAddUser = useCallback(() => {
    setIsEditing(false);
    setEditingUser(undefined);
    setIsFormOpen(true);
  }, []);

  const handleEditUser = useCallback(async () => {
    if (!selected) return;
    setIsEditing(true);
    setEditingUserId((selected as ShortUser).userId);
    setIsLoadingEdit(true);
    try {
      const response = await adminApi.getUser((selected as ShortUser).userId);
      setEditingUser((response as any).data || response);
      setIsFormOpen(true);
    } catch {
      Toast.show({
        type: "error",
        title: "Ошибка!",
        msg: "Ошибка получения данных пользователя",
      });
    } finally {
      setIsLoadingEdit(false);
    }
  }, [selected]);

  const handleCloseForm = useCallback(() => {
    setIsFormOpen(false);
  }, []);

  const handleSubmit = useCallback(
    async (data: AdminUserAddType | AdminUserEditType) => {
      try {
        if (isEditing && editingUserId) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { password, ...updateData } = data as AdminUserAddType;
          await adminApi.updateUser(
            editingUserId,
            updateData as AdminUserEditType
          );
          Toast.show({
            type: "msg",
            title: "Успех!",
            msg: "Пользователь обновлен",
          });
        } else {
          await adminApi.addUser(data as AdminUserAddType);
          Toast.show({
            type: "msg",
            title: "Успех!",
            msg: "Пользователь добавлен",
          });
        }
        onSuccess();
        setIsFormOpen(false);
      } catch {
        Toast.show({
          type: "error",
          title: "Ошибка!",
          msg: isEditing
            ? "Ошибка обновления пользователя"
            : "Ошибка добавления пользователя",
        });
      }
    },
    [isEditing, editingUserId, onSuccess]
  );

  const handleDeleteUser = useCallback(async () => {
    if (!selected) return;
    try {
      await adminApi.deleteUser((selected as ShortUser).userId);
      Toast.show({
        type: "msg",
        title: "Успех!",
        msg: "Пользователь удален",
      });
      onSuccess();
      onDeleteSuccess?.();
    } catch {
      Toast.show({
        type: "error",
        title: "Ошибка!",
        msg: "Ошибка удаления пользователя",
      });
    }
  }, [selected, onSuccess, onDeleteSuccess]);

  return {
    isFormOpen,
    isEditing,
    editingUser,
    isLoadingEdit,
    handleAddUser,
    handleEditUser,
    handleCloseForm,
    handleSubmit,
    handleDeleteUser,
  };
};
