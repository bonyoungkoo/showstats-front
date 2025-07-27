"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, BarChart3, Plus } from "lucide-react";
import { PlayerCard } from "@/types/player";
import Image from "next/image";

interface CompareSheetProps {
  players: PlayerCard[];
  onRemovePlayer: (playerId: string) => void;
  onClearAll: () => void;
  onCompare: () => void;
}

export default function CompareSheet({
  players,
  onRemovePlayer,
  onClearAll,
  onCompare,
}: CompareSheetProps) {
  return (
    <div className="h-full flex flex-col">
      {/* 헤더 섹션 */}
      <div className="flex items-center justify-start mb-4 px-4 pt-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearAll}
          className="text-red-400 hover:text-red-300 hover:bg-red-950/20"
        >
          전체 초기화
        </Button>
      </div>

      {/* 선수 목록 섹션 - 가로 레이아웃 */}
      <div className="flex-1 px-4">
        <div className="grid grid-cols-2 gap-4 h-full">
          {/* 첫 번째 선수 슬롯 */}
          <div className="flex flex-col">
            {players[0] ? (
              <Card className="group hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 hover:border-blue-500 h-full">
                <div className="p-4 h-full flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-5 h-5 bg-blue-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                      1
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemovePlayer(players[0].uuid)}
                      className="opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300 hover:bg-red-950/20"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex flex-col items-center flex-1">
                    {/* 선수 이미지와 레어리티 */}
                    <div className="relative mb-4">
                      <div className="w-20 h-25 rounded-lg overflow-hidden bg-gray-800 border border-gray-600">
                        <Image
                          src={players[0].img}
                          alt={players[0].name}
                          width={80}
                          height={100}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/icon.png";
                          }}
                        />
                      </div>
                      {/* 레어리티 쉴드 */}
                      <div className="absolute -top-1 -right-1">
                        <div className="relative">
                          <Image
                            src={`/rarity/shield-${players[0].rarity.toLowerCase()}.webp`}
                            alt={`${players[0].rarity} shield`}
                            width={32}
                            height={32}
                            className="w-8 h-8"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "/rarity/shield-common.webp";
                            }}
                          />
                          <span
                            className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold drop-shadow-lg"
                            style={{ transform: "translateY(-2px)" }}
                          >
                            {players[0].ovr}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* 선수 정보 */}
                    <div className="text-center flex-1">
                      <div className="font-bold text-white text-lg mb-2">
                        {players[0].name}
                      </div>
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Badge
                          variant="secondary"
                          className="text-xs bg-gray-700 text-gray-300"
                        >
                          {players[0].display_position}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="text-xs border-gray-600 text-gray-400"
                        >
                          {players[0].series}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground italic text-sm mb-3">
                        {players[0].team}
                      </p>

                      {/* 추가 정보 */}
                      <div className="space-y-1 text-xs text-gray-400">
                        <div>{players[0].age}세</div>
                        <div>
                          {players[0].bat_hand}/{players[0].throw_hand}
                        </div>
                        <div>{players[0].height}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="border-2 border-dashed border-gray-600 bg-gray-800/50 hover:border-gray-500 transition-colors h-full">
                <div className="p-4 h-full flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 border-2 border-dashed border-gray-500 rounded-full flex items-center justify-center mb-4">
                    <Plus className="h-8 w-8 text-gray-500" />
                  </div>
                  <p className="text-gray-500 font-medium mb-2">첫 번째 선수</p>
                  <p className="text-sm text-gray-600">
                    테이블에서 선수를 선택해주세요
                  </p>
                </div>
              </Card>
            )}
          </div>

          {/* 두 번째 선수 슬롯 */}
          <div className="flex flex-col">
            {players[1] ? (
              <Card className="group hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 hover:border-blue-500 h-full">
                <div className="p-4 h-full flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-5 h-5 bg-blue-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                      2
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemovePlayer(players[1].uuid)}
                      className="opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300 hover:bg-red-950/20"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex flex-col items-center flex-1">
                    {/* 선수 이미지와 레어리티 */}
                    <div className="relative mb-4">
                      <div className="w-20 h-25 rounded-lg overflow-hidden bg-gray-800 border border-gray-600">
                        <Image
                          src={players[1].img}
                          alt={players[1].name}
                          width={80}
                          height={100}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/icon.png";
                          }}
                        />
                      </div>
                      {/* 레어리티 쉴드 */}
                      <div className="absolute -top-1 -right-1">
                        <div className="relative">
                          <Image
                            src={`/rarity/shield-${players[1].rarity.toLowerCase()}.webp`}
                            alt={`${players[1].rarity} shield`}
                            width={32}
                            height={32}
                            className="w-8 h-8"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "/rarity/shield-common.webp";
                            }}
                          />
                          <span
                            className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold drop-shadow-lg"
                            style={{ transform: "translateY(-2px)" }}
                          >
                            {players[1].ovr}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* 선수 정보 */}
                    <div className="text-center flex-1">
                      <div className="font-bold text-white text-lg mb-2">
                        {players[1].name}
                      </div>
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Badge
                          variant="secondary"
                          className="text-xs bg-gray-700 text-gray-300"
                        >
                          {players[1].display_position}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="text-xs border-gray-600 text-gray-400"
                        >
                          {players[1].series}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground italic text-sm mb-3">
                        {players[1].team}
                      </p>

                      {/* 추가 정보 */}
                      <div className="space-y-1 text-xs text-gray-400">
                        <div>{players[1].age}세</div>
                        <div>
                          {players[1].bat_hand}/{players[1].throw_hand}
                        </div>
                        <div>{players[1].height}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="border-2 border-dashed border-gray-600 bg-gray-800/50 hover:border-gray-500 transition-colors h-full">
                <div className="p-4 h-full flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 border-2 border-dashed border-gray-500 rounded-full flex items-center justify-center mb-4">
                    <Plus className="h-8 w-8 text-gray-500" />
                  </div>
                  <p className="text-gray-500 font-medium mb-2">두 번째 선수</p>
                  <p className="text-sm text-gray-600">
                    테이블에서 선수를 선택해주세요
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* 하단 액션 버튼 */}
      {players.length > 0 && (
        <div className="pt-4 px-4 pb-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200"
            disabled={players.length < 2}
            onClick={onCompare}
          >
            <BarChart3 className="h-5 w-5 mr-2" />
            비교하기 ({players.length}명)
          </Button>
          {players.length < 2 && (
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
              최소 2명의 선수가 필요합니다
            </p>
          )}
        </div>
      )}
    </div>
  );
}
