import { useForm } from "@/lib/hooks";
import { ObjectSchema } from "@/lib/validators/base-schemas/object-schema";
import { Button, ComboBox, Input } from "@/shared/ui";
import { TitleXS } from "@/shared/ui/captions";
import {
  ErrorText,
  FormField,
  FormRow,
  FormWrapper,
  RowWrapper,
} from "./styled";

interface AdminUserFormProps {
  schema: ObjectSchema<any>;
  initialValues?: Record<string, any>;
  isEditing?: boolean;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  title: string;
  submitLabel: string;
}

export const AdminUserForm = ({
  schema,
  initialValues = {},
  isEditing = false,
  onSubmit,
  onCancel,
  title,
  submitLabel,
}: AdminUserFormProps) => {
  const form = useForm(schema, { defaultValues: initialValues });

  const handleSubmit = () => {
    if (!form.isValid) return;
    onSubmit(form.data);
  };

  return (
    <FormWrapper>
      <TitleXS>{title}</TitleXS>
      <FormRow>
        <FormField>
          <label style={{ fontFamily: "Nunito", fontWeight: 700 }}>Логин</label>
          <Input {...form.register("login")} />
          {form.errors.login && (
            <ErrorText>{form.errors.login.message}</ErrorText>
          )}
        </FormField>
        {!isEditing && (
          <FormField>
            <label style={{ fontFamily: "Nunito", fontWeight: 700 }}>
              Пароль
            </label>
            <Input type="password" {...form.register("password")} />
            {form.errors.password && (
              <ErrorText>{form.errors.password.message}</ErrorText>
            )}
          </FormField>
        )}
      </FormRow>
      <FormRow>
        <FormField>
          <label style={{ fontFamily: "Nunito", fontWeight: 700 }}>Имя</label>
          <Input {...form.register("firstname")} />
          {form.errors.firstname && (
            <ErrorText>{form.errors.firstname.message}</ErrorText>
          )}
        </FormField>
        <FormField>
          <label style={{ fontFamily: "Nunito", fontWeight: 700 }}>
            Фамилия
          </label>
          <Input {...form.register("lastname")} />
          {form.errors.lastname && (
            <ErrorText>{form.errors.lastname.message}</ErrorText>
          )}
        </FormField>
        <FormField>
          <label style={{ fontFamily: "Nunito", fontWeight: 700 }}>
            Отчество
          </label>
          <Input {...form.register("patronymic")} />
          {form.errors.patronymic && (
            <ErrorText>{form.errors.patronymic.message}</ErrorText>
          )}
        </FormField>
      </FormRow>
      <FormRow>
        <FormField>
          <label style={{ fontFamily: "Nunito", fontWeight: 700 }}>
            Телефон
          </label>
          <Input {...form.register("phone")} />
          {form.errors.phone && (
            <ErrorText>{form.errors.phone.message}</ErrorText>
          )}
        </FormField>
        <FormField>
          <label style={{ fontFamily: "Nunito", fontWeight: 700 }}>Роль</label>
          <ComboBox
            options={[
              { label: "Админ", value: "admin" },
              { label: "Клиент", value: "customer" },
            ]}
            onChange={(value) => form.setData({ role: value })}
            value={form.data.role}
          />
          {form.errors.role && (
            <ErrorText>{form.errors.role.message}</ErrorText>
          )}
        </FormField>
      </FormRow>
      <RowWrapper>
        <Button
          variant={"primary"}
          onClick={handleSubmit}
          disabled={!form.isValid}
        >
          {submitLabel}
        </Button>
        <Button variant="border" onClick={onCancel}>
          Отмена
        </Button>
      </RowWrapper>
    </FormWrapper>
  );
};
