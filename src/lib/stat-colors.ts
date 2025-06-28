// tomato.gg WN8 스타일의 색상 등급 시스템

export type StatGrade =
  | "terrible"
  | "bad"
  | "below-average"
  | "average"
  | "above-average"
  | "good"
  | "very-good"
  | "excellent";

export interface StatColorConfig {
  grade: StatGrade;
  color: string;
  bgColor: string;
  label: string;
}

// WN8 스타일 색상 등급 정의 (실제 WN8 색상과 동일하게)
export const STAT_COLORS: Record<StatGrade, StatColorConfig> = {
  terrible: {
    grade: "terrible",
    color: "text-red-600", // 빨강 - Very Bad
    bgColor: "bg-red-600",
    label: "매우 나쁨",
  },
  bad: {
    grade: "bad",
    color: "text-orange-500", // 주황 - Bad
    bgColor: "bg-orange-500",
    label: "나쁨",
  },
  "below-average": {
    grade: "below-average",
    color: "text-yellow-500", // 노랑 - Below Average
    bgColor: "bg-yellow-500",
    label: "평균 이하",
  },
  average: {
    grade: "average",
    color: "text-lime-500", // 연두 - Average
    bgColor: "bg-lime-500",
    label: "평균",
  },
  "above-average": {
    grade: "above-average",
    color: "text-green-600", // 진한 녹색 - Good
    bgColor: "bg-green-600",
    label: "평균 이상",
  },
  good: {
    grade: "good",
    color: "text-teal-500", // 청록 - Very Good
    bgColor: "bg-teal-500",
    label: "좋음",
  },
  "very-good": {
    grade: "very-good",
    color: "text-blue-500", // 파란색 - Great
    bgColor: "bg-blue-500",
    label: "매우 좋음",
  },
  excellent: {
    grade: "excellent",
    color: "text-purple-500", // 보라 - Unicum/Excellent
    bgColor: "bg-purple-500",
    label: "최상급",
  },
};

// 타율 등급 기준
export function getBattingAverageGrade(avg: number): StatGrade {
  if (avg >= 0.35) return "excellent";
  if (avg >= 0.325) return "very-good";
  if (avg >= 0.3) return "good";
  if (avg >= 0.28) return "above-average";
  if (avg >= 0.26) return "average";
  if (avg >= 0.24) return "below-average";
  if (avg >= 0.22) return "bad";
  if (avg >= 0.2) return "terrible";
  return "terrible";
}

// 출루율 등급 기준
export function getOnBasePercentageGrade(obp: number): StatGrade {
  if (obp >= 0.42) return "excellent";
  if (obp >= 0.39) return "very-good";
  if (obp >= 0.36) return "good";
  if (obp >= 0.34) return "above-average";
  if (obp >= 0.32) return "average";
  if (obp >= 0.3) return "below-average";
  if (obp >= 0.28) return "bad";
  if (obp >= 0.26) return "terrible";
  return "terrible";
}

// 장타율 등급 기준
export function getSluggingPercentageGrade(slg: number): StatGrade {
  if (slg >= 0.6) return "excellent";
  if (slg >= 0.55) return "very-good";
  if (slg >= 0.5) return "good";
  if (slg >= 0.45) return "above-average";
  if (slg >= 0.4) return "average";
  if (slg >= 0.35) return "below-average";
  if (slg >= 0.3) return "bad";
  if (slg >= 0.25) return "terrible";
  return "terrible";
}

// OPS 등급 기준
export function getOPSGrade(ops: number): StatGrade {
  if (ops >= 1.0) return "excellent";
  if (ops >= 0.9) return "very-good";
  if (ops >= 0.8) return "good";
  if (ops >= 0.75) return "above-average";
  if (ops >= 0.7) return "average";
  if (ops >= 0.65) return "below-average";
  if (ops >= 0.6) return "bad";
  if (ops >= 0.55) return "terrible";
  return "terrible";
}

// ERA 등급 기준 (낮을수록 좋음)
export function getERAGrade(era: number): StatGrade {
  if (era <= 2.0) return "excellent";
  if (era <= 2.5) return "very-good";
  if (era <= 3.0) return "good";
  if (era <= 3.5) return "above-average";
  if (era <= 4.0) return "average";
  if (era <= 4.5) return "below-average";
  if (era <= 5.0) return "bad";
  if (era <= 6.0) return "terrible";
  return "terrible";
}

// WHIP 등급 기준 (낮을수록 좋음)
export function getWHIPGrade(whip: number): StatGrade {
  if (whip <= 1.0) return "excellent";
  if (whip <= 1.1) return "very-good";
  if (whip <= 1.2) return "good";
  if (whip <= 1.3) return "above-average";
  if (whip <= 1.4) return "average";
  if (whip <= 1.5) return "below-average";
  if (whip <= 1.6) return "bad";
  if (whip <= 1.8) return "terrible";
  return "terrible";
}

// 삼진율 등급 기준 (높을수록 좋음)
export function getStrikeoutRateGrade(kRate: number): StatGrade {
  // 백분율로 온다면 그대로, 소수로 온다면 100을 곱해서 처리
  const rate = kRate > 1 ? kRate : kRate * 100;

  if (rate >= 30.0) return "excellent";
  if (rate >= 27.0) return "very-good";
  if (rate >= 24.0) return "good";
  if (rate >= 21.0) return "above-average";
  if (rate >= 18.0) return "average";
  if (rate >= 15.0) return "below-average";
  if (rate >= 12.0) return "bad";
  if (rate >= 9.0) return "terrible";
  return "terrible";
}

// 볼넷율 등급 기준 (낮을수록 좋음)
export function getWalkRateGrade(bbRate: number): StatGrade {
  // 백분율로 온다면 그대로, 소수로 온다면 100을 곱해서 처리
  const rate = bbRate > 1 ? bbRate : bbRate * 100;

  if (rate <= 5.0) return "excellent";
  if (rate <= 6.0) return "very-good";
  if (rate <= 7.0) return "good";
  if (rate <= 8.0) return "above-average";
  if (rate <= 9.0) return "average";
  if (rate <= 10.0) return "below-average";
  if (rate <= 12.0) return "bad";
  if (rate <= 15.0) return "terrible";
  return "terrible";
}

// 승률 등급 기준 (높을수록 좋음)
export function getWinRateGrade(winRate: number): StatGrade {
  // 백분율로 온다면 소수로 변환, 소수로 온다면 그대로 처리
  const rate = winRate > 1 ? winRate / 100 : winRate;

  if (rate >= 0.75) return "excellent";
  if (rate >= 0.7) return "very-good";
  if (rate >= 0.65) return "good";
  if (rate >= 0.6) return "above-average";
  if (rate >= 0.55) return "average";
  if (rate >= 0.5) return "below-average";
  if (rate >= 0.45) return "bad";
  if (rate >= 0.4) return "terrible";
  return "terrible";
}

// 통계 타입에 따른 등급 계산
export function getStatGrade(value: number, statType: string): StatGrade {
  switch (statType) {
    case "average":
    case "rispAverage":
      return getBattingAverageGrade(value);
    case "obp":
      return getOnBasePercentageGrade(value);
    case "slg":
      return getSluggingPercentageGrade(value);
    case "ops":
      return getOPSGrade(value);
    case "era":
      return getERAGrade(value);
    case "whip":
      return getWHIPGrade(value);
    case "strikeoutRate":
      return getStrikeoutRateGrade(value);
    case "walkRate":
      return getWalkRateGrade(value);
    case "winRate":
      return getWinRateGrade(value);
    default:
      return "average";
  }
}

// 색상 정보 가져오기
export function getStatColor(value: number, statType: string): StatColorConfig {
  const grade = getStatGrade(value, statType);
  return STAT_COLORS[grade];
}
