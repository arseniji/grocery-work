import { ColWrapper, ControlsWrapper, RowWrapper } from "./styled";
import { SmartSearch } from "@/feat";
import { Button, ComboBox } from "@/shared/ui";
import { getSortingOptions } from "../utils";
import { getSearchOptions } from "../utils/get-search-options";
import type { GetProductsRes } from "@/lib/api/admin/types";

interface ProductControlsProps {
  data?: GetProductsRes;
  search?: string;
  sort?: string;
  onAdd: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onSort: (sort?: string) => void;
  onSearch: (query?: string) => void;
  selected: boolean;
}

export const ProductControls = ({
  data,
  search,
  sort,
  onAdd,
  onEdit,
  onDelete,
  onSort,
  onSearch,
  selected,
}: ProductControlsProps) => (
  <ControlsWrapper>
    <ColWrapper>
      <ComboBox
        placeholder="Сортировать по:"
        options={getSortingOptions(data?.products?.at(0))}
        onChange={onSort}
        value={sort}
      />

      <RowWrapper>
        <Button variant={"border"} onClick={onAdd}>
          Добавить
        </Button>
        <Button variant={"border"} disabled={!selected} onClick={onEdit}>
          Изменить
        </Button>
        <Button variant={"border"} disabled={!selected} onClick={onDelete}>
          Удалить
        </Button>
      </RowWrapper>
    </ColWrapper>
    <SmartSearch
      initialValue={search}
      options={getSearchOptions(data?.products?.at(0))}
      onChange={onSearch}
    />
  </ControlsWrapper>
);
