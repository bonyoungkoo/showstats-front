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
import { useParams } from "next/navigation";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { StatValue } from "@/components/ui/stat-value";
import { StatLegend } from "@/components/ui/stat-legend";
import { ScoringPlayCard } from "@/components/ui/baseball-diamond";
import { ScoringSummary } from "@/components/ui/scoring-summary";

export default function GameDetailPage() {
  const params = useParams();
  const gameId = params.id;

  // 실제로는 API에서 가져올 데이터
  const gameDetail = {
    id: gameId,
    date: "2024-01-15",
    time: "14:30",
    mode: "Co-op Ranked",
    gameType: "2v2",
    duration: "2:15",
    innings: 9,
    ballpark: "Yankee Stadium",
    weather: "Clear, 72°F",
    myTeam: {
      name: "Los Angeles Dodgers",
      score: 8,
      host: {
        name: "내 계정",
        gamertag: "MyGamertag",
        batting: {
          atBats: 5,
          hits: 3,
          homeRuns: 2,
          rbis: 4,
          walks: 1,
          strikeouts: 1,
          average: 0.6,
          obp: 0.667,
          slg: 1.4,
          ops: 2.067,
          rispAtBats: 2,
          rispHits: 1,
          rispAverage: 0.5,
          plateAppearances: 6,
          doubles: 0,
          triples: 0,
          stolenBases: 1,
          leftOnBase: 2,
          clutchHits: 1,
          clutchAtBats: 2,
        },
        pitching: {
          innings: 4.0,
          hits: 3,
          runs: 2,
          earnedRuns: 2,
          walks: 1,
          strikeouts: 5,
          era: 4.5,
          whip: 1.0,
          strikeoutRate: 35.7,
          walkRate: 7.1,
          firstStrike: 12,
          firstStrikePercentage: 75.0,
        },
      },
      teammate: {
        name: "팀메이트",
        gamertag: "teammate123",
        batting: {
          atBats: 4,
          hits: 2,
          homeRuns: 0,
          rbis: 2,
          walks: 2,
          strikeouts: 1,
          average: 0.5,
          obp: 0.667,
          slg: 0.5,
          ops: 1.167,
          rispAtBats: 3,
          rispHits: 2,
          rispAverage: 0.667,
          plateAppearances: 6,
          doubles: 1,
          triples: 0,
          stolenBases: 0,
          leftOnBase: 1,
          clutchHits: 2,
          clutchAtBats: 3,
        },
        pitching: {
          innings: 5.0,
          hits: 2,
          runs: 3,
          earnedRuns: 3,
          walks: 2,
          strikeouts: 3,
          era: 5.4,
          whip: 0.8,
          strikeoutRate: 20.0,
          walkRate: 13.3,
          firstStrike: 15,
          firstStrikePercentage: 68.2,
        },
      },
    },
    opponentTeam: {
      name: "New York Yankees",
      score: 5,
      players: [
        { name: "Yankees_Master", gamertag: "Yankees_Master" },
        { name: "Bronx_Bomber", gamertag: "Bronx_Bomber" },
      ],
    },
    result: "승리",
    gameFlow: [
      { inning: 1, home: 2, away: 0 },
      { inning: 2, home: 0, away: 1 },
      { inning: 3, home: 1, away: 2 },
      { inning: 4, home: 3, away: 0 },
      { inning: 5, home: 2, away: 1 },
      { inning: 6, home: 0, away: 1 },
      { inning: 7, home: 0, away: 0 },
      { inning: 8, home: 0, away: 0 },
      { inning: 9, home: 0, away: 0 },
    ],
    scoringPlays: [
      {
        id: "1",
        inning: 1,
        inningHalf: "bottom" as const,
        outs: 1,
        runners: { first: false, second: "Mookie Betts", third: false },
        batter: "Freddie Freeman",
        batterOwner: "내 계정",
        result: "우익수 앞 안타",
        runsScored: 1,
        description: "우익수 앞 안타로 2루 주자 홈인, 타자는 1루 진루",
      },
      {
        id: "2",
        inning: 1,
        inningHalf: "bottom" as const,
        outs: 2,
        runners: { first: "Freddie Freeman", second: false, third: false },
        batter: "Shohei Ohtani",
        batterOwner: "팀메이트",
        result: "솔로 홈런",
        runsScored: 1,
        description: "우중간 담장을 넘는 솔로 홈런",
      },
      {
        id: "3",
        inning: 3,
        inningHalf: "bottom" as const,
        outs: 0,
        runners: { first: false, second: false, third: "Will Smith" },
        batter: "Max Muncy",
        batterOwner: "팀메이트",
        result: "희생 플라이",
        runsScored: 1,
        description: "우익수 앞 깊은 플라이볼로 3루 주자 태그업 홈인",
      },
      {
        id: "4",
        inning: 4,
        inningHalf: "bottom" as const,
        outs: 1,
        runners: {
          first: "Teoscar Hernandez",
          second: "Mookie Betts",
          third: false,
        },
        batter: "Freddie Freeman",
        batterOwner: "내 계정",
        result: "좌익선 3루타",
        runsScored: 2,
        description: "좌익 파울라인 근처 3루타로 1,2루 주자 모두 홈인",
      },
      {
        id: "5",
        inning: 4,
        inningHalf: "bottom" as const,
        outs: 1,
        runners: { first: false, second: false, third: "Freddie Freeman" },
        batter: "Shohei Ohtani",
        batterOwner: "팀메이트",
        result: "중견수 앞 안타",
        runsScored: 1,
        description: "중견수를 뜯고 나가는 안타로 3루 주자 홈인",
      },
      {
        id: "6",
        inning: 5,
        inningHalf: "bottom" as const,
        outs: 0,
        runners: { first: "Will Smith", second: false, third: "Max Muncy" },
        batter: "Mookie Betts",
        batterOwner: "내 계정",
        result: "2점 홈런",
        runsScored: 2,
        description: "좌익 상단을 넘는 2점 홈런으로 1루, 3루 주자와 함께 홈인",
      },
    ],
  };

  const getComparisonIcon = (myValue: number, teammateValue: number) => {
    let icon;
    if (myValue > teammateValue)
      icon = <TrendingUp className="w-4 h-4 text-green-400" />;
    else if (myValue < teammateValue)
      icon = <TrendingDown className="w-4 h-4 text-red-400" />;
    else icon = <Minus className="w-4 h-4 text-muted-foreground" />;

    return <div className="flex justify-center">{icon}</div>;
  };

  const formatStat = (value: number, isPercentage = false, decimals = 3) => {
    if (isPercentage) {
      return `${value.toFixed(1)}%`;
    }
    return decimals === 0 ? value.toString() : value.toFixed(decimals);
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* 페이지 헤더 */}
      <div>
        <h1 className="text-3xl font-bold showstats-highlight">
          경기 상세 분석
        </h1>
        <p className="text-muted-foreground">
          {gameDetail.date} · {gameDetail.mode} · {gameDetail.gameType}
        </p>
      </div>

      {/* 게임 개요 - 새로운 디자인 */}
      <Card className="showstats-card overflow-hidden relative">
        {/* 승리 시 배경 효과 */}
        {gameDetail.result === "승리" && (
          <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 via-transparent to-green-600/10 pointer-events-none" />
        )}

        <CardContent className="p-8">
          {/* 메인 스코어 섹션 */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-8 mb-4">
              {/* 우리팀 */}
              <div className="flex-1 text-right">
                <div className="text-lg font-semibold text-muted-foreground mb-2">
                  {gameDetail.myTeam.name}
                </div>
                <div className="text-6xl font-bold showstats-highlight">
                  {gameDetail.myTeam.score}
                </div>
              </div>

              {/* VS 구분자 */}
              <div className="flex flex-col items-center">
                <div className="text-2xl font-bold text-muted-foreground mb-2">
                  VS
                </div>
                <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
              </div>

              {/* 상대팀 */}
              <div className="flex-1 text-left">
                <div className="text-lg font-semibold text-muted-foreground mb-2">
                  {gameDetail.opponentTeam.name}
                </div>
                <div className="text-6xl font-bold text-muted-foreground">
                  {gameDetail.opponentTeam.score}
                </div>
              </div>
            </div>

            {/* 승부 결과 */}
            <div className="flex items-center justify-center gap-4">
              <div
                className={`text-lg font-bold ${
                  gameDetail.result === "승리"
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {gameDetail.result}
              </div>
              <div className="text-sm text-muted-foreground">
                {gameDetail.date} · {gameDetail.time}
              </div>
            </div>
          </div>

          {/* 게임 메타 정보 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-card/50 rounded-lg p-4 text-center border border-border/50">
              <div className="text-2xl mb-2">🏟️</div>
              <div className="text-sm font-medium">구장</div>
              <div className="text-xs text-muted-foreground mt-1">
                {gameDetail.ballpark}
              </div>
            </div>
            <div className="bg-card/50 rounded-lg p-4 text-center border border-border/50">
              <div className="text-2xl mb-2">🌤️</div>
              <div className="text-sm font-medium">날씨</div>
              <div className="text-xs text-muted-foreground mt-1">
                {gameDetail.weather}
              </div>
            </div>
            <div className="bg-card/50 rounded-lg p-4 text-center border border-border/50">
              <div className="text-2xl mb-2">⏱️</div>
              <div className="text-sm font-medium">소요시간</div>
              <div className="text-xs text-muted-foreground mt-1">
                {gameDetail.duration}
              </div>
            </div>
            <div className="bg-card/50 rounded-lg p-4 text-center border border-border/50">
              <div className="text-2xl mb-2">⚾</div>
              <div className="text-sm font-medium">이닝</div>
              <div className="text-xs text-muted-foreground mt-1">
                {gameDetail.innings}회
              </div>
            </div>
          </div>

          {/* 게임 모드 정보 */}
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            <Badge variant="outline" className="text-sm">
              📱 {gameDetail.mode}
            </Badge>
            <Badge variant="outline" className="text-sm">
              👥 {gameDetail.gameType}
            </Badge>
          </div>

          {/* 팀 구성 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 우리팀 */}
            <div className="bg-blue-600/10 rounded-lg p-6 border border-blue-600/20">
              <div className="text-center mb-4">
                <div className="text-lg font-bold text-blue-400 mb-2">
                  우리팀
                </div>
                <div className="text-sm text-muted-foreground">
                  {gameDetail.myTeam.name}
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 bg-card/30 rounded-lg p-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold">🎮</span>
                  </div>
                  <div>
                    <div className="font-medium">
                      {gameDetail.myTeam.host.gamertag}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      메인 플레이어
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-card/30 rounded-lg p-3">
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold">👥</span>
                  </div>
                  <div>
                    <div className="font-medium">
                      {gameDetail.myTeam.teammate.gamertag}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      팀메이트
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 상대팀 */}
            <div className="bg-red-600/10 rounded-lg p-6 border border-red-600/20">
              <div className="text-center mb-4">
                <div className="text-lg font-bold text-red-400 mb-2">
                  상대팀
                </div>
                <div className="text-sm text-muted-foreground">
                  {gameDetail.opponentTeam.name}
                </div>
              </div>
              <div className="space-y-3">
                {gameDetail.opponentTeam.players.map((player, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 bg-card/30 rounded-lg p-3"
                  >
                    <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold">⚔️</span>
                    </div>
                    <div>
                      <div className="font-medium">{player.gamertag}</div>
                      <div className="text-xs text-muted-foreground">
                        상대방 {idx + 1}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 이닝별 득점 */}
      <Card className="showstats-card">
        <CardHeader>
          <CardTitle className="text-xl">이닝별 득점</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead>팀</TableHead>
                  {gameDetail.gameFlow.map((inning) => (
                    <TableHead key={inning.inning} className="text-center">
                      {inning.inning}
                    </TableHead>
                  ))}
                  <TableHead className="text-center font-bold">R</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="border-border">
                  <TableCell className="font-medium">
                    {gameDetail.myTeam.name}
                  </TableCell>
                  {gameDetail.gameFlow.map((inning) => (
                    <TableCell key={inning.inning} className="text-center">
                      {inning.home > 0 ? (
                        <span className="font-bold text-primary">
                          {inning.home}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">0</span>
                      )}
                    </TableCell>
                  ))}
                  <TableCell className="text-center font-bold showstats-highlight">
                    {gameDetail.myTeam.score}
                  </TableCell>
                </TableRow>
                <TableRow className="border-border">
                  <TableCell className="font-medium">
                    {gameDetail.opponentTeam.name}
                  </TableCell>
                  {gameDetail.gameFlow.map((inning) => (
                    <TableCell key={inning.inning} className="text-center">
                      {inning.away > 0 ? (
                        <span className="font-bold text-primary">
                          {inning.away}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">0</span>
                      )}
                    </TableCell>
                  ))}
                  <TableCell className="text-center font-bold text-muted-foreground">
                    {gameDetail.opponentTeam.score}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* 득점 상황 분석 */}
      <Card className="showstats-card">
        <CardHeader>
          <CardTitle className="text-xl">득점 상황 분석</CardTitle>
          <CardDescription>
            우리 팀의 모든 득점 상황을 베이스 상황과 함께 시각화했습니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* 득점 요약 통계 */}
            <ScoringSummary plays={gameDetail.scoringPlays} />

            {/* 개별 득점 상황 */}
            <div>
              <h3 className="text-lg font-semibold mb-4">개별 득점 상황</h3>
              <div className="space-y-4">
                {gameDetail.scoringPlays.map((play) => (
                  <ScoringPlayCard key={play.id} play={play} />
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 팀원 비교 분석 - 메인 섹션 */}
      <Card className="showstats-card">
        <CardHeader>
          <CardTitle className="text-xl">팀원 비교 분석</CardTitle>
          <CardDescription>같은 팀 동료와의 상세 성과 비교</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="batting" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="batting">타격 비교</TabsTrigger>
              <TabsTrigger value="pitching">투구 비교</TabsTrigger>
            </TabsList>

            {/* 타격 비교 */}
            <TabsContent value="batting" className="space-y-4">
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
                            {gameDetail.myTeam.host.batting.plateAppearances}
                          </TableCell>
                          <TableCell className="text-center font-bold">
                            {
                              gameDetail.myTeam.teammate.batting
                                .plateAppearances
                            }
                          </TableCell>
                          <TableCell className="text-center">
                            {getComparisonIcon(
                              gameDetail.myTeam.host.batting.plateAppearances,
                              gameDetail.myTeam.teammate.batting
                                .plateAppearances
                            )}
                          </TableCell>
                        </TableRow>
                        <TableRow className="border-border">
                          <TableCell>타수 (AB)</TableCell>
                          <TableCell className="text-center font-bold">
                            {gameDetail.myTeam.host.batting.atBats}
                          </TableCell>
                          <TableCell className="text-center font-bold">
                            {gameDetail.myTeam.teammate.batting.atBats}
                          </TableCell>
                          <TableCell className="text-center">
                            {getComparisonIcon(
                              gameDetail.myTeam.host.batting.atBats,
                              gameDetail.myTeam.teammate.batting.atBats
                            )}
                          </TableCell>
                        </TableRow>
                        <TableRow className="border-border">
                          <TableCell>안타 (H)</TableCell>
                          <TableCell
                            className={`text-center font-bold ${
                              gameDetail.myTeam.host.batting.hits >
                              gameDetail.myTeam.teammate.batting.hits
                                ? "showstats-highlight"
                                : ""
                            }`}
                          >
                            {gameDetail.myTeam.host.batting.hits}
                          </TableCell>
                          <TableCell
                            className={`text-center font-bold ${
                              gameDetail.myTeam.teammate.batting.hits >
                              gameDetail.myTeam.host.batting.hits
                                ? "showstats-highlight"
                                : ""
                            }`}
                          >
                            {gameDetail.myTeam.teammate.batting.hits}
                          </TableCell>
                          <TableCell className="text-center">
                            {getComparisonIcon(
                              gameDetail.myTeam.host.batting.hits,
                              gameDetail.myTeam.teammate.batting.hits
                            )}
                          </TableCell>
                        </TableRow>
                        <TableRow className="border-border">
                          <TableCell>홈런 (HR)</TableCell>
                          <TableCell
                            className={`text-center font-bold ${
                              gameDetail.myTeam.host.batting.homeRuns >
                              gameDetail.myTeam.teammate.batting.homeRuns
                                ? "showstats-highlight"
                                : ""
                            }`}
                          >
                            {gameDetail.myTeam.host.batting.homeRuns}
                          </TableCell>
                          <TableCell
                            className={`text-center font-bold ${
                              gameDetail.myTeam.teammate.batting.homeRuns >
                              gameDetail.myTeam.host.batting.homeRuns
                                ? "showstats-highlight"
                                : ""
                            }`}
                          >
                            {gameDetail.myTeam.teammate.batting.homeRuns}
                          </TableCell>
                          <TableCell className="text-center">
                            {getComparisonIcon(
                              gameDetail.myTeam.host.batting.homeRuns,
                              gameDetail.myTeam.teammate.batting.homeRuns
                            )}
                          </TableCell>
                        </TableRow>
                        <TableRow className="border-border">
                          <TableCell>타점 (RBI)</TableCell>
                          <TableCell
                            className={`text-center font-bold ${
                              gameDetail.myTeam.host.batting.rbis >
                              gameDetail.myTeam.teammate.batting.rbis
                                ? "showstats-highlight"
                                : ""
                            }`}
                          >
                            {gameDetail.myTeam.host.batting.rbis}
                          </TableCell>
                          <TableCell
                            className={`text-center font-bold ${
                              gameDetail.myTeam.teammate.batting.rbis >
                              gameDetail.myTeam.host.batting.rbis
                                ? "showstats-highlight"
                                : ""
                            }`}
                          >
                            {gameDetail.myTeam.teammate.batting.rbis}
                          </TableCell>
                          <TableCell className="text-center">
                            {getComparisonIcon(
                              gameDetail.myTeam.host.batting.rbis,
                              gameDetail.myTeam.teammate.batting.rbis
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
                              value={gameDetail.myTeam.host.batting.average}
                              statType="average"
                              format="decimal"
                            />
                          </TableCell>
                          <TableCell className="text-center font-bold">
                            <StatValue
                              value={gameDetail.myTeam.teammate.batting.average}
                              statType="average"
                              format="decimal"
                            />
                          </TableCell>
                          <TableCell className="text-center">
                            {getComparisonIcon(
                              gameDetail.myTeam.host.batting.average,
                              gameDetail.myTeam.teammate.batting.average
                            )}
                          </TableCell>
                        </TableRow>
                        <TableRow className="border-border">
                          <TableCell>출루율 (OBP)</TableCell>
                          <TableCell className="text-center font-bold">
                            <StatValue
                              value={gameDetail.myTeam.host.batting.obp}
                              statType="obp"
                              format="decimal"
                            />
                          </TableCell>
                          <TableCell className="text-center font-bold">
                            <StatValue
                              value={gameDetail.myTeam.teammate.batting.obp}
                              statType="obp"
                              format="decimal"
                            />
                          </TableCell>
                          <TableCell className="text-center">
                            {getComparisonIcon(
                              gameDetail.myTeam.host.batting.obp,
                              gameDetail.myTeam.teammate.batting.obp
                            )}
                          </TableCell>
                        </TableRow>
                        <TableRow className="border-border">
                          <TableCell>장타율 (SLG)</TableCell>
                          <TableCell className="text-center font-bold">
                            <StatValue
                              value={gameDetail.myTeam.host.batting.slg}
                              statType="slg"
                              format="decimal"
                            />
                          </TableCell>
                          <TableCell className="text-center font-bold">
                            <StatValue
                              value={gameDetail.myTeam.teammate.batting.slg}
                              statType="slg"
                              format="decimal"
                            />
                          </TableCell>
                          <TableCell className="text-center">
                            {getComparisonIcon(
                              gameDetail.myTeam.host.batting.slg,
                              gameDetail.myTeam.teammate.batting.slg
                            )}
                          </TableCell>
                        </TableRow>
                        <TableRow className="border-border">
                          <TableCell>OPS</TableCell>
                          <TableCell className="text-center font-bold">
                            <StatValue
                              value={gameDetail.myTeam.host.batting.ops}
                              statType="ops"
                              format="decimal"
                            />
                          </TableCell>
                          <TableCell className="text-center font-bold">
                            <StatValue
                              value={gameDetail.myTeam.teammate.batting.ops}
                              statType="ops"
                              format="decimal"
                            />
                          </TableCell>
                          <TableCell className="text-center">
                            {getComparisonIcon(
                              gameDetail.myTeam.host.batting.ops,
                              gameDetail.myTeam.teammate.batting.ops
                            )}
                          </TableCell>
                        </TableRow>
                        <TableRow className="border-border">
                          <TableCell>득점권 타율</TableCell>
                          <TableCell className="text-center font-bold">
                            <StatValue
                              value={gameDetail.myTeam.host.batting.rispAverage}
                              statType="rispAverage"
                              format="decimal"
                            />
                          </TableCell>
                          <TableCell className="text-center font-bold">
                            <StatValue
                              value={
                                gameDetail.myTeam.teammate.batting.rispAverage
                              }
                              statType="rispAverage"
                              format="decimal"
                            />
                          </TableCell>
                          <TableCell className="text-center">
                            {getComparisonIcon(
                              gameDetail.myTeam.host.batting.rispAverage,
                              gameDetail.myTeam.teammate.batting.rispAverage
                            )}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>

              {/* 클러치 상황 & 추가 스탯 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="text-lg">클러치 상황</CardTitle>
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
                            {gameDetail.myTeam.host.batting.rispAtBats}
                          </TableCell>
                          <TableCell className="text-center font-bold">
                            {gameDetail.myTeam.teammate.batting.rispAtBats}
                          </TableCell>
                          <TableCell className="text-center">
                            {getComparisonIcon(
                              gameDetail.myTeam.host.batting.rispAtBats,
                              gameDetail.myTeam.teammate.batting.rispAtBats
                            )}
                          </TableCell>
                        </TableRow>
                        <TableRow className="border-border">
                          <TableCell>득점권 안타</TableCell>
                          <TableCell
                            className={`text-center font-bold ${
                              gameDetail.myTeam.host.batting.rispHits >
                              gameDetail.myTeam.teammate.batting.rispHits
                                ? "showstats-highlight"
                                : ""
                            }`}
                          >
                            {gameDetail.myTeam.host.batting.rispHits}
                          </TableCell>
                          <TableCell
                            className={`text-center font-bold ${
                              gameDetail.myTeam.teammate.batting.rispHits >
                              gameDetail.myTeam.host.batting.rispHits
                                ? "showstats-highlight"
                                : ""
                            }`}
                          >
                            {gameDetail.myTeam.teammate.batting.rispHits}
                          </TableCell>
                          <TableCell className="text-center">
                            {getComparisonIcon(
                              gameDetail.myTeam.host.batting.rispHits,
                              gameDetail.myTeam.teammate.batting.rispHits
                            )}
                          </TableCell>
                        </TableRow>
                        <TableRow className="border-border">
                          <TableCell>클러치 히트</TableCell>
                          <TableCell
                            className={`text-center font-bold ${
                              gameDetail.myTeam.host.batting.clutchHits /
                                gameDetail.myTeam.host.batting.clutchAtBats >
                              gameDetail.myTeam.teammate.batting.clutchHits /
                                gameDetail.myTeam.teammate.batting.clutchAtBats
                                ? "showstats-highlight"
                                : ""
                            }`}
                          >
                            {gameDetail.myTeam.host.batting.clutchHits}/
                            {gameDetail.myTeam.host.batting.clutchAtBats}
                          </TableCell>
                          <TableCell
                            className={`text-center font-bold ${
                              gameDetail.myTeam.teammate.batting.clutchHits /
                                gameDetail.myTeam.teammate.batting
                                  .clutchAtBats >
                              gameDetail.myTeam.host.batting.clutchHits /
                                gameDetail.myTeam.host.batting.clutchAtBats
                                ? "showstats-highlight"
                                : ""
                            }`}
                          >
                            {gameDetail.myTeam.teammate.batting.clutchHits}/
                            {gameDetail.myTeam.teammate.batting.clutchAtBats}
                          </TableCell>
                          <TableCell className="text-center">
                            {getComparisonIcon(
                              gameDetail.myTeam.host.batting.clutchHits /
                                gameDetail.myTeam.host.batting.clutchAtBats,
                              gameDetail.myTeam.teammate.batting.clutchHits /
                                gameDetail.myTeam.teammate.batting.clutchAtBats
                            )}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="text-lg">기타 스탯</CardTitle>
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
                          <TableCell>2루타</TableCell>
                          <TableCell className="text-center font-bold">
                            {gameDetail.myTeam.host.batting.doubles}
                          </TableCell>
                          <TableCell className="text-center font-bold">
                            {gameDetail.myTeam.teammate.batting.doubles}
                          </TableCell>
                          <TableCell className="text-center">
                            {getComparisonIcon(
                              gameDetail.myTeam.host.batting.doubles,
                              gameDetail.myTeam.teammate.batting.doubles
                            )}
                          </TableCell>
                        </TableRow>
                        <TableRow className="border-border">
                          <TableCell>도루</TableCell>
                          <TableCell className="text-center font-bold">
                            {gameDetail.myTeam.host.batting.stolenBases}
                          </TableCell>
                          <TableCell className="text-center font-bold">
                            {gameDetail.myTeam.teammate.batting.stolenBases}
                          </TableCell>
                          <TableCell className="text-center">
                            {getComparisonIcon(
                              gameDetail.myTeam.host.batting.stolenBases,
                              gameDetail.myTeam.teammate.batting.stolenBases
                            )}
                          </TableCell>
                        </TableRow>
                        <TableRow className="border-border">
                          <TableCell>잔루</TableCell>
                          <TableCell className="text-center font-bold">
                            {gameDetail.myTeam.host.batting.leftOnBase}
                          </TableCell>
                          <TableCell className="text-center font-bold">
                            {gameDetail.myTeam.teammate.batting.leftOnBase}
                          </TableCell>
                          <TableCell className="text-center">
                            {getComparisonIcon(
                              gameDetail.myTeam.teammate.batting.leftOnBase,
                              gameDetail.myTeam.host.batting.leftOnBase
                            )}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* 투구 비교 */}
            <TabsContent value="pitching" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="text-lg">기본 투구 스탯</CardTitle>
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
                          <TableCell>이닝수 (IP)</TableCell>
                          <TableCell className="text-center font-bold">
                            {gameDetail.myTeam.host.pitching.innings}
                          </TableCell>
                          <TableCell className="text-center font-bold">
                            {gameDetail.myTeam.teammate.pitching.innings}
                          </TableCell>
                          <TableCell className="text-center">
                            {getComparisonIcon(
                              gameDetail.myTeam.host.pitching.innings,
                              gameDetail.myTeam.teammate.pitching.innings
                            )}
                          </TableCell>
                        </TableRow>
                        <TableRow className="border-border">
                          <TableCell>피안타 (H)</TableCell>
                          <TableCell className="text-center font-bold">
                            {gameDetail.myTeam.host.pitching.hits}
                          </TableCell>
                          <TableCell className="text-center font-bold">
                            {gameDetail.myTeam.teammate.pitching.hits}
                          </TableCell>
                          <TableCell className="text-center">
                            {getComparisonIcon(
                              gameDetail.myTeam.teammate.pitching.hits,
                              gameDetail.myTeam.host.pitching.hits
                            )}
                          </TableCell>
                        </TableRow>
                        <TableRow className="border-border">
                          <TableCell>실점 (R)</TableCell>
                          <TableCell className="text-center font-bold">
                            {gameDetail.myTeam.host.pitching.runs}
                          </TableCell>
                          <TableCell className="text-center font-bold">
                            {gameDetail.myTeam.teammate.pitching.runs}
                          </TableCell>
                          <TableCell className="text-center">
                            {getComparisonIcon(
                              gameDetail.myTeam.teammate.pitching.runs,
                              gameDetail.myTeam.host.pitching.runs
                            )}
                          </TableCell>
                        </TableRow>
                        <TableRow className="border-border">
                          <TableCell>자책점 (ER)</TableCell>
                          <TableCell className="text-center font-bold">
                            {gameDetail.myTeam.host.pitching.earnedRuns}
                          </TableCell>
                          <TableCell className="text-center font-bold">
                            {gameDetail.myTeam.teammate.pitching.earnedRuns}
                          </TableCell>
                          <TableCell className="text-center">
                            {getComparisonIcon(
                              gameDetail.myTeam.teammate.pitching.earnedRuns,
                              gameDetail.myTeam.host.pitching.earnedRuns
                            )}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="text-lg">고급 투구 스탯</CardTitle>
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
                          <TableCell>ERA</TableCell>
                          <TableCell className="text-center font-bold">
                            <StatValue
                              value={gameDetail.myTeam.host.pitching.era}
                              statType="era"
                              format="decimal"
                            />
                          </TableCell>
                          <TableCell className="text-center font-bold">
                            <StatValue
                              value={gameDetail.myTeam.teammate.pitching.era}
                              statType="era"
                              format="decimal"
                            />
                          </TableCell>
                          <TableCell className="text-center">
                            {getComparisonIcon(
                              gameDetail.myTeam.teammate.pitching.era,
                              gameDetail.myTeam.host.pitching.era
                            )}
                          </TableCell>
                        </TableRow>
                        <TableRow className="border-border">
                          <TableCell>WHIP</TableCell>
                          <TableCell className="text-center font-bold">
                            <StatValue
                              value={gameDetail.myTeam.host.pitching.whip}
                              statType="whip"
                              format="decimal"
                            />
                          </TableCell>
                          <TableCell className="text-center font-bold">
                            <StatValue
                              value={gameDetail.myTeam.teammate.pitching.whip}
                              statType="whip"
                              format="decimal"
                            />
                          </TableCell>
                          <TableCell className="text-center">
                            {getComparisonIcon(
                              gameDetail.myTeam.teammate.pitching.whip,
                              gameDetail.myTeam.host.pitching.whip
                            )}
                          </TableCell>
                        </TableRow>
                        <TableRow className="border-border">
                          <TableCell>삼진율 (K%)</TableCell>
                          <TableCell className="text-center font-bold">
                            <StatValue
                              value={
                                gameDetail.myTeam.host.pitching.strikeoutRate
                              }
                              statType="strikeoutRate"
                              format="percentage"
                            />
                          </TableCell>
                          <TableCell className="text-center font-bold">
                            <StatValue
                              value={
                                gameDetail.myTeam.teammate.pitching
                                  .strikeoutRate
                              }
                              statType="strikeoutRate"
                              format="percentage"
                            />
                          </TableCell>
                          <TableCell className="text-center">
                            {getComparisonIcon(
                              gameDetail.myTeam.host.pitching.strikeoutRate,
                              gameDetail.myTeam.teammate.pitching.strikeoutRate
                            )}
                          </TableCell>
                        </TableRow>
                        <TableRow className="border-border">
                          <TableCell>볼넷율 (BB%)</TableCell>
                          <TableCell className="text-center font-bold">
                            <StatValue
                              value={gameDetail.myTeam.host.pitching.walkRate}
                              statType="walkRate"
                              format="percentage"
                            />
                          </TableCell>
                          <TableCell className="text-center font-bold">
                            <StatValue
                              value={
                                gameDetail.myTeam.teammate.pitching.walkRate
                              }
                              statType="walkRate"
                              format="percentage"
                            />
                          </TableCell>
                          <TableCell className="text-center">
                            {getComparisonIcon(
                              gameDetail.myTeam.teammate.pitching.walkRate,
                              gameDetail.myTeam.host.pitching.walkRate
                            )}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>

              {/* 투구 컨트롤 */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-lg">투구 컨트롤</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>첫구 스트라이크</span>
                        <div className="flex gap-4">
                          <span className="font-bold">
                            {gameDetail.myTeam.host.pitching.firstStrike}
                          </span>
                          <span className="font-bold">
                            {gameDetail.myTeam.teammate.pitching.firstStrike}
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>첫구 스트라이크율</span>
                        <div className="flex gap-4">
                          <span className="font-bold showstats-highlight">
                            {formatStat(
                              gameDetail.myTeam.host.pitching
                                .firstStrikePercentage,
                              true,
                              1
                            )}
                          </span>
                          <span className="font-bold showstats-highlight">
                            {formatStat(
                              gameDetail.myTeam.teammate.pitching
                                .firstStrikePercentage,
                              true,
                              1
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
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
