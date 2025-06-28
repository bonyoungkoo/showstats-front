"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParams, useSearchParams } from "next/navigation";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import Image from "next/image";
import { StatValue } from "@/components/ui/stat-value";
import { StatLegend } from "@/components/ui/stat-legend";
import { ComparisonChart } from "@/components/ui/comparison-chart";
import { useEffect, useState } from "react";
import {
  ScoringSummary,
  ScoringPlayData,
} from "@/components/ui/scoring-summary";
import { ScoringPlayCard } from "@/components/ui/baseball-diamond";
import { parseWeatherWithTemperature } from "@/lib/weather-utils";

// API 응답 타입 정의
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

interface GameAnalysisResponse {
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
  // 실제 게임 스코어 (lineScore 객체 안에 있음)
  lineScore: {
    home_runs: string;
    away_runs: string;
    created_at: string;
    home_full_name: string;
    away_full_name: string;
    homeTeamLogo?: string;
    awayTeamLogo?: string;
    // ... 기타 필드들
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

export default function GameDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const gameId = params.id;
  const username = searchParams.get("username") || "sunken_kim";
  const teamName = searchParams.get("teamName");

  const [gameData, setGameData] = useState<GameAnalysisResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // sessionStorage 의존성 제거 - URL 파라미터로 모든 정보 전달받음

  useEffect(() => {
    const fetchGameData = async () => {
      try {
        setLoading(true);
        console.log(
          `게임 분석 API 호출: username=${username}, gameId=${gameId}`
        );

        const response = await fetch("http://localhost:3003/api/analyze", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username,
            gameId: gameId,
            teamName: teamName,
          }),
        });

        if (!response.ok) {
          throw new Error(`API 호출 실패: ${response.status}`);
        }

        const data: GameAnalysisResponse = await response.json();
        console.log("게임 분석 API 응답:", data);
        console.log("🔍 lineScore.home_runs:", data.lineScore?.home_runs);
        console.log("🔍 lineScore.away_runs:", data.lineScore?.away_runs);
        console.log("🔍 lineScore.created_at:", data.lineScore?.created_at);
        console.log(
          "🔍 lineScore.home_full_name:",
          data.lineScore?.home_full_name
        );
        console.log(
          "🔍 lineScore.away_full_name:",
          data.lineScore?.away_full_name
        );
        console.log("🔍 lineScore.homeTeamLogo:", data.lineScore?.homeTeamLogo);
        console.log("🔍 lineScore.awayTeamLogo:", data.lineScore?.awayTeamLogo);
        console.log("🔍 우리팀 teamName:", teamName);
        console.log("🔍 전체 키들:", Object.keys(data));
        setGameData(data);
      } catch (err) {
        console.error("게임 분석 API 에러:", err);
        setError(err instanceof Error ? err.message : "알 수 없는 오류");
      } finally {
        setLoading(false);
      }
    };

    if (gameId && username) {
      fetchGameData();
    }
  }, [gameId, username, teamName]);

  const getComparisonIcon = (myValue: number, teammateValue: number) => {
    if (myValue > teammateValue)
      return <TrendingUp className="w-4 h-4 text-green-400" />;
    else if (myValue < teammateValue)
      return <TrendingDown className="w-4 h-4 text-red-400" />;
    else return <Minus className="w-4 h-4 text-muted-foreground" />;
  };

  // 로딩 상태
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">
            게임 데이터를 분석하고 있습니다...
          </p>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error || !gameData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="border-red-500/50">
          <CardHeader>
            <CardTitle className="text-red-500">오류 발생</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {error || "게임 데이터를 불러올 수 없습니다."}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              gameId: {gameId}, username: {username}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 타석 수 계산 (plateAppearances)
  const myPlateAppearances = gameData.myStats.atBats + gameData.myStats.walks;
  const friendPlateAppearances =
    gameData.friendStats.atBats + gameData.friendStats.walks;

  // 득점권 상황 판별 함수
  const isRunnerInScoringPosition = (runnersBefore: {
    [key: string]: number;
  }) => {
    // 2루 또는 3루에 주자가 있으면 득점권
    return (
      runnersBefore["2"] ||
      runnersBefore["3"] ||
      Object.values(runnersBefore).some((base) => base >= 2)
    );
  };

  // 득점 상황 데이터 변환 (RBI가 있는 타석만)
  const scoringPlays: ScoringPlayData[] = gameData.atBatDetails
    .filter((atBat) => atBat.rbi > 0)
    .map((atBat, index) => ({
      id: `scoring-${index}`,
      inning: atBat.inning,
      inningHalf: atBat.isTopInning ? "top" : "bottom",
      outs: atBat.outsBefore || 0,
      runners: {
        first:
          atBat.runnersBefore["1"] ||
          Object.values(atBat.runnersBefore).find((base) => base === 1)
            ? "주자"
            : false,
        second:
          atBat.runnersBefore["2"] ||
          Object.values(atBat.runnersBefore).find((base) => base === 2)
            ? "주자"
            : false,
        third:
          atBat.runnersBefore["3"] ||
          Object.values(atBat.runnersBefore).find((base) => base === 3)
            ? "주자"
            : false,
      },
      batter: atBat.batter,
      batterOwner: atBat.owner === "my" ? "내 계정" : "팀원",
      result: atBat.result.replace("_", " "),
      runsScored: atBat.rbi,
      description: atBat.log.join(" "),
    }));

  // 득점권 상황 분석
  const rispSituations = gameData.atBatDetails.filter((atBat) =>
    isRunnerInScoringPosition(atBat.runnersBefore)
  );

  const myRispAtBats = rispSituations.filter((atBat) => atBat.owner === "my");
  const friendRispAtBats = rispSituations.filter(
    (atBat) => atBat.owner === "friend"
  );

  const myRispHits = myRispAtBats.filter(
    (atBat) =>
      atBat.result.includes("single") ||
      atBat.result.includes("double") ||
      atBat.result.includes("triple") ||
      atBat.result.includes("home_run")
  );

  const friendRispHits = friendRispAtBats.filter(
    (atBat) =>
      atBat.result.includes("single") ||
      atBat.result.includes("double") ||
      atBat.result.includes("triple") ||
      atBat.result.includes("home_run")
  );

  // 클러치 상황 분석 (득점권 + 2아웃)
  const clutchSituations = gameData.atBatDetails.filter(
    (atBat) =>
      isRunnerInScoringPosition(atBat.runnersBefore) && atBat.outsBefore === 2
  );

  const myClutchAtBats = clutchSituations.filter(
    (atBat) => atBat.owner === "my"
  );
  const friendClutchAtBats = clutchSituations.filter(
    (atBat) => atBat.owner === "friend"
  );

  const myClutchSuccess = myClutchAtBats.filter((atBat) => atBat.rbi > 0);
  const friendClutchSuccess = friendClutchAtBats.filter(
    (atBat) => atBat.rbi > 0
  );

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* 게임 매치업 화면 */}
      {gameData ? (
        <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-8 text-white">
          {/* 배경 패턴 */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGRlZnM+CjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPgo8cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz4KPC9wYXR0ZXJuPgo8L2RlZnM+CjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz4KPHN2Zz4=')] opacity-20"></div>

          {/* 메인 매치업 */}
          <div className="relative z-10">
            {/* 팀 vs 팀 */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex-1 text-center">
                <h2 className="text-2xl md:text-3xl font-bold mb-2">
                  {teamName || "내 팀"}
                </h2>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center overflow-hidden">
                    {gameData.lineScore?.homeTeamLogo ? (
                      <Image
                        src={gameData.lineScore.homeTeamLogo}
                        alt={gameData.lineScore.home_full_name || "홈팀"}
                        width={48}
                        height={48}
                        className="rounded-full object-cover"
                        onError={() => console.log("홈팀 로고 로드 실패")}
                      />
                    ) : (
                      <span className="text-white text-2xl">⚾</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center mx-8">
                <div className="text-4xl md:text-6xl font-bold mb-2">
                  {gameData.lineScore?.home_runs !== undefined &&
                  gameData.lineScore?.away_runs !== undefined ? (
                    // 실제 게임 스코어 표시 (홈팀이 내 팀이라고 가정)
                    <>
                      <span className="text-blue-400">
                        {gameData.lineScore.home_runs}
                      </span>
                      <span className="text-gray-400 mx-2">:</span>
                      <span className="text-red-400">
                        {gameData.lineScore.away_runs}
                      </span>
                    </>
                  ) : (
                    // 기존 방식 (fallback)
                    <>
                      <span className="text-blue-400">
                        {gameData.validation.actualRuns}
                      </span>
                      <span className="text-gray-400 mx-2">:</span>
                      <span className="text-red-400">
                        {gameData.validation.expectedRuns}
                      </span>
                    </>
                  )}
                </div>
                <div className="text-center">
                  <Badge
                    className={
                      gameData.lineScore?.home_runs !== undefined &&
                      gameData.lineScore?.away_runs !== undefined
                        ? parseInt(gameData.lineScore.home_runs) >
                          parseInt(gameData.lineScore.away_runs)
                          ? "bg-green-600"
                          : parseInt(gameData.lineScore.home_runs) <
                              parseInt(gameData.lineScore.away_runs)
                            ? "bg-red-600"
                            : "bg-yellow-600"
                        : gameData.validation.actualRuns >
                            gameData.validation.expectedRuns
                          ? "bg-green-600"
                          : gameData.validation.actualRuns <
                              gameData.validation.expectedRuns
                            ? "bg-red-600"
                            : "bg-yellow-600"
                    }
                  >
                    {gameData.lineScore?.home_runs !== undefined &&
                    gameData.lineScore?.away_runs !== undefined
                      ? parseInt(gameData.lineScore.home_runs) >
                        parseInt(gameData.lineScore.away_runs)
                        ? "승리"
                        : parseInt(gameData.lineScore.home_runs) <
                            parseInt(gameData.lineScore.away_runs)
                          ? "패배"
                          : "무승부"
                      : gameData.validation.actualRuns >
                          gameData.validation.expectedRuns
                        ? "승리"
                        : gameData.validation.actualRuns <
                            gameData.validation.expectedRuns
                          ? "패배"
                          : "무승부"}
                  </Badge>
                  <div className="text-sm text-gray-300 mt-1">
                    {gameData.lineScore?.created_at ||
                      gameData.gameMetadata.scheduledFirstPitch ||
                      "날짜 정보 없음"}
                  </div>
                </div>
              </div>

              <div className="flex-1 text-center">
                <h2 className="text-2xl md:text-3xl font-bold mb-2">
                  {(() => {
                    // 우리팀이 아닌 팀을 상대팀으로 표시
                    if (
                      gameData.lineScore?.home_full_name &&
                      gameData.lineScore?.away_full_name
                    ) {
                      return gameData.lineScore.home_full_name === teamName
                        ? gameData.lineScore.away_full_name
                        : gameData.lineScore.home_full_name;
                    }
                    return "상대팀";
                  })()}
                </h2>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center overflow-hidden">
                    {(() => {
                      // 우리팀이 홈팀이면 어웨이팀 로고, 어웨이팀이면 홈팀 로고
                      const opponentLogo =
                        gameData.lineScore?.home_full_name === teamName
                          ? gameData.lineScore?.awayTeamLogo
                          : gameData.lineScore?.homeTeamLogo;

                      const opponentName =
                        gameData.lineScore?.home_full_name === teamName
                          ? gameData.lineScore?.away_full_name
                          : gameData.lineScore?.home_full_name;

                      return opponentLogo ? (
                        <Image
                          src={opponentLogo}
                          alt={opponentName || "상대팀"}
                          width={48}
                          height={48}
                          className="rounded-full object-cover"
                          onError={() => console.log("상대팀 로고 로드 실패")}
                        />
                      ) : (
                        <span className="text-white text-2xl">⚾</span>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </div>

            {/* 게임 정보 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/20">
              <div className="text-center">
                <div className="text-sm text-gray-300 mb-1">게임 타입</div>
                <Badge variant="outline" className="border-white/30 text-white">
                  2:2
                </Badge>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-300 mb-1">구장</div>
                <div className="font-medium">
                  {gameData.gameMetadata.stadium || "Unknown"}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-300 mb-1">타격 난이도</div>
                <div className="font-medium">
                  {gameData.gameMetadata.hittingDifficulty || "Unknown"}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-300 mb-1">날씨</div>
                <div className="font-medium">
                  {gameData.gameMetadata.weather
                    ? (() => {
                        const weatherInfo = parseWeatherWithTemperature(
                          gameData.gameMetadata.weather
                        );
                        return (
                          <div className="flex flex-col items-center gap-1">
                            <div>{weatherInfo.formattedWeather}</div>
                          </div>
                        );
                      })()
                    : "🌤️ 알수없음"}
                </div>
              </div>
            </div>

            {/* 선수 정보 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-white/20">
              <div className="text-center">
                <div className="text-lg font-bold mb-2 text-blue-400">
                  내 기록
                </div>
                <div className="text-sm text-gray-300">
                  {gameData.myStats.hits}H • {gameData.myStats.rbis}RBI •{" "}
                  {gameData.myStats.homeRuns}HR
                </div>
                <div className="text-lg font-bold">
                  AVG {gameData.myStats.average.toFixed(3)}
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold mb-2 text-red-400">
                  팀원 기록
                </div>
                <div className="text-sm text-gray-300">
                  {gameData.friendStats.hits}H • {gameData.friendStats.rbis}RBI
                  • {gameData.friendStats.homeRuns}HR
                </div>
                <div className="text-lg font-bold">
                  AVG {gameData.friendStats.average.toFixed(3)}
                </div>
              </div>
            </div>

            {/* 검증 정보 */}
            <div className="mt-6 pt-6 border-t border-white/20 text-center">
              <Badge
                variant="outline"
                className={`border-white/30 ${
                  gameData.validation.hitsMatch && gameData.validation.runsMatch
                    ? "text-green-400"
                    : "text-yellow-400"
                }`}
              >
                {gameData.validation.hitsMatch && gameData.validation.runsMatch
                  ? "✓ 데이터 검증 완료"
                  : "⚠ 데이터 검증 필요"}
              </Badge>
            </div>
          </div>
        </div>
      ) : (
        /* 로딩 중일 때 기본 헤더 */
        <Card className="border-border showstats-card">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-2xl font-bold showstats-highlight">
                  게임 #{gameId} 상세 분석
                </CardTitle>
                <CardDescription>
                  {username}님의 Co-op 게임 분석 결과
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Badge variant="outline" className="border-border">
                  Co-op 게임
                </Badge>
              </div>
            </div>
          </CardHeader>
        </Card>
      )}

      {/* 게임 요약 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-border">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold showstats-highlight">
                {gameData.validation.actualHits}
              </div>
              <p className="text-sm text-muted-foreground">총 안타</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold showstats-highlight">
                {gameData.validation.actualRuns}
              </div>
              <p className="text-sm text-muted-foreground">총 득점</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold showstats-highlight">
                {gameData.atBatDetails.length}
              </div>
              <p className="text-sm text-muted-foreground">총 타석</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 경기 메타데이터 */}
      {gameData.gameMetadata && (
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-lg">경기 정보</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-sm text-muted-foreground mb-1">출석률</div>
                <div className="font-medium">
                  {gameData.gameMetadata.attendance}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-muted-foreground mb-1">고도</div>
                <div className="font-medium">
                  {gameData.gameMetadata.elevation}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-muted-foreground mb-1">바람</div>
                <div className="font-medium">
                  {gameData.gameMetadata.wind === "No Wind"
                    ? "🍃 무풍"
                    : `💨 ${gameData.gameMetadata.wind}`}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-muted-foreground mb-1">
                  투구 난이도
                </div>
                <div className="font-medium">
                  {gameData.gameMetadata.pitchingDifficulty}
                </div>
              </div>
            </div>

            {/* 심판진 정보 */}
            <div className="mt-6 pt-6 border-t border-border">
              <h4 className="text-sm font-medium text-muted-foreground mb-3">
                심판진
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-muted-foreground">주심</div>
                  <div className="font-medium">
                    {gameData.gameMetadata.umpires.hp}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-muted-foreground">1루심</div>
                  <div className="font-medium">
                    {gameData.gameMetadata.umpires.first}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-muted-foreground">2루심</div>
                  <div className="font-medium">
                    {gameData.gameMetadata.umpires.second}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-muted-foreground">3루심</div>
                  <div className="font-medium">
                    {gameData.gameMetadata.umpires.third}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 메인 컨텐츠 */}
      <Card className="border-border showstats-card">
        <CardContent className="p-6">
          <Tabs defaultValue="batting" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="batting">타격 비교</TabsTrigger>
              <TabsTrigger value="scoring">득점 분석</TabsTrigger>
              <TabsTrigger value="details">타석 상세</TabsTrigger>
            </TabsList>

            {/* 타격 비교 */}
            <TabsContent value="batting" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 기본 타격 스탯 */}
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="text-lg">기본 타격 스탯</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow className="border-border">
                          <TableHead>항목</TableHead>
                          <TableHead className="text-center">나</TableHead>
                          <TableHead className="text-center">팀원</TableHead>
                          <TableHead className="text-center">비교</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow className="border-border">
                          <TableCell>타석 (PA)</TableCell>
                          <TableCell className="text-center font-bold">
                            {myPlateAppearances}
                          </TableCell>
                          <TableCell className="text-center font-bold">
                            {friendPlateAppearances}
                          </TableCell>
                          <TableCell className="text-center">
                            {getComparisonIcon(
                              myPlateAppearances,
                              friendPlateAppearances
                            )}
                          </TableCell>
                        </TableRow>
                        <TableRow className="border-border">
                          <TableCell>타수 (AB)</TableCell>
                          <TableCell className="text-center font-bold">
                            {gameData.myStats.atBats}
                          </TableCell>
                          <TableCell className="text-center font-bold">
                            {gameData.friendStats.atBats}
                          </TableCell>
                          <TableCell className="text-center">
                            {getComparisonIcon(
                              gameData.myStats.atBats,
                              gameData.friendStats.atBats
                            )}
                          </TableCell>
                        </TableRow>
                        <TableRow className="border-border">
                          <TableCell>안타 (H)</TableCell>
                          <TableCell className="text-center font-bold">
                            {gameData.myStats.hits}
                          </TableCell>
                          <TableCell className="text-center font-bold">
                            {gameData.friendStats.hits}
                          </TableCell>
                          <TableCell className="text-center">
                            {getComparisonIcon(
                              gameData.myStats.hits,
                              gameData.friendStats.hits
                            )}
                          </TableCell>
                        </TableRow>
                        <TableRow className="border-border">
                          <TableCell>홈런 (HR)</TableCell>
                          <TableCell className="text-center font-bold">
                            {gameData.myStats.homeRuns}
                          </TableCell>
                          <TableCell className="text-center font-bold">
                            {gameData.friendStats.homeRuns}
                          </TableCell>
                          <TableCell className="text-center">
                            {getComparisonIcon(
                              gameData.myStats.homeRuns,
                              gameData.friendStats.homeRuns
                            )}
                          </TableCell>
                        </TableRow>
                        <TableRow className="border-border">
                          <TableCell>타점 (RBI)</TableCell>
                          <TableCell className="text-center font-bold">
                            {gameData.myStats.rbis}
                          </TableCell>
                          <TableCell className="text-center font-bold">
                            {gameData.friendStats.rbis}
                          </TableCell>
                          <TableCell className="text-center">
                            {getComparisonIcon(
                              gameData.myStats.rbis,
                              gameData.friendStats.rbis
                            )}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                {/* 고급 타격 스탯 */}
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="text-lg">고급 타격 스탯</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow className="border-border">
                          <TableHead>항목</TableHead>
                          <TableHead className="text-center">나</TableHead>
                          <TableHead className="text-center">팀원</TableHead>
                          <TableHead className="text-center">비교</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow className="border-border">
                          <TableCell>타율 (AVG)</TableCell>
                          <TableCell className="text-center font-bold">
                            <StatValue
                              value={gameData.myStats.average}
                              statType="average"
                              format="decimal"
                            />
                          </TableCell>
                          <TableCell className="text-center font-bold">
                            <StatValue
                              value={gameData.friendStats.average}
                              statType="average"
                              format="decimal"
                            />
                          </TableCell>
                          <TableCell className="text-center">
                            {getComparisonIcon(
                              gameData.myStats.average,
                              gameData.friendStats.average
                            )}
                          </TableCell>
                        </TableRow>
                        <TableRow className="border-border">
                          <TableCell>출루율 (OBP)</TableCell>
                          <TableCell className="text-center font-bold">
                            <StatValue
                              value={gameData.myStats.obp}
                              statType="obp"
                              format="decimal"
                            />
                          </TableCell>
                          <TableCell className="text-center font-bold">
                            <StatValue
                              value={gameData.friendStats.obp}
                              statType="obp"
                              format="decimal"
                            />
                          </TableCell>
                          <TableCell className="text-center">
                            {getComparisonIcon(
                              gameData.myStats.obp,
                              gameData.friendStats.obp
                            )}
                          </TableCell>
                        </TableRow>
                        <TableRow className="border-border">
                          <TableCell>장타율 (SLG)</TableCell>
                          <TableCell className="text-center font-bold">
                            <StatValue
                              value={gameData.myStats.slg}
                              statType="slg"
                              format="decimal"
                            />
                          </TableCell>
                          <TableCell className="text-center font-bold">
                            <StatValue
                              value={gameData.friendStats.slg}
                              statType="slg"
                              format="decimal"
                            />
                          </TableCell>
                          <TableCell className="text-center">
                            {getComparisonIcon(
                              gameData.myStats.slg,
                              gameData.friendStats.slg
                            )}
                          </TableCell>
                        </TableRow>
                        <TableRow className="border-border">
                          <TableCell>OPS</TableCell>
                          <TableCell className="text-center font-bold">
                            <StatValue
                              value={gameData.myStats.ops}
                              statType="ops"
                              format="decimal"
                            />
                          </TableCell>
                          <TableCell className="text-center font-bold">
                            <StatValue
                              value={gameData.friendStats.ops}
                              statType="ops"
                              format="decimal"
                            />
                          </TableCell>
                          <TableCell className="text-center">
                            {getComparisonIcon(
                              gameData.myStats.ops,
                              gameData.friendStats.ops
                            )}
                          </TableCell>
                        </TableRow>
                        <TableRow className="border-border">
                          <TableCell>득점권 타율</TableCell>
                          <TableCell className="text-center font-bold">
                            <StatValue
                              value={gameData.myStats.rispAverage}
                              statType="rispAverage"
                              format="decimal"
                            />
                          </TableCell>
                          <TableCell className="text-center font-bold">
                            <StatValue
                              value={gameData.friendStats.rispAverage}
                              statType="rispAverage"
                              format="decimal"
                            />
                          </TableCell>
                          <TableCell className="text-center">
                            {getComparisonIcon(
                              gameData.myStats.rispAverage,
                              gameData.friendStats.rispAverage
                            )}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>

              {/* 스탯 비교 시각화 */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-lg">스탯 비교 분석</CardTitle>
                  <CardDescription>
                    주요 타격 지표를 시각적으로 비교해보세요
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ComparisonChart
                    myStats={{
                      battingAverage: gameData.myStats.average,
                      onBasePercentage: gameData.myStats.obp,
                      sluggingPercentage: gameData.myStats.slg,
                      ops: gameData.myStats.ops,
                      rbiAverage: gameData.myStats.rispAverage,
                      strikeoutRate:
                        (gameData.myStats.strikeouts / myPlateAppearances) *
                        100,
                    }}
                    teammateStats={{
                      battingAverage: gameData.friendStats.average,
                      onBasePercentage: gameData.friendStats.obp,
                      sluggingPercentage: gameData.friendStats.slg,
                      ops: gameData.friendStats.ops,
                      rbiAverage: gameData.friendStats.rispAverage,
                      strikeoutRate:
                        (gameData.friendStats.strikeouts /
                          friendPlateAppearances) *
                        100,
                    }}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* 득점 분석 */}
            <TabsContent value="scoring" className="space-y-6">
              {/* 득점권 상황 분석 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="text-lg">득점권 타격 분석</CardTitle>
                    <CardDescription>
                      2루 이상에 주자가 있는 상황에서의 성과
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow className="border-border">
                          <TableHead>항목</TableHead>
                          <TableHead className="text-center">나</TableHead>
                          <TableHead className="text-center">팀원</TableHead>
                          <TableHead className="text-center">비교</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow className="border-border">
                          <TableCell>득점권 타석</TableCell>
                          <TableCell className="text-center font-bold">
                            {myRispAtBats.length}
                          </TableCell>
                          <TableCell className="text-center font-bold">
                            {friendRispAtBats.length}
                          </TableCell>
                          <TableCell className="text-center">
                            {getComparisonIcon(
                              myRispAtBats.length,
                              friendRispAtBats.length
                            )}
                          </TableCell>
                        </TableRow>
                        <TableRow className="border-border">
                          <TableCell>득점권 안타</TableCell>
                          <TableCell className="text-center font-bold">
                            {myRispHits.length}
                          </TableCell>
                          <TableCell className="text-center font-bold">
                            {friendRispHits.length}
                          </TableCell>
                          <TableCell className="text-center">
                            {getComparisonIcon(
                              myRispHits.length,
                              friendRispHits.length
                            )}
                          </TableCell>
                        </TableRow>
                        <TableRow className="border-border">
                          <TableCell>득점권 타율</TableCell>
                          <TableCell className="text-center font-bold">
                            <StatValue
                              value={
                                myRispAtBats.length > 0
                                  ? myRispHits.length / myRispAtBats.length
                                  : 0
                              }
                              statType="average"
                              format="decimal"
                            />
                          </TableCell>
                          <TableCell className="text-center font-bold">
                            <StatValue
                              value={
                                friendRispAtBats.length > 0
                                  ? friendRispHits.length /
                                    friendRispAtBats.length
                                  : 0
                              }
                              statType="average"
                              format="decimal"
                            />
                          </TableCell>
                          <TableCell className="text-center">
                            {getComparisonIcon(
                              myRispAtBats.length > 0
                                ? myRispHits.length / myRispAtBats.length
                                : 0,
                              friendRispAtBats.length > 0
                                ? friendRispHits.length /
                                    friendRispAtBats.length
                                : 0
                            )}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                {/* 클러치 상황 분석 */}
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="text-lg">클러치 상황 분석</CardTitle>
                    <CardDescription>
                      득점권 + 2아웃 상황에서의 성과
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold showstats-highlight mb-1">
                          {clutchSituations.length}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          총 클러치 상황
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-teal-50/50 dark:bg-teal-950/20 rounded">
                          <div className="text-lg font-bold text-teal-600 dark:text-teal-400">
                            {myClutchAtBats.length}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            나의 클러치 타석
                          </div>
                          <div className="text-sm font-medium mt-1">
                            성공: {myClutchSuccess.length}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            성공률:{" "}
                            {myClutchAtBats.length > 0
                              ? (
                                  (myClutchSuccess.length /
                                    myClutchAtBats.length) *
                                  100
                                ).toFixed(1)
                              : "0"}
                            %
                          </div>
                        </div>

                        <div className="text-center p-3 bg-rose-50/50 dark:bg-rose-950/20 rounded">
                          <div className="text-lg font-bold text-rose-600 dark:text-rose-400">
                            {friendClutchAtBats.length}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            팀원 클러치 타석
                          </div>
                          <div className="text-sm font-medium mt-1">
                            성공: {friendClutchSuccess.length}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            성공률:{" "}
                            {friendClutchAtBats.length > 0
                              ? (
                                  (friendClutchSuccess.length /
                                    friendClutchAtBats.length) *
                                  100
                                ).toFixed(1)
                              : "0"}
                            %
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {scoringPlays.length > 0 ? (
                <>
                  {/* 득점 요약 및 분석 */}
                  <ScoringSummary
                    plays={scoringPlays}
                    allAtBats={gameData.atBatDetails}
                  />

                  {/* 개별 득점 상황 */}
                  <Card className="border-border">
                    <CardHeader>
                      <CardTitle className="text-lg">개별 득점 상황</CardTitle>
                      <CardDescription>
                        각 득점 상황의 세부 내용을 확인해보세요 (아웃카운트
                        포함)
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {scoringPlays.map((play) => (
                          <ScoringPlayCard
                            key={play.id}
                            play={play}
                            className="bg-muted/20"
                          />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Card className="border-border">
                  <CardContent className="py-12">
                    <div className="text-center">
                      <p className="text-muted-foreground mb-2">
                        이 게임에서는 득점 상황이 없습니다.
                      </p>
                      <p className="text-sm text-muted-foreground">
                        RBI가 기록된 타석이 없어 득점 분석을 표시할 수 없습니다.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* 타석 상세 */}
            <TabsContent value="details" className="space-y-6">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-lg">타석별 상세 기록</CardTitle>
                  <CardDescription>
                    각 타석의 상황과 결과를 확인해보세요 (아웃카운트, 주자 상황,
                    득점권/클러치 상황 포함)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {gameData.atBatDetails.map((atBat, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg border ${
                          atBat.owner === "my"
                            ? "bg-teal-50/50 border-teal-200 dark:bg-teal-950/20 dark:border-teal-800"
                            : "bg-rose-50/50 border-rose-200 dark:bg-rose-950/20 dark:border-rose-800"
                        }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge
                              variant="outline"
                              className={
                                atBat.owner === "my"
                                  ? "border-teal-500 text-teal-700 dark:text-teal-300"
                                  : "border-rose-500 text-rose-700 dark:text-rose-300"
                              }
                            >
                              {atBat.owner === "my" ? "나" : "팀원"}
                            </Badge>
                            <span className="font-medium">{atBat.batter}</span>
                            <span className="text-sm text-muted-foreground">
                              {atBat.inning}회 {atBat.isTopInning ? "초" : "말"}
                            </span>

                            {/* 아웃카운트 */}
                            <Badge variant="outline" className="text-xs">
                              {atBat.outsBefore || 0}아웃
                            </Badge>

                            {/* 득점권 상황 */}
                            {isRunnerInScoringPosition(atBat.runnersBefore) && (
                              <Badge
                                variant="secondary"
                                className="text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                              >
                                득점권
                              </Badge>
                            )}

                            {/* 클러치 상황 */}
                            {isRunnerInScoringPosition(atBat.runnersBefore) &&
                              atBat.outsBefore === 2 && (
                                <Badge
                                  variant="secondary"
                                  className="text-xs bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                >
                                  클러치
                                </Badge>
                              )}
                          </div>
                          <div className="text-right">
                            <div className="font-medium capitalize">
                              {atBat.result.replace("_", " ")}
                            </div>
                            {atBat.rbi > 0 && (
                              <div className="text-sm text-green-600 dark:text-green-400">
                                {atBat.rbi} RBI
                              </div>
                            )}
                          </div>
                        </div>

                        {/* 주자 상황 표시 */}
                        {Object.keys(atBat.runnersBefore).length > 0 && (
                          <div className="mb-2 p-2 bg-muted/30 rounded text-xs">
                            <span className="text-muted-foreground">
                              주자 상황:{" "}
                            </span>
                            {Object.entries(atBat.runnersBefore).map(
                              ([player, base]) => (
                                <span key={player} className="mr-2">
                                  {base}루 {player}
                                </span>
                              )
                            )}
                          </div>
                        )}
                        <div className="text-sm text-muted-foreground">
                          {atBat.log.map((logEntry, logIndex) => (
                            <div key={logIndex}>{logEntry}</div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* 통계 범례 */}
      <StatLegend />
    </div>
  );
}
