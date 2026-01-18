import { useState } from "react";
import { Container, Table, Th, Td, Tr } from "./styled";
import { flattenKeys } from "@/lib/commons";

interface DataTableProps {
  data?: Record<string, any>[];
  keys?: Record<string, string>;
  onSelect?: (value: Record<string, any>) => void;
}

const getValueByPath = (obj: any, path: string): any => {
  return path.split(".").reduce((current, key) => current && current[key], obj);
};

export const DataTable = ({ data, keys, onSelect }: DataTableProps) => {
  const [selectedIndex, setSelectedIndex] = useState<number>();

  if (!data || data.length === 0) {
    return <Container>No data available</Container>;
  }

  let tableKeys: string[];
  if (keys) {
    tableKeys = Object.keys(keys);
  } else {
    tableKeys = flattenKeys(data[0]).filter(
      (key) => !key.includes("metadata") && !key.includes("success")
    );
  }

  const handleSelect = (value: Record<string, any>, index: number) => {
    if (!onSelect) return;
    onSelect(value);
    setSelectedIndex(index);
  };

  return (
    <Container>
      <Table>
        <thead>
          <tr>
            {tableKeys.map((key) => (
              <Th key={key}>{keys ? keys[key] : key}</Th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <Tr
              key={index}
              onClick={() => handleSelect(row, index)}
              isActive={selectedIndex === index}
            >
              {tableKeys.map((key) => (
                <Td key={key}>{String(getValueByPath(row, key))}</Td>
              ))}
            </Tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};
