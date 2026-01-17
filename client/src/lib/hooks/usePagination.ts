import { useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router";

export const usePagination = (basePath: string) => {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const updateParams = useCallback(
    (updates: Record<string, string | undefined>) => {
      const newParams = new URLSearchParams(params);
      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          newParams.set(key, value);
        } else {
          newParams.delete(key);
        }
      });
      navigate(`${basePath}?${newParams.toString()}`);
    },
    [navigate, params, basePath],
  );

  const handleCategory = useCallback(
    (category: string) => {
      if (params.has("category")) {
        updateParams({ category: undefined });
        return;
      }
      updateParams({ category });
    },
    [updateParams, params],
  );

  const handlePrevPage = useCallback(
    (page: number) => {
      if (page > 1) {
        updateParams({ page: (page - 1).toString() });
      }
    },
    [updateParams],
  );

  const handleNextPage = useCallback(
    (page: number, hasNext: boolean) => {
      if (hasNext) {
        updateParams({ page: (page + 1).toString() });
      }
    },
    [updateParams],
  );

  const handleSort = useCallback(
    (sort?: string) => {
      updateParams({ sort });
    },
    [updateParams],
  );

  const handleSearch = useCallback(
    (query?: string) => {
      updateParams({ search: query });
    },
    [updateParams],
  );

  return {
    handlePrevPage,
    handleNextPage,
    handleSort,
    handleSearch,
    handleCategory,
  };
};
