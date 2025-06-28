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
    <div
      className={cn("border border-border rounded-lg p-6 space-y-4", className)}
    >
      {/* 상황 정보 헤더 - 한 줄로 깔끔하게 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* 이닝 */}
          <div className="flex items-center gap-1 text-sm">
            <span className="font-semibold text-foreground">
              {inningInfo.inningNum}
            </span>
            <span className="text-muted-foreground">{inningInfo.halfText}</span>
          </div>

          {/* 구분선 */}
          <div className="w-px h-4 bg-border"></div>

          {/* 아웃카운트 */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">OUT</span>
            <div className="flex gap-1">
              {Array.from({ length: 3 }, (_, i) => (
                <div
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full ${
                    i < outsInfo.outs ? "bg-orange-500" : "bg-muted"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* 구분선 */}
          <div className="w-px h-4 bg-border"></div>

          {/* 베이스 상황 */}
          <span className="text-sm text-muted-foreground">
            {basesSituation}
          </span>
        </div>

        {/* 득점 */}
        <div className="flex items-center gap-1 px-2 py-1 bg-green-500/10 rounded text-green-600">
          <span className="text-sm font-semibold">+{play.runsScored}</span>
          <span className="text-xs">점</span>
        </div>
      </div>

      {/* 메인 컨텐츠 영역 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* 베이스볼 다이아몬드 - 패딩으로 영역 확보 */}
        <div className="flex justify-center lg:justify-start p-4">
          <BaseballDiamond
            runners={play.runners}
            size="sm"
            showLabels={false}
          />
        </div>

        {/* 플레이 정보 */}
        <div className="lg:col-span-2 space-y-3">
          {/* 타자와 결과 */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-foreground">
                {play.batter}
              </span>
              <span
                className={`px-2 py-0.5 rounded text-xs font-medium ${
                  play.batterOwner === "내 계정"
                    ? "bg-blue-500/10 text-blue-600"
                    : "bg-purple-500/10 text-purple-600"
                }`}
              >
                {play.batterOwner}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">→</span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  play.result.includes("홈런")
                    ? "bg-yellow-500/10 text-yellow-600 border border-yellow-500/20"
                    : play.result.includes("안타") ||
                        play.result.includes("2루타") ||
                        play.result.includes("3루타")
                      ? "bg-green-500/10 text-green-600 border border-green-500/20"
                      : "bg-muted/50 text-foreground border border-border"
                }`}
              >
                {play.result}
              </span>
            </div>
          </div>

          {/* 주자 정보 (있는 경우만) */}
          {runnerInfo.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {runnerInfo.map((runner, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-1 px-2 py-1 bg-muted/30 rounded text-xs"
                >
                  <span className="font-medium text-blue-600">
                    {runner.base}
                  </span>
                  <span className="text-muted-foreground">{runner.name}</span>
                </div>
              ))}
            </div>
          )}

          {/* 플레이 설명 */}
          <p className="text-sm text-muted-foreground leading-relaxed">
            {play.description}
          </p>
        </div>
      </div>
    </div>
  );
}
