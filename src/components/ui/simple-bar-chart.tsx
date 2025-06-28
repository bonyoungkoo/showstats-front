"use client";

interface ChartData {
  stat: string;
  나: number;
  팀원: number;
}

interface SimpleBarChartProps {
  data: ChartData[];
  title: string;
  description: string;
  myColor?: string;
  teammateColor?: string;
}

export function SimpleBarChart({
  data,
  title,
  description,
  myColor = "#3b82f6",
  teammateColor = "#8b5cf6",
}: SimpleBarChartProps) {
  const maxValue = Math.max(...data.flatMap((item) => [item.나, item.팀원]));

  return (
    <div className="border border-border rounded-lg bg-card">
      <div className="p-6 pb-4">
        <h3 className="text-lg font-semibold text-card-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="px-6 pb-6">
        <div className="space-y-6">
          {data.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-foreground">
                  {item.stat}
                </span>
                <div className="flex gap-4 text-xs text-muted-foreground">
                  <span>나: {item.나}</span>
                  <span>팀원: {item.팀원}</span>
                </div>
              </div>

              <div className="space-y-1">
                {/* 나의 막대 */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground w-8">나</span>
                  <div className="flex-1 bg-muted/30 rounded-full h-4 relative">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${(item.나 / maxValue) * 100}%`,
                        backgroundColor: myColor,
                      }}
                    />
                    <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs font-medium text-white">
                      {item.나}
                    </span>
                  </div>
                </div>

                {/* 팀원의 막대 */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground w-8">
                    팀원
                  </span>
                  <div className="flex-1 bg-muted/30 rounded-full h-4 relative">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${(item.팀원 / maxValue) * 100}%`,
                        backgroundColor: teammateColor,
                      }}
                    />
                    <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs font-medium text-white">
                      {item.팀원}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 범례 */}
        <div className="flex justify-center gap-6 mt-6 pt-4 border-t border-border">
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded"
              style={{ backgroundColor: myColor }}
            ></div>
            <span className="text-xs text-muted-foreground">나</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded"
              style={{ backgroundColor: teammateColor }}
            ></div>
            <span className="text-xs text-muted-foreground">팀원</span>
          </div>
        </div>

        {/* 디버깅 정보 */}
        <div className="mt-4 p-3 bg-muted/20 rounded text-xs">
          <p>📊 CSS 막대 차트 (fallback)</p>
          <p>📈 최대값: {maxValue}</p>
          <p>🎯 데이터: {data.length}개 항목</p>
        </div>
      </div>
    </div>
  );
}
