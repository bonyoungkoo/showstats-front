import { create } from "zustand";
import { ColumnFiltersState, SortingState } from "@tanstack/react-table";

export interface FilterState {
  // 구종 능력치 상태
  pitchStats: {
    [key: string]: {
      speed: [number, number];
      control: [number, number];
      movement: [number, number];
    };
  };

  // 신장 슬라이더 상태
  heightRange: [number, number];

  // 능력치 슬라이더 상태
  statRanges: {
    [key: string]: [number, number];
  };

  // 테이블 필터 상태
  columnFilters: ColumnFiltersState;
  sorting: SortingState;
  currentPage: number;
  pageSize: number;

  // 액션들
  setPitchStats: (pitchStats: {
    [key: string]: {
      speed: [number, number];
      control: [number, number];
      movement: [number, number];
    };
  }) => void;

  updatePitchStat: (
    pitchName: string,
    stat: "speed" | "control" | "movement",
    value: [number, number]
  ) => void;

  setHeightRange: (range: [number, number]) => void;

  setStatRanges: (statRanges: { [key: string]: [number, number] }) => void;

  updateStatRange: (statName: string, value: [number, number]) => void;

  // 테이블 상태 액션들
  setColumnFilters: (filters: ColumnFiltersState) => void;
  setSorting: (sorting: SortingState) => void;
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;

  resetAll: () => void;
}

export const useFilterStore = create<FilterState>()((set) => ({
  // 초기 상태
  pitchStats: {},
  heightRange: [60, 85],
  statRanges: {},
  columnFilters: [],
  sorting: [],
  currentPage: 1,
  pageSize: 25,

  // 액션들
  setPitchStats: (pitchStats) => set({ pitchStats }),

  updatePitchStat: (pitchName, stat, value) => {
    set((state) => ({
      pitchStats: {
        ...state.pitchStats,
        [pitchName]: {
          ...state.pitchStats[pitchName],
          [stat]: value,
        },
      },
    }));
  },

  setHeightRange: (heightRange) => set({ heightRange }),

  setStatRanges: (statRanges) => set({ statRanges }),

  updateStatRange: (statName, value) => {
    set((state) => ({
      statRanges: {
        ...state.statRanges,
        [statName]: value,
      },
    }));
  },

  // 테이블 상태 액션들
  setColumnFilters: (columnFilters) => set({ columnFilters }),
  setSorting: (sorting) => set({ sorting }),
  setCurrentPage: (currentPage) => set({ currentPage }),
  setPageSize: (pageSize) => set({ pageSize }),

  resetAll: () =>
    set({
      pitchStats: {},
      heightRange: [60, 85],
      statRanges: {},
      columnFilters: [],
      sorting: [],
      currentPage: 1,
      pageSize: 25,
    }),
}));
