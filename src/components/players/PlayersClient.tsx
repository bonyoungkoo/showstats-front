"use client";

import { useState, useEffect, useCallback } from "react";
import { PlayerCard, PlayersResponse } from "@/types/player";
import { DataTableServer } from "@/components/ui/data-table-server";
import { createColumns } from "./players-columns";
import { Skeleton } from "@/components/ui/skeleton";
import { SortingState, ColumnFiltersState } from "@tanstack/react-table";
import PlayerComparisonDialog from "./PlayerComparisonDialog";

export default function PlayersClient() {
  const [players, setPlayers] = useState<PlayerCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [totalCount, setTotalCount] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(
    null
  );
  const [comparisonDialogOpen, setComparisonDialogOpen] = useState(false);
  const [selectedPlayerForComparison, setSelectedPlayerForComparison] =
    useState<PlayerCard | null>(null);

  // 선수비교 팝업 열기
  const handleCompareClick = (player: PlayerCard) => {
    setSelectedPlayerForComparison(player);
    setComparisonDialogOpen(true);
  };

  // 컬럼 생성
  const columns = createColumns(handleCompareClick);

  const buildFilters = (filters: ColumnFiltersState) => {
    return filters.reduce(
      (acc, filter) => {
        // card 컬럼의 필터는 name으로 매핑 (서버 API에서 name으로 검색)
        if (filter.id === "card") {
          acc["name"] = filter.value as string;
        } else if (filter.id === "bat_hand") {
          // 타격 필터는 배열로 처리
          acc["bat_hand"] = Array.isArray(filter.value)
            ? filter.value.join(",")
            : (filter.value as string);
        } else if (filter.id === "display_position") {
          // 포지션 필터는 배열로 처리
          acc["display_position"] = Array.isArray(filter.value)
            ? filter.value.join(",")
            : (filter.value as string);
        } else if (filter.id === "display_secondary_positions") {
          // 서브 포지션 필터는 배열로 처리
          acc["display_secondary_positions"] = Array.isArray(filter.value)
            ? filter.value.join(",")
            : (filter.value as string);
        } else {
          acc[filter.id] = filter.value as string;
        }
        return acc;
      },
      {} as Record<string, string>
    );
  };

  const fetchPlayers = async (
    page: number = 1,
    limit: number = 25,
    sortField?: string,
    sortOrder: "asc" | "desc" = "desc",
    filters: Record<string, string> = {}
  ) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...filters,
      });

      if (sortField) {
        params.append("sort", sortField);
        params.append("order", sortOrder);
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/player-cards/search?${params}`
      );
      const data: PlayersResponse = await response.json();

      setPlayers(data.data);
      setTotalCount(data.total);
      setPageCount(data.totalPages);
      setCurrentPage(data.page);
    } catch (error) {
      console.error("선수 데이터를 불러오는 중 오류가 발생했습니다:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayers(currentPage, pageSize);

    // 컴포넌트 언마운트 시 타이머 정리
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const sortField = sorting.length > 0 ? sorting[0].id : undefined;
    const sortOrder =
      sorting.length > 0 ? (sorting[0].desc ? "desc" : "asc") : "desc";
    const filters = buildFilters(columnFilters);

    fetchPlayers(page, pageSize, sortField, sortOrder, filters);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
    const sortField = sorting.length > 0 ? sorting[0].id : undefined;
    const sortOrder =
      sorting.length > 0 ? (sorting[0].desc ? "desc" : "asc") : "desc";
    const filters = buildFilters(columnFilters);

    fetchPlayers(1, newPageSize, sortField, sortOrder, filters);
  };

  const handleSortingChange = (newSorting: SortingState) => {
    setSorting(newSorting);
    const sortField = newSorting.length > 0 ? newSorting[0].id : undefined;
    const sortOrder =
      newSorting.length > 0 ? (newSorting[0].desc ? "desc" : "asc") : "desc";
    const filters = buildFilters(columnFilters);

    fetchPlayers(currentPage, pageSize, sortField, sortOrder, filters);
  };

  const debouncedSearch = useCallback(
    (newFilters: ColumnFiltersState) => {
      const sortField = sorting.length > 0 ? sorting[0].id : undefined;
      const sortOrder =
        sorting.length > 0 ? (sorting[0].desc ? "desc" : "asc") : "desc";
      const filters = buildFilters(newFilters);

      fetchPlayers(1, pageSize, sortField, sortOrder, filters);
    },
    [sorting, pageSize]
  );

  const handleColumnFiltersChange = (newFilters: ColumnFiltersState) => {
    setColumnFilters(newFilters);

    // 이전 타이머가 있다면 취소
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // 새로운 타이머 설정 (500ms 후에 검색 실행)
    const timeout = setTimeout(() => {
      debouncedSearch(newFilters);
    }, 500);

    setSearchTimeout(timeout);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="rounded-md border overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="text-center p-4">
                  <Skeleton className="h-4 w-16 mx-auto" />
                </th>
                <th className="text-center p-4">
                  <Skeleton className="h-4 w-12 mx-auto" />
                </th>
                <th className="text-center p-4">
                  <Skeleton className="h-4 w-12 mx-auto" />
                </th>
                <th className="text-center p-4">
                  <Skeleton className="h-4 w-12 mx-auto" />
                </th>
                <th className="text-center p-4">
                  <Skeleton className="h-4 w-12 mx-auto" />
                </th>
                <th className="text-center p-4">
                  <Skeleton className="h-4 w-20 mx-auto" />
                </th>
                <th className="text-center p-4">
                  <Skeleton className="h-4 w-8 mx-auto" />
                </th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 10 }).map((_, i) => (
                <tr key={i} className="border-t">
                  <td className="text-center p-4">
                    <div className="flex items-center justify-center gap-2">
                      <Skeleton className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
                      <Skeleton className="h-4 w-8" />
                    </div>
                  </td>
                  <td className="text-center p-4">
                    <div className="flex items-center gap-3">
                      <Skeleton
                        className="w-8 sm:w-10 md:w-12"
                        style={{ aspectRatio: "40/56.38" }}
                      />
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-4 w-8" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                  </td>
                  <td className="text-center p-4">
                    <div className="flex justify-center">
                      <Skeleton className="h-5 w-8" />
                    </div>
                  </td>
                  <td className="text-center p-4">
                    <div className="flex justify-center">
                      <Skeleton className="h-5 w-8" />
                    </div>
                  </td>
                  <td className="text-center p-4">
                    <div className="flex justify-center">
                      <Skeleton className="h-5 w-12" />
                    </div>
                  </td>
                  <td className="text-center p-4">
                    <div className="flex justify-center">
                      <Skeleton className="h-5 w-16" />
                    </div>
                  </td>
                  <td className="text-center p-4">
                    <div className="flex justify-center">
                      <Skeleton className="h-8 w-8" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // 데이터가 로딩 중이거나 유효하지 않으면 로딩 상태를 보여줍니다
  if (loading || !Array.isArray(players)) {
    return (
      <div className="space-y-4">
        <div className="rounded-md border overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="text-center p-4">
                  <Skeleton className="h-4 w-16 mx-auto" />
                </th>
                <th className="text-center p-4">
                  <Skeleton className="h-4 w-12 mx-auto" />
                </th>
                <th className="text-center p-4">
                  <Skeleton className="h-4 w-12 mx-auto" />
                </th>
                <th className="text-center p-4">
                  <Skeleton className="h-4 w-12 mx-auto" />
                </th>
                <th className="text-center p-4">
                  <Skeleton className="h-4 w-12 mx-auto" />
                </th>
                <th className="text-center p-4">
                  <Skeleton className="h-4 w-20 mx-auto" />
                </th>
                <th className="text-center p-4">
                  <Skeleton className="h-4 w-8 mx-auto" />
                </th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 10 }).map((_, i) => (
                <tr key={i} className="border-t">
                  <td className="text-center p-4">
                    <div className="flex items-center justify-center gap-2">
                      <Skeleton className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
                      <Skeleton className="h-4 w-8" />
                    </div>
                  </td>
                  <td className="text-center p-4">
                    <div className="flex items-center gap-3">
                      <Skeleton
                        className="w-8 sm:w-10 md:w-12"
                        style={{ aspectRatio: "40/56.38" }}
                      />
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-4 w-8" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                  </td>
                  <td className="text-center p-4">
                    <div className="flex justify-center">
                      <Skeleton className="h-5 w-8" />
                    </div>
                  </td>
                  <td className="text-center p-4">
                    <div className="flex justify-center">
                      <Skeleton className="h-5 w-8" />
                    </div>
                  </td>
                  <td className="text-center p-4">
                    <div className="flex justify-center">
                      <Skeleton className="h-5 w-12" />
                    </div>
                  </td>
                  <td className="text-center p-4">
                    <div className="flex justify-center">
                      <Skeleton className="h-5 w-16" />
                    </div>
                  </td>
                  <td className="text-center p-4">
                    <div className="flex justify-center">
                      <Skeleton className="h-8 w-8" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <>
      <DataTableServer
        columns={columns}
        data={players}
        pageCount={pageCount}
        currentPage={currentPage}
        pageSize={pageSize}
        totalCount={totalCount}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        onSortingChange={handleSortingChange}
        onColumnFiltersChange={handleColumnFiltersChange}
        sorting={sorting}
        columnFilters={columnFilters}
      />

      <PlayerComparisonDialog
        open={comparisonDialogOpen}
        onOpenChange={setComparisonDialogOpen}
        selectedPlayer={selectedPlayerForComparison}
      />
    </>
  );
}
