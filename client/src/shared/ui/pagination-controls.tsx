import { memo } from "react";
import { PaginationContainer } from "./styled";
import { Button } from "./button";
import { TitleXS } from "./captions";

interface PaginationControlsProps {
  page: number;
  totalPages?: number;
  hasNext: boolean;
  onPrev: () => void;
  onNext: () => void;
}

export const PaginationControls = memo(
  ({ page, totalPages, hasNext, onPrev, onNext }: PaginationControlsProps) => (
    <PaginationContainer>
      {page > 1 && (
        <Button variant="border" onClick={onPrev}>
          Предыдущая
        </Button>
      )}

      {totalPages && (
        <TitleXS>
          {page} / {totalPages}
        </TitleXS>
      )}

      {hasNext && (
        <Button variant="border" onClick={onNext}>
          Следующая
        </Button>
      )}
    </PaginationContainer>
  )
);
