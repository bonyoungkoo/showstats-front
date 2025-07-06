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
import Image from "next/image";
import { StatLegend } from "@/components/ui/stat-legend";
import { ComparisonChart } from "@/components/ui/comparison-chart";
import { getStatColor } from "@/lib/stat-colors";
import { useGameAnalysis } from "@/hooks/useGameAnalysis";
import { parseWeatherWithTemperature } from "@/lib/weather-utils";
import { ScoringSummary } from "@/components/ui/scoring-summary";

export default function GameDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const gameId = params?.id as string;
  const username = searchParams?.get("username") || "sunken_kim";

  // TanStack Query 사용
  const {
    data: gameData,
    isLoading: loading,
    error,
  } = useGameAnalysis(username, gameId);

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

  // 득점권 상황 판별 함수
  const isRunnerInScoringPosition = (runnersBefore: Record<string, number>) => {
    // 2루 또는 3루에 주자가 있으면 득점권
    return (
      runnersBefore["2"] ||
      runnersBefore["3"] ||
      Object.values(runnersBefore).some((base) => base >= 2)
    );
  };

  // 홈팀 클러치 타석/성공
  const homeHostClutchAtBats = gameData.home.ownership.hostAtBats.filter(
    (atBat) => isRunnerInScoringPosition(atBat.runnersBefore ?? {}) && atBat.outsBefore === 2
  );
  const homeTeammateClutchAtBats = gameData.home.ownership.teammateAtBats.filter(
    (atBat) => isRunnerInScoringPosition(atBat.runnersBefore ?? {}) && atBat.outsBefore === 2
  );
  const awayHostClutchAtBats = gameData.away.ownership.hostAtBats.filter(
    (atBat) => isRunnerInScoringPosition(atBat.runnersBefore ?? {}) && atBat.outsBefore === 2
  );
  const awayTeammateClutchAtBats = gameData.away.ownership.teammateAtBats.filter(
    (atBat) => isRunnerInScoringPosition(atBat.runnersBefore ?? {}) && atBat.outsBefore === 2
  );

  const clutchRows = [
    {
      label: `${gameData.lineScore.home_full_name} 호스트`,
      color: "bg-blue-500",
      clutch: homeHostClutchAtBats.length,
      success: homeHostClutchAtBats.filter((atBat) => (atBat.rbi ?? 0) > 0).length,
    },
    {
      label: `${gameData.lineScore.home_full_name} 팀원`,
      color: "bg-blue-300",
      clutch: homeTeammateClutchAtBats.length,
      success: homeTeammateClutchAtBats.filter((atBat) => (atBat.rbi ?? 0) > 0).length,
    },
    {
      label: `${gameData.lineScore.away_full_name} 호스트`,
      color: "bg-red-500",
      clutch: awayHostClutchAtBats.length,
      success: awayHostClutchAtBats.filter((atBat) => (atBat.rbi ?? 0) > 0).length,
    },
    {
      label: `${gameData.lineScore.away_full_name} 팀원`,
      color: "bg-red-300",
      clutch: awayTeammateClutchAtBats.length,
      success: awayTeammateClutchAtBats.filter((atBat) => (atBat.rbi ?? 0) > 0).length,
    },
  ];

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
                  {gameData.lineScore.away_full_name}
                </h2>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center overflow-hidden">
                    <Image
                      src={gameData.awayTeamLogo ?? ""}
                      alt={gameData.lineScore.away_full_name || "어웨이팀"}
                      width={48}
                      height={48}
                      className="rounded-full object-cover"
                      onError={() => console.log("홈팀 로고 로드 실패")}
                    />
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 홈팀 카드 */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-blue-500">{gameData.lineScore.home_full_name} (홈)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-row justify-around items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold showstats-highlight">{gameData.lineScore.home_hits}</div>
                <p className="text-sm text-muted-foreground">총 안타</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold showstats-highlight">{gameData.lineScore.home_runs}</div>
                <p className="text-sm text-muted-foreground">총 득점</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold showstats-highlight">{gameData.home.totalStats.atBats + gameData.home.totalStats.walks}</div>
                <p className="text-sm text-muted-foreground">총 타석</p>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* 어웨이팀 카드 */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-red-500">{gameData.lineScore.away_full_name} (어웨이)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-row justify-around items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold showstats-highlight">{gameData.lineScore.away_hits}</div>
                <p className="text-sm text-muted-foreground">총 안타</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold showstats-highlight">{gameData.lineScore.away_runs}</div>
                <p className="text-sm text-muted-foreground">총 득점</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold showstats-highlight">{gameData.away.totalStats.atBats + gameData.away.totalStats.walks}</div>
                <p className="text-sm text-muted-foreground">총 타석</p>
              </div>
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
                        <TableRow>
                          <TableHead className="w-32">항목</TableHead>
                          <TableHead className="text-center w-32" colSpan={2}>
                            <div className="flex flex-col items-center">
                              <span className="font-bold text-xs text-white mb-1 flex items-center justify-center">
                                {gameData.lineScore.home_full_name}
                                {gameData.homeTeamLogo && (
                                  <Image src={gameData.homeTeamLogo} alt="홈팀로고" width={18} height={18} className="inline-block rounded-full ml-1 align-middle" />
                                )}
                              </span>
                            </div>
                          </TableHead>
                          <TableHead className="text-center w-32" colSpan={2}>
                            <div className="flex flex-col items-center">
                              <span className="font-bold text-xs text-white mb-1 flex items-center justify-center">
                                {gameData.lineScore.away_full_name}
                                {gameData.awayTeamLogo && (
                                  <Image src={gameData.awayTeamLogo} alt="어웨이팀로고" width={18} height={18} className="inline-block rounded-full ml-1 align-middle" />
                                )}
                              </span>
                            </div>
                          </TableHead>
                        </TableRow>
                        <TableRow>
                          <TableHead className="w-32">항목</TableHead>
                          <TableHead className="text-center w-32">
                            <span className="px-1.5 py-0.5 rounded bg-red-400 text-white text-[10px] font-bold mr-1">홈팀</span>
                            호스트
                          </TableHead>
                          <TableHead className="text-center w-32">
                            <span className="px-1.5 py-0.5 rounded bg-red-400 text-white text-[10px] font-bold mr-1">홈팀</span>
                            팀원
                          </TableHead>
                          <TableHead className="text-center w-32">
                            <span className="px-1.5 py-0.5 rounded bg-blue-400 text-white text-[10px] font-bold mr-1">어웨이팀</span>
                            호스트
                          </TableHead>
                          <TableHead className="text-center w-32">
                            <span className="px-1.5 py-0.5 rounded bg-blue-400 text-white text-[10px] font-bold mr-1">어웨이팀</span>
                            팀원
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {(() => {
                          const rows = [
                            {
                              label: "타석 (PA)",
                              values: [
                                gameData.home.hostStats.atBats + gameData.home.hostStats.walks,
                                gameData.home.teammateStats.atBats + gameData.home.teammateStats.walks,
                                gameData.away.hostStats.atBats + gameData.away.hostStats.walks,
                                gameData.away.teammateStats.atBats + gameData.away.teammateStats.walks,
                              ],
                            },
                            {
                              label: "타수 (AB)",
                              values: [
                                gameData.home.hostStats.atBats,
                                gameData.home.teammateStats.atBats,
                                gameData.away.hostStats.atBats,
                                gameData.away.teammateStats.atBats,
                              ],
                            },
                            {
                              label: "안타 (H)",
                              values: [
                                gameData.home.hostStats.hits,
                                gameData.home.teammateStats.hits,
                                gameData.away.hostStats.hits,
                                gameData.away.teammateStats.hits,
                              ],
                            },
                            {
                              label: "홈런 (HR)",
                              values: [
                                gameData.home.hostStats.homeRuns,
                                gameData.home.teammateStats.homeRuns,
                                gameData.away.hostStats.homeRuns,
                                gameData.away.teammateStats.homeRuns,
                              ],
                            },
                            {
                              label: "타점 (RBI)",
                              values: [
                                gameData.home.hostStats.rbis,
                                gameData.home.teammateStats.rbis,
                                gameData.away.hostStats.rbis,
                                gameData.away.teammateStats.rbis,
                              ],
                            },
                          ];
                          return rows.map((row, i) => {
                            const max = Math.max(...row.values);
                            return (
                              <TableRow key={i} className="border-border">
                                <TableCell className="w-32">{row.label}</TableCell>
                                {row.values.map((v, idx) => (
                                  <TableCell
                                    key={idx}
                                    className={`text-center font-bold w-32`}
                                  >
                                    {v === max && row.values.filter(x => x === max).length === 1 ? (
                                      <span className="inline-block mr-1 text-yellow-400" title="최고 기록">⭐</span>
                                    ) : null}
                                    {v}
                                  </TableCell>
                                ))}
                              </TableRow>
                            );
                          });
                        })()}
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
                        <TableRow>
                          <TableHead className="w-32">항목</TableHead>
                          <TableHead className="text-center w-32" colSpan={2}>
                            <div className="flex flex-col items-center">
                              <span className="font-bold text-xs text-white mb-1 flex items-center justify-center">
                                {gameData.lineScore.home_full_name}
                                {gameData.homeTeamLogo && (
                                  <Image src={gameData.homeTeamLogo} alt="홈팀로고" width={18} height={18} className="inline-block rounded-full ml-1 align-middle" />
                                )}
                              </span>
                            </div>
                          </TableHead>
                          <TableHead className="text-center w-32" colSpan={2}>
                            <div className="flex flex-col items-center">
                              <span className="font-bold text-xs text-white mb-1 flex items-center justify-center">
                                {gameData.lineScore.away_full_name}
                                {gameData.awayTeamLogo && (
                                  <Image src={gameData.awayTeamLogo} alt="어웨이팀로고" width={18} height={18} className="inline-block rounded-full ml-1 align-middle" />
                                )}
                              </span>
                            </div>
                          </TableHead>
                        </TableRow>
                        <TableRow>
                          <TableHead className="w-32">항목</TableHead>
                          <TableHead className="text-center w-32">
                            <span className="px-1.5 py-0.5 rounded bg-red-400 text-white text-[10px] font-bold mr-1">홈팀</span>
                            호스트
                          </TableHead>
                          <TableHead className="text-center w-32">
                            <span className="px-1.5 py-0.5 rounded bg-red-400 text-white text-[10px] font-bold mr-1">홈팀</span>
                            팀원
                          </TableHead>
                          <TableHead className="text-center w-32">
                            <span className="px-1.5 py-0.5 rounded bg-blue-400 text-white text-[10px] font-bold mr-1">어웨이팀</span>
                            호스트
                          </TableHead>
                          <TableHead className="text-center w-32">
                            <span className="px-1.5 py-0.5 rounded bg-blue-400 text-white text-[10px] font-bold mr-1">어웨이팀</span>
                            팀원
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {(() => {
                          const rows = [
                            {
                              label: "타율 (AVG)",
                              values: [
                                gameData.home.hostStats.average,
                                gameData.home.teammateStats.average,
                                gameData.away.hostStats.average,
                                gameData.away.teammateStats.average,
                              ],
                              statType: "average",
                            },
                            {
                              label: "출루율 (OBP)",
                              values: [
                                gameData.home.hostStats.obp,
                                gameData.home.teammateStats.obp,
                                gameData.away.hostStats.obp,
                                gameData.away.teammateStats.obp,
                              ],
                              statType: "obp",
                            },
                            {
                              label: "장타율 (SLG)",
                              values: [
                                gameData.home.hostStats.slg,
                                gameData.home.teammateStats.slg,
                                gameData.away.hostStats.slg,
                                gameData.away.teammateStats.slg,
                              ],
                              statType: "slg",
                            },
                            {
                              label: "OPS",
                              values: [
                                gameData.home.hostStats.ops,
                                gameData.home.teammateStats.ops,
                                gameData.away.hostStats.ops,
                                gameData.away.teammateStats.ops,
                              ],
                              statType: "ops",
                            },
                            {
                              label: "득점권 타율",
                              values: [
                                gameData.home.hostStats.rispAverage,
                                gameData.home.teammateStats.rispAverage,
                                gameData.away.hostStats.rispAverage,
                                gameData.away.teammateStats.rispAverage,
                              ],
                              statType: "rispAverage",
                            },
                          ];
                          return rows.map((row, i) => {
                            const max = Math.max(...row.values);
                            return (
                              <TableRow key={i} className="border-border">
                                <TableCell className="w-32">{row.label}</TableCell>
                                {row.values.map((v, idx) => {
                                  const color = getStatColor(v, row.statType).color;
                                  return (
                                    <TableCell
                                      key={idx}
                                      className={`text-center font-bold w-32 ${color}`}
                                    >
                                      {v === max && row.values.filter(x => x === max).length === 1 ? (
                                        <span className="inline-block mr-1 text-yellow-400" title="최고 기록">⭐</span>
                                      ) : null}
                                      {v.toFixed(3)}
                                    </TableCell>
                                  );
                                })}
                              </TableRow>
                            );
                          });
                        })()}
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
                    homeStats={gameData.home}
                    awayStats={gameData.away}
                    homeTeamName={gameData.lineScore.home_full_name}
                    awayTeamName={gameData.lineScore.away_full_name}
                    homeTeamLogo={gameData.homeTeamLogo ? String(gameData.homeTeamLogo) : ''}
                    awayTeamLogo={gameData.awayTeamLogo ? String(gameData.awayTeamLogo) : ''}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* 득점 분석 */}
            <TabsContent value="scoring" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 득점권 타격 분석 */}
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="text-lg">득점권 타격 분석</CardTitle>
                    <CardDescription>2루 이상에 주자가 있는 상황에서의 성과</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>항목</TableHead>
                          <TableHead className="text-center">
                            <span className="px-1.5 py-0.5 rounded bg-red-400 text-white text-[10px] font-bold mr-1">홈팀</span>
                            호스트
                          </TableHead>
                          <TableHead className="text-center">
                            <span className="px-1.5 py-0.5 rounded bg-red-400 text-white text-[10px] font-bold mr-1">홈팀</span>
                            팀원
                          </TableHead>
                          <TableHead className="text-center">
                            <span className="px-1.5 py-0.5 rounded bg-blue-400 text-white text-[10px] font-bold mr-1">어웨이팀</span>
                            호스트
                          </TableHead>
                          <TableHead className="text-center">
                            <span className="px-1.5 py-0.5 rounded bg-blue-400 text-white text-[10px] font-bold mr-1">어웨이팀</span>
                            팀원
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {(() => {
                          const rows = [
                            {
                              label: "득점권 타석",
                              values: [
                                gameData.home.hostStats.rispAtBats,
                                gameData.home.teammateStats.rispAtBats,
                                gameData.away.hostStats.rispAtBats,
                                gameData.away.teammateStats.rispAtBats,
                              ],
                            },
                            {
                              label: "득점권 안타",
                              values: [
                                gameData.home.hostStats.rispHits,
                                gameData.home.teammateStats.rispHits,
                                gameData.away.hostStats.rispHits,
                                gameData.away.teammateStats.rispHits,
                              ],
                            },
                            {
                              label: "득점권 타율",
                              values: [
                                gameData.home.hostStats.rispAverage,
                                gameData.home.teammateStats.rispAverage,
                                gameData.away.hostStats.rispAverage,
                                gameData.away.teammateStats.rispAverage,
                              ],
                              isDecimal: true,
                            },
                          ];
                          return rows.map((row, i) => {
                            const max = Math.max(...row.values);
                            return (
                              <TableRow key={i} className="border-border">
                                <TableCell>{row.label}</TableCell>
                                {row.values.map((v, idx) => (
                                  <TableCell
                                    key={idx}
                                    className={`text-center font-bold ${row.isDecimal ? (v === max && max !== 0 ? "text-green-400" : "") : ""}`}
                                  >
                                    {row.isDecimal ? v.toFixed(3) : v}
                                    {row.isDecimal && v === max && max !== 0 && row.values.filter(x => x === max).length === 1 ? (
                                      <span className="ml-1 text-yellow-400">⭐</span>
                                    ) : null}
                                  </TableCell>
                                ))}
                              </TableRow>
                            );
                          });
                        })()}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                {/* 클러치 상황 분석 */}
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="text-lg">클러치 상황 분석</CardTitle>
                    <CardDescription>득점권 + 2아웃 상황에서의 성과</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* 홈팀 클러치 */}
                      <Card className="border-red-400 bg-background flex flex-col h-full">
                        <CardHeader className="flex flex-row items-center gap-2 pb-2">
                          <span className="px-2 py-1 rounded bg-red-400 text-white text-xs font-bold">홈팀</span>
                          <span className="font-bold text-red-500">{gameData.lineScore.home_full_name}</span>
                          {gameData.homeTeamLogo && (
                            <Image src={gameData.homeTeamLogo} alt="홈팀 로고" width={28} height={28} className="rounded-full border border-red-300 bg-white" />
                          )}
                        </CardHeader>
                        <CardContent className="flex-1 flex flex-col justify-between pt-0 gap-4">
                          {[0, 1].map(idx => {
                            const row = idx === 0 ? clutchRows[0] : clutchRows[1];
                            return (
                              <div key={idx} className={`rounded-lg p-4 w-full bg-background text-white border border-white/10`}>
                                <div className="text-base font-bold mb-1">{row.label}</div>
                                <div className="text-3xl font-bold mb-2">{row.clutch || 0}</div>
                                <div className="text-sm mb-1">클러치 타석</div>
                                <div className="text-lg font-bold">성공: {row.success || 0}</div>
                                <div className="text-xs text-white/80">
                                  성공률: {row.clutch ? ((row.success / row.clutch) * 100).toFixed(1) : "0.0"}%
                                </div>
                              </div>
                            );
                          })}
                        </CardContent>
                      </Card>
                      {/* 어웨이팀 클러치 */}
                      <Card className="border-blue-400 bg-background flex flex-col h-full">
                        <CardHeader className="flex flex-row items-center gap-2 pb-2">
                          <span className="px-2 py-1 rounded bg-blue-400 text-white text-xs font-bold">어웨이팀</span>
                          <span className="font-bold text-blue-500">{gameData.lineScore.away_full_name}</span>
                          {gameData.awayTeamLogo && (
                            <Image src={gameData.awayTeamLogo} alt="어웨이팀 로고" width={28} height={28} className="rounded-full border border-blue-300 bg-white" />
                          )}
                        </CardHeader>
                        <CardContent className="flex-1 flex flex-col justify-between pt-0 gap-4">
                          {[2, 3].map(idx => {
                            const row = clutchRows[idx];
                            return (
                              <div key={idx} className={`rounded-lg p-4 w-full bg-background text-white border border-white/10`}>
                                <div className="text-base font-bold mb-1">{row.label}</div>
                                <div className="text-3xl font-bold mb-2">{row.clutch || 0}</div>
                                <div className="text-sm mb-1">클러치 타석</div>
                                <div className="text-lg font-bold">성공: {row.success || 0}</div>
                                <div className="text-xs text-white/80">
                                  성공률: {row.clutch ? ((row.success / row.clutch) * 100).toFixed(1) : "0.0"}%
                                </div>
                              </div>
                            );
                          })}
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* 득점 요약 */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-lg">득점 요약</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* 홈팀 득점 요약 */}
                    <Card className="border-red-400 bg-red-50/10 flex flex-col h-full">
                      <CardHeader className="flex flex-row items-center gap-2 pb-2">
                        <span className="px-2 py-1 rounded bg-red-400 text-white text-xs font-bold">홈팀</span>
                        <span className="font-bold text-red-500">{gameData.lineScore.home_full_name}</span>
                        {gameData.homeTeamLogo && (
                          <Image src={gameData.homeTeamLogo} alt="홈팀 로고" width={28} height={28} className="rounded-full border border-red-300 bg-white" />
                        )}
                      </CardHeader>
                      <CardContent className="flex-1 flex flex-col justify-between pt-0">
                        <ScoringSummary
                          plays={gameData.home.ownership.totalAtBats.filter(atBat => atBat.rbi && atBat.rbi > 0).map((atBat, index) => ({
                            id: `home-scoring-${index}`,
                            inning: atBat.inning,
                            inningHalf: atBat.isTopInning ? "top" : "bottom",
                            outs: atBat.outsBefore || 0,
                            runners: {
                              first: atBat.runnersBefore && (atBat.runnersBefore["1"] || Object.values(atBat.runnersBefore).find(base => base === 1)) ? "주자" : false,
                              second: atBat.runnersBefore && (atBat.runnersBefore["2"] || Object.values(atBat.runnersBefore).find(base => base === 2)) ? "주자" : false,
                              third: atBat.runnersBefore && (atBat.runnersBefore["3"] || Object.values(atBat.runnersBefore).find(base => base === 3)) ? "주자" : false,
                            },
                            batter: atBat.batter,
                            batterOwner: atBat.isHost ? "호스트" : "팀원",
                            result: atBat.result?.replace("_", " ") ?? "",
                            runsScored: atBat.rbi ?? 0,
                            description: atBat.log.join(" "),
                          }))}
                          allAtBats={gameData.home.ownership.totalAtBats}
                          className=""
                        />
                      </CardContent>
                    </Card>
                    {/* 어웨이팀 득점 요약 */}
                    <Card className="border-blue-400 bg-blue-50/10 flex flex-col h-full">
                      <CardHeader className="flex flex-row items-center gap-2 pb-2">
                        <span className="px-2 py-1 rounded bg-blue-400 text-white text-xs font-bold">어웨이팀</span>
                        <span className="font-bold text-blue-500">{gameData.lineScore.away_full_name}</span>
                        {gameData.awayTeamLogo && (
                          <Image src={gameData.awayTeamLogo} alt="어웨이팀 로고" width={28} height={28} className="rounded-full border border-blue-300 bg-white" />
                        )}
                      </CardHeader>
                      <CardContent className="flex-1 flex flex-col justify-between pt-0">
                        <ScoringSummary
                          plays={gameData.away.ownership.totalAtBats.filter(atBat => atBat.rbi && atBat.rbi > 0).map((atBat, index) => ({
                            id: `away-scoring-${index}`,
                            inning: atBat.inning,
                            inningHalf: atBat.isTopInning ? "top" : "bottom",
                            outs: atBat.outsBefore || 0,
                            runners: {
                              first: atBat.runnersBefore && (atBat.runnersBefore["1"] || Object.values(atBat.runnersBefore).find(base => base === 1)) ? "주자" : false,
                              second: atBat.runnersBefore && (atBat.runnersBefore["2"] || Object.values(atBat.runnersBefore).find(base => base === 2)) ? "주자" : false,
                              third: atBat.runnersBefore && (atBat.runnersBefore["3"] || Object.values(atBat.runnersBefore).find(base => base === 3)) ? "주자" : false,
                            },
                            batter: atBat.batter,
                            batterOwner: atBat.isHost ? "호스트" : "팀원",
                            result: atBat.result?.replace("_", " ") ?? "",
                            runsScored: atBat.rbi ?? 0,
                            description: atBat.log.join(" "),
                          }))}
                          allAtBats={gameData.away.ownership.totalAtBats}
                          className=""
                        />
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
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
