"use client";

import { TeamAnalysis } from "@/hooks/useGameAnalysis";
import { SingleStatChart } from "./single-stat-chart";

interface ComparisonChartProps {
  homeStats: TeamAnalysis;
  awayStats: TeamAnalysis;
  homeTeamName: string;
  awayTeamName: string;
  homeTeamLogo?: string;
  awayTeamLogo?: string;
}

export function ComparisonChart({
  homeStats,
  awayStats,
  homeTeamName,
  awayTeamName,
  homeTeamLogo,
  awayTeamLogo,
}: ComparisonChartProps) {
  // 통일된 색상 - 모든 차트에서 동일하게 사용
  const homeColor = "#0d9488"; // teal-600
  const awayColor = "#e11d48"; // rose-600

  return (
    <div className="space-y-4">
      {/* 첫 번째 줄: 타율, 출루율, 장타율 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SingleStatChart
          homeTeamName={homeTeamName}
          awayTeamName={awayTeamName}
          awayHostValue={awayStats.hostStats.average}
          awayTeammateValue={awayStats.teammateStats.average}
          homeHostValue={homeStats.hostStats.average}
          homeTeammateValue={homeStats.teammateStats.average}
          statName="타율"
          format="decimal"
          homeColor={homeColor}
          awayColor={awayColor}
          homeTeamLogo={homeTeamLogo}
          awayTeamLogo={awayTeamLogo}
        />
        <SingleStatChart
          homeTeamName={homeTeamName}
          awayTeamName={awayTeamName}
          awayHostValue={awayStats.hostStats.obp}
          awayTeammateValue={awayStats.teammateStats.obp}
          homeHostValue={homeStats.hostStats.obp}
          homeTeammateValue={homeStats.teammateStats.obp}
          statName="출루율"
          format="decimal"
          homeColor={homeColor}
          awayColor={awayColor}
          homeTeamLogo={homeTeamLogo}
          awayTeamLogo={awayTeamLogo}
        />
        <SingleStatChart
          homeTeamName={homeTeamName}
          awayTeamName={awayTeamName}
          awayHostValue={awayStats.hostStats.slg}
          awayTeammateValue={awayStats.teammateStats.slg}
          homeHostValue={homeStats.hostStats.slg}
          homeTeammateValue={homeStats.teammateStats.slg}
          statName="장타율"
          format="decimal"
          homeColor={homeColor}
          awayColor={awayColor}
          homeTeamLogo={homeTeamLogo}
          awayTeamLogo={awayTeamLogo}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SingleStatChart
          homeTeamName={homeTeamName}
          awayTeamName={awayTeamName}
          awayHostValue={awayStats.hostStats.ops}
          awayTeammateValue={awayStats.teammateStats.ops}
          homeHostValue={homeStats.hostStats.ops}
          homeTeammateValue={homeStats.teammateStats.ops}
          statName="OPS"
          format="decimal"
          homeColor={homeColor}
          awayColor={awayColor}
          homeTeamLogo={homeTeamLogo}
          awayTeamLogo={awayTeamLogo}
        />
        <SingleStatChart
          homeTeamName={homeTeamName}
          awayTeamName={awayTeamName}
          awayHostValue={awayStats.hostStats.rispAverage}
          awayTeammateValue={awayStats.teammateStats.rispAverage}
          homeHostValue={homeStats.hostStats.rispAverage}
          homeTeammateValue={homeStats.teammateStats.rispAverage}
          statName="득점권타율"
          format="decimal"
          homeColor={homeColor}
          awayColor={awayColor}
          homeTeamLogo={homeTeamLogo}
          awayTeamLogo={awayTeamLogo}
        />
        <SingleStatChart
          homeTeamName={homeTeamName}
          awayTeamName={awayTeamName}
          awayHostValue={awayStats.hostStats.strikeouts / awayStats.hostStats.atBats}
          awayTeammateValue={awayStats.teammateStats.strikeouts / awayStats.teammateStats.atBats}
          homeHostValue={homeStats.hostStats.strikeouts / homeStats.hostStats.atBats}
          homeTeammateValue={homeStats.teammateStats.strikeouts / homeStats.teammateStats.atBats}
          statName="삼진율"
          format="percentage"
          homeColor={homeColor}
          awayColor={awayColor}
          homeTeamLogo={homeTeamLogo}
          awayTeamLogo={awayTeamLogo}
        />
      </div>
    </div>
  );
}
