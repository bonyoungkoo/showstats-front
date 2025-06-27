"use client";

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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/games?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* 환영 섹션 */}
      <section className="text-center py-12">
        <h2 className="text-4xl font-bold mb-4">
          <span className="showstats-highlight">MLB The Show</span> 전적 분석
          플랫폼
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
          MLB The Show 야구 게임의 상세한 전적 조회와 심화 분석을 제공하는
          플랫폼입니다.
        </p>

        {/* 플레이어 검색 */}
        <div className="max-w-md mx-auto">
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              placeholder="플레이어 이름을 검색해보세요..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-background border-border"
            />
            <Button type="submit" className="showstats-button">
              검색
            </Button>
          </form>
          <p className="text-xs text-muted-foreground mt-2">
            상대방의 이름을 입력하여 경기 기록을 확인해보세요
          </p>
        </div>
      </section>

      {/* 주요 통계 카드들 */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="showstats-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              총 플레이어
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold showstats-highlight">
              127,845
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-400">+12.5%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card className="showstats-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              분석된 경기
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold showstats-highlight">2,847</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-400">+23.1%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card className="showstats-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              활성 유저
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold showstats-highlight">89,234</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-400">+8.3%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card className="showstats-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              평균 승률
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold showstats-highlight">67.8%</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-red-400">-2.1%</span> from last month
            </p>
          </CardContent>
        </Card>
      </section>

      {/* 최근 경기 결과 */}
      <section>
        <Card className="showstats-card">
          <CardHeader>
            <CardTitle className="text-xl">최근 경기 결과</CardTitle>
            <CardDescription>
              오늘 진행된 주요 경기들의 결과입니다
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead>모드</TableHead>
                  <TableHead>매치업</TableHead>
                  <TableHead>스코어</TableHead>
                  <TableHead>기록</TableHead>
                  <TableHead>결과</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="border-border hover:bg-muted/30">
                  <TableCell className="font-medium">Ranked Seasons</TableCell>
                  <TableCell>vs BlueJays_Fan</TableCell>
                  <TableCell>
                    <span className="text-primary font-semibold">7:3</span>
                  </TableCell>
                  <TableCell>3H, 2RBI, 1HR</TableCell>
                  <TableCell>
                    <Badge
                      variant="default"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      승리
                    </Badge>
                  </TableCell>
                </TableRow>
                <TableRow className="border-border hover:bg-muted/30">
                  <TableCell className="font-medium">Battle Royale</TableCell>
                  <TableCell>vs Yankees_Pro</TableCell>
                  <TableCell>
                    <span className="text-primary font-semibold">5:2</span>
                  </TableCell>
                  <TableCell>4H, 3RBI, 2HR</TableCell>
                  <TableCell>
                    <Badge
                      variant="default"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      승리
                    </Badge>
                  </TableCell>
                </TableRow>
                <TableRow className="border-border hover:bg-muted/30">
                  <TableCell className="font-medium">Events</TableCell>
                  <TableCell>vs Dodgers_King</TableCell>
                  <TableCell>
                    <span className="text-primary font-semibold">2:8</span>
                  </TableCell>
                  <TableCell>2H, 0RBI, 0HR</TableCell>
                  <TableCell>
                    <Badge variant="destructive">패배</Badge>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>

      {/* 플레이어 랭킹 */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="showstats-card">
          <CardHeader>
            <CardTitle className="text-xl">Top 플레이어</CardTitle>
            <CardDescription>이번 시즌 최고 성과 플레이어들</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              {
                rank: 1,
                name: "BaseballKing",
                rating: "892",
                winRate: "78.5%",
                avg: ".324",
              },
              {
                rank: 2,
                name: "DiamondPro",
                rating: "875",
                winRate: "76.2%",
                avg: ".318",
              },
              {
                rank: 3,
                name: "ShowMaster",
                rating: "864",
                winRate: "74.1%",
                avg: ".311",
              },
            ].map((player) => (
              <div
                key={player.rank}
                className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-primary font-bold text-sm">
                      #{player.rank}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold">{player.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Rating {player.rating}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="showstats-highlight">{player.winRate}</div>
                  <div className="text-sm text-muted-foreground">
                    AVG {player.avg}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="showstats-card">
          <CardHeader>
            <CardTitle className="text-xl">인기 팀</CardTitle>
            <CardDescription>가장 많이 사용되는 팀 순위</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              {
                rank: 1,
                name: "Los Angeles Dodgers",
                usage: "23.4%",
                winRate: "68.2%",
              },
              {
                rank: 2,
                name: "New York Yankees",
                usage: "19.8%",
                winRate: "65.7%",
              },
              {
                rank: 3,
                name: "Atlanta Braves",
                usage: "16.3%",
                winRate: "67.1%",
              },
            ].map((team) => (
              <div key={team.rank} className="showstats-stat-box">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-primary font-bold">#{team.rank}</span>
                    <span className="font-semibold">{team.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="showstats-highlight">{team.usage}</div>
                    <div className="text-sm text-muted-foreground">
                      승률 {team.winRate}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
