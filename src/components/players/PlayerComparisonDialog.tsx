"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlayerCard } from "@/types/player";
import { X, Plus } from "lucide-react";

interface PlayerComparisonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedPlayer: PlayerCard | null;
}

export default function PlayerComparisonDialog({
  open,
  onOpenChange,
  selectedPlayer,
}: PlayerComparisonDialogProps) {
  const [comparisonPlayer, setComparisonPlayer] = useState<PlayerCard | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<PlayerCard[]>([]);
  const [searching, setSearching] = useState(false);

  // 선수 검색 함수
  const searchPlayers = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/player-cards/search?name=${encodeURIComponent(query)}&limit=10`
      );
      if (response.ok) {
        const data = await response.json();
        setSearchResults(
          data.data.filter(
            (player: PlayerCard) => player.uuid !== selectedPlayer?.uuid
          )
        );
      }
    } catch (error) {
      console.error("선수 검색 중 오류:", error);
    } finally {
      setSearching(false);
    }
  };

  // 검색어 변경 시 디바운스 적용
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchPlayers(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // 스탯 색상 함수
  const getStatColor = (value: number) => {
    if (value >= 120) return "text-purple-400";
    if (value >= 100) return "text-blue-400";
    if (value >= 80) return "text-green-400";
    if (value >= 60) return "text-yellow-400";
    if (value >= 40) return "text-orange-400";
    return "text-red-400";
  };

  // 스탯 비교 함수

  // 비교할 스탯 목록
  const statsToCompare = [
    { key: "contact_left", label: "좌타 컨택" },
    { key: "contact_right", label: "우타 컨택" },
    { key: "power_left", label: "좌타 파워" },
    { key: "power_right", label: "우타 파워" },
    { key: "speed", label: "스피드" },
    { key: "fielding_ability", label: "수비 능력" },
    { key: "arm_strength", label: "송구 파워" },
    { key: "arm_accuracy", label: "송구 정확도" },
    { key: "reaction_time", label: "반응 속도" },
    { key: "baserunning_ability", label: "주루 능력" },
    { key: "baserunning_aggression", label: "주루 공격성" },
    { key: "plate_vision", label: "타격 시야" },
    { key: "plate_discipline", label: "선구안" },
    { key: "batting_clutch", label: "타격 클러치" },
    { key: "hitting_durability", label: "타격 내구도" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>선수 비교</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* 선수 선택 영역 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 선택된 선수 */}
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-3">기준 선수</h3>
              {selectedPlayer && (
                <div className="flex items-center gap-3">
                  <img
                    src={selectedPlayer.img}
                    alt={selectedPlayer.name}
                    className="w-12 h-16 object-cover rounded"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/icon.png";
                    }}
                  />
                  <div>
                    <div className="font-medium">{selectedPlayer.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {selectedPlayer.display_position} • {selectedPlayer.team}
                    </div>
                    <Badge variant="secondary" className="text-xs mt-1">
                      OVR {selectedPlayer.ovr}
                    </Badge>
                  </div>
                </div>
              )}
            </div>

            {/* 비교할 선수 선택 */}
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-3">비교할 선수</h3>
              {comparisonPlayer ? (
                <div className="flex items-center gap-3">
                  <img
                    src={comparisonPlayer.img}
                    alt={comparisonPlayer.name}
                    className="w-12 h-16 object-cover rounded"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/icon.png";
                    }}
                  />
                  <div className="flex-1">
                    <div className="font-medium">{comparisonPlayer.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {comparisonPlayer.display_position} •{" "}
                      {comparisonPlayer.team}
                    </div>
                    <Badge variant="secondary" className="text-xs mt-1">
                      OVR {comparisonPlayer.ovr}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setComparisonPlayer(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="선수명을 입력하세요..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                  {searching && (
                    <div className="text-sm text-muted-foreground">
                      검색 중...
                    </div>
                  )}
                  {searchResults.length > 0 && (
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {searchResults.map((player) => (
                        <div
                          key={player.uuid}
                          className="flex items-center gap-2 p-2 hover:bg-muted rounded cursor-pointer"
                          onClick={() => {
                            setComparisonPlayer(player);
                            setSearchQuery("");
                            setSearchResults([]);
                          }}
                        >
                          <img
                            src={player.img}
                            alt={player.name}
                            className="w-8 h-10 object-cover rounded"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "/icon.png";
                            }}
                          />
                          <div className="flex-1">
                            <div className="text-sm font-medium">
                              {player.name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {player.display_position} • OVR {player.ovr}
                            </div>
                          </div>
                          <Plus className="h-4 w-4 text-muted-foreground" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* 스탯 비교 테이블 */}
          {selectedPlayer && comparisonPlayer && (
            <div className="border rounded-lg">
              <div className="p-4 border-b">
                <h3 className="font-semibold">스탯 비교</h3>
              </div>
              <div className="divide-y">
                {statsToCompare.map((stat) => {
                  const stat1 = selectedPlayer[
                    stat.key as keyof PlayerCard
                  ] as number;
                  const stat2 = comparisonPlayer[
                    stat.key as keyof PlayerCard
                  ] as number;

                  return (
                    <div key={stat.key} className="flex items-center p-4">
                      {/* 기준 선수 스탯 */}
                      <div className="flex-1 flex items-center justify-end pr-8">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-semibold text-lg ${getStatColor(stat1)}`}
                          >
                            {stat1}
                          </span>
                          <div className="w-16 flex items-center justify-start">
                            {stat1 > stat2 && (
                              <div className="flex items-center gap-1 text-sm text-green-500">
                                <span>▲</span>
                                <span>{stat1 - stat2}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* 스탯 이름 (중앙) */}
                      <div className="w-32 text-sm font-medium flex items-center justify-center">
                        {stat.label}
                      </div>

                      {/* 차이 표시 */}
                      <div className="w-16 flex items-center justify-center"></div>

                      {/* 비교 선수 스탯 */}
                      <div className="flex-1 flex items-center justify-start pl-8">
                        <div className="flex items-center gap-2">
                          <div className="w-16 flex items-center justify-end">
                            {stat2 > stat1 && (
                              <div className="flex items-center gap-1 text-sm text-green-500">
                                <span>▲</span>
                                <span>{stat2 - stat1}</span>
                              </div>
                            )}
                          </div>
                          <span
                            className={`font-semibold text-lg ${getStatColor(stat2)}`}
                          >
                            {stat2}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
