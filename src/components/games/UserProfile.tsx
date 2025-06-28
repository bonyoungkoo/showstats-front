"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import Image from "next/image";
import { getStatColor } from "@/lib/stat-colors";

// API 응답 타입 정의
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

interface UserApiResponse {
  playerInfo: {
    universal_profiles: UserStats[];
  };
  iconImageUrl: string;
}

interface UserProfileProps {
  username: string;
  isApiData: boolean;
  teamName?: string | null;
  userStats?: UserStats | null;
  iconUrl?: string;
}

export default function UserProfile({
  username,
  isApiData,
  teamName,
  userStats: propUserStats,
  iconUrl: propIconUrl,
}: UserProfileProps) {
  const [userStats, setUserStats] = useState<UserStats | null>(
    propUserStats || null
  );
  const [iconUrl, setIconUrl] = useState<string>(propIconUrl || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // props로 데이터를 받았으면 API 호출 건너뛰기
    if (propUserStats && propIconUrl !== undefined) {
      setUserStats(propUserStats);
      setIconUrl(propIconUrl);
      return;
    }

    if (!isApiData || !username) return;

    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:3003/api/users/${username}`
        );

        if (!response.ok) {
          console.error("User API 호출 실패:", response.status);
          return;
        }

        const data: UserApiResponse = await response.json();
        console.log("User API 응답:", data);

        if (data.playerInfo?.universal_profiles?.[0]) {
          setUserStats(data.playerInfo.universal_profiles[0]);
          setIconUrl(data.iconImageUrl || "");
        }
      } catch (error) {
        console.error("User API 호출 에러:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [username, isApiData, propUserStats, propIconUrl]);

  // API 데이터가 아니거나 로딩 중이면 표시하지 않음
  if (!isApiData) {
    return null;
  }

  // 로딩 중일 때는 로딩 표시
  if (loading) {
    return (
      <Card className="showstats-card mb-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2 text-muted-foreground">
              프로필 로딩 중...
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  // 데이터가 없으면 기본 프로필 표시
  if (!userStats) {
    return (
      <Card className="showstats-card mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-6 lg:items-center">
            {/* 기본 프로필 */}
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-2xl">
                  {username.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex flex-col">
                <h2 className="text-2xl font-black text-white">{username}</h2>
                {teamName && (
                  <Badge
                    variant="outline"
                    className="border-orange-500 text-orange-400 bg-orange-500/10 w-fit"
                  >
                    {teamName}
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex-1 text-center text-muted-foreground">
              프로필 데이터를 불러올 수 없습니다
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // 총 게임 시간 계산 (분 단위를 시간으로 변환)
  const totalGameTime = Object.values(userStats.most_played_modes).reduce(
    (total, time) => total + parseInt(time || "0"),
    0
  );
  const totalHours = Math.floor(totalGameTime / 60);
  const totalDays = Math.floor(totalHours / 24);

  // DD 게임 시간 (분 단위를 시간으로 변환)
  const ddTime = parseInt(userStats.most_played_modes.dd_time || "0");
  const ddHours = Math.floor(ddTime / 60);

  // 현재 시즌 데이터 (가장 최신)
  const currentSeasonData =
    userStats.online_data.find((data) => data.year === "2025") ||
    userStats.online_data.find((data) => data.year === "Total");

  return (
    <Card className="showstats-card mb-6">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row gap-6 lg:items-center">
          {/* 프로필 섹션 */}
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              {iconUrl ? (
                <Image
                  src={iconUrl}
                  alt={`${userStats.username} 프로필`}
                  width={80}
                  height={80}
                  className="rounded-xl border-2 border-primary/30"
                  onError={() => setIconUrl("")}
                />
              ) : (
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">
                    {userStats.username.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-col">
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3 mb-2">
                <h2 className="text-2xl font-black text-white">
                  {userStats.username}
                </h2>

                <div className="flex flex-wrap gap-2">
                  {/* 팀 이름 뱃지 */}
                  {teamName && (
                    <Badge
                      variant="outline"
                      className="border-orange-500 text-orange-400 bg-orange-500/10"
                    >
                      {teamName}
                    </Badge>
                  )}

                  {/* 게임 뱃지 */}
                  <Badge
                    variant="outline"
                    className="border-blue-400 text-blue-400"
                  >
                    MLB The Show 25
                  </Badge>
                </div>
              </div>

              {/* 시즌 성과 - 프로필 바로 아래 */}
              {currentSeasonData && (
                <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                  <span className="font-semibold">
                    {currentSeasonData.wins}승
                  </span>
                  <span className="font-semibold">
                    {currentSeasonData.loses}패
                  </span>
                  <span>타율 {currentSeasonData.batting_average}</span>
                  <span>{currentSeasonData.hr} HR</span>
                  <span>평균자책점 {currentSeasonData.era}</span>
                </div>
              )}
            </div>
          </div>

          {/* 통계 섹션 */}
          <div className="flex-1 flex justify-center">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-2xl">
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground mb-1">
                  {userStats.games_played}
                </div>
                <div className="text-sm text-muted-foreground">총 게임 수</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground mb-1">
                  {ddHours}h
                </div>
                <div className="text-sm text-muted-foreground">
                  DD 플레이 시간
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground mb-1">
                  {totalDays}일
                </div>
                <div className="text-sm text-muted-foreground">
                  총 플레이 시간
                </div>
              </div>
              {currentSeasonData && (
                <div className="text-center">
                  {(() => {
                    const winRate = Math.round(
                      (parseInt(currentSeasonData.wins) /
                        (parseInt(currentSeasonData.wins) +
                          parseInt(currentSeasonData.loses))) *
                        100
                    );
                    const winRateColor = getStatColor(winRate, "winRate");
                    return (
                      <div
                        className={`text-3xl font-bold mb-1 ${winRateColor.color}`}
                      >
                        {winRate}%
                      </div>
                    );
                  })()}
                  <div className="text-sm text-muted-foreground">승률</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
