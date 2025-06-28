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
import { useState } from "react";
import StatGuide from "@/components/ui/stat-guide";
import { useRecentSearches } from "@/hooks/useRecentSearches";
import { Clock, X } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [teammateQuery, setTeammateQuery] = useState("");
  const [showTeammateInput, setShowTeammateInput] = useState(false);

  const { data: recentSearches, addSearch, removeSearch } = useRecentSearches();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // 최근 검색 기록에 추가
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section - MLB The Show 스타일 */}
      <section className="relative overflow-hidden">
        {/* 배경 그라데이션 효과 */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-transparent to-yellow-500/20"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>

        <div className="container mx-auto px-4 py-16 relative">
          <div className="text-center max-w-4xl mx-auto">
            {/* MLB The Show 로고 스타일 제목 */}
            <div className="mb-8">
              <h1 className="text-6xl md:text-8xl font-black tracking-wider mb-4">
                <span className="bg-gradient-to-r from-blue-400 via-white to-yellow-400 bg-clip-text text-transparent drop-shadow-2xl">
                  MLB
                </span>
              </h1>
              <div className="relative inline-block">
                <h2 className="text-4xl md:text-6xl font-black tracking-widest text-white drop-shadow-2xl">
                  THE SHOW
                </h2>
                <div className="absolute -top-1 -right-8 md:-right-12 text-yellow-400 text-3xl md:text-5xl font-black transform rotate-12 drop-shadow-2xl">
                  25
                </div>
              </div>
            </div>

            {/* 부제목 */}
            <div className="mb-12">
              <p className="text-2xl md:text-3xl font-bold text-blue-300 mb-4">
                전적 분석 플랫폼
              </p>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
                MLB The Show 야구 게임의 상세한 전적 조회와 심화 분석을
                제공합니다.
              </p>
            </div>

            {/* 검색 박스 - 게임 스타일로 개선 */}
            <div className="max-w-md mx-auto mb-12">
              <form onSubmit={handleSearch} className="space-y-4">
                {/* 메인 플레이어 검색 */}
                <div className="relative group">
                  <Input
                    placeholder="플레이어 아이디를 입력하세요..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-slate-800/80 border-2 border-blue-500/50 rounded-xl h-14 px-6 text-lg placeholder:text-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition-all"
                  />
                  <Button
                    type="submit"
                    className="absolute right-2 top-2 h-10 px-6 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 font-bold rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                  >
                    SEARCH
                  </Button>
                </div>

                {/* 팀원 추가 버튼 */}
                {!showTeammateInput && (
                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={() => setShowTeammateInput(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 hover:bg-slate-700/70 border border-slate-600/50 rounded-lg transition-all text-gray-300 hover:text-white"
                    >
                      <span className="text-lg">👥</span>
                      <span className="text-sm font-medium">팀원 추가</span>
                    </button>
                  </div>
                )}

                {/* 팀원 검색창 */}
                {showTeammateInput && (
                  <div className="relative group">
                    <Input
                      placeholder="팀원 아이디를 입력하세요... (선택사항)"
                      value={teammateQuery}
                      onChange={(e) => setTeammateQuery(e.target.value)}
                      className="bg-slate-800/80 border-2 border-yellow-500/50 rounded-xl h-12 px-6 text-base placeholder:text-gray-400 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setShowTeammateInput(false);
                        setTeammateQuery("");
                      }}
                      className="absolute right-2 top-2 h-8 w-8 bg-slate-600 hover:bg-slate-500 rounded-md transition-all flex items-center justify-center text-gray-300 hover:text-white"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </form>

              <p className="text-sm text-gray-400 mt-3 text-center">
                {teammateQuery.trim()
                  ? "본인과 팀원의 2:2 게임 기록을 검색합니다"
                  : "플레이어 아이디로 경기 기록을 검색해보세요"}
              </p>
            </div>

            {/* 최근 검색 기록 */}
            {recentSearches && recentSearches.length > 0 && (
              <div className="max-w-md mx-auto mb-8">
                <div className="flex items-center gap-2 text-gray-400 text-sm mb-3">
                  <Clock className="w-4 h-4" />
                  <span>최근 검색</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((search) => (
                    <div
                      key={search.username}
                      className="group relative flex items-center gap-2 bg-slate-800/60 hover:bg-slate-700/60 border border-slate-600/50 hover:border-blue-500/50 rounded-lg px-3 py-2 transition-all text-sm text-gray-300 hover:text-white"
                    >
                      <button
                        onClick={() => handleRecentSearchClick(search.username)}
                        className="flex-1 text-left"
                      >
                        {search.displayName || search.username}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeSearch(search.username);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-400 flex-shrink-0"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CTA 버튼들 */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {/* <Button
                onClick={() => router.push("/games")}
                className="bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-400 hover:to-yellow-300 text-black font-black text-lg px-8 py-4 rounded-xl shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105"
              >
                📊 전적 보기
              </Button>
              <Button
                variant="outline"
                className="border-2 border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-black font-bold text-lg px-8 py-4 rounded-xl transition-all transform hover:scale-105"
              >
                🏆 랭킹 확인
              </Button> */}
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 space-y-12">
        {/* 실시간 통계 - 게임 스타일 대시보드 */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-blue-500/30 rounded-2xl shadow-2xl hover:shadow-3xl transition-all hover:border-blue-400/50 transform hover:scale-105">
            <CardContent className="p-6 text-center">
              <div className="text-blue-400 text-sm font-bold uppercase tracking-wider mb-2">
                Total Players
              </div>
              <div className="text-4xl font-black text-white mb-2">127,845</div>
              <div className="text-green-400 text-sm font-semibold">
                +12.5% ↗
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-yellow-500/30 rounded-2xl shadow-2xl hover:shadow-3xl transition-all hover:border-yellow-400/50 transform hover:scale-105">
            <CardContent className="p-6 text-center">
              <div className="text-yellow-400 text-sm font-bold uppercase tracking-wider mb-2">
                Games Analyzed
              </div>
              <div className="text-4xl font-black text-white mb-2">2,847</div>
              <div className="text-green-400 text-sm font-semibold">
                +23.1% ↗
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-purple-500/30 rounded-2xl shadow-2xl hover:shadow-3xl transition-all hover:border-purple-400/50 transform hover:scale-105">
            <CardContent className="p-6 text-center">
              <div className="text-purple-400 text-sm font-bold uppercase tracking-wider mb-2">
                Active Users
              </div>
              <div className="text-4xl font-black text-white mb-2">89,234</div>
              <div className="text-green-400 text-sm font-semibold">
                +8.3% ↗
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-red-500/30 rounded-2xl shadow-2xl hover:shadow-3xl transition-all hover:border-red-400/50 transform hover:scale-105">
            <CardContent className="p-6 text-center">
              <div className="text-red-400 text-sm font-bold uppercase tracking-wider mb-2">
                Average Win Rate
              </div>
              <div className="text-4xl font-black text-white mb-2">67.8%</div>
              <div className="text-red-400 text-sm font-semibold">-2.1% ↘</div>
            </CardContent>
          </Card>
        </section>

        {/* 최근 경기 결과 - 게임 스타일 */}
        <section>
          <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-slate-600/50 rounded-2xl shadow-2xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl font-black text-white flex items-center gap-2">
                🔥 HOT GAMES
              </CardTitle>
              <CardDescription className="text-gray-300">
                오늘의 주목할 만한 경기 결과
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
                    result: "W",
                    color: "green",
                  },
                  {
                    mode: "Battle Royale",
                    opponent: "Yankees_Pro",
                    score: "5:2",
                    stats: "4H, 3RBI, 2HR",
                    result: "W",
                    color: "green",
                  },
                  {
                    mode: "Events",
                    opponent: "Dodgers_King",
                    score: "2:8",
                    stats: "2H, 0RBI, 0HR",
                    result: "L",
                    color: "red",
                  },
                ].map((game, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-700/50 rounded-xl p-4 border border-slate-600/50 hover:bg-slate-700/70 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Badge
                          className={`${game.color === "green" ? "bg-green-600" : "bg-red-600"} text-white font-bold px-3 py-1`}
                        >
                          {game.result}
                        </Badge>
                        <div>
                          <div className="text-white font-bold">
                            {game.mode}
                          </div>
                          <div className="text-gray-400 text-sm">
                            vs {game.opponent}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-black text-blue-400">
                          {game.score}
                        </div>
                        <div className="text-gray-400 text-sm">
                          {game.stats}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 플레이어 랭킹 & 인기 팀 */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-blue-500/30 rounded-2xl shadow-2xl">
            <CardHeader>
              <CardTitle className="text-xl font-black text-white flex items-center gap-2">
                👑 TOP PLAYERS
              </CardTitle>
              <CardDescription className="text-gray-300">
                이번 시즌 최고 성과 플레이어
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
                  className="bg-slate-700/50 rounded-xl p-4 border border-slate-600/50 hover:bg-slate-700/70 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-black ${
                          player.rank === 1
                            ? "bg-yellow-400"
                            : player.rank === 2
                              ? "bg-gray-300"
                              : "bg-orange-400"
                        }`}
                      >
                        #{player.rank}
                      </div>
                      <div>
                        <div className="text-white font-bold">
                          {player.name}
                        </div>
                        <div className="text-blue-400 text-sm font-semibold">
                          Rating {player.rating}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-400 font-bold">
                        {player.winRate}
                      </div>
                      <div className="text-gray-400 text-sm">
                        AVG {player.avg}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-yellow-500/30 rounded-2xl shadow-2xl">
            <CardHeader>
              <CardTitle className="text-xl font-black text-white flex items-center gap-2">
                ⚾ POPULAR TEAMS
              </CardTitle>
              <CardDescription className="text-gray-300">
                가장 인기 있는 팀 순위
              </CardDescription>
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
                  className="bg-slate-700/50 rounded-xl p-4 border border-slate-600/50 hover:bg-slate-700/70 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-yellow-400 font-black text-lg">
                        #{team.rank}
                      </span>
                      <span className="text-white font-bold">{team.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-blue-400 font-bold">
                        {team.usage}
                      </div>
                      <div className="text-gray-400 text-sm">
                        승률 {team.winRate}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        {/* Stats Color Guide */}
        <StatGuide />
      </div>
    </div>
  );
}
