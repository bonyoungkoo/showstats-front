import { useQuery } from "@tanstack/react-query";

export interface GameListItem {
  gameId: string;
  created_at: string;
  home_full_name: string;
  away_full_name: string;
  home_runs: string;
  away_runs: string;
  isSingleGame: boolean;
  homeTeamLogo?: string;
  awayTeamLogo?: string;
}

export interface UserGamesResponse {
  games: GameListItem[];
  totalCount: number;
}

interface ApiGameHistoryItem {
  id: string;
  display_date?: string;
  home_full_name: string;
  away_full_name: string;
  home_runs: string;
  away_runs: string;
  isSingleGame?: boolean;
  homeTeamLogo?: string;
  awayTeamLogo?: string;
}

interface ApiResponse {
  game_history?: ApiGameHistoryItem[];
  total_pages?: number;
  page?: number;
}

async function fetchUserGames(username: string): Promise<UserGamesResponse> {
  const params = new URLSearchParams();
  params.set("username", username);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/games/history?${params.toString()}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`게임 목록을 불러오는데 실패했습니다: ${response.status}`);
  }

  const data: ApiResponse = await response.json();
  console.log(data);

  // API 응답을 UserGamesResponse 형식으로 변환
  if (data.game_history && Array.isArray(data.game_history)) {
    return {
      games: data.game_history.map((game: ApiGameHistoryItem) => ({
        gameId: game.id,
        created_at: game.display_date || new Date().toISOString(),
        home_full_name: game.home_full_name,
        away_full_name: game.away_full_name,
        home_runs: game.home_runs,
        away_runs: game.away_runs,
        isSingleGame: game.isSingleGame ?? true,
        homeTeamLogo: game.homeTeamLogo,
        awayTeamLogo: game.awayTeamLogo,
      })),
      totalCount: data.game_history.length,
    };
  }

  // 빈 응답 처리
  return {
    games: [],
    totalCount: 0,
  };
}

export function useUserGames(username: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ["userGames", username],
    queryFn: () => fetchUserGames(username),
    enabled: enabled && !!username,
    staleTime: 1000 * 60 * 2, // 2분간 fresh
    gcTime: 1000 * 60 * 10, // 10분간 캐시 유지
  });
}
