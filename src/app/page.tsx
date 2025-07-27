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
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useRecentSearches } from "@/hooks/useRecentSearches";
import { Clock, X, Users, Trophy, TrendingUp } from "lucide-react";
import { useFilterStore } from "@/lib/filter-store";

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [teammateQuery, setTeammateQuery] = useState("");
  const [showTeammateInput, setShowTeammateInput] = useState(false);

  const { data: recentSearches, addSearch, removeSearch } = useRecentSearches();
  const { resetAll } = useFilterStore();

  // 홈 페이지 진입 시 필터 상태 초기화
  useEffect(() => {
    resetAll();
  }, [resetAll]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      addSearch(searchQuery.trim());
      const params = new URLSearchParams();
      params.set("username", searchQuery.trim());
      if (teammateQuery.trim()) {
        params.set("teammate", teammateQuery.trim());
      }
      router.push(`/games?${params.toString()}`);
    }
  };

  const handleRecentSearchClick = (username: string) => {
    setSearchQuery(username);
    const params = new URLSearchParams();
    params.set("username", username);
    router.push(`/games?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        {/* 야구장 배경 효과 */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 via-green-800/10 to-green-900/20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/40 to-background/80"></div>

        {/* 배경 패턴 */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-32 h-32 border-2 border-white rounded-full"></div>
          <div className="absolute top-40 right-32 w-24 h-24 border border-white rounded-full"></div>
          <div className="absolute bottom-32 left-1/3 w-16 h-16 border border-white rounded-full"></div>
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-5xl mx-auto">
            {/* MLB The Show 스타일 로고 */}
            <div className="mb-12">
              {/* The Show Stats 25 타이틀 */}
              <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-6 relative">
                <span className="text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] [text-shadow:_2px_2px_0_rgb(0_0_0_/_40%)]">
                  The Show{" "}
                </span>
                <span className="text-yellow-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] [text-shadow:_2px_2px_0_rgb(0_0_0_/_40%)]">
                  Stats
                </span>
                <span className="text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] [text-shadow:_2px_2px_0_rgb(0_0_0_/_40%)]">
                  {" "}
                </span>
                <span className="text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] [text-shadow:_2px_2px_0_rgb(0_0_0_/_40%)]">
                  25
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-300 mb-4 font-semibold">
                전적 분석 플랫폼
              </p>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
                MLB The Show의 모든 게임 데이터를 분석하고 당신의 실력을 한 단계
                끌어올리세요
              </p>
            </div>

            {/* 검색 섹션 - 게임 스타일 */}
            <div className="max-w-2xl mx-auto mb-12">
              <form onSubmit={handleSearch} className="space-y-6">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
                  <div className="relative bg-slate-900/90 border-2 border-blue-500/50 rounded-2xl p-2">
                    <div className="flex items-center">
                      <Input
                        placeholder="플레이어 아이디를 입력하세요"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-6 pr-28 h-12 text-base md:text-lg bg-transparent border-0 text-white placeholder:text-gray-400 placeholder:text-sm md:placeholder:text-base focus:ring-0 focus:border-0"
                      />
                      <Button
                        type="submit"
                        className="absolute right-2 top-2 bottom-2 h-auto px-4 md:px-6 bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-400 hover:to-yellow-300 text-black font-black text-sm md:text-base rounded-lg shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
                      >
                        SEARCH
                      </Button>
                    </div>
                  </div>
                </div>

                {!showTeammateInput && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowTeammateInput(true)}
                    className="bg-slate-800/50 border-2 border-slate-600/50 hover:bg-slate-700/50 hover:border-blue-500/50 text-white font-bold text-lg px-8 py-4 rounded-xl transition-all"
                  >
                    <Users className="w-5 h-5 mr-3" />
                    팀원과 함께 검색
                  </Button>
                )}

                {showTeammateInput && (
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-600 to-yellow-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
                    <div className="relative bg-slate-900/90 border-2 border-yellow-500/50 rounded-2xl p-2">
                      <div className="flex items-center">
                        <Users className="absolute left-6 text-gray-400 w-6 h-6" />
                        <Input
                          placeholder="팀원 아이디 (선택사항)"
                          value={teammateQuery}
                          onChange={(e) => setTeammateQuery(e.target.value)}
                          className="pl-14 pr-16 h-14 text-lg bg-transparent border-0 text-white placeholder:text-gray-400 focus:ring-0 focus:border-0"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => {
                            setShowTeammateInput(false);
                            setTeammateQuery("");
                          }}
                          className="absolute right-2 h-10 w-10 p-0 text-gray-400 hover:text-white hover:bg-slate-700 rounded-lg"
                        >
                          <X className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </form>

              {/* 최근 검색 - 게임 스타일 */}
              {recentSearches && recentSearches.length > 0 && (
                <div className="mt-8">
                  <div className="flex items-center justify-center gap-2 text-gray-400 text-sm mb-4">
                    <Clock className="w-4 h-4" />
                    <span className="font-semibold">최근 검색</span>
                  </div>
                  <div className="flex flex-wrap justify-center gap-3">
                    {recentSearches.map((search) => (
                      <div
                        key={search.username}
                        className="group relative flex items-center gap-2 bg-slate-800/60 hover:bg-slate-700/60 border border-slate-600/50 hover:border-blue-500/50 rounded-xl px-4 py-2 transition-all"
                      >
                        <button
                          onClick={() =>
                            handleRecentSearchClick(search.username)
                          }
                          className="flex-1 text-left text-sm text-gray-300 hover:text-white font-medium"
                        >
                          {search.displayName || search.username}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeSearch(search.username);
                          }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-400"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 pb-20 space-y-16">
        {/* 통계 카드 */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="showstats-card">
            <CardContent className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div className="text-2xl font-bold mb-1">127,845</div>
              <div className="text-sm text-muted-foreground">총 플레이어</div>
            </CardContent>
          </Card>

          <Card className="showstats-card">
            <CardContent className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-4">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <div className="text-2xl font-bold mb-1">2,847</div>
              <div className="text-sm text-muted-foreground">분석된 게임</div>
            </CardContent>
          </Card>

          <Card className="showstats-card">
            <CardContent className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-4">
                <Trophy className="w-6 h-6 text-primary" />
              </div>
              <div className="text-2xl font-bold mb-1">89,234</div>
              <div className="text-sm text-muted-foreground">활성 사용자</div>
            </CardContent>
          </Card>

          <Card className="showstats-card">
            <CardContent className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-4">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <div className="text-2xl font-bold mb-1">67.8%</div>
              <div className="text-sm text-muted-foreground">평균 승률</div>
            </CardContent>
          </Card>
        </section>

        {/* 최근 경기 */}
        <section>
          <Card className="showstats-card">
            <CardHeader>
              <CardTitle className="showstats-highlight">
                주목할 만한 경기
              </CardTitle>
              <CardDescription>
                오늘의 인상적인 경기 결과들을 확인해보세요
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    mode: "Ranked Seasons",
                    opponent: "BlueJays_Fan",
                    score: "7:3",
                    stats: "3H, 2RBI, 1HR",
                    result: "승리",
                    isWin: true,
                  },
                  {
                    mode: "Battle Royale",
                    opponent: "Yankees_Pro",
                    score: "5:2",
                    stats: "4H, 3RBI, 2HR",
                    result: "승리",
                    isWin: true,
                  },
                  {
                    mode: "Events",
                    opponent: "Dodgers_King",
                    score: "2:8",
                    stats: "2H, 0RBI, 0HR",
                    result: "패배",
                    isWin: false,
                  },
                ].map((game, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <Badge
                        variant="secondary"
                        className={game.isWin ? "bg-green-600" : "bg-red-600"}
                      >
                        {game.result}
                      </Badge>
                      <div>
                        <div className="font-semibold">{game.mode}</div>
                        <div className="text-sm text-muted-foreground">
                          vs {game.opponent}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-primary">
                        {game.score}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {game.stats}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 랭킹 섹션 */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="showstats-card">
            <CardHeader>
              <CardTitle className="showstats-highlight">
                TOP 플레이어
              </CardTitle>
              <CardDescription>
                이번 시즌 최고 성과를 거둔 플레이어들
              </CardDescription>
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
                  className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center font-bold text-primary">
                      #{player.rank}
                    </div>
                    <div>
                      <div className="font-semibold">{player.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Rating {player.rating}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-green-600">
                      {player.winRate}
                    </div>
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
              <CardTitle className="showstats-highlight">인기 팀</CardTitle>
              <CardDescription>가장 많이 선택되는 팀 순위</CardDescription>
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
                <div
                  key={team.rank}
                  className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-primary font-bold">#{team.rank}</span>
                    <span className="font-semibold">{team.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-primary">
                      {team.usage}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      승률 {team.winRate}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
