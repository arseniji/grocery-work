import { DataTable } from "@/feat";
import type { ShortOrder } from "@/lib/api/admin/types";

interface OrderTableProps {
  data?: ShortOrder[];
  onSelect: (value: ShortOrder) => void;
}

export const OrderTable = ({ data, onSelect }: OrderTableProps) => (
  <DataTable data={data} onSelect={(value) => onSelect(value as ShortOrder)} />
);
