import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { STAT_COLORS, StatGrade } from "@/lib/stat-colors";

const GRADE_ORDER: StatGrade[] = [
  "terrible",
  "bad",
  "below-average",
  "average",
  "above-average",
  "good",
  "very-good",
  "excellent",
];

export function StatLegend() {
  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-lg">통계 등급 범례</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-5 lg:grid-cols-8 gap-2">
          {GRADE_ORDER.map((grade) => {
            const config = STAT_COLORS[grade];
            return (
              <div
                key={grade}
                className={`text-center p-2 rounded text-xs ${config.bgColor}`}
              >
                {config.label}
              </div>
            );
          })}
        </div>
        <div className="mt-4 text-sm text-muted-foreground">
          <p>• 타율/출루율/장타율/OPS/득점권 타율: 높은 수치일수록 좋은 등급</p>
          <p>• ERA/WHIP/볼넷율: 낮은 수치일수록 좋은 등급</p>
          <p>• 삼진율: 높은 수치일수록 좋은 등급</p>
        </div>
      </CardContent>
    </Card>
  );
}
