import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

export interface RecentSearch {
  username: string;
  searchedAt: string;
  displayName?: string;
}

const RECENT_SEARCHES_KEY = "showstats_recent_searches";
const MAX_RECENT_SEARCHES = 5;

// localStorage에서 최근 검색 기록 가져오기
function getRecentSearches(): RecentSearch[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("최근 검색 기록을 불러오는데 실패했습니다:", error);
    return [];
  }
}

// localStorage에 최근 검색 기록 저장
function saveRecentSearches(searches: RecentSearch[]): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(searches));
  } catch (error) {
    console.error("최근 검색 기록을 저장하는데 실패했습니다:", error);
  }
}

// 새로운 검색 기록 추가
function addRecentSearch(username: string, displayName?: string): void {
  const searches = getRecentSearches();
  const newSearch: RecentSearch = {
    username,
    searchedAt: new Date().toISOString(),
    displayName: displayName || username,
  };

  // 기존에 있는 같은 username 제거
  const filteredSearches = searches.filter(
    (search) => search.username !== username
  );

  // 새로운 검색을 맨 앞에 추가하고 최대 개수만큼만 유지
  const updatedSearches = [newSearch, ...filteredSearches].slice(
    0,
    MAX_RECENT_SEARCHES
  );

  saveRecentSearches(updatedSearches);
}

// 검색 기록 삭제
function removeRecentSearch(username: string): void {
  const searches = getRecentSearches();
  const filteredSearches = searches.filter(
    (search) => search.username !== username
  );
  saveRecentSearches(filteredSearches);
}

// 모든 검색 기록 삭제
function clearRecentSearches(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  }
}

export function useRecentSearches() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["recentSearches"],
    queryFn: getRecentSearches,
    staleTime: Infinity, // localStorage 데이터이므로 항상 fresh
    gcTime: Infinity,
  });

  const addSearch = useCallback(
    (username: string, displayName?: string) => {
      addRecentSearch(username, displayName);
      // 쿼리 캐시 무효화하여 UI 업데이트
      queryClient.invalidateQueries({ queryKey: ["recentSearches"] });
    },
    [queryClient]
  );

  const removeSearch = useCallback(
    (username: string) => {
      removeRecentSearch(username);
      queryClient.invalidateQueries({ queryKey: ["recentSearches"] });
    },
    [queryClient]
  );

  const clearAll = useCallback(() => {
    clearRecentSearches();
    queryClient.invalidateQueries({ queryKey: ["recentSearches"] });
  }, [queryClient]);

  return {
    ...query,
    addSearch,
    removeSearch,
    clearAll,
  };
}
