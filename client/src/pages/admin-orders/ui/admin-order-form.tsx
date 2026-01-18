import { ObjectSchema } from "@/lib/validators/base-schemas/object-schema";
import { AdminForm } from "@/shared/ui/admin-form";
import type { AdminOrderAddType } from "@/entities/order/schemas";
import { ORDER_FORM_FIELDS } from "../constants/form-fields";

interface AdminOrderFormProps {
  schema: ObjectSchema<any>;
  initialValues?: Partial<AdminOrderAddType>;
  onSubmit: (data: AdminOrderAddType) => void;
  onCancel: () => void;
  title: string;
  submitLabel: string;
}

export const AdminOrderForm = ({
  schema,
  initialValues = {},
  onSubmit,
  onCancel,
  title,
  submitLabel,
}: AdminOrderFormProps) => (
  <AdminForm
    schema={schema}
    fields={ORDER_FORM_FIELDS}
    initialValues={initialValues}
    onSubmit={onSubmit}
    onCancel={onCancel}
    title={title}
    submitLabel={submitLabel}
  />
);
