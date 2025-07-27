import { FilterState } from "./filter-store";

const FILTER_STORAGE_KEY = "player-filter-temp";

// 필터 상태를 임시로 저장 (상세 페이지 진입 시)
export const saveFilterState = (state: Partial<FilterState>) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(state));
  }
};

// 필터 상태를 복원 (상세 페이지에서 복귀 시)
export const restoreFilterState = (): Partial<FilterState> | null => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem(FILTER_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // 복원 후 저장된 데이터 삭제
      localStorage.removeItem(FILTER_STORAGE_KEY);
      return parsed;
    }
  }
  return null;
};

// 필터 상태 저장 여부 확인
export const hasSavedFilterState = (): boolean => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(FILTER_STORAGE_KEY) !== null;
  }
  return false;
};
