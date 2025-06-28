"use client";

interface SingleStatChartProps {
  myValue: number;
  teammateValue: number;
  statName: string;
  myColor?: string;
  teammateColor?: string;
  format?: "decimal" | "percentage";
}

export function SingleStatChart({
  myValue,
  teammateValue,
  statName,
  myColor = "#0d9488",
  teammateColor = "#e11d48",
  format = "decimal",
}: SingleStatChartProps) {
  const formatValue = (value: number) => {
    if (format === "percentage") {
      return `${(value * 100).toFixed(1)}%`;
    }
    return value.toFixed(3);
  };

  return (
    <div className="border border-border rounded-lg bg-card p-4">
      <div className="mb-3">
        <h4 className="text-sm font-medium text-card-foreground">{statName}</h4>
      </div>

      <div className="space-y-3">
        {/* 나의 값 */}
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">나</span>
            <span className="text-sm font-medium text-foreground">
              {formatValue(myValue)}
            </span>
          </div>
          <div className="w-full bg-muted/30 rounded-full h-2">
            <div
              className="h-2 rounded-full transition-all duration-500"
              style={{
                width: `${Math.max((myValue / Math.max(myValue, teammateValue)) * 100, 5)}%`,
                backgroundColor: myColor,
              }}
            />
          </div>
        </div>

        {/* 팀원의 값 */}
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">팀원</span>
            <span className="text-sm font-medium text-foreground">
              {formatValue(teammateValue)}
            </span>
          </div>
          <div className="w-full bg-muted/30 rounded-full h-2">
            <div
              className="h-2 rounded-full transition-all duration-500"
              style={{
                width: `${Math.max((teammateValue / Math.max(myValue, teammateValue)) * 100, 5)}%`,
                backgroundColor: teammateColor,
              }}
            />
          </div>
        </div>
      </div>

      {/* 승패 표시 */}
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
      </div>
    </div>
  );
}
