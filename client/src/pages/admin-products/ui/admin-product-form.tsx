import { useForm } from "@/lib/hooks";
import { ObjectSchema } from "@/lib/validators/base-schemas/object-schema";
import { Button, Input } from "@/shared/ui";
import { TitleXS } from "@/shared/ui/captions";
import {
  ErrorText,
  FormField,
  FormRow,
  FormWrapper,
  RowWrapper,
} from "./styled";
import type { AdminProductAddType } from "@/entities/product/schemas";
import { PRODUCT_FORM_FIELDS } from "../constants/form-fields";

interface AdminProductFormProps {
  schema: ObjectSchema<any>;
  initialValues?: Partial<AdminProductAddType>;
  onSubmit: (data: AdminProductAddType) => void;
  onCancel: () => void;
  title: string;
  submitLabel: string;
}

export const AdminProductForm = ({
  schema,
  initialValues = {},
  onSubmit,
  onCancel,
  title,
  submitLabel,
}: AdminProductFormProps) => {
  const form = useForm(schema, { defaultValues: initialValues });

  const handleSubmit = () => {
    if (!form.isValid) return;
    onSubmit(form.data as AdminProductAddType);
  };

  return (
    <FormWrapper>
      <TitleXS>{title}</TitleXS>
      {PRODUCT_FORM_FIELDS.map((row, rowIndex) => (
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
