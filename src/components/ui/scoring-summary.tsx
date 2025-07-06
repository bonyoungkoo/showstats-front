import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { BaseballDiamond, BaseRunners } from "./baseball-diamond";
import { AtBatEvent } from "@/hooks/useGameAnalysis";

export interface ScoringPlayData {
  id: string;
  inning: number;
  inningHalf: "top" | "bottom";
  outs: number;
  runners: BaseRunners;
  batter: string;
  batterOwner: string;
  result: string;
  runsScored: number;
  description: string;
}

// interface AtBatDetail {
//   batter: string;
//   inning: number;
//   isTopInning: boolean;
//   log: string[];
//   result: string;
//   rbi: number;
//   risp: boolean;
//   runnersBefore: { [key: string]: number };
//   outsBefore: number;
//   owner: "my" | "friend";
// }

interface ScoringSummaryProps {
  plays: ScoringPlayData[];
  allAtBats?: AtBatEvent[]; // 전체 타석 데이터 추가
  className?: string;
}

export function ScoringSummary({
  plays,
  allAtBats,
  className,
}: ScoringSummaryProps) {
  // 득점 상황 분석
  const totalRuns = plays.reduce((sum, play) => sum + play.runsScored, 0);
  const totalPlays = plays.length;

  // 주자 상황별 통계 (boolean 또는 string 값 모두 처리)
  const hasRunner = (runner: boolean | string | undefined) => Boolean(runner);

  // 전체 타석에서 주자 상황별 통계 계산
  const calculateRunnerSituations = (atBats: AtBatEvent[]) => {
    return {
      empty: atBats.filter(
        (ab) =>
          Object.keys(ab.runnersBefore ?? {}).length === 0 ||
          Object.values(ab.runnersBefore ?? {}).every((base) => !base)
      ).length,
      risp: atBats.filter((ab) =>
        Object.values(ab.runnersBefore ?? {}).some((base) => base && base >= 2)
      ).length,
      loaded: atBats.filter((ab) => {
        const runners = Object.values(ab.runnersBefore ?? {});
        return (
          runners.includes(1) && runners.includes(2) && runners.includes(3)
        );
      }).length,
      first: atBats.filter((ab) => {
        const runners = Object.values(ab.runnersBefore ?? {});
        return (
          runners.includes(1) && !runners.includes(2) && !runners.includes(3)
        );
      }).length,
      second: atBats.filter((ab) => {
        const runners = Object.values(ab.runnersBefore ?? {});
        return (
          !runners.includes(1) && runners.includes(2) && !runners.includes(3)
        );
      }).length,
      third: atBats.filter((ab) => {
        const runners = Object.values(ab.runnersBefore ?? {});
        return (
          !runners.includes(1) && !runners.includes(2) && runners.includes(3)
        );
      }).length,
      firstSecond: atBats.filter((ab) => {
        const runners = Object.values(ab.runnersBefore ?? {});
        return (
          runners.includes(1) && runners.includes(2) && !runners.includes(3)
        );
      }).length,
      firstThird: atBats.filter((ab) => {
        const runners = Object.values(ab.runnersBefore ?? {});
        return (
          runners.includes(1) && !runners.includes(2) && runners.includes(3)
        );
      }).length,
      secondThird: atBats.filter((ab) => {
        const runners = Object.values(ab.runnersBefore ?? {});
        return (
          !runners.includes(1) && runners.includes(2) && runners.includes(3)
        );
      }).length,
    };
  };

  // 전체 타석에서의 주자 상황별 총 횟수
  const totalRunnerSituations = allAtBats
    ? calculateRunnerSituations(allAtBats)
    : null;

  const runnerSituations = {
    empty: plays.filter(
      (p) =>
        !hasRunner(p.runners.first) &&
        !hasRunner(p.runners.second) &&
        !hasRunner(p.runners.third)
    ).length,
    risp: plays.filter(
      (p) => hasRunner(p.runners.second) || hasRunner(p.runners.third)
    ).length, // 득점권
    loaded: plays.filter(
      (p) =>
        hasRunner(p.runners.first) &&
        hasRunner(p.runners.second) &&
        hasRunner(p.runners.third)
    ).length,
    first: plays.filter(
      (p) =>
        hasRunner(p.runners.first) &&
        !hasRunner(p.runners.second) &&
        !hasRunner(p.runners.third)
    ).length,
    second: plays.filter(
      (p) =>
        !hasRunner(p.runners.first) &&
        hasRunner(p.runners.second) &&
        !hasRunner(p.runners.third)
    ).length,
    third: plays.filter(
      (p) =>
        !hasRunner(p.runners.first) &&
        !hasRunner(p.runners.second) &&
        hasRunner(p.runners.third)
    ).length,
    firstSecond: plays.filter(
      (p) =>
        hasRunner(p.runners.first) &&
        hasRunner(p.runners.second) &&
        !hasRunner(p.runners.third)
    ).length,
    firstThird: plays.filter(
      (p) =>
        hasRunner(p.runners.first) &&
        !hasRunner(p.runners.second) &&
        hasRunner(p.runners.third)
    ).length,
    secondThird: plays.filter(
      (p) =>
        !hasRunner(p.runners.first) &&
        hasRunner(p.runners.second) &&
        hasRunner(p.runners.third)
    ).length,
  };

  // 아웃카운트별 통계
  const outCounts = {
    noOuts: plays.filter((p) => p.outs === 0).length,
    oneOut: plays.filter((p) => p.outs === 1).length,
    twoOuts: plays.filter((p) => p.outs === 2).length,
  };

  // 선수별 통계
  const playerStats = plays.reduce(
    (acc, play) => {
      if (!acc[play.batter]) {
        acc[play.batter] = { plays: 0, runs: 0 };
      }
      acc[play.batter].plays++;
      acc[play.batter].runs += play.runsScored;
      return acc;
    },
    {} as Record<string, { plays: number; runs: number }>
  );

  // 이닝별 득점 분포
  const inningStats = plays.reduce(
    (acc, play) => {
      if (!acc[play.inning]) {
        acc[play.inning] = { plays: 0, runs: 0 };
      }
      acc[play.inning].plays++;
      acc[play.inning].runs += play.runsScored;
      return acc;
    },
    {} as Record<number, { plays: number; runs: number }>
  );

  // 득점 타입 분석 (RBI가 있는 경우만)
  const scoringTypes = {
    homerun: plays.filter(
      (p) => p.runsScored > 0 && p.result.includes("home run")
    ).length,
    hit: plays.filter(
      (p) =>
        p.runsScored > 0 &&
        (p.result.includes("single") ||
          p.result.includes("double") ||
          p.result.includes("triple")) &&
        !p.result.includes("home run")
    ).length,
    sacrifice: plays.filter(
      (p) => p.runsScored > 0 && p.result.includes("sacrifice")
    ).length,
    other: plays.filter(
      (p) =>
        p.runsScored > 0 &&
        !p.result.includes("home run") &&
        !p.result.includes("single") &&
        !p.result.includes("double") &&
        !p.result.includes("triple") &&
        !p.result.includes("sacrifice")
    ).length,
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 전체 득점 요약 */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-lg">득점 요약</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold showstats-highlight">
                {totalRuns}
              </div>
              <div className="text-sm text-muted-foreground">총 득점</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold showstats-highlight">
                {totalPlays}
              </div>
              <div className="text-sm text-muted-foreground">득점 상황</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold showstats-highlight">
                {totalPlays > 0 ? (totalRuns / totalPlays).toFixed(1) : "0.0"}
              </div>
              <div className="text-sm text-muted-foreground">상황당 득점</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold showstats-highlight">
                {runnerSituations.risp}
              </div>
              <div className="text-sm text-muted-foreground">득점권 상황</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 주자 상황별 분석 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-lg">주자 상황별 득점</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* 싱글 베이스 상황 */}
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-3">
                  싱글 베이스
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col items-center gap-2 p-3 bg-muted/10 rounded">
                    <BaseballDiamond
                      runners={{ first: false, second: false, third: false }}
                      size="xs"
                      showLabels={false}
                    />
                    <span className="text-xs text-center">주자없음</span>
                    <span
                      className={`font-bold text-sm ${runnerSituations.empty > 0 ? "showstats-highlight" : ""}`}
                    >
                      {runnerSituations.empty}회 /{" "}
                      {totalRunnerSituations?.empty || 0}회
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-2 p-3 bg-muted/10 rounded">
                    <BaseballDiamond
                      runners={{ first: "주자", second: false, third: false }}
                      size="xs"
                      showLabels={false}
                    />
                    <span className="text-xs text-center">1루</span>
                    <span
                      className={`font-bold text-sm ${runnerSituations.first > 0 ? "showstats-highlight" : ""}`}
                    >
                      {runnerSituations.first}회 /{" "}
                      {totalRunnerSituations?.first || 0}회
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-2 p-3 bg-muted/10 rounded">
                    <BaseballDiamond
                      runners={{ first: false, second: "주자", third: false }}
                      size="xs"
                      showLabels={false}
                    />
                    <span className="text-xs text-center">2루</span>
                    <span
                      className={`font-bold text-sm ${runnerSituations.second > 0 ? "showstats-highlight" : ""}`}
                    >
                      {runnerSituations.second}회 /{" "}
                      {totalRunnerSituations?.second || 0}회
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-2 p-3 bg-muted/10 rounded">
                    <BaseballDiamond
                      runners={{ first: false, second: false, third: "주자" }}
                      size="xs"
                      showLabels={false}
                    />
                    <span className="text-xs text-center">3루</span>
                    <span
                      className={`font-bold text-sm ${runnerSituations.third > 0 ? "showstats-highlight" : ""}`}
                    >
                      {runnerSituations.third}회 /{" "}
                      {totalRunnerSituations?.third || 0}회
                    </span>
                  </div>
                </div>
              </div>

              {/* 멀티 베이스 상황 */}
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-3">
                  멀티 베이스
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col items-center gap-2 p-3 bg-muted/10 rounded">
                    <BaseballDiamond
                      runners={{ first: "주자", second: "주자", third: false }}
                      size="xs"
                      showLabels={false}
                    />
                    <span className="text-xs text-center">1·2루</span>
                    <span
                      className={`font-bold text-sm ${runnerSituations.firstSecond > 0 ? "showstats-highlight" : ""}`}
                    >
                      {runnerSituations.firstSecond}회 /{" "}
                      {totalRunnerSituations?.firstSecond || 0}회
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-2 p-3 bg-muted/10 rounded">
                    <BaseballDiamond
                      runners={{ first: "주자", second: false, third: "주자" }}
                      size="xs"
                      showLabels={false}
                    />
                    <span className="text-xs text-center">1·3루</span>
                    <span
                      className={`font-bold text-sm ${runnerSituations.firstThird > 0 ? "showstats-highlight" : ""}`}
                    >
                      {runnerSituations.firstThird}회 /{" "}
                      {totalRunnerSituations?.firstThird || 0}회
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-2 p-3 bg-muted/10 rounded">
                    <BaseballDiamond
                      runners={{ first: false, second: "주자", third: "주자" }}
                      size="xs"
                      showLabels={false}
                    />
                    <span className="text-xs text-center">2·3루</span>
                    <span
                      className={`font-bold text-sm ${runnerSituations.secondThird > 0 ? "showstats-highlight" : ""}`}
                    >
                      {runnerSituations.secondThird}회 /{" "}
                      {totalRunnerSituations?.secondThird || 0}회
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-2 p-3 bg-muted/10 rounded">
                    <BaseballDiamond
                      runners={{ first: "주자", second: "주자", third: "주자" }}
                      size="xs"
                      showLabels={false}
                    />
                    <span className="text-xs text-center">만루</span>
                    <span
                      className={`font-bold text-sm ${runnerSituations.loaded > 0 ? "showstats-highlight" : ""}`}
                    >
                      {runnerSituations.loaded}회 /{" "}
                      {totalRunnerSituations?.loaded || 0}회
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-lg">아웃카운트별 득점</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>0아웃</span>
                  <span
                    className={`font-bold ${outCounts.noOuts > 0 ? "showstats-highlight" : ""}`}
                  >
                    {outCounts.noOuts}회
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>1아웃</span>
                  <span
                    className={`font-bold ${outCounts.oneOut > 0 ? "showstats-highlight" : ""}`}
                  >
                    {outCounts.oneOut}회
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>2아웃</span>
                  <span
                    className={`font-bold ${outCounts.twoOuts > 0 ? "showstats-highlight" : ""}`}
                  >
                    {outCounts.twoOuts}회
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-lg">이닝별 득점 분포</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(inningStats)
                  .sort(([a], [b]) => Number(a) - Number(b))
                  .map(([inning, stats]) => (
                    <div
                      key={inning}
                      className="flex justify-between items-center"
                    >
                      <span>{inning}회</span>
                      <div className="text-right">
                        <span className="font-bold showstats-highlight mr-2">
                          {stats.runs}점
                        </span>
                        <span className="text-sm text-muted-foreground">
                          ({stats.plays}회)
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-lg">득점 타입 분석</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
                    홈런
                  </span>
                  <span
                    className={`font-bold ${scoringTypes.homerun > 0 ? "showstats-highlight" : ""}`}
                  >
                    {scoringTypes.homerun}회
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                    안타
                  </span>
                  <span
                    className={`font-bold ${scoringTypes.hit > 0 ? "showstats-highlight" : ""}`}
                  >
                    {scoringTypes.hit}회
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                    희생타
                  </span>
                  <span
                    className={`font-bold ${scoringTypes.sacrifice > 0 ? "showstats-highlight" : ""}`}
                  >
                    {scoringTypes.sacrifice}회
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-gray-500 rounded-full"></span>
                    기타
                  </span>
                  <span
                    className={`font-bold ${scoringTypes.other > 0 ? "showstats-highlight" : ""}`}
                  >
                    {scoringTypes.other}회
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 선수별 득점 기여도 */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-lg">선수별 득점 기여도</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(playerStats).map(([player, stats]) => (
              <div
                key={player}
                className="flex justify-between items-center p-3 bg-muted/20 rounded"
              >
                <div>
                  <div className="font-medium">{player}</div>
                  <div className="text-sm text-muted-foreground">
                    {stats.plays}번의 득점 상황
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold showstats-highlight">
                    {stats.runs}점
                  </div>
                  <div className="text-sm text-muted-foreground">
                    평균{" "}
                    {stats.plays > 0
                      ? (stats.runs / stats.plays).toFixed(1)
                      : "0.0"}
                    점
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
