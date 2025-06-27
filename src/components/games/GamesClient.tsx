"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface GameData {
  id: number;
  date: string;
  time: string;
  mode: string;
  opponent: string;
  myTeam: string;
  opponentTeam: string;
  score: string;
  result: string;
  myStats: { H: number; RBI: number; HR: number; AVG: string };
  innings: number;
  duration: string;
}

interface GamesClientProps {
  initialGameData: GameData[];
  initialSearchQuery: string;
}

export default function GamesClient({
  initialGameData,
  initialSearchQuery,
}: GamesClientProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);

  // 검색어로 필터링된 게임 데이터
  const filteredGameData = initialGameData.filter(
    (game) =>
      searchQuery === "" ||
      game.opponent.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleGameClick = (gameId: number) => {
    router.push(`/games/${gameId}`);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    // URL 업데이트 (선택사항)
    const url = new URL(window.location.href);
    if (value) {
      url.searchParams.set("search", value);
    } else {
      url.searchParams.delete("search");
    }
    window.history.replaceState({}, "", url.toString());
  };

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold showstats-highlight">게임 전적</h1>
          <p className="text-muted-foreground mt-1">
            나의 MLB The Show 경기 기록을 확인하고 분석해보세요
            {searchQuery && (
              <span className="block text-sm text-primary mt-1">
                {searchQuery} 검색 결과: {filteredGameData.length}개 경기
              </span>
            )}
          </p>
        </div>
        <div className="flex gap-3">
          <Button className="showstats-button">새 경기 추가</Button>
          <Button variant="outline" className="border-border">
            통계 보기
          </Button>
        </div>
      </div>

      {/* 필터 및 검색 */}
      <Card className="showstats-card">
        <CardHeader>
          <CardTitle className="text-lg">필터 및 검색</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              placeholder="상대방 이름 검색..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="bg-background border-border"
            />
            <Select>
              <SelectTrigger className="bg-background border-border">
                <SelectValue placeholder="게임 모드" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="ranked">Ranked Seasons</SelectItem>
                <SelectItem value="battle">Battle Royale</SelectItem>
                <SelectItem value="events">Events</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="bg-background border-border">
                <SelectValue placeholder="결과" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="win">승리</SelectItem>
                <SelectItem value="lose">패배</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="bg-background border-border">
                <SelectValue placeholder="기간" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">오늘</SelectItem>
                <SelectItem value="week">일주일</SelectItem>
                <SelectItem value="month">한달</SelectItem>
                <SelectItem value="all">전체</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* 통계 요약 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="showstats-card">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold showstats-highlight">
                {filteredGameData.length}
              </div>
              <div className="text-sm text-muted-foreground">
                {searchQuery ? "검색된 경기" : "총 경기"}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="showstats-card">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {
                  filteredGameData.filter((game) => game.result === "승리")
                    .length
                }
              </div>
              <div className="text-sm text-muted-foreground">승리</div>
            </div>
          </CardContent>
        </Card>
        <Card className="showstats-card">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">
                {
                  filteredGameData.filter((game) => game.result === "패배")
                    .length
                }
              </div>
              <div className="text-sm text-muted-foreground">패배</div>
            </div>
          </CardContent>
        </Card>
        <Card className="showstats-card">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold showstats-highlight">
                {filteredGameData.length > 0
                  ? Math.round(
                      (filteredGameData.filter((game) => game.result === "승리")
                        .length /
                        filteredGameData.length) *
                        100 *
                        10
                    ) / 10
                  : 0}
                %
              </div>
              <div className="text-sm text-muted-foreground">승률</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 경기 목록 */}
      <Card className="showstats-card">
        <CardHeader>
          <CardTitle className="text-xl">
            {searchQuery ? `"${searchQuery}" 검색 결과` : "최근 경기 목록"}
          </CardTitle>
          <CardDescription>
            {searchQuery
              ? `${filteredGameData.length}개의 경기가 검색되었습니다`
              : "경기를 클릭하면 상세 분석을 확인할 수 있습니다"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredGameData.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {searchQuery
                  ? `"${searchQuery}"와(과) 일치하는 경기가 없습니다.`
                  : "경기 기록이 없습니다."}
              </p>
              {searchQuery && (
                <Button
                  onClick={() => handleSearchChange("")}
                  variant="outline"
                  className="mt-4 border-border"
                >
                  전체 경기 보기
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead>날짜/시간</TableHead>
                  <TableHead>모드</TableHead>
                  <TableHead>상대방</TableHead>
                  <TableHead>매치업</TableHead>
                  <TableHead>스코어</TableHead>
                  <TableHead>결과</TableHead>
                  <TableHead>나의 기록</TableHead>
                  <TableHead>소요시간</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGameData.map((game) => (
                  <TableRow
                    key={game.id}
                    className="border-border hover:bg-muted/30 cursor-pointer transition-colors"
                    onClick={() => handleGameClick(game.id)}
                  >
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">{game.date}</div>
                        <div className="text-muted-foreground">{game.time}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-border">
                        {game.mode}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {searchQuery &&
                      game.opponent
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ? (
                        <span className="bg-primary/20 px-1 rounded">
                          {game.opponent}
                        </span>
                      ) : (
                        game.opponent
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">{game.myTeam}</div>
                        <div className="text-muted-foreground text-xs">
                          vs {game.opponentTeam}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-primary font-semibold text-lg">
                        {game.score}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          game.result === "승리" ? "default" : "destructive"
                        }
                        className={
                          game.result === "승리"
                            ? "bg-green-600 hover:bg-green-700"
                            : ""
                        }
                      >
                        {game.result}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">
                          {game.myStats.H}H, {game.myStats.RBI}RBI,{" "}
                          {game.myStats.HR}HR
                        </div>
                        <div className="text-muted-foreground">
                          AVG {game.myStats.AVG}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {game.duration}
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
