import { UpdateProfileSchema } from "@/entities/profile/schemas";
import type { IProfile } from "@/entities/profile/types";
import { Toast } from "@/feat";
import { profileApi } from "@/lib/api/profile";
import { useForm } from "@/lib/hooks";
import type { AxiosError } from "axios";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";

export const ProfilePage = () => {
  const navigate = useNavigate();

  const { isValid, data, errors } = useForm(UpdateProfileSchema);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [profile, setProfile] = useState<IProfile>();

  const loadProfile = useCallback(async () => {
    try {
      const response = await profileApi.get();
      setProfile(response);
    } catch (err) {
      const error = err as AxiosError;
      console.log(error);
      Toast.show({
        type: "error",
        msg: "Ошибка получения пользователя, вы будете перенаправленны",
        title: "Ошибка",
      });

      setTimeout(() => {
        navigate("/");
      }, 1000);
    }
    setIsLoading(false);
  }, [navigate]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  return <></>;
};
