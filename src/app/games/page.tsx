"use client";

import { useSearchParams } from "next/navigation";
import { useUserGames } from "@/hooks/useUserGames";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useRecentSearches } from "@/hooks/useRecentSearches";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { useEffect, Suspense } from "react";
import { Button } from "@/components/ui/button";

function GamesPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const username = searchParams.get("username") || "";
  const teammateQuery = searchParams.get("teammate") || "";

  const { addSearch } = useRecentSearches();

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

  // 게임 상세 보기 핸들러
  const handleGameDetail = (gameId: string) => {
    const params = new URLSearchParams();
    params.set("username", username);
    if (userProfile?.displayName) {
      params.set("teamName", userProfile.displayName);
    }
    router.push(`/games/${gameId}?${params.toString()}`);
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
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-2xl font-bold">
                {userProfile?.displayName || username}님의 게임 기록
              </CardTitle>
              <CardDescription>
                총 {games.length}개의 게임 기록
                {teammateQuery && ` (팀원: ${teammateQuery})`}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline">총 게임: {games.length}</Badge>
              <Badge variant="outline">
                Co-op: {games.filter((g) => g.is_coop).length}
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* 게임 목록 */}
      <Card>
        <CardContent className="p-6">
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
                <TableRow>
                  <TableHead>날짜</TableHead>
                  <TableHead>팀 vs 팀</TableHead>
                  <TableHead>스코어</TableHead>
                  <TableHead>결과</TableHead>
                  <TableHead>타입</TableHead>
                  <TableHead>액션</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {games.map((game) => (
                  <TableRow key={game.gameId}>
                    <TableCell>
                      {new Date(game.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {game.home_full_name} vs {game.away_full_name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono">
                        {game.home_runs}:{game.away_runs}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          parseInt(game.home_runs) > parseInt(game.away_runs)
                            ? "default"
                            : "destructive"
                        }
                      >
                        {parseInt(game.home_runs) > parseInt(game.away_runs)
                          ? "승"
                          : "패"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {game.is_coop ? "Co-op" : "Solo"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        onClick={() => handleGameDetail(game.gameId)}
                      >
                        상세보기
                      </Button>
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
