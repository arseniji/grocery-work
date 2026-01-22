import { ObjectSchema } from "@/lib/validators/base-schemas/object-schema";
import { AdminForm } from "@/shared/ui/admin-form";
import {
  USER_FORM_FIELDS,
  USER_FORM_FIELDS_ADD,
} from "../constants/form-fields.ts";

interface AdminUserFormProps {
  addSchema: ObjectSchema<any>;
  editSchema: ObjectSchema<any>;
  initialValues?: Record<string, any>;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  title: string;
  submitLabel: string;
  type: "edit" | "add";
}

export const AdminUserForm = ({
  addSchema,
  editSchema,
  initialValues = {},
  onSubmit,
  onCancel,
  title,
  submitLabel,
  type,
}: AdminUserFormProps) => (
  <AdminForm
    schema={type === "add" ? addSchema : editSchema}
    fields={type === "add" ? USER_FORM_FIELDS_ADD : USER_FORM_FIELDS}
    initialValues={initialValues}
    onSubmit={onSubmit}
    onCancel={onCancel}
    title={title}
    submitLabel={submitLabel}
  />
);
