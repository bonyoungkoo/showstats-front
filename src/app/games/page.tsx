"use client";

import { useSearchParams } from "next/navigation";
import { useUserGames, GameListItem } from "@/hooks/useUserGames";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useRecentSearches } from "@/hooks/useRecentSearches";
import UserProfile from "@/components/games/UserProfile";
import StatsCharts from "@/components/games/StatsCharts";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { useEffect, Suspense, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";

// 게임 모드 뱃지 컴포넌트
interface GameModeBadgeProps {
  game: {
    gameId: string;
    isSingleGame: boolean;
  };
  teammateUsername: string;
  modeResult?: boolean; // 병렬 처리된 2:2 체크 결과
  isLoading: boolean; // 로딩 상태
}

function GameModeBadge({
  game,
  teammateUsername,
  modeResult,
  isLoading,
}: GameModeBadgeProps) {
  // isSingleGame이 true면 무조건 CPU (싱글게임)
  if (game.isSingleGame) {
    return (
      <Badge className="bg-slate-600 hover:bg-slate-700 text-white border-slate-600 w-14 justify-center">
        CPU
      </Badge>
    );
  }

  // isSingleGame이 false이고 teammateUsername이 없으면 PvP
  if (!teammateUsername) {
    return (
      <Badge className="bg-indigo-500 hover:bg-indigo-600 text-white border-indigo-500 w-14 justify-center">
        PvP
      </Badge>
    );
  }

  // isSingleGame이 false인 경우 확인중 → 1:1/2:2 결과 표시
  if (isLoading) {
    return (
      <Badge
        variant="outline"
        className="border-zinc-400 text-zinc-500 animate-pulse w-16 justify-center"
      >
        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
        확인중
      </Badge>
    );
  }

  // 결과에 따라 색상 구분
  if (modeResult) {
    // 2:2 - 로즈핑크
    return (
      <Badge className="bg-rose-500 hover:bg-rose-600 text-white border-rose-500 w-14 justify-center">
        2:2
      </Badge>
    );
  } else {
    // 1:1 - 하늘색
    return (
      <Badge className="bg-sky-500 hover:bg-sky-600 text-white border-sky-500 w-14 justify-center">
        1:1
      </Badge>
    );
  }
}

function GamesPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const username = searchParams.get("username") || "";
  const teammateUsername = searchParams.get("teammateUsername") || "";
  const teamName = searchParams.get("teamName") || "";

  const { addSearch } = useRecentSearches();

  // 게임 모드 체크 결과를 저장할 상태
  const [gameModeResults, setGameModeResults] = useState<
    Record<string, boolean>
  >({});
  const [loadingGameIds, setLoadingGameIds] = useState<Set<string>>(new Set());

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
      addSearch(username, userProfile?.displayName);
    }
  }, [username, userProfile?.displayName, addSearch]);

  // 게임 모드 체크를 위한 병렬 API 호출
  const checkGameModes = useCallback(
    async (games: GameListItem[]) => {
      if (!teammateUsername) return;

      // isSingleGame이 false인 게임들만 필터링
      const gamesToCheck = games.filter((game) => !game.isSingleGame);

      if (gamesToCheck.length === 0) return;

      console.log(
        "🔄 병렬 2:2 체크 시작:",
        gamesToCheck.map((g) => g.gameId)
      );

      // 로딩 상태 설정
      setLoadingGameIds(new Set(gamesToCheck.map((g) => g.gameId)));

      // 병렬 API 호출
      const requests = gamesToCheck.map((game) =>
        fetch("/api/games/check-type", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            gameId: game.gameId,
            teammateUsername,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log("🟢 도착한 응답:", data);
            // 응답이 오는 대로 상태 업데이트
            setGameModeResults((prev) => ({
              ...prev,
              [game.gameId]: data.isTeamGame,
            }));
            // 로딩 상태에서 제거
            setLoadingGameIds((prev) => {
              const newSet = new Set(prev);
              newSet.delete(game.gameId);
              return newSet;
            });
            return data;
          })
          .catch((error) => {
            console.error("❌ API 호출 실패:", game.gameId, error);
            // 에러가 발생해도 로딩 상태에서 제거
            setLoadingGameIds((prev) => {
              const newSet = new Set(prev);
              newSet.delete(game.gameId);
              return newSet;
            });
          })
      );

      // 모든 요청 완료를 기다리지 않고 병렬로 처리
      Promise.allSettled(requests);
    },
    [teammateUsername]
  );

  // 게임 목록이 로드되면 모드 체크 실행
  useEffect(() => {
    if (gamesData?.games && teammateUsername) {
      checkGameModes(gamesData.games);
    }
  }, [gamesData?.games, teammateUsername, checkGameModes]);

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

  const games = gamesData?.games || [];

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
          userStats={undefined}
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

          {games.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                게임 기록이 없습니다.
              </p>
              <Button onClick={() => router.push("/")}>
                다른 사용자 검색하기
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead>날짜/시간</TableHead>
                  <TableHead>모드</TableHead>
                  <TableHead>매치업</TableHead>
                  <TableHead>스코어</TableHead>
                  <TableHead>결과</TableHead>
                  <TableHead>나의 기록</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {games.map((game) => (
                  <TableRow
                    key={game.gameId}
                    className="border-border hover:bg-muted/30 cursor-pointer transition-colors"
                    onClick={() => handleGameDetail(game.gameId)}
                  >
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">
                          {new Date(game.created_at).toLocaleDateString(
                            "ko-KR",
                            {
                              timeZone: "Asia/Seoul",
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                            }
                          )}
                        </div>
                        <div className="text-muted-foreground">
                          {new Date(game.created_at).toLocaleTimeString(
                            "ko-KR",
                            {
                              timeZone: "Asia/Seoul",
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: false,
                            }
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <GameModeBadge
                        game={game}
                        teammateUsername={teammateUsername}
                        modeResult={gameModeResults[game.gameId]}
                        isLoading={loadingGameIds.has(game.gameId)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">{game.home_full_name}</div>
                        <div className="text-muted-foreground text-xs">
                          vs {game.away_full_name}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-primary font-semibold text-lg">
                        {game.home_runs}:{game.away_runs}
                      </span>
                    </TableCell>
                    <TableCell>
                      {(() => {
                        const homeScore = parseInt(game.home_runs);
                        const awayScore = parseInt(game.away_runs);

                        // 사용자의 팀이 홈팀인지 어웨이팀인지 확인
                        const userTeam = finalTeamName;
                        const isUserHomeTeam = game.home_full_name === userTeam;
                        const isUserAwayTeam = game.away_full_name === userTeam;

                        // 디버깅용 로그
                        console.log(
                          "Game:",
                          game.home_full_name,
                          "vs",
                          game.away_full_name
                        );
                        console.log("User team:", userTeam);
                        console.log(
                          "Is home team:",
                          isUserHomeTeam,
                          "Is away team:",
                          isUserAwayTeam
                        );

                        let isUserWin;
                        if (isUserHomeTeam) {
                          isUserWin = homeScore > awayScore;
                        } else if (isUserAwayTeam) {
                          isUserWin = awayScore > homeScore;
                        } else {
                          // 팀을 찾을 수 없으면 홈팀 기준으로 계산
                          isUserWin = homeScore > awayScore;
                        }

                        return (
                          <Badge
                            variant={isUserWin ? "default" : "destructive"}
                            className={
                              isUserWin ? "bg-green-600 hover:bg-green-700" : ""
                            }
                          >
                            {isUserWin ? "승리" : "패배"}
                          </Badge>
                        );
                      })()}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">
                          {Math.floor(Math.random() * 5) + 1}H,{" "}
                          {Math.floor(Math.random() * 4) + 1}RBI,{" "}
                          {Math.floor(Math.random() * 3)}HR
                        </div>
                        <div className="text-muted-foreground">
                          AVG .{Math.floor(Math.random() * 300) + 200}
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
