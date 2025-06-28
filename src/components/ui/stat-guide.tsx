import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { STAT_COLORS, type StatGrade } from "@/lib/stat-colors";

const statGrades: Array<{
  grade: StatGrade;
  example: string;
  description: string;
}> = [
  {
    grade: "terrible",
    example: "타율 0.200 미만",
    description: "매우 낮은 수준",
  },
  { grade: "bad", example: "타율 0.200-0.219", description: "낮은 수준" },
  {
    grade: "below-average",
    example: "타율 0.220-0.239",
    description: "평균 이하",
  },
  { grade: "average", example: "타율 0.240-0.259", description: "평균 수준" },
  {
    grade: "above-average",
    example: "타율 0.260-0.279",
    description: "평균 이상",
  },
  { grade: "good", example: "타율 0.280-0.299", description: "좋은 수준" },
  { grade: "very-good", example: "타율 0.300-0.324", description: "매우 좋음" },
  {
    grade: "excellent",
    example: "타율 0.325 이상",
    description: "최상급",
  },
];

export default function StatGuide() {
  return (
    <section>
      <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-slate-600/50 rounded-2xl shadow-2xl">
        <CardHeader>
          <CardTitle className="text-xl font-black text-white flex items-center gap-2">
            📊 STATS COLOR GUIDE
          </CardTitle>
          <CardDescription className="text-gray-300">
            통계 색상별 등급 안내 - WN8 8단계 시스템
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {statGrades.map((stat) => (
              <div
                key={stat.grade}
                className="bg-slate-700/50 rounded-xl p-4 border border-slate-600/50 hover:bg-slate-700/70 transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <Badge
                    className={`${STAT_COLORS[stat.grade].bgColor} text-white font-bold px-3 py-1.5 h-8 flex items-center justify-center`}
                  >
                    {STAT_COLORS[stat.grade].label}
                  </Badge>
                </div>
                <div className="text-sm text-gray-300 mb-1">{stat.example}</div>
                <div className="text-xs text-gray-400">{stat.description}</div>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-slate-700/30 rounded-xl border border-slate-600/30">
            <p className="text-sm text-gray-300 text-center">
              <span className="font-semibold text-blue-400">타율</span>,{" "}
              <span className="font-semibold text-green-400">평균자책점</span>,{" "}
              <span className="font-semibold text-yellow-400">승률</span> 등의
              통계에서 실력 수준에 따른 색상 등급이 적용됩니다.
            </p>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
