import { useQuery } from "@tanstack/react-query";

export interface UserStats {
  username: string;
  display_level: string;
  games_played: string;
  vanity: {
    nameplate_equipped: string;
    icon_equipped: string;
  };
  most_played_modes: {
    dd_time: string;
    playnow_time: string;
    rtts_time: string;
    [key: string]: string;
  };
  lifetime_hitting_stats: Array<{ [key: string]: number }>;
  online_data: Array<{
    year: string;
    wins: string;
    loses: string;
    hr: string;
    batting_average: string;
    era: string;
  }>;
}
export interface UserProfile {
  playerInfo: {
    universal_profiles: UserStats[];
  };
  iconImageUrl: string;
}

async function fetchUserProfile(username: string): Promise<UserProfile> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${username}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
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
