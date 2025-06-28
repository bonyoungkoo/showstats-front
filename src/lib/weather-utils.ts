// 날씨 타입 정의
export type WeatherType =
  | "Clear"
  | "Sunny"
  | "Overcast"
  | "Cloudy"
  | "Partly Cloudy"
  | "Rain"
  | "Light Rain"
  | "Heavy Rain"
  | "Snow"
  | "Light Snow"
  | "Heavy Snow"
  | "Fog"
  | "Windy"
  | "Unknown";

// 날씨별 이모지 매핑
const weatherEmojiMap: Record<WeatherType, string> = {
  Clear: "☀️",
  Sunny: "☀️",
  Overcast: "☁️",
  Cloudy: "⛅",
  "Partly Cloudy": "⛅",
  Rain: "🌧️",
  "Light Rain": "🌦️",
  "Heavy Rain": "⛈️",
  Snow: "❄️",
  "Light Snow": "🌨️",
  "Heavy Snow": "❄️",
  Fog: "🌫️",
  Windy: "💨",
  Unknown: "🌤️",
};

// 날씨별 한글 이름 매핑
const weatherKoreanMap: Record<WeatherType, string> = {
  Clear: "맑음",
  Sunny: "맑음",
  Overcast: "흐림",
  Cloudy: "구름많음",
  "Partly Cloudy": "부분 흐림",
  Rain: "비",
  "Light Rain": "약한 비",
  "Heavy Rain": "폭우",
  Snow: "눈",
  "Light Snow": "약한 눈",
  "Heavy Snow": "폭설",
  Fog: "안개",
  Windy: "바람많음",
  Unknown: "알수없음",
};

/**
 * 영어 날씨 문자열을 표준 WeatherType으로 변환
 */
export function parseWeatherType(weather: string): WeatherType {
  if (!weather) return "Unknown";

  const normalizedWeather = weather.toLowerCase().trim();

  // 정확한 매칭부터 시도
  if (normalizedWeather.includes("overcast")) return "Overcast";
  if (normalizedWeather.includes("clear")) return "Clear";
  if (normalizedWeather.includes("sunny")) return "Sunny";
  if (normalizedWeather.includes("partly cloudy")) return "Partly Cloudy";
  if (normalizedWeather.includes("cloudy")) return "Cloudy";
  if (normalizedWeather.includes("heavy rain")) return "Heavy Rain";
  if (normalizedWeather.includes("light rain")) return "Light Rain";
  if (normalizedWeather.includes("rain")) return "Rain";
  if (normalizedWeather.includes("heavy snow")) return "Heavy Snow";
  if (normalizedWeather.includes("light snow")) return "Light Snow";
  if (normalizedWeather.includes("snow")) return "Snow";
  if (normalizedWeather.includes("fog")) return "Fog";
  if (normalizedWeather.includes("windy")) return "Windy";

  return "Unknown";
}

/**
 * 날씨 타입에 해당하는 이모지 반환
 */
export function getWeatherEmoji(weather: string | WeatherType): string {
  const weatherType =
    typeof weather === "string" ? parseWeatherType(weather) : weather;
  return weatherEmojiMap[weatherType];
}

/**
 * 날씨 타입에 해당하는 한글 이름 반환
 */
export function getWeatherKorean(weather: string | WeatherType): string {
  const weatherType =
    typeof weather === "string" ? parseWeatherType(weather) : weather;
  return weatherKoreanMap[weatherType];
}

/**
 * 날씨 정보를 이모지와 함께 포맷팅하여 반환
 */
export function formatWeather(weather: string): string {
  if (!weather) return "🌤️ 알수없음";

  const emoji = getWeatherEmoji(weather);
  const korean = getWeatherKorean(weather);

  return `${emoji} ${korean}`;
}

/**
 * 온도 정보가 포함된 날씨 문자열을 파싱하여 온도와 날씨를 분리
 * 예: "69 degrees, Overcast" → { temperature: "69°", weather: "Overcast" }
 */
export function parseWeatherWithTemperature(weatherString: string): {
  temperature: string;
  weather: string;
  formattedWeather: string;
} {
  if (!weatherString) {
    return {
      temperature: "",
      weather: "Unknown",
      formattedWeather: formatWeather("Unknown"),
    };
  }

  // "69 degrees, Overcast" 패턴 매칭
  const match = weatherString.match(/^(\d+)\s*degrees?,?\s*(.+)$/i);

  if (match) {
    const temperature = `${match[1]}°`;
    const weather = match[2].trim();
    return {
      temperature,
      weather,
      formattedWeather: formatWeather(weather),
    };
  }

  // 온도 정보가 없는 경우
  return {
    temperature: "",
    weather: weatherString,
    formattedWeather: formatWeather(weatherString),
  };
}
