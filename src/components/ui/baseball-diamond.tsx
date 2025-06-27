import { cn } from "@/lib/utils";

export interface BaseRunners {
  first?: boolean | string;
  second?: boolean | string;
  third?: boolean | string;
}

export interface ScoringPlay {
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

interface BaseballDiamondProps {
  runners: BaseRunners;
  showLabels?: boolean;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
}

export function BaseballDiamond({
  runners,
  showLabels = true,
  size = "md",
  className,
}: BaseballDiamondProps) {
  const sizeClasses = {
    xs: "w-12 h-12",
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
  };

  const baseSize = {
    xs: "w-1.5 h-1.5",
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4",
  };

  const textSize = {
    xs: "text-[6px]",
    sm: "text-[8px]",
    md: "text-[10px]",
    lg: "text-xs",
  };

  return (
    <div className={cn("relative", sizeClasses[size], className)}>
      {/* 다이아몬드 배경 */}
      <div className="absolute inset-0 rotate-45 border-2 border-muted-foreground/40 bg-gradient-to-br from-green-900/30 to-green-800/20" />

      {/* 홈 플레이트 */}
      <div
        className={cn(
          "absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45",
          baseSize[size],
          "bg-white border-2 border-muted-foreground shadow-md"
        )}
      />
      {showLabels && (
        <div
          className={cn(
            "absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full mt-1",
            textSize[size],
            "text-muted-foreground text-center"
          )}
        >
          H
        </div>
      )}

      {/* 1루 */}
      <div
        className={cn(
          "absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 rotate-45",
          baseSize[size],
          runners.first
            ? "bg-blue-400 border-2 border-blue-300 shadow-lg shadow-blue-400/50 animate-pulse"
            : "bg-muted/60 border border-muted-foreground/60"
        )}
      />

      {/* 2루 */}
      <div
        className={cn(
          "absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-45",
          baseSize[size],
          runners.second
            ? "bg-blue-400 border-2 border-blue-300 shadow-lg shadow-blue-400/50 animate-pulse"
            : "bg-muted/60 border border-muted-foreground/60"
        )}
      />

      {/* 3루 */}
      <div
        className={cn(
          "absolute left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-45",
          baseSize[size],
          runners.third
            ? "bg-blue-400 border-2 border-blue-300 shadow-lg shadow-blue-400/50 animate-pulse"
            : "bg-muted/60 border border-muted-foreground/60"
        )}
      />
    </div>
  );
}

interface ScoringPlayCardProps {
  play: ScoringPlay;
  className?: string;
}

export function ScoringPlayCard({ play, className }: ScoringPlayCardProps) {
  const getInningDisplay = (inning: number, half: "top" | "bottom") => {
    const inningNum = inning;
    const halfText = half === "top" ? "초" : "말";
    return { inningNum, halfText };
  };

  const getOutsDisplay = (outs: number) => {
    return { outs };
  };

  const getRunnerInfo = (runners: BaseRunners) => {
    const runnerList = [];
    if (runners.third)
      runnerList.push({
        base: "3루",
        name: typeof runners.third === "string" ? runners.third : "주자",
      });
    if (runners.second)
      runnerList.push({
        base: "2루",
        name: typeof runners.second === "string" ? runners.second : "주자",
      });
    if (runners.first)
      runnerList.push({
        base: "1루",
        name: typeof runners.first === "string" ? runners.first : "주자",
      });

    return runnerList;
  };

  const getBasesSituation = (runners: BaseRunners) => {
    const bases = [];
    if (runners.first) bases.push("1루");
    if (runners.second) bases.push("2루");
    if (runners.third) bases.push("3루");

    if (bases.length === 0) return "무주자";
    if (bases.length === 3) return "만루";
    return bases.join("·");
  };

  const inningInfo = getInningDisplay(play.inning, play.inningHalf);
  const outsInfo = getOutsDisplay(play.outs);
  const runnerInfo = getRunnerInfo(play.runners);
  const basesSituation = getBasesSituation(play.runners);

  return (
    <div className={cn("showstats-card p-5 space-y-6", className)}>
      {/* 게임 상황 헤더 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
          {/* 이닝 정보 */}
          <div className="flex items-center gap-1 px-2 sm:px-3 py-1 bg-blue-500/20 rounded-full">
            <span className="text-base sm:text-lg font-bold text-blue-400">
              {inningInfo.inningNum}
            </span>
            <span className="text-xs sm:text-sm font-medium text-blue-300">
              {inningInfo.halfText}
            </span>
          </div>

          {/* 아웃카운트 */}
          <div className="flex items-center gap-2 px-2 sm:px-3 py-1 bg-orange-500/20 rounded-full">
            <span className="text-xs sm:text-sm font-medium text-orange-300">
              OUT
            </span>
            <div className="flex gap-1">
              {Array.from({ length: 3 }, (_, i) => (
                <div
                  key={i}
                  className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full border ${
                    i < outsInfo.outs
                      ? "bg-orange-400 border-orange-400"
                      : "bg-transparent border-orange-400/50"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* 베이스 상황 */}
          <div className="flex items-center gap-2 px-2 sm:px-3 py-1 bg-green-500/20 rounded-full">
            <span className="text-xs sm:text-sm font-medium text-green-300">
              {basesSituation}
            </span>
          </div>

          {/* 득점 - 모바일에서는 같은 줄에 표시 */}
          <div className="flex items-center gap-2 px-2 sm:px-3 py-1 bg-yellow-500/20 rounded-full sm:hidden">
            <span className="text-base font-bold text-yellow-400">
              +{play.runsScored}
            </span>
            <span className="text-xs text-yellow-300">점</span>
          </div>
        </div>

        {/* 득점 - 데스크톱에서만 별도 표시 */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-yellow-500/20 rounded-full">
          <span className="text-lg font-bold text-yellow-400">
            +{play.runsScored}
          </span>
          <span className="text-sm text-yellow-300">점</span>
        </div>
      </div>

      {/* 상세 정보 */}
      <div className="flex flex-col md:grid md:grid-cols-12 gap-4">
        {/* 모바일: 세로 배치, 데스크톱: 가로 배치 */}

        {/* 베이스 다이아몬드와 주자 정보 - 항상 가로 배치 */}
        <div className="flex gap-4 md:col-span-5">
          {/* 베이스 다이아몬드 */}
          <div className="flex justify-center items-center flex-shrink-0">
            <BaseballDiamond
              runners={play.runners}
              size="xs"
              showLabels={false}
              className="sm:hidden"
            />
            <BaseballDiamond
              runners={play.runners}
              size="sm"
              showLabels={false}
              className="hidden sm:block"
            />
          </div>

          {/* 주자 정보 목록 */}
          <div className="flex flex-col justify-center space-y-1 md:space-y-2 flex-1 min-w-0">
            {runnerInfo.length > 0 ? (
              runnerInfo.map((runner, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs">
                  <span className="font-medium text-blue-400 w-6 flex-shrink-0">
                    {runner.base}
                  </span>
                  <span className="text-blue-300 px-2 py-1 bg-blue-500/10 rounded inline-block">
                    {runner.name}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-xs text-muted-foreground px-2 py-1">
                무주자
              </div>
            )}
          </div>
        </div>

        {/* 플레이 정보 */}
        <div className="md:col-span-7 flex flex-col justify-center space-y-3">
          {/* 타자 정보 */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex items-center gap-2 px-2 py-1 bg-primary/10 rounded flex-wrap">
              <span className="font-bold text-lg">{play.batter}</span>
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${
                  play.batterOwner === "내 계정"
                    ? "bg-blue-500/20 text-blue-400"
                    : "bg-purple-500/20 text-purple-400"
                }`}
              >
                {play.batterOwner}
              </span>
            </div>

            <div className="flex items-center justify-between sm:justify-start gap-3">
              <div className="flex items-center gap-2 relative py-2">
                <div className="text-lg">🏏</div>
                <div className="relative w-8 h-6 overflow-visible">
                  <div className="absolute left-0 w-2 h-2 bg-white rounded-full animate-[baseBall_1.5s_ease-out_infinite] shadow-sm"></div>
                </div>
              </div>

              <div
                className={`px-3 py-1 rounded-full text-sm font-bold border-2 flex items-center ${
                  play.result.includes("홈런")
                    ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/50"
                    : play.result.includes("안타") ||
                        play.result.includes("2루타") ||
                        play.result.includes("3루타")
                      ? "bg-green-500/20 text-green-400 border-green-500/50"
                      : "bg-primary/20 text-primary border-primary/50"
                }`}
              >
                {play.result}
              </div>
            </div>
          </div>

          {/* 플레이 설명 */}
          <div className="text-sm leading-relaxed bg-muted/20 p-3 rounded">
            {play.description}
          </div>
        </div>
      </div>
    </div>
  );
}
