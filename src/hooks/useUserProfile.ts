import { useQuery } from "@tanstack/react-query";

export interface UserProfile {
  username: string;
  displayName?: string;
  totalGames: number;
  coopGames: number;
  lastPlayed?: string;
  avatar?: string;
  stats?: {
    totalHits: number;
    totalHomeRuns: number;
    totalRBIs: number;
    averageBattingAverage: number;
  };
}

async function fetchUserProfile(username: string): Promise<UserProfile> {
  // 현재는 가상의 API이지만, 실제 API가 있다면 여기서 호출
  const response = await fetch(`http://localhost:3003/api/users/${username}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    // API가 아직 없다면 기본 데이터 반환
    if (response.status === 404) {
      return {
        username,
        displayName: username,
        totalGames: 0,
        coopGames: 0,
      };
    }
    throw new Error(
      `유저 프로필을 불러오는데 실패했습니다: ${response.status}`
    );
  }

  return response.json();
}

export function useUserProfile(username: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ["userProfile", username],
    queryFn: () => fetchUserProfile(username),
    enabled: enabled && !!username,
    staleTime: 1000 * 60 * 5, // 5분간 fresh
    gcTime: 1000 * 60 * 15, // 15분간 캐시 유지
    retry: false, // 프로필 API가 없을 수 있으므로 재시도 안함
  });
}
