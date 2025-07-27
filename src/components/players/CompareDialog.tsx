"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlayerCard } from "@/types/player";
import Image from "next/image";
import { TrendingUp } from "lucide-react";

interface CompareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  players: PlayerCard[];
}

export default function CompareDialog({
  open,
  onOpenChange,
  players,
}: CompareDialogProps) {
  if (players.length < 2) return null;

  const [player1, player2] = players;

  const isBothHitter = player1.is_hitter && player2.is_hitter;
  const isBothPitcher = !player1.is_hitter && !player2.is_hitter;

  const getStatColor = (value: number) => {
    if (value >= 120) return "text-purple-400";
    if (value >= 100) return "text-blue-400";
    if (value >= 80) return "text-green-400";
    if (value >= 60) return "text-yellow-400";
    if (value >= 40) return "text-orange-400";
    return "text-red-400";
  };

  const renderStatRow = (label: string, stat1: number, stat2: number) => {
    const color1 = getStatColor(stat1);
    const color2 = getStatColor(stat2);
    const difference = Math.abs(stat1 - stat2);
    const isPlayer1Higher = stat1 > stat2;
    const isPlayer2Higher = stat2 > stat1;

    return (
      <div className="grid grid-cols-3 gap-6 items-center py-3 px-6 hover:bg-gray-800/30 transition-colors border-b border-gray-700/50 last:border-b-0">
        {/* 선수 1 능력치 */}
        <div className="flex items-center justify-end gap-3">
          <div className="text-right">
            <div className={`font-bold text-lg ${color1}`}>{stat1}</div>
          </div>
          {/* 우위 표시 영역 (고정 너비) */}
          <div className="w-12 flex justify-center">
            {isPlayer1Higher && difference > 0 && (
              <div className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4 text-cyan-400" />
                <span className="text-xs text-cyan-400 font-semibold">
                  +{difference}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* 능력치 라벨 */}
        <div className="text-center">
          <div className="text-sm font-semibold text-white">{label}</div>
        </div>

        {/* 선수 2 능력치 */}
        <div className="flex items-center justify-start gap-3">
          {/* 우위 표시 영역 (고정 너비) */}
          <div className="w-12 flex justify-center">
            {isPlayer2Higher && difference > 0 && (
              <div className="flex items-center gap-1">
                <span className="text-xs text-cyan-400 font-semibold">
                  +{difference}
                </span>
                <TrendingUp className="h-4 w-4 text-cyan-400" />
              </div>
            )}
          </div>
          <div className="text-left">
            <div className={`font-bold text-lg ${color2}`}>{stat2}</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[85vh] p-0 bg-gray-900 border-gray-700">
        <DialogHeader className="px-6 py-4 border-b border-gray-700 bg-gray-800">
          <DialogTitle className="text-center text-xl font-bold text-white">
            선수 비교
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(85vh-80px)]">
          <div className="p-6 space-y-2">
            {/* 선수 카드 섹션 */}
            <div className="grid grid-cols-2 gap-2">
              {/* 선수 1 */}
              <Card className="overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 hover:shadow-xl transition-all duration-300">
                <CardHeader className="text-center pb-6">
                  <div className="relative mx-auto mb-4">
                    <div className="w-32 h-40 rounded-lg overflow-hidden bg-gray-800 border border-gray-600">
                      <Image
                        src={player1.img}
                        alt={player1.name}
                        width={128}
                        height={160}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/icon.png";
                        }}
                      />
                    </div>
                    {/* 레어리티 쉴드 */}
                    <div className="absolute -top-2 -right-2">
                      <div className="relative">
                        <Image
                          src={`/rarity/shield-${player1.rarity.toLowerCase()}.webp`}
                          alt={`${player1.rarity} shield`}
                          width={48}
                          height={48}
                          className="w-12 h-12"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/rarity/shield-common.webp";
                          }}
                        />
                        <span
                          className="absolute inset-0 flex items-center justify-center text-white text-xl font-bold drop-shadow-lg"
                          style={{ transform: "translateY(-5px)" }}
                        >
                          {player1.ovr}
                        </span>
                      </div>
                    </div>
                  </div>
                  <CardTitle className="text-xl font-bold text-white min-h-[3.5rem]">
                    {player1.name}
                  </CardTitle>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <Badge
                      variant="secondary"
                      className="text-xs bg-gray-700 text-gray-300"
                    >
                      {player1.display_position}
                    </Badge>
                  </div>
                  <div>
                    <Badge
                      variant="outline"
                      className="text-xs border-gray-600 text-gray-400"
                    >
                      {player1.series}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground italic text-sm mt-1">
                    {player1.team}
                  </p>

                  {/* 추가 정보 */}
                  <div className="flex items-center justify-center gap-3 mt-3 text-xs text-gray-400">
                    <span>{player1.age}세</span>
                    <span>•</span>
                    <span>
                      {player1.bat_hand}/{player1.throw_hand}
                    </span>
                    <span>•</span>
                    <span>{player1.height}</span>
                  </div>
                </CardHeader>
              </Card>

              {/* 선수 2 */}
              <Card className="overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 hover:shadow-xl transition-all duration-300">
                <CardHeader className="text-center pb-6">
                  <div className="relative mx-auto mb-4">
                    <div className="w-32 h-40 rounded-lg overflow-hidden bg-gray-800 border border-gray-600">
                      <Image
                        src={player2.img}
                        alt={player2.name}
                        width={128}
                        height={160}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/icon.png";
                        }}
                      />
                    </div>
                    {/* 레어리티 쉴드 */}
                    <div className="absolute -top-2 -right-2">
                      <div className="relative">
                        <Image
                          src={`/rarity/shield-${player2.rarity.toLowerCase()}.webp`}
                          alt={`${player2.rarity} shield`}
                          width={48}
                          height={48}
                          className="w-12 h-12"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/rarity/shield-common.webp";
                          }}
                        />
                        <span
                          className="absolute inset-0 flex items-center justify-center text-white text-xl font-bold drop-shadow-lg"
                          style={{ transform: "translateY(-5px)" }}
                        >
                          {player2.ovr}
                        </span>
                      </div>
                    </div>
                  </div>
                  <CardTitle className="text-xl font-bold text-white min-h-[3.5rem]">
                    {player2.name}
                  </CardTitle>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <Badge
                      variant="secondary"
                      className="text-xs bg-gray-700 text-gray-300"
                    >
                      {player2.display_position}
                    </Badge>
                  </div>
                  <div>
                    <Badge
                      variant="outline"
                      className="text-xs border-gray-600 text-gray-400"
                    >
                      {player2.series}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground italic text-sm mt-1">
                    {player2.team}
                  </p>

                  {/* 추가 정보 */}
                  <div className="flex items-center justify-center gap-3 mt-3 text-xs text-gray-400">
                    <span>{player2.age}세</span>
                    <span>•</span>
                    <span>
                      {player2.bat_hand}/{player2.throw_hand}
                    </span>
                    <span>•</span>
                    <span>{player2.height}</span>
                  </div>
                </CardHeader>
              </Card>
            </div>

            {/* 능력치 비교 섹션 */}
            <Card className="overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
              <CardHeader className="border-b border-gray-700">
                <CardTitle className="text-center text-lg font-semibold text-white pt-1">
                  능력치 비교
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div>
                  {isBothHitter && (
                    <>
                      {renderStatRow(
                        "좌타 컨택",
                        player1.contact_left,
                        player2.contact_left
                      )}
                      {renderStatRow(
                        "우타 컨택",
                        player1.contact_right,
                        player2.contact_right
                      )}
                      {renderStatRow(
                        "좌타 파워",
                        player1.power_left,
                        player2.power_left
                      )}
                      {renderStatRow(
                        "우타 파워",
                        player1.power_right,
                        player2.power_right
                      )}
                      {renderStatRow(
                        "타격 클러치",
                        player1.batting_clutch,
                        player2.batting_clutch
                      )}
                      {renderStatRow(
                        "타격 시야",
                        player1.plate_vision,
                        player2.plate_vision
                      )}
                      {renderStatRow(
                        "선구안",
                        player1.plate_discipline,
                        player2.plate_discipline
                      )}
                      {renderStatRow(
                        "번트 능력",
                        player1.bunting_ability,
                        player2.bunting_ability
                      )}
                      {renderStatRow(
                        "드래그 번트",
                        player1.drag_bunting_ability,
                        player2.drag_bunting_ability
                      )}
                    </>
                  )}

                  {isBothPitcher && (
                    <>
                      {renderStatRow("체력", player1.stamina, player2.stamina)}
                      {renderStatRow(
                        "H/9",
                        player1.hits_per_bf,
                        player2.hits_per_bf
                      )}
                      {renderStatRow("K/9", player1.k_per_bf, player2.k_per_bf)}
                      {renderStatRow(
                        "BB/9",
                        player1.bb_per_bf,
                        player2.bb_per_bf
                      )}
                      {renderStatRow(
                        "HR/9",
                        player1.hr_per_bf,
                        player2.hr_per_bf
                      )}
                      {renderStatRow(
                        "구속",
                        player1.pitch_velocity,
                        player2.pitch_velocity
                      )}
                      {renderStatRow(
                        "투구 클러치",
                        player1.pitching_clutch,
                        player2.pitching_clutch
                      )}
                      {renderStatRow(
                        "제구력",
                        player1.pitch_control,
                        player2.pitch_control
                      )}
                      {renderStatRow(
                        "투구 무브먼트",
                        player1.pitch_movement,
                        player2.pitch_movement
                      )}
                    </>
                  )}

                  <>
                    {renderStatRow(
                      "수비 능력",
                      player1.fielding_ability,
                      player2.fielding_ability
                    )}
                    {renderStatRow(
                      "송구 파워",
                      player1.arm_strength,
                      player2.arm_strength
                    )}
                    {renderStatRow(
                      "송구 정확도",
                      player1.arm_accuracy,
                      player2.arm_accuracy
                    )}
                    {renderStatRow(
                      "반응 속도",
                      player1.reaction_time,
                      player2.reaction_time
                    )}
                    {renderStatRow("스피드", player1.speed, player2.speed)}
                    {renderStatRow(
                      "도루 능력",
                      player1.baserunning_ability,
                      player2.baserunning_ability
                    )}
                    {renderStatRow(
                      "주루 공격성",
                      player1.baserunning_aggression,
                      player2.baserunning_aggression
                    )}
                  </>
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
