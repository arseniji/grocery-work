import { useForm } from "@/lib/hooks";
import { ObjectSchema } from "@/lib/validators/base-schemas/object-schema";
import { Button, Input } from "@/shared/ui";
import { TitleXS } from "@/shared/ui/captions";
import {
  ErrorText,
  FormField,
  FormRow,
  FormWrapper,
} from "@/shared/ui/styled.ts";

interface FormFieldConfig {
  name: string;
  label: string;
  type: string;
}

interface AdminFormProps {
  schema: ObjectSchema<any>;
  fields: readonly (readonly FormFieldConfig[])[];
  initialValues?: Record<string, any>;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  title: string;
  submitLabel: string;
}

export const AdminForm = ({
  schema,
  fields,
  initialValues = {},
  onSubmit,
  onCancel,
  title,
  submitLabel,
}: AdminFormProps) => {
  const form = useForm(schema, { defaultValues: initialValues });

  const handleSubmit = () => {
    if (!form.isValid) return;
    onSubmit(form.data);
  };

  return (
    <FormWrapper>
      <TitleXS>{title}</TitleXS>
      {fields.map((row, rowIndex) => (
        <FormRow key={rowIndex}>
          {row.map(({ name, label, type }) => (
            <FormField key={name}>
              <label style={{ fontFamily: "Nunito", fontWeight: 700 }}>
                {label}
              </label>
              <Input type={type} {...form.register(name)} />
              {form.errors[name] && (
                <ErrorText>{form.errors[name].message}</ErrorText>
              )}
            </FormField>
          ))}
        </FormRow>
      ))}
      <FormRow>
        <Button variant="border" onClick={onCancel}>
          Отмена
        </Button>
        <Button onClick={handleSubmit}>{submitLabel}</Button>
      </FormRow>
    </FormWrapper>
  );
};
