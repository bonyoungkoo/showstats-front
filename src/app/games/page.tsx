"use client";

import { useSearchParams } from "next/navigation";
import { useUserGames, GameListItem } from "@/hooks/useUserGames";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useRecentSearches } from "@/hooks/useRecentSearches";
import UserProfile from "@/components/games/UserProfile";
import StatsCharts from "@/components/games/StatsCharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useEffect, Suspense, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

// ApiGameHistoryItem 타입 정의 (혹은 import)
type ApiGameHistoryItem = {
  id: string;
  display_date?: string;
  display_pitcher_info?: string;
  home_full_name: string;
  away_full_name: string;
  home_runs: string;
  away_runs: string;
  isSingleGame?: boolean;
  // ...필요시 추가 필드...
};

function GamesPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const username = searchParams.get("username") || "";
  const teammateUsername = searchParams.get("teammateUsername") || "";
  const teamName = searchParams.get("teamName") || "";
  const { addSearch } = useRecentSearches();
  const [page, setPage] = useState<number>(1);
  const [games, setGames] = useState<
    (GameListItem & { display_date?: string; display_pitcher_info?: string })[]
  >([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);

  // 최초 로딩 및 페이지 변경 시 데이터 fetch
  useEffect(() => {
    let ignore = false;
    async function fetchGames() {
      try {
        if (!username) return; // username 없으면 fetch 실행 안 함
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/games/history?username=${username}&page=1`
        );
        const data = await res.json();
        if (!ignore) {
          setGames(
            (data.game_history || []).map((g: ApiGameHistoryItem) => ({
              ...g,
              gameId: g.id,
            }))
          );
          setTotalPages(data.total_pages || 1);
          setPage(data.page || 1);
        }
      } catch (e) {
        console.log(e);
      } finally {
      }
    }
    fetchGames();
    return () => {
      ignore = true;
    };
  }, [username]);

  // 최종 팀이름 상태 (유추된 값 포함)
  const [finalTeamName, setFinalTeamName] = useState<string>(teamName || "");

  // TanStack Query 훅들 사용
  const {
    data: gamesData,
    isLoading: gamesLoading,
    error: gamesError,
  } = useUserGames(username, !!username);

  const { data: userProfile, isLoading: profileLoading } = useUserProfile(
    username,
    !!username
  );

  // 검색시 최근 검색 기록에 추가
  useEffect(() => {
    if (username) {
      addSearch(
        username,
        userProfile?.playerInfo.universal_profiles[0].username
      );
    }
  }, [username, addSearch, userProfile?.playerInfo.universal_profiles]);

  // 게임 데이터가 로드되면 최종 팀이름 상태 업데이트
  useEffect(() => {
    if (gamesData?.games && gamesData.games.length > 0) {
      const games = gamesData.games;

      // 팀이름 유추 로직
      const teamCounts: Record<string, number> = {};
      games.forEach((game) => {
        teamCounts[game.home_full_name] =
          (teamCounts[game.home_full_name] || 0) + 1;
        teamCounts[game.away_full_name] =
          (teamCounts[game.away_full_name] || 0) + 1;
      });

      const mostFrequentTeam = Object.entries(teamCounts).sort(
        ([, a], [, b]) => b - a
      )[0]?.[0];

      const inferredTeam = mostFrequentTeam || games[0].home_full_name;
      const resolvedTeamName = teamName || inferredTeam;

      if (resolvedTeamName && resolvedTeamName !== finalTeamName) {
        setFinalTeamName(resolvedTeamName);
      }
    }
  }, [gamesData?.games, teamName, finalTeamName]);

  // 게임 상세 보기 핸들러
  const handleGameDetail = (gameId: string) => {
    // 현재 URL의 모든 쿼리스트링을 그대로 가져가기
    const currentParams = new URLSearchParams(searchParams.toString());

    // 최종 팀이름이 있으면 쿼리스트링에 추가
    if (finalTeamName && !currentParams.has("teamName")) {
      currentParams.set("teamName", finalTeamName);
    }

    router.push(`/games/${gameId}?${currentParams.toString()}`);
  };

  // 로딩 상태
  if (gamesLoading || profileLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">
            게임 데이터를 불러오고 있습니다...
          </p>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (gamesError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="border-red-500/50">
          <CardHeader>
            <CardTitle className="text-red-500">오류 발생</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              게임 데이터를 불러올 수 없습니다: {gamesError.message}
            </p>
            <Button onClick={() => router.push("/")} className="mt-4">
              홈으로 돌아가기
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 사용자명이 없는 경우
  if (!username) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>사용자 검색 필요</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              게임 기록을 보려면 사용자명이 필요합니다.
            </p>
            <Button onClick={() => router.push("/")}>홈에서 검색하기</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 다음 페이지 로딩
  const loadMore = async () => {
    if (loadingMore || page >= totalPages) return;
    setLoadingMore(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/games/history?username=${username}&page=${page + 1}`
      );
      const data = await res.json();
      const newGames = ((data.game_history as ApiGameHistoryItem[]) || []).map(
        (g) => ({
          ...g,
          gameId: g.id,
          created_at: g.display_date || new Date().toISOString(),
          isSingleGame: g.isSingleGame ?? false,
        })
      );
      setGames((prev) => {
        const prevIds = new Set(prev.map((g) => g.gameId));
        const uniqueNewGames = newGames.filter((g) => !prevIds.has(g.gameId));
        return [...prev, ...uniqueNewGames];
      });
      setPage(data.page || page + 1);
      setTotalPages(data.total_pages || totalPages);
    } catch (e) {
      console.log(e);
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* 헤더 */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              <span className="showstats-highlight">{username}</span>님의 게임
              기록
            </h1>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <div className="flex items-center">
                <span>총 {games.length}개 게임</span>
              </div>
              {teamName && (
                <span>
                  팀:{" "}
                  <span className="text-foreground font-medium">
                    {teamName}
                  </span>
                </span>
              )}
              {teammateUsername && (
                <span>
                  팀원:{" "}
                  <span className="text-foreground font-medium">
                    {teammateUsername}
                  </span>
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-muted-foreground">실시간 데이터</span>
          </div>
        </div>
      </div>

      {/* 사용자 프로필 */}
      <UserProfile
        username={username}
        isApiData={true}
        teamName={finalTeamName}
        userStats={undefined}
        iconUrl={undefined}
      />

      {/* 통계 차트 */}
      {games.length > 0 && (
        <StatsCharts
          gameData={games.map((game) => {
            const homeScore = parseInt(game.home_runs);
            const awayScore = parseInt(game.away_runs);

            // 사용자의 팀이 홈팀인지 어웨이팀인지 확인
            const userTeam = finalTeamName;
            const isUserHomeTeam = game.home_full_name === userTeam;
            const isUserAwayTeam = game.away_full_name === userTeam;

            let isUserWin;
            if (isUserHomeTeam) {
              isUserWin = homeScore > awayScore;
            } else if (isUserAwayTeam) {
              isUserWin = awayScore > homeScore;
            } else {
              // 팀을 찾을 수 없으면 홈팀 기준으로 계산
              isUserWin = homeScore > awayScore;
            }

            return {
              result: isUserWin ? "승리" : "패배",
            };
          })}
          userStats={userProfile?.playerInfo.universal_profiles[0]}
        />
      )}

      {/* 게임 목록 */}
      <Card className="showstats-card">
        <CardContent className="p-6">
          <div className="mb-6">
            <h2 className="text-xl font-bold showstats-highlight mb-2">
              최근 경기 목록
            </h2>
            <p className="text-muted-foreground">
              경기를 클릭하면 상세 분석을 확인할 수 있습니다
            </p>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>날짜/시간</TableHead>
                <TableHead>모드</TableHead>
                <TableHead>어웨이</TableHead>
                <TableHead>스코어</TableHead>
                <TableHead>홈</TableHead>
                <TableHead>결과</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {games.map((game) => {
                const homeScore = parseInt(game.home_runs);
                const awayScore = parseInt(game.away_runs);
                const userTeam = finalTeamName;
                const isUserHomeTeam = game.home_full_name === userTeam;
                const isUserAwayTeam = game.away_full_name === userTeam;
                let isUserWin;
                if (isUserHomeTeam) {
                  isUserWin = homeScore > awayScore;
                } else if (isUserAwayTeam) {
                  isUserWin = awayScore > homeScore;
                } else {
                  isUserWin = homeScore > awayScore;
                }
                return (
                  <TableRow
                    key={game.gameId}
                    className="cursor-pointer hover:bg-muted/30"
                    onClick={() => handleGameDetail(game.gameId)}
                  >
                    <TableCell>
                      <div className="font-medium">
                        {game.display_date?.split(" ")[0]?.replaceAll("/", ".")}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {game.display_date?.split(" ")[1]}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className="bg-indigo-500/80 text-white"
                      >
                        PvP
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="font-bold">{game.away_full_name}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="font-bold">
                        <span className="text-primary text-lg">
                          {game.away_runs}
                        </span>
                        <span className="mx-1">:</span>
                        <span className="text-primary text-lg">
                          {game.home_runs}
                        </span>
                      </span>
                    </TableCell>
                    <TableCell className="text-left">
                      <span className="font-bold">{game.home_full_name}</span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={isUserWin ? "bg-green-600" : "bg-red-600"}
                      >
                        {isUserWin ? "승리" : "패배"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          {page < totalPages && (
            <div className="flex justify-center mt-6">
              <Button
                onClick={loadMore}
                disabled={loadingMore}
                className="bg-muted/40 text-foreground flex items-center justify-center gap-2"
              >
                {loadingMore ? (
                  <Loader2 className="animate-spin w-5 h-5" />
                ) : (
                  "더 보기"
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function GamesPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">
              페이지를 불러오고 있습니다...
            </p>
          </div>
        </div>
      }
    >
      <GamesPageContent />
    </Suspense>
  );
}
