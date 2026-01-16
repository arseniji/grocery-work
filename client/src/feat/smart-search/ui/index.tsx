import { useState } from "react";
import {
  Container,
  PlusWrapper,
  Query,
  QueryContainer,
  SearchContainer,
} from "./styled";
import { ComboBox, Input } from "@/shared/ui";
import type { ComboBoxOption } from "@/shared/ui/combobox";
import { BodyM } from "@/shared/ui/captions";
import { CrossIcon, PlusIcon } from "@/shared/icons";

interface SmartSearchProps {
  options: ComboBoxOption[];
  onChange: (query: string) => void;
  initialValue?: string;
}

export const SmartSearch = ({
  options,
  onChange,
  initialValue,
}: SmartSearchProps) => {
  const [search, setSearch] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string>("");
  const [query, setQuery] = useState<string>(initialValue || "");
  const [filtered, setFiltered] = useState<ComboBoxOption[]>(options);

  const filterOptions = (newQ: string) => {
    const opt = options.filter((opt) => !newQ.includes(opt.value));
    console.log(opt);
    setFiltered(opt);
  };

  const handleAdd = () => {
    let newQ = `${search}:${searchValue}`;
    if (query) {
      newQ = `${query},${newQ}`;
    }
    filterOptions(newQ);
    setQuery(newQ);
    onChange(newQ);
    setSearchValue("");
  };

  const handleRemove = (q: string) => {
    const newQ = query
      .split(",")
      .filter((oldQ) => oldQ !== q)
      .join(",");
    filterOptions(newQ);
    setQuery(newQ);
    onChange(newQ);
  };

  return (
    <Container>
      <SearchContainer>
        <ComboBox
          width="150px"
          placeholder="Искать по:"
          options={filtered}
          onChange={setSearch}
          value={search}
        />
        <Input
          containerStyle={{
            minWidth: 100,
            padding: "8px 10px",
          }}
          placeholder="Значение:"
          onChange={setSearchValue}
          value={searchValue}
          onKeyDown={({ key }) => key === "Enter" && handleAdd()}
        />
        <PlusWrapper onClick={handleAdd}>
          <PlusIcon />
        </PlusWrapper>
      </SearchContainer>

      <QueryContainer>
        {query &&
          query.split(",").map((q) => (
            <Query key={q} onClick={() => handleRemove(q)}>
              <BodyM>{q}</BodyM>
              <CrossIcon />
            </Query>
          ))}
      </QueryContainer>
    </Container>
  );
};
