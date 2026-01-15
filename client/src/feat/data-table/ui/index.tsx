import { Container, Table, Th, Td } from "./styled";

interface DataTableProps {
  data?: Record<string, any>[];
  keys: Array<string>;
}

export const DataTable = ({ data, keys }: DataTableProps) => {
  if (!data || data.length === 0) {
    return <Container>No data available</Container>;
  }

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
            <tr key={index}>
              {keys.map((key) => (
                <Td key={key}>{String(row[key])}</Td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};
