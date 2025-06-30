import { useQuery } from "@tanstack/react-query";

// 기존 types에서 가져온 인터페이스들
interface BattingStats {
  atBats: number;
  hits: number;
  homeRuns: number;
  rbis: number;
  walks: number;
  strikeouts: number;
  average: number;
  obp: number;
  slg: number;
  ops: number;
  rispAtBats: number;
  rispHits: number;
  rispAverage: number;
}

interface AtBatDetail {
  batter: string;
  inning: number;
  isTopInning: boolean;
  log: string[];
  result: string;
  rbi: number;
  risp: boolean;
  runnersBefore: { [key: string]: number };
  outsBefore: number;
  owner: "my" | "friend";
}

export interface GameAnalysisResponse {
  myStats: BattingStats;
  friendStats: BattingStats;
  validation: {
    expectedHits: number;
    actualHits: number;
    expectedRuns: number;
    actualRuns: number;
    hitsMatch: boolean;
    runsMatch: boolean;
  };
  atBatDetails: AtBatDetail[];
  ownership: {
    myAtBats: AtBatDetail[];
    friendAtBats: AtBatDetail[];
  };
  homeTeamLogo?: string;
  awayTeamLogo?: string;
  lineScore: {
    home_runs: string;
    away_runs: string;
    created_at: string;
    home_full_name: string;
    away_full_name: string;
  };
  gameMetadata: {
    stadium: string;
    elevation: string;
    hittingDifficulty: string;
    pitchingDifficulty: string;
    gameType: string;
    attendance: string;
    weather: string;
    wind: string;
    scheduledFirstPitch: string;
    umpires: {
      hp: string;
      first: string;
      second: string;
      third: string;
    };
  };
}

async function fetchGameAnalysis(
  username: string,
  gameId: string,
  teamName?: string
): Promise<GameAnalysisResponse> {
  const response = await fetch("/api/analyze", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      gameId,
      teamName,
    }),
  });

  if (!response.ok) {
    throw new Error(
      `게임 분석 데이터를 불러오는데 실패했습니다: ${response.status}`
    );
  }

  return response.json();
}

export function useGameAnalysis(
  username: string,
  gameId: string,
  teamName?: string,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: ["gameAnalysis", username, gameId, teamName],
    queryFn: () => fetchGameAnalysis(username, gameId, teamName),
    enabled: enabled && !!username && !!gameId,
    staleTime: 1000 * 60 * 10, // 10분간 fresh (게임 데이터는 변하지 않으므로 길게)
    gcTime: 1000 * 60 * 30, // 30분간 캐시 유지
  });
}
