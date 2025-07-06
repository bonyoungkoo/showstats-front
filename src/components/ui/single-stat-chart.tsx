"use client";

import Image from "next/image";

interface SingleStatChartProps {
  homeTeamName: string;
  awayTeamName: string;
  homeHostValue: number;
  homeTeammateValue: number;
  awayHostValue: number;
  awayTeammateValue: number;
  statName: string;
  format?: "decimal" | "percentage";
  homeColor?: string;
  awayColor?: string;
  homeTeamLogo?: string;
  awayTeamLogo?: string;
}

export function SingleStatChart({
  homeTeamName,
  awayTeamName,
  homeHostValue,
  homeTeammateValue,
  awayHostValue,
  awayTeammateValue,
  statName,
  homeColor = "#0d9488",
  awayColor = "#e11d48",
  format = "decimal",
  homeTeamLogo,
  awayTeamLogo,
}: SingleStatChartProps) {
  const formatValue = (value: number) => {
    if (format === "percentage") {
      return `${(value * 100).toFixed(1)}%`;
    }
    return value.toFixed(3);
  };

  return (
    <div className="border border-border rounded-lg bg-card p-4">
      <h4 className="text-sm font-medium text-card-foreground mb-3">{statName}</h4>

      {/* 홈팀 소제목 */}
      <div className="flex items-center gap-1 mb-2 mt-8">
        <span className="px-1.5 py-0.5 rounded bg-red-400 text-white text-[10px] font-bold">홈팀</span>
        <span className="font-bold text-red-500 text-sm">{homeTeamName}</span>
        {homeTeamLogo && <Image src={homeTeamLogo} alt="홈팀로고" width={18} height={18} className="inline-block rounded-full ml-1 align-middle" />}
      </div>
      {/* 홈팀 호스트 */}
      <div className="space-y-1 mb-2">
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">호스트</span>
          <span className="text-sm font-medium text-foreground">{formatValue(homeHostValue)}</span>
        </div>
        <div className="w-full bg-muted/30 rounded-full h-2">
          <div
            className="h-2 rounded-full transition-all duration-500"
            style={{
              width: `${Math.max((homeHostValue / Math.max(homeHostValue, homeTeammateValue, awayHostValue, awayTeammateValue)) * 100, 5)}%`,
              backgroundColor: homeColor,
            }}
          />
        </div>
      </div>
      {/* 홈팀 팀원 */}
      <div className="space-y-1 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">팀원</span>
          <span className="text-sm font-medium text-foreground">{formatValue(homeTeammateValue)}</span>
        </div>
        <div className="w-full bg-muted/30 rounded-full h-2">
          <div
            className="h-2 rounded-full transition-all duration-500"
            style={{
              width: `${Math.max((homeTeammateValue / Math.max(homeHostValue, homeTeammateValue, awayHostValue, awayTeammateValue)) * 100, 5)}%`,
              backgroundColor: homeColor,
            }}
          />
        </div>
      </div>

      {/* 어웨이팀 소제목 */}
      <div className="flex items-center gap-1 mb-2 mt-8">
        <span className="px-1.5 py-0.5 rounded bg-blue-400 text-white text-[10px] font-bold">어웨이팀</span>
        <span className="font-bold text-blue-500 text-sm">{awayTeamName}</span>
        {awayTeamLogo && <Image src={awayTeamLogo} alt="어웨이팀로고" width={18} height={18} className="inline-block rounded-full ml-1 align-middle" />}
      </div>
      {/* 어웨이팀 호스트 */}
      <div className="space-y-1 mb-2">
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">호스트</span>
          <span className="text-sm font-medium text-foreground">{formatValue(awayHostValue)}</span>
        </div>
        <div className="w-full bg-muted/30 rounded-full h-2">
          <div
            className="h-2 rounded-full transition-all duration-500"
            style={{
              width: `${Math.max((awayHostValue / Math.max(homeHostValue, homeTeammateValue, awayHostValue, awayTeammateValue)) * 100, 5)}%`,
              backgroundColor: awayColor,
            }}
          />
        </div>
      </div>
      {/* 어웨이팀 팀원 */}
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">팀원</span>
          <span className="text-sm font-medium text-foreground">{formatValue(awayTeammateValue)}</span>
        </div>
        <div className="w-full bg-muted/30 rounded-full h-2">
          <div
            className="h-2 rounded-full transition-all duration-500"
            style={{
              width: `${Math.max((awayTeammateValue / Math.max(homeHostValue, homeTeammateValue, awayHostValue, awayTeammateValue)) * 100, 5)}%`,
              backgroundColor: awayColor,
            }}
          />
        </div>
      </div>

      {/* 승패 표시
      <div className="mt-3 pt-3 border-t border-border">
        <div className="flex justify-center">
          {myValue > teammateValue ? (
            <span className="text-xs text-teal-600 font-medium">내가 우세</span>
          ) : myValue < teammateValue ? (
            <span className="text-xs text-rose-600 font-medium">
              팀원이 우세
            </span>
          ) : (
            <span className="text-xs text-muted-foreground font-medium">
              동점
            </span>
          )}
        </div>
      </div> */}
    </div>
  );
}
