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

interface AdminProductFormProps {
  schema: ObjectSchema<any>;
  initialValues?: Record<string, any>;
  onSubmit: (data: any) => void;
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
    onSubmit(form.data);
  };

  return (
    <FormWrapper>
      <TitleXS>{title}</TitleXS>
      <FormRow>
        <FormField>
          <label style={{ fontFamily: "Nunito", fontWeight: 700 }}>
            Название продукта
          </label>
          <Input {...form.register("product_name")} />
          {form.errors.product_name && (
            <ErrorText>{form.errors.product_name.message}</ErrorText>
          )}
        </FormField>
        <FormField>
          <label style={{ fontFamily: "Nunito", fontWeight: 700 }}>Цена</label>
          <Input type="number" {...form.register("price")} />
          {form.errors.price && (
            <ErrorText>{form.errors.price.message}</ErrorText>
          )}
        </FormField>
      </FormRow>
      <FormRow>
        <FormField>
          <label style={{ fontFamily: "Nunito", fontWeight: 700 }}>
            Рейтинг
          </label>
          <Input {...form.register("rating")} />
          {form.errors.rating && (
            <ErrorText>{form.errors.rating.message}</ErrorText>
          )}
        </FormField>
        <FormField>
          <label style={{ fontFamily: "Nunito", fontWeight: 700 }}>
            Категория
          </label>
          <Input {...form.register("category")} />
          {form.errors.category && (
            <ErrorText>{form.errors.category.message}</ErrorText>
          )}
        </FormField>
        <FormField>
          <label style={{ fontFamily: "Nunito", fontWeight: 700 }}>
            Единица измерения
          </label>
          <Input {...form.register("measurement_unit")} />
          {form.errors.measurement_unit && (
            <ErrorText>{form.errors.measurement_unit.message}</ErrorText>
          )}
        </FormField>
      </FormRow>
      <FormRow>
        <FormField>
          <label style={{ fontFamily: "Nunito", fontWeight: 700 }}>
            Количество
          </label>
          <Input type="number" {...form.register("quantity")} />
          {form.errors.quantity && (
            <ErrorText>{form.errors.quantity.message}</ErrorText>
          )}
        </FormField>
      </FormRow>
      <FormRow>
        <FormField>
          <label style={{ fontFamily: "Nunito", fontWeight: 700 }}>
            Описание
          </label>
          <Input {...form.register("description")} />
          {form.errors.description && (
            <ErrorText>{form.errors.description.message}</ErrorText>
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
