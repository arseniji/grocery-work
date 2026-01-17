import { Button } from "@/shared/ui";
import { Nav } from "./styled";

export const AdminNav = () => {
  return (
    <Nav>
      <Button as="link" href="/admin/users">
        Пользователи
      </Button>
      <Button as="link" href="/admin/products">
        Продукты
      </Button>
    </Nav>
  );
};
