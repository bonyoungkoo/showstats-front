import { cn } from "@/lib/utils";
import { getStatColor } from "@/lib/stat-colors";

interface StatValueProps {
  value: number;
  statType: string;
  format?: "number" | "percentage" | "decimal";
  showBackground?: boolean;
  className?: string;
}

export function StatValue({
  value,
  statType,
  format = "number",
  showBackground = false,
  className,
}: StatValueProps) {
  const colorConfig = getStatColor(value, statType);

  const formatValue = (val: number) => {
    switch (format) {
      case "percentage":
        // 이미 백분율로 들어오는 경우와 소수로 들어오는 경우 모두 처리
        const percentage = val > 1 ? val : val * 100;
        return `${percentage.toFixed(1)}%`;
      case "decimal":
        return val.toFixed(3);
      default:
        return val.toString();
    }
  };

  return (
    <span
      className={cn(
        "font-medium",
        colorConfig.color,
        showBackground && colorConfig.bgColor,
        showBackground && "px-2 py-1 rounded",
        className
      )}
      title={`${colorConfig.label} (${formatValue(value)})`}
    >
      {formatValue(value)}
    </span>
  );
}
