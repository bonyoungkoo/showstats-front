"use client";

import { useState, useEffect } from "react";
import { PlayerCard, PlayersResponse } from "@/types/player";
import { DataTableServer } from "@/components/ui/data-table-server";
import { createColumns } from "./players-columns";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { SortingState, ColumnFiltersState } from "@tanstack/react-table";
import CompareSheet from "./CompareSheet";
import CompareDialog from "./CompareDialog";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  PlayerCardSearchFilters,
  playerCardFilterKeys,
} from "@/types/player-card-filters";
import { useFilterStore } from "@/lib/filter-store";
import { restoreFilterState } from "@/lib/filter-persistence";
import { toast } from "sonner";

export default function PlayersClient() {
  const [players, setPlayers] = useState<PlayerCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [pageCount, setPageCount] = useState(0);

  // Zustand 스토어에서 상태 가져오기
  const {
    pitchStats,
    statRanges,
    columnFilters,
    sorting,
    currentPage,
    pageSize,
    setColumnFilters,
    setSorting,
    setCurrentPage,
    setPageSize,
    resetAll,
  } = useFilterStore();

  const [compareCandidates, setCompareCandidates] = useState<PlayerCard[]>([]);
  const [compareDialogOpen, setCompareDialogOpen] = useState(false);

  // 선수비교 후보에 추가
  const handleAddToCompare = (player: PlayerCard) => {
    // 2명 제한 확인
    if (compareCandidates.length >= 2) {
      toast.error("최대 2명까지만 비교할 수 있습니다.");
      return;
    }

    // 이미 추가된 선수인지 확인
    if (compareCandidates.some((candidate) => candidate.uuid === player.uuid)) {
      toast.warning("이미 비교 목록에 추가된 선수입니다.");
      return;
    }

    setCompareCandidates((prev) => [...prev, player]);
    toast.success(`${player.name}이(가) 선수 비교에 추가되었습니다.`);
  };

  // 선수비교 후보에서 제거
  const handleRemoveFromCompare = (playerId: string) => {
    setCompareCandidates((prev) =>
      prev.filter((player) => player.uuid !== playerId)
    );
  };

  // 선수비교 후보 전체 초기화
  const handleClearCompare = () => {
    setCompareCandidates([]);
  };

  // 선수비교 다이얼로그 열기
  const handleCompare = () => {
    setCompareDialogOpen(true);
  };

  // 컬럼 생성
  const columns = createColumns(handleAddToCompare, compareCandidates);

  const buildFilters = (
    filters: ColumnFiltersState,
    validKeys: (keyof PlayerCardSearchFilters)[],
    pitchStatsData: typeof pitchStats = pitchStats,
    statRangesData: typeof statRanges = statRanges
  ): PlayerCardSearchFilters => {
    const result = filters.reduce((acc, filter) => {
      if (validKeys.includes(filter.id as keyof PlayerCardSearchFilters)) {
        const key = filter.id as keyof PlayerCardSearchFilters;

        // 구종 필터링의 경우 문자열 배열을 객체 배열로 변환
        if (key === "pitches" && Array.isArray(filter.value)) {
          acc[key] = filter.value.map((pitchName: string) => {
            const stats = pitchStatsData[pitchName];
            return {
              name: pitchName,
              ...(stats && {
                speed: stats.speed,
                control: stats.control,
                movement: stats.movement,
              }),
            };
          }) as PlayerCardSearchFilters[typeof key];
        } else {
          (acc[key] as unknown) = filter.value;
        }
      }
      return acc;
    }, {} as Partial<PlayerCardSearchFilters>);

    // 능력치 범위를 개별 필터로 추가 (batting_stats, fielding_stats 등은 제외)
    Object.entries(statRangesData).forEach(([statName, range]) => {
      // 능력치 그룹 필드가 아닌 개별 능력치만 추가
      if (
        ![
          "batting_stats",
          "fielding_stats",
          "baserunning_stats",
          "pitching_stats",
        ].includes(statName as string)
      ) {
        (result as Record<string, typeof range>)[statName] = range;
      }
    });

    return result as PlayerCardSearchFilters;
  };

  const fetchPlayers = async ({
    page = 1,
    limit = 25,
    sortField,
    sortOrder = "desc",
    filters = {} as PlayerCardSearchFilters,
  }: {
    page?: number;
    limit?: number;
    sortField?: string;
    sortOrder?: "asc" | "desc";
    filters?: PlayerCardSearchFilters;
  }) => {
    console.log("filters", filters);
    console.log("sortField", sortField);
    console.log("sortOrder", sortOrder);
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/player-cards/filter`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            page,
            limit,
            sort: sortField,
            order: sortOrder,
            filters,
          }),
        }
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
    // 상세 페이지에서 돌아온 경우 저장된 필터 상태 복원
    const savedState = restoreFilterState();

    if (savedState) {
      console.log("복원된 상태:", savedState);
      // 저장된 상태가 있으면 복원하고 즉시 데이터 요청
      if (savedState.columnFilters) setColumnFilters(savedState.columnFilters);
      if (savedState.sorting && savedState.sorting.length > 0) {
        setSorting(savedState.sorting);
      } else {
        // 정렬 상태가 없으면 기본 정렬 설정
        setSorting([{ id: "ovr", desc: true }]);
      }
      if (savedState.currentPage) setCurrentPage(savedState.currentPage);
      if (savedState.pageSize) setPageSize(savedState.pageSize);

      // 복원된 상태로 즉시 데이터 요청
      const sortField = savedState.sorting?.[0]?.id || "ovr";
      const sortOrder = savedState.sorting?.[0]?.desc ? "desc" : "desc"; // 기본값을 desc로 설정
      console.log("복원된 정렬:", {
        sortField,
        sortOrder,
        sorting: savedState.sorting,
      });

      // 저장된 pitchStats와 statRanges가 있으면 Zustand 스토어에 복원
      if (savedState.pitchStats) {
        Object.entries(savedState.pitchStats).forEach(([pitchName, stats]) => {
          Object.entries(stats).forEach(([stat, value]) => {
            if (stat === "speed" || stat === "control" || stat === "movement") {
              useFilterStore
                .getState()
                .updatePitchStat(
                  pitchName,
                  stat as "speed" | "control" | "movement",
                  value as [number, number]
                );
            }
          });
        });
      }

      if (savedState.statRanges) {
        Object.entries(savedState.statRanges).forEach(([statName, range]) => {
          useFilterStore
            .getState()
            .updateStatRange(statName, range as [number, number]);
        });
      }

      const filters = buildFilters(
        savedState.columnFilters || [],
        playerCardFilterKeys,
        savedState.pitchStats || {},
        savedState.statRanges || {}
      );

      fetchPlayers({
        page: savedState.currentPage || 1,
        limit: savedState.pageSize || 25,
        sortField,
        sortOrder,
        filters,
      });
    } else {
      // 저장된 상태가 없으면 초기 상태로 요청 (기본 정렬: ovr desc)
      fetchPlayers({
        page: 1,
        limit: 25,
        sortField: "ovr",
        sortOrder: "desc",
      });
    }
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const sortField = sorting.length > 0 ? sorting[0].id : undefined;
    const sortOrder =
      sorting.length > 0 ? (sorting[0].desc ? "desc" : "asc") : "desc";
    const filters = buildFilters(
      columnFilters,
      playerCardFilterKeys,
      pitchStats,
      statRanges
    );

    fetchPlayers({
      page,
      limit: pageSize,
      sortField,
      sortOrder,
      filters,
    });
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
    const sortField = sorting.length > 0 ? sorting[0].id : undefined;
    const sortOrder =
      sorting.length > 0 ? (sorting[0].desc ? "desc" : "asc") : "desc";
    const filters = buildFilters(
      columnFilters,
      playerCardFilterKeys,
      pitchStats,
      statRanges
    );

    fetchPlayers({
      page: 1,
      limit: newPageSize,
      sortField,
      sortOrder,
      filters,
    });
  };

  const handleSortingChange = (newSorting: SortingState) => {
    setSorting(newSorting);
    const sortField = newSorting.length > 0 ? newSorting[0].id : undefined;
    const sortOrder =
      newSorting.length > 0 ? (newSorting[0].desc ? "desc" : "asc") : "desc";
    const filters = buildFilters(
      columnFilters,
      playerCardFilterKeys,
      pitchStats,
      statRanges
    );

    fetchPlayers({
      page: currentPage,
      limit: pageSize,
      sortField,
      sortOrder,
      filters,
    });
  };

  const handleColumnFiltersChange = (newFilters: ColumnFiltersState) => {
    setColumnFilters(newFilters);
  };

  const handleSearch = () => {
    const sortField = sorting.length > 0 ? sorting[0].id : undefined;
    const sortOrder =
      sorting.length > 0 ? (sorting[0].desc ? "desc" : "asc") : "desc";
    const filters = buildFilters(
      columnFilters,
      playerCardFilterKeys,
      pitchStats,
      statRanges
    );

    fetchPlayers({
      page: 1,
      limit: pageSize,
      sortField,
      sortOrder,
      filters,
    });
  };

  const handleReset = () => {
    // 모든 필터 상태 초기화 (Zustand 스토어에서 관리)
    resetAll();

    // 서버로 전체검색 요청
    fetchPlayers({
      page: 1,
      limit: 25, // 초기 페이지 크기
    });
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
        onSearch={handleSearch}
        onReset={handleReset}
        sorting={sorting}
        columnFilters={columnFilters}
      />

      {/* 선수비교 시트 */}
      {compareCandidates.length > 0 && (
        <Sheet>
          <SheetTrigger asChild>
            <Button className="fixed bottom-4 right-4 z-50 shadow-lg rounded-full px-3 py-2 bg-primary hover:bg-primary/90">
              👥 선수 비교 ({compareCandidates.length})
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[600px]">
            <SheetTitle className="sr-only">선수 비교 후보</SheetTitle>
            <CompareSheet
              players={compareCandidates}
              onRemovePlayer={handleRemoveFromCompare}
              onClearAll={handleClearCompare}
              onCompare={handleCompare}
            />
          </SheetContent>
        </Sheet>
      )}

      {/* 선수비교 다이얼로그 */}
      <CompareDialog
        open={compareDialogOpen}
        onOpenChange={setCompareDialogOpen}
        players={compareCandidates}
      />
    </>
  );
}
