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

export type AtBatResult =
  | 'single'
  | 'double'
  | 'triple'
  | 'home_run'
  | 'walk'
  | 'strikeout'
  | 'out'
  | 'sacrifice out'
  | 'sacrifice fly out'
  | 'error'
  | 'unknown';
export interface AtBatEvent {
  batter: string;
  result?: AtBatResult;
  rbi?: number;
  description?: string;
  risp?: boolean;
  runnersBefore?: Record<string, number>;
  outsBefore?: number; // 타석 시작 전 아웃카운트
  inning: number;
  isTopInning: boolean;
  log: string[];
  owner?: 'my' | 'friend'; // 호환성을 위해 유지 (deprecated)
  team?: 'home' | 'away'; // 홈팀/원정팀 구분
  teamName?: string; // 팀 이름 (예: "Los Angeles Angels")
  isHost?: boolean;
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

export interface Ownership {
  hostAtBats: AtBatEvent[];
  teammateAtBats: AtBatEvent[];
  totalAtBats: AtBatEvent[];
}

export interface ValidationResult {
  hitsMatch: boolean;
  runsMatch: boolean;
  expectedHits: number;
  actualHits: number;
  expectedRuns: number;
  actualRuns: number;
}
export interface BatterStats {
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

  // 추가
  rispAtBats: number;
  rispHits: number;
  rispAverage: number;
}
export interface TeamAnalysis {
  hostStats: BatterStats;
  teammateStats: BatterStats;
  totalStats: BatterStats;
  ownership: Ownership;
}

export interface GameMetadata {
  stadium?: string;
  elevation?: string;
  hittingDifficulty?: string;
  pitchingDifficulty?: string;
  gameType?: string;
  attendance?: string;
  weather?: string;
  wind?: string;
  scheduledFirstPitch?: string;
  umpires?: {
    hp?: string;
    first?: string;
    second?: string;
    third?: string;
  };
}
export interface LineScore {
  inning: string;
  home_full_name: string;
  away_full_name: string;
  away_hits: string;
  away_runs: string;
  home_hits: string;
  home_runs: string;
  created_at: string;
}
export interface AnalyzeGameResult {
  home: TeamAnalysis;
  away: TeamAnalysis;
  validation: {
    home: ValidationResult;
    away: ValidationResult;
  };
  gameMetadata: GameMetadata;
  lineScore: LineScore;
  homeTeamLogo?: string;
  awayTeamLogo?: string;
}

async function fetchGameAnalysis(
  username: string,
  gameId: string,
): Promise<AnalyzeGameResult> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      gameId,
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
  enabled: boolean = true
) {
  return useQuery({
    queryKey: ["gameAnalysis", username, gameId],
    queryFn: () => fetchGameAnalysis(username, gameId),
    enabled: enabled && !!username && !!gameId,
    staleTime: 1000 * 60 * 10, // 10분간 fresh (게임 데이터는 변하지 않으므로 길게)
    gcTime: 1000 * 60 * 30, // 30분간 캐시 유지
  });
}
