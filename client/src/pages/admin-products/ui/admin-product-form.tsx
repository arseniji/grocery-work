import { ObjectSchema } from "@/lib/validators/base-schemas/object-schema";
import { AdminForm } from "@/shared/ui/admin-form";
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
}: AdminProductFormProps) => (
  <AdminForm
    schema={schema}
    fields={PRODUCT_FORM_FIELDS}
    initialValues={initialValues}
    onSubmit={onSubmit}
    onCancel={onCancel}
    title={title}
    submitLabel={submitLabel}
  />
);
