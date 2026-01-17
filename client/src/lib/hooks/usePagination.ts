// client/src/lib/hooks/usePagination.ts
import { useCallback, useRef, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { manager } from "@/lib/command/command-manager";
import { FilterCommand } from "@/lib/command/entities/filter-command";

export const usePagination = (basePath: string) => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const commandRef = useRef<FilterCommand | null>(null);

  useEffect(() => {
    if (!commandRef.current) {
      commandRef.current = new FilterCommand(navigate, basePath);
      manager.add("filter", commandRef.current);
    }
  }, [navigate, basePath]);

  const handleCategory = useCallback(
    (category: string) => {
      const currentCategory = params.get("category");
      if (currentCategory === category) {
        manager.execute("filter", { key: "category", value: undefined });
      } else {
        manager.execute("filter", { key: "category", value: category });
      }
    },
    [params],
  );

  const handleSort = useCallback((sort?: string) => {
    manager.execute("filter", { key: "sort", value: sort });
  }, []);

  const handleSearch = useCallback((query?: string) => {
    manager.execute("filter", { key: "search", value: query });
  }, []);

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

  return {
    handlePrevPage,
    handleNextPage,
    handleSort,
    handleSearch,
    handleCategory,
  };
};
