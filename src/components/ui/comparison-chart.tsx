"use client";

import { SingleStatChart } from "./single-stat-chart";

interface ComparisonChartProps {
  myStats: {
    battingAverage: number;
    onBasePercentage: number;
    sluggingPercentage: number;
    ops: number;
    rbiAverage: number;
    strikeoutRate: number;
  };
  teammateStats: {
    battingAverage: number;
    onBasePercentage: number;
    sluggingPercentage: number;
    ops: number;
    rbiAverage: number;
    strikeoutRate: number;
  };
}

export function ComparisonChart({
  myStats,
  teammateStats,
}: ComparisonChartProps) {
  // 통일된 색상 - 모든 차트에서 동일하게 사용
  const myColor = "#0d9488"; // teal-600
  const teammateColor = "#e11d48"; // rose-600

  return (
    <div className="space-y-4">
      {/* 첫 번째 줄: 타율, 출루율, 장타율 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SingleStatChart
          myValue={myStats.battingAverage}
          teammateValue={teammateStats.battingAverage}
          statName="타율"
          format="decimal"
          myColor={myColor}
          teammateColor={teammateColor}
        />
        <SingleStatChart
          myValue={myStats.onBasePercentage}
          teammateValue={teammateStats.onBasePercentage}
          statName="출루율"
          format="decimal"
          myColor={myColor}
          teammateColor={teammateColor}
        />
        <SingleStatChart
          myValue={myStats.sluggingPercentage}
          teammateValue={teammateStats.sluggingPercentage}
          statName="장타율"
          format="decimal"
          myColor={myColor}
          teammateColor={teammateColor}
        />
      </div>

      {/* 두 번째 줄: OPS, 득점권타율, 삼진율 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SingleStatChart
          myValue={myStats.ops}
          teammateValue={teammateStats.ops}
          statName="OPS"
          format="decimal"
          myColor={myColor}
          teammateColor={teammateColor}
        />
        <SingleStatChart
          myValue={myStats.rbiAverage}
          teammateValue={teammateStats.rbiAverage}
          statName="득점권타율"
          format="decimal"
          myColor={myColor}
          teammateColor={teammateColor}
        />
        <SingleStatChart
          myValue={myStats.strikeoutRate}
          teammateValue={teammateStats.strikeoutRate}
          statName="삼진율"
          format="percentage"
          myColor={myColor}
          teammateColor={teammateColor}
        />
      </div>
    </div>
  );
}
