"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import {
  getBattingAverageGrade,
  getERAGrade,
  STAT_COLORS,
} from "@/lib/stat-colors";

interface GameData {
  result: string;
}

interface UserStats {
  username: string;
  display_level: string;
  games_played: string;
  vanity: {
    nameplate_equipped: string;
    icon_equipped: string;
  };
  most_played_modes: {
    dd_time: string;
    playnow_time: string;
    rtts_time: string;
    [key: string]: string;
  };
  lifetime_hitting_stats: Array<{ [key: string]: number }>;
  online_data: Array<{
    year: string;
    wins: string;
    loses: string;
    hr: string;
    batting_average: string;
    era: string;
  }>;
}

interface StatsChartsProps {
  gameData: GameData[];
  userStats?: UserStats | null;
}

export default function StatsCharts({ gameData, userStats }: StatsChartsProps) {
  // 승률 계산
  const wins = gameData.filter((game) => game.result === "승리").length;
  const losses = gameData.filter((game) => game.result === "패배").length;
  const totalGames = wins + losses;
  const winRate = totalGames > 0 ? Math.round((wins / totalGames) * 100) : 0;

  // 게임 데이터가 없으면 기본 데이터 사용
  const hasGameData = totalGames > 0;

  // 원형 그래프 데이터
  const pieData = hasGameData
    ? [
        { name: "승리", value: wins, color: "#3b82f6" },
        { name: "패배", value: losses, color: "#ef4444" },
      ]
    : [{ name: "데이터 없음", value: 1, color: "#6b7280" }];

  // 유저 API 데이터에서 통계 가져오기 (있는 경우)
  const currentSeasonData =
    userStats?.online_data?.find((data) => data.year === "2025") ||
    userStats?.online_data?.find((data) => data.year === "Total");

  // 막대 그래프 데이터 (타율, 평균자책점만)
  const battingAvg = currentSeasonData
    ? parseFloat(currentSeasonData.batting_average)
    : 0.275;
  const era = currentSeasonData ? parseFloat(currentSeasonData.era) : 3.5;

  const barData = [
    {
      name: "타율",
      value: battingAvg,
      colorConfig: STAT_COLORS[getBattingAverageGrade(battingAvg)],
      max: 0.4, // 타율 최대값
      displayValue: currentSeasonData ? battingAvg.toFixed(3) : "정보 없음",
    },
    {
      name: "평균자책점",
      value: era,
      colorConfig: STAT_COLORS[getERAGrade(era)],
      max: 6.0, // ERA 최대값
      displayValue: currentSeasonData ? era.toFixed(2) : "정보 없음",
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
      {/* 승률 원형 그래프 */}
      <Card className="showstats-card">
        <CardContent className="p-3">
          <div className="flex items-center gap-3">
            <div className="h-16 w-16 flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={28}
                    innerRadius={16}
                    fill="#8884d8"
                    dataKey="value"
                    stroke="rgba(30, 41, 59, 1)"
                    strokeWidth={2}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="relative -mt-10 flex items-center justify-center">
                <span className="text-xs font-bold text-foreground">
                  {hasGameData ? `${winRate}%` : "N/A"}
                </span>
              </div>
            </div>
            <div className="flex-1">
              <div className="space-y-1 text-xs">
                {hasGameData ? (
                  <>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <span>승리</span>
                      </div>
                      <span className="font-semibold">{wins}게임</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                        <span>패배</span>
                      </div>
                      <span className="font-semibold">{losses}게임</span>
                    </div>
                  </>
                ) : (
                  <div className="text-center text-muted-foreground">
                    게임 기록이 없습니다
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 주요 스탯 가로 막대 그래프 */}
      <Card className="showstats-card">
        <CardContent className="p-3">
          <div className="space-y-2">
            {barData.map((stat, index) => (
              <div key={index} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${stat.colorConfig.bgColor}`}
                    ></div>
                    <span>{stat.name}</span>
                  </div>
                  <span className={`font-semibold ${stat.colorConfig.color}`}>
                    {stat.displayValue}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${stat.colorConfig.bgColor}`}
                    style={{
                      width: `${(stat.value / stat.max) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
