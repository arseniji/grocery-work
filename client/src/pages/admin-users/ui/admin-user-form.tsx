import { ObjectSchema } from "@/lib/validators/base-schemas/object-schema";
import { AdminForm } from "@/shared/ui/admin-form";
import { USER_FORM_FIELDS } from "../constants/form-fields";

interface AdminUserFormProps {
  schema: ObjectSchema<any>;
  initialValues?: Record<string, any>;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  title: string;
  submitLabel: string;
}

export const AdminUserForm = ({
  schema,
  initialValues = {},
  onSubmit,
  onCancel,
  title,
  submitLabel,
}: AdminUserFormProps) => (
  <AdminForm
    schema={schema}
    fields={USER_FORM_FIELDS}
    initialValues={initialValues}
    onSubmit={onSubmit}
    onCancel={onCancel}
    title={title}
    submitLabel={submitLabel}
  />
);
