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

interface SelectOption {
  value: string;
  label: string;
}

interface FormFieldConfig {
  name: string;
  label: string;
  type: string;
  options?: SelectOption[];
}

interface AdminFormProps {
  schema: ObjectSchema<any>;
  fields: FormFieldConfig[][];
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
          {row.map(({ name, label, type, options }) => {
            const registered = form.register(name);
            return (
              <FormField key={name}>
                <label style={{ fontFamily: "Nunito", fontWeight: 700 }}>
                  {label}
                </label>
                {type === "select" && options ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "10px 20px",
                      borderRadius: "5px",
                      border: "1px solid #000",
                      width: "100%",
                      minWidth: "200px",
                    }}
                  >
                    <select
                      name={registered.name}
                      value={registered.value || options[0]?.value}
                      onChange={(e: { target: { value: string } }) => registered.onChange(e.target.value)}
                      onBlur={registered.onBlur}
                      style={{
                        width: "100%",
                        border: "none",
                        outline: "none",
                        background: "transparent",
                        cursor: "pointer",
                        fontFamily: "Nunito",
                        fontWeight: 700,
                        fontSize: "20px",
                        lineHeight: "28px",
                      }}
                    >
                      {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <Input type={type} {...registered} />
                )}
                {form.errors[name] && (
                  <ErrorText>{form.errors[name].message}</ErrorText>
                )}
              </FormField>
            );
          })}
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
