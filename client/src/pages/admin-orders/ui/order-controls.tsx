import { ColWrapper, ControlsWrapper, RowWrapper } from "./styled.ts";
import { SmartSearch, ExportButtons, ImportButtons } from "@/feat";
import { Button, ComboBox } from "@/shared/ui";
import { getSortingOptions } from "../utils";
import { getSearchOptions } from "../utils/get-search-options";
import type { GetOrdersRes } from "@/lib/api/admin/types";

interface OrderControlsProps {
  data?: GetOrdersRes;
  search?: string;
  sort?: string;
  onAdd: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onSort: (sort?: string) => void;
  onSearch: (query?: string) => void;
  selected: boolean;
}

export const OrderControls = ({
  data,
  search,
  sort,
  onAdd,
  onEdit,
  onDelete,
  onSort,
  onSearch,
  selected,
}: OrderControlsProps) => (
  <ControlsWrapper>
    <ColWrapper>
      <ComboBox
        placeholder="Сортировать по:"
        options={getSortingOptions(data?.orders?.at(0))}
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
      <RowWrapper>
        <ExportButtons type="orders" />
      </RowWrapper>
      <ImportButtons type="orders" />
    </ColWrapper>
    <SmartSearch
      initialValue={search}
      options={getSearchOptions(data?.orders?.at(0))}
      onChange={onSearch}
    />
  </ControlsWrapper>
);
