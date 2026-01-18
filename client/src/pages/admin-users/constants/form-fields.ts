interface FormFieldConfig {
  name: string;
  label: string;
  type: string;
}

export const USER_FORM_FIELDS: FormFieldConfig[][] = [
  [
    { name: "login", label: "Логин", type: "text" },
    { name: "firstname", label: "Имя", type: "text" },
  ],
  [
    { name: "lastname", label: "Фамилия", type: "text" },
    { name: "patronymic", label: "Отчество", type: "text" },
  ],
  [
    { name: "phone", label: "Телефон", type: "tel" },
    { name: "role", label: "Роль", type: "text" },
  ],
];

export const USER_FORM_FIELDS_ADD: FormFieldConfig[][] = [
  ...USER_FORM_FIELDS,
  [{ name: "password", label: "Пароль", type: "password" }],
];
