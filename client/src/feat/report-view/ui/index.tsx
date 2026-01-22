import { separateWorlds } from "@/lib/commons";
import {
  BLockContainer,
  BlockTitle,
  Container,
  ValueContainer,
  ValueName,
} from "./styled";
import { TextM } from "@/shared/ui/captions";
import { DataTable } from "@/feat/data-table";

interface ReportViewProps {
  data: Record<string, any>;
}

export const ReportView = ({ data }: ReportViewProps) => {
  return (
    <Container>
      {Object.keys(data).map((k) => {
        const name = separateWorlds(k);

        if (Array.isArray(data[k])) {
          return (
            <>
              <BlockTitle tab={0}>{name}</BlockTitle>
              <DataTable data={data[k]} />;
            </>
          );
        }

        if (typeof data[k] === "object") {
          return <ObjectBlock key={k} data={data[k]} name={name} tab={0} />;
        }

        return (
          <ValueBlock name={name} key={name + k} value={data[k]} tab={0} />
        );
      })}
    </Container>
  );
};

interface ObjectBlockProps {
  data: Record<string, any>;
  name: string;
  tab: number;
}

export const ObjectBlock = ({ data, name, tab }: ObjectBlockProps) => {
  return (
    <BLockContainer tab={tab}>
      <BlockTitle tab={tab}>{name}</BlockTitle>
      {Object.keys(data).map((k) => {
        const n = separateWorlds(k);

        if (Array.isArray(data[k])) {
          return (
            <>
              <BlockTitle tab={tab}>{n}</BlockTitle>
              <DataTable data={data[k]} />;
            </>
          );
        }

        if (typeof data[k] === "object") {
          return (
            <ObjectBlock key={name + k} data={data[k]} name={n} tab={tab + 1} />
          );
        }

        return (
          <ValueBlock name={n} key={name + k} value={data[k]} tab={tab + 1} />
        );
      })}
    </BLockContainer>
  );
};

interface ValueBlockProps {
  name: string;
  value: string | number;
  tab: number;
}

export const ValueBlock = ({ name, value, tab }: ValueBlockProps) => {
  return (
    <ValueContainer tab={tab}>
      <ValueName>{name}:</ValueName>
      <TextM>{value}</TextM>
    </ValueContainer>
  );
};
