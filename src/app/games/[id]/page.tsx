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
import {
  ScoringSummary,
  ScoringPlayData,
} from "@/components/ui/scoring-summary";
import { ScoringPlayCard } from "@/components/ui/baseball-diamond";
import { parseWeatherWithTemperature } from "@/lib/weather-utils";
import { useGameAnalysis } from "@/hooks/useGameAnalysis";

export default function GameDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const gameId = params.id as string;
  const username = searchParams.get("username") || "sunken_kim";
  const teamName = searchParams.get("teamName");

  // TanStack Query 사용
  const {
    data: gameData,
    isLoading: loading,
    error,
  } = useGameAnalysis(username, gameId);

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
              {error?.message ||
                String(error) ||
                "게임 데이터를 불러올 수 없습니다."}
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
  const hostPlateAppearances = gameData.home.hostStats.atBats + gameData.home.hostStats.walks
  const teammatePlateAppearances = gameData.home.teammateStats.atBats + gameData.home.teammateStats.walks

  // 득점권 상황 판별 함수
  const isRunnerInScoringPosition = (runnersBefore: Record<string, number>) => {
    // 2루 또는 3루에 주자가 있으면 득점권
    return (
      runnersBefore["2"] ||
      runnersBefore["3"] ||
      Object.values(runnersBefore).some((base) => base >= 2)
    );
  };

  // 득점 상황 데이터 변환 (RBI가 있는 타석만)
  const scoringPlays: ScoringPlayData[] = gameData.home.ownership.totalAtBats
    .filter((atBat) => atBat.rbi && atBat.rbi > 0)
    .map((atBat, index) => ({
      id: `scoring-${index}`,
      inning: atBat.inning,
      inningHalf: atBat.isTopInning ? "top" : "bottom",
      outs: atBat.outsBefore || 0,
      runners: {
        first:
          atBat.runnersBefore && 
          (atBat.runnersBefore["1"] ||
          Object.values(atBat.runnersBefore).find((base) => base === 1))
            ? "주자"
            : false,
        second:
          atBat.runnersBefore &&
          (atBat.runnersBefore["2"] ||
          Object.values(atBat.runnersBefore).find((base) => base === 2))
            ? "주자"
            : false,
        third:
          atBat.runnersBefore &&
          (atBat.runnersBefore["3"] ||
          Object.values(atBat.runnersBefore).find((base) => base === 3))
            ? "주자"
            : false,
      },
      batter: atBat.batter,
      batterOwner: atBat.isHost ? "호스트" : "팀원",
      result: atBat.result?.replace("_", " ") ?? "",
      runsScored: atBat.rbi ?? 0,
      description: atBat.log.join(" "),
    }));

  // 득점권 상황 분석
  const rispSituations = gameData.home.ownership.totalAtBats.filter((atBat) =>
    isRunnerInScoringPosition(atBat.runnersBefore ?? {})
  );  

  const hostRispAtBats = rispSituations.filter((atBat) => atBat.owner === "my");
  const teammateRispAtBats = rispSituations.filter(
    (atBat) => atBat.owner === "friend"
  );

  const hostRispHits = hostRispAtBats.filter(
    (atBat) =>
      atBat.result?.includes("single") ||
      atBat.result?.includes("double") ||
      atBat.result?.includes("triple") ||
      atBat.result?.includes("home_run")
  );

  const teammateRispHits = teammateRispAtBats.filter(
    (atBat) =>
      atBat.result?.includes("single") ||
      atBat.result?.includes("double") ||
      atBat.result?.includes("triple") ||
      atBat.result?.includes("home_run")
  );

  // 클러치 상황 분석 (득점권 + 2아웃)
  const clutchSituations = gameData.home.ownership.totalAtBats.filter(
    (atBat) =>
      isRunnerInScoringPosition(atBat.runnersBefore ?? {}) && atBat.outsBefore === 2
  );

  const hostClutchAtBats = clutchSituations.filter(
    (atBat) => atBat.isHost
  );
  const teammateClutchAtBats = clutchSituations.filter(
    (atBat) => !atBat.isHost
  );

  const myClutchSuccess = hostClutchAtBats.filter((atBat) => (atBat.rbi ?? 0) > 0);
  const friendClutchSuccess = teammateClutchAtBats.filter(
    (atBat) => (atBat.rbi ?? 0) > 0
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
                    {gameData.homeTeamLogo ? (
                      <Image
                        src={gameData.awayTeamLogo ?? ""}
                        alt={gameData.lineScore.away_full_name || "어웨이팀"}
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
                        {gameData.lineScore.away_runs}
                      </span>
                      <span className="text-gray-400 mx-2">:</span>
                      <span className="text-red-400">
                        {gameData.lineScore.home_runs}
                      </span>
                    </>
                  ) : (
                    // 기존 방식 (fallback)
                    <>
                      <span className="text-blue-400">
                        {gameData.validation.away.actualRuns}
                      </span>
                      <span className="text-gray-400 mx-2">:</span>
                      <span className="text-red-400">
                        {gameData.validation.home.expectedRuns}
                      </span>
                    </>
                  )}
                </div>
               
              </div>

              <div className="flex-1 text-center">
                <h2 className="text-2xl md:text-3xl font-bold mb-2">
                  {gameData.lineScore.home_full_name}
                </h2>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center overflow-hidden">
                    <Image
                      src={gameData.homeTeamLogo ?? ""}
                      alt={gameData.lineScore.home_full_name ?? ""}
                      width={48}
                      height={48}
                      className="rounded-full object-cover"
                      onError={() => console.log("상대팀 로고 로드 실패")}
                    />
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
                  어웨이팀 기록
                </div>
                <div className="text-sm text-gray-300">
                  {gameData.away.totalStats.hits}H • {gameData.away.totalStats.rbis}RBI •{" "}
                  {gameData.away.totalStats.homeRuns}HR
                </div>
                <div className="text-lg font-bold">
                  AVG {gameData.away.totalStats.average.toFixed(3)}
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold mb-2 text-red-400">
                  홈팀 기록
                </div>
                <div className="text-sm text-gray-300">
                  {gameData.home.totalStats.hits}H • {gameData.home.totalStats.rbis}RBI
                  • {gameData.home.totalStats.homeRuns}HR
                </div>
                <div className="text-lg font-bold">
                  AVG {gameData.home.totalStats.average.toFixed(3)}
                </div>
              </div>
            </div>

            {/* 검증 정보 */}
            <div className="mt-6 pt-6 border-t border-white/20 text-center">
              <Badge
                variant="outline"
                className={`border-white/30 ${
                  gameData.validation.home.hitsMatch && gameData.validation.home.runsMatch
                    ? "text-green-400"
                    : "text-yellow-400"
                }`}
              >
                {gameData.validation.home.hitsMatch && gameData.validation.home.runsMatch
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
          <CardContent>
            <div className="text-center">
              <div className="text-2xl font-bold showstats-highlight">
                {gameData.validation.home.actualHits}
              </div>
              <p className="text-sm text-muted-foreground">총 안타</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent>
            <div className="text-center">
              <div className="text-2xl font-bold showstats-highlight">
                {gameData.validation.home.actualRuns}
              </div>
              <p className="text-sm text-muted-foreground">총 득점</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent>
            <div className="text-center">
              <div className="text-2xl font-bold showstats-highlight">
                {gameData.home.ownership.totalAtBats.length}
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
                    {gameData.gameMetadata.umpires?.hp}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-muted-foreground">1루심</div>
                  <div className="font-medium">
                    {gameData.gameMetadata.umpires?.first}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-muted-foreground">2루심</div>
                  <div className="font-medium">
                    {gameData.gameMetadata.umpires?.second}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-muted-foreground">3루심</div>
                  <div className="font-medium">
                    {gameData.gameMetadata.umpires?.third}
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
                          <TableHead className="text-center">호스트</TableHead>
                          <TableHead className="text-center">팀원</TableHead>
                          <TableHead className="text-center">비교</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow className="border-border">
                          <TableCell>타석 (PA)</TableCell>
                          <TableCell className="text-center font-bold">
                            {hostPlateAppearances}
                          </TableCell>
                          <TableCell className="text-center font-bold">
                            {teammatePlateAppearances}
                          </TableCell>
                          <TableCell className="text-center">
                            {getComparisonIcon(
                              hostPlateAppearances,
                              teammatePlateAppearances
                            )}
                          </TableCell>
                        </TableRow>
                        <TableRow className="border-border">
                          <TableCell>타수 (AB)</TableCell>
                          <TableCell className="text-center font-bold">
                            {gameData.home.hostStats.atBats}
                          </TableCell>
                          <TableCell className="text-center font-bold">
                            {gameData.home.teammateStats.atBats}
                          </TableCell>
                          <TableCell className="text-center">
                            {getComparisonIcon(
                              gameData.home.hostStats.atBats,
                              gameData.home.teammateStats.atBats
                            )}
                          </TableCell>
                        </TableRow>
                        <TableRow className="border-border">
                          <TableCell>안타 (H)</TableCell>
                          <TableCell className="text-center font-bold">
                            {gameData.home.hostStats.hits}
                          </TableCell>
                          <TableCell className="text-center font-bold">
                            {gameData.home.teammateStats.hits}
                          </TableCell>
                          <TableCell className="text-center">
                            {getComparisonIcon(
                              gameData.home.hostStats.hits,
                              gameData.home.teammateStats.hits
                            )}
                          </TableCell>
                        </TableRow>
                        <TableRow className="border-border">
                          <TableCell>홈런 (HR)</TableCell>
                          <TableCell className="text-center font-bold">
                            {gameData.home.hostStats.homeRuns}
                          </TableCell>
                          <TableCell className="text-center font-bold">
                            {gameData.home.teammateStats.homeRuns}
                          </TableCell>
                          <TableCell className="text-center">
                            {getComparisonIcon(
                              gameData.home.hostStats.homeRuns,
                              gameData.home.teammateStats.homeRuns
                            )}
                          </TableCell>
                        </TableRow>
                        <TableRow className="border-border">
                          <TableCell>타점 (RBI)</TableCell>
                          <TableCell className="text-center font-bold">
                            {gameData.home.hostStats.rbis}
                          </TableCell>
                          <TableCell className="text-center font-bold">
                            {gameData.home.teammateStats.rbis}
                          </TableCell>
                          <TableCell className="text-center">
                            {getComparisonIcon(
                              gameData.home.hostStats.rbis,
                              gameData.home.teammateStats.rbis
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
                          <TableHead className="text-center">호스트</TableHead>
                          <TableHead className="text-center">팀원</TableHead>
                          <TableHead className="text-center">비교</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow className="border-border">
                          <TableCell>타율 (AVG)</TableCell>
                          <TableCell className="text-center font-bold">
                            <StatValue
                              value={gameData.home.hostStats.average}
                              statType="average"
                              format="decimal"
                            />
                          </TableCell>
                          <TableCell className="text-center font-bold">
                            <StatValue
                              value={gameData.home.teammateStats.average}
                              statType="average"
                              format="decimal"
                            />
                          </TableCell>
                          <TableCell className="text-center">
                            {getComparisonIcon(
                              gameData.home.hostStats.average,
                              gameData.home.teammateStats.average
                            )}
                          </TableCell>
                        </TableRow>
                        <TableRow className="border-border">
                          <TableCell>출루율 (OBP)</TableCell>
                          <TableCell className="text-center font-bold">
                            <StatValue
                              value={gameData.home.hostStats.obp}
                              statType="obp"
                              format="decimal"
                            />
                          </TableCell>
                          <TableCell className="text-center font-bold">
                            <StatValue
                              value={gameData.home.teammateStats.obp}
                              statType="obp"
                              format="decimal"
                            />
                          </TableCell>
                          <TableCell className="text-center">
                            {getComparisonIcon(
                              gameData.home.hostStats.obp,
                              gameData.home.teammateStats.obp
                            )}
                          </TableCell>
                        </TableRow>
                        <TableRow className="border-border">
                          <TableCell>장타율 (SLG)</TableCell>
                          <TableCell className="text-center font-bold">
                            <StatValue
                              value={gameData.home.hostStats.slg}
                              statType="slg"
                              format="decimal"
                            />
                          </TableCell>
                          <TableCell className="text-center font-bold">
                            <StatValue
                              value={gameData.home.teammateStats.slg}
                              statType="slg"
                              format="decimal"
                            />
                          </TableCell>
                          <TableCell className="text-center">
                            {getComparisonIcon(
                              gameData.home.hostStats.slg,
                              gameData.home.teammateStats.slg
                            )}
                          </TableCell>
                        </TableRow>
                        <TableRow className="border-border">
                          <TableCell>OPS</TableCell>
                          <TableCell className="text-center font-bold">
                            <StatValue
                              value={gameData.home.hostStats.ops}
                              statType="ops"
                              format="decimal"
                            />
                          </TableCell>
                          <TableCell className="text-center font-bold">
                            <StatValue
                              value={gameData.home.teammateStats.ops}
                              statType="ops"
                              format="decimal"
                            />
                          </TableCell>
                          <TableCell className="text-center">
                            {getComparisonIcon(
                              gameData.home.hostStats.ops,
                              gameData.home.teammateStats.ops
                            )}
                          </TableCell>
                        </TableRow>
                        <TableRow className="border-border">
                          <TableCell>득점권 타율</TableCell>
                          <TableCell className="text-center font-bold">
                            <StatValue
                              value={gameData.home.hostStats.rispAverage}
                              statType="rispAverage"
                              format="decimal"
                            />
                          </TableCell>
                          <TableCell className="text-center font-bold">
                            <StatValue
                              value={gameData.home.teammateStats.rispAverage}
                              statType="rispAverage"
                              format="decimal"
                            />
                          </TableCell>
                          <TableCell className="text-center">
                            {getComparisonIcon(
                              gameData.home.hostStats.rispAverage,
                              gameData.home.teammateStats.rispAverage
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
                      battingAverage: gameData.home.hostStats.average,
                      onBasePercentage: gameData.home.hostStats.obp,
                      sluggingPercentage: gameData.home.hostStats.slg,
                      ops: gameData.home.hostStats.ops,
                      rbiAverage: gameData.home.hostStats.rispAverage,
                      strikeoutRate:
                        (gameData.home.hostStats.strikeouts / hostPlateAppearances) *
                        100,
                    }}
                    teammateStats={{
                      battingAverage: gameData.home.teammateStats.average,
                      onBasePercentage: gameData.home.teammateStats.obp,
                      sluggingPercentage: gameData.home.teammateStats.slg,
                      ops: gameData.home.teammateStats.ops,
                      rbiAverage: gameData.home.teammateStats.rispAverage,
                      strikeoutRate:
                        (gameData.home.teammateStats.strikeouts /
                          teammatePlateAppearances) *
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
                            {hostRispAtBats.length}
                          </TableCell>
                          <TableCell className="text-center font-bold">
                            {teammateRispAtBats.length}
                          </TableCell>
                          <TableCell className="text-center">
                            {getComparisonIcon(
                              hostRispAtBats.length,
                              teammateRispAtBats.length
                            )}
                          </TableCell>
                        </TableRow>
                        <TableRow className="border-border">
                          <TableCell>득점권 안타</TableCell>
                          <TableCell className="text-center font-bold">
                            {hostRispHits.length}
                          </TableCell>
                          <TableCell className="text-center font-bold">
                            {teammateRispHits.length}
                          </TableCell>
                          <TableCell className="text-center">
                            {getComparisonIcon(
                              hostRispHits.length,
                              teammateRispHits.length
                            )}
                          </TableCell>
                        </TableRow>
                        <TableRow className="border-border">
                          <TableCell>득점권 타율</TableCell>
                          <TableCell className="text-center font-bold">
                            <StatValue
                              value={
                                hostRispAtBats.length > 0
                                  ? hostRispHits.length / hostRispAtBats.length
                                  : 0
                              }
                              statType="average"
                              format="decimal"
                            />
                          </TableCell>
                          <TableCell className="text-center font-bold">
                            <StatValue
                              value={
                                teammateRispAtBats.length > 0
                                  ? teammateRispHits.length /
                                    teammateRispAtBats.length
                                  : 0
                              }
                              statType="average"
                              format="decimal"
                            />
                          </TableCell>
                          <TableCell className="text-center">
                            {getComparisonIcon(
                              hostRispAtBats.length > 0
                                ? hostRispHits.length / hostRispAtBats.length
                                : 0,
                              teammateRispAtBats.length > 0
                                ? teammateRispHits.length /
                                    teammateRispAtBats.length
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
                            {hostClutchAtBats.length}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            나의 클러치 타석
                          </div>
                          <div className="text-sm font-medium mt-1">
                            성공: {myClutchSuccess.length}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            성공률:{" "}
                            {hostClutchAtBats.length > 0
                              ? (
                                  (myClutchSuccess.length /
                                    hostClutchAtBats.length) *
                                  100
                                ).toFixed(1)
                              : "0"}
                            %
                          </div>
                        </div>

                        <div className="text-center p-3 bg-rose-50/50 dark:bg-rose-950/20 rounded">
                          <div className="text-lg font-bold text-rose-600 dark:text-rose-400">
                            {teammateClutchAtBats.length}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            팀원 클러치 타석
                          </div>
                          <div className="text-sm font-medium mt-1">
                            성공: {friendClutchSuccess.length}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            성공률:{" "}
                            {teammateClutchAtBats.length > 0
                              ? (
                                  (friendClutchSuccess.length /
                                    teammateClutchAtBats.length) *
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
                    allAtBats={gameData.home.ownership.totalAtBats}
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
                    {gameData.home.ownership.totalAtBats.map((atBat, index) => (
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
                            {isRunnerInScoringPosition(atBat.runnersBefore ?? {}) && (
                              <Badge
                                variant="secondary"
                                className="text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                              >
                                득점권
                              </Badge>
                            )}

                            {/* 클러치 상황 */}
                            {isRunnerInScoringPosition(atBat.runnersBefore ?? {}) &&
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
                              {atBat.result?.replace("_", " ")}
                            </div>
                            {atBat.rbi && atBat.rbi > 0 && (
                              <div className="text-sm text-green-600 dark:text-green-400">
                                {atBat.rbi} RBI
                              </div>
                            )}
                          </div>
                        </div>

                        {/* 주자 상황 표시 */}
                        {Object.keys(atBat.runnersBefore ?? {}).length > 0 && (
                          <div className="mb-2 p-2 bg-muted/30 rounded text-xs">
                            <span className="text-muted-foreground">
                              주자 상황:{" "}
                            </span>
                            {Object.entries(atBat.runnersBefore ?? {}).map(
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
