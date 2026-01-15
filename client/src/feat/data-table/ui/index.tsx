import { useState } from "react";
import { Container, Table, Th, Td, Tr } from "./styled";

interface DataTableProps {
  data?: Record<string, any>[];
  keys: Array<string>;
  onSelect?: (value: Record<string, any>) => void;
}

export const DataTable = ({ data, keys, onSelect }: DataTableProps) => {
  const [selectedIndex, setSelectedIndex] = useState<number>();

  if (!data || data.length === 0) {
    return <Container>No data available</Container>;
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
            {keys.map((key) => (
              <Th key={key}>{key}</Th>
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
              {keys.map((key) => (
                <Td key={key}>{String(row[key])}</Td>
              ))}
            </Tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};
