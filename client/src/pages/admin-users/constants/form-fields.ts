export const USER_FORM_FIELDS = [
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
  [{ name: "password", label: "Пароль", type: "password" }],
] as const;
