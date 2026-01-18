import { DataTable } from "@/feat";
import type { ShortUser } from "@/lib/api/admin/types";

interface UserTableProps {
  data?: ShortUser[];
  onSelect: (value: ShortUser) => void;
}

export const UserTable = ({ data, onSelect }: UserTableProps) => (
  <DataTable data={data} onSelect={(value) => onSelect(value as ShortUser)} />
);
