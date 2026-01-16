import { DataTable } from "@/feat";
import type { ShortProduct } from "@/lib/api/admin/types";

interface ProductTableProps {
  data?: ShortProduct[];
  onSelect: (value: ShortProduct) => void;
}

export const ProductTable = ({ data, onSelect }: ProductTableProps) => (
  <DataTable
    data={data}
    onSelect={(value) => onSelect(value as ShortProduct)}
  />
);
