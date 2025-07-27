"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Info } from "lucide-react";
import Link from "next/link";
import { PlayerCard } from "@/types/player";
import Image from "next/image";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface PlayerDetailClientProps {
  playerId: string;
}

export default function PlayerDetailClient({
  playerId,
}: PlayerDetailClientProps) {
  const [player, setPlayer] = useState<PlayerCard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlayer = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/player-cards/${playerId}`
        );
        if (response.ok) {
          const data = await response.json();
          setPlayer(data);
        } else {
          console.error("선수 정보를 불러올 수 없습니다.");
        }
      } catch (error) {
        console.error("선수 데이터를 불러오는 중 오류가 발생했습니다:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayer();
  }, [playerId]);

  const getHandDisplay = (batHand: string, throwHand: string) => {
    if (batHand === "S") return "S/R";
    return `${batHand}/${throwHand}`;
  };

  const getStatColor = (value: number) => {
    if (value >= 120) return "text-purple-400";
    if (value >= 100) return "text-blue-400";
    if (value >= 80) return "text-green-400";
    if (value >= 60) return "text-yellow-400";
    if (value >= 40) return "text-orange-400";
    return "text-red-400";
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {/* 뒤로가기 버튼 스켈레톤 */}
        <div className="flex items-center gap-4">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-48" />
        </div>

        {/* 선수 정보 스켈레톤 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 선수 이미지 카드 스켈레톤 */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <Skeleton className="w-full h-64 rounded-lg" />
                  <div className="space-y-2">
                    <Skeleton className="h-8 w-32" />
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-5 w-16" />
                      <Skeleton className="h-5 w-20" />
                    </div>
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <div className="space-y-2">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="flex justify-between">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 선수 스탯 카드 스켈레톤 */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-24" />
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* 타격 스탯 스켈레톤 */}
                  <div className="space-y-4">
                    <Skeleton className="h-6 w-16" />
                    <div className="space-y-3">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="flex justify-between">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-4 w-8" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 수비 스탯 스켈레톤 */}
                  <div className="space-y-4">
                    <Skeleton className="h-6 w-16" />
                    <div className="space-y-3">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex justify-between">
                          <Skeleton className="h-4 w-20" />
                          <Skeleton className="h-4 w-8" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!player) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-white mb-4">
          선수를 찾을 수 없습니다
        </h2>
        <Link href="/players">
          <Button>선수 목록으로 돌아가기</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 뒤로가기 버튼 */}
      <Link href="/players">
        <Button variant="outline" className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          선수 목록으로 돌아가기
        </Button>
      </Link>

      {/* 선수 기본 정보 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 선수 이미지 */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="relative">
                  <Image
                    src={player.img}
                    alt={player.name}
                    width={263}
                    height={373}
                    className="w-full rounded-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/icon.png";
                    }}
                  />
                  <div className="absolute top-2 right-2">
                    <div className="relative">
                      <Image
                        src={`/rarity/shield-${player.rarity.toLowerCase()}.webp`}
                        alt={`${player.rarity} shield`}
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
                        {player.ovr}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h1 className="text-2xl font-bold text-white">
                    {player.name}
                  </h1>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {player.display_position}
                    </Badge>
                    <Badge variant="outline">{player.series}</Badge>
                  </div>
                  <p className="text-muted-foreground italic">{player.team}</p>
                </div>

                {/* 기본 정보 */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">포지션</span>
                    <span className="text-white">
                      {player.display_position}
                    </span>
                  </div>
                  {player.display_secondary_positions && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">보조 포지션</span>
                      <span className="text-white">
                        {player.display_secondary_positions}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">타격/투구</span>
                    <span className="text-white">
                      {getHandDisplay(player.bat_hand, player.throw_hand)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">나이</span>
                    <span className="text-white">{player.age}세</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">신장/체중</span>
                    <span className="text-white">
                      {player.height} / {player.weight}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">출생지</span>
                    <span className="text-white">{player.born}</span>
                  </div>
                  {player.jersey_number && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">등번호</span>
                      <span className="text-white">
                        #{player.jersey_number}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 선수 스탯 */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-white">선수 스탯</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 타격 스탯 */}
                {player.is_hitter && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-border pb-2">
                      <h3 className="text-lg font-semibold text-white">타격</h3>
                      <div className="flex items-center gap-2">
                        {player.hit_rank_image && (
                          <Image
                            src={player.hit_rank_image}
                            alt="타격 랭크"
                            width={16}
                            height={16}
                            className="w-4 h-4"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = "none";
                            }}
                          />
                        )}
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-4 w-4 p-0"
                            >
                              <Info className="h-3 w-3" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-80">
                            <div className="space-y-2">
                              <h4 className="font-medium leading-none">
                                타격 스탯 설명
                              </h4>
                              <ul className="text-sm text-muted-foreground list-none space-y-1 break-keep">
                                <li>
                                  <strong>컨택:</strong> 공을 정확히 맞추는
                                  능력. 능력치가 높을수록 PCI 크기가 커집니다.
                                </li>
                                <li>
                                  <strong>파워:</strong> 공을 멀리 치는 능력.
                                  능력치가 높을수록 타구 스피드가 빨라집니다.
                                </li>
                                <li>
                                  <strong>클러치:</strong> 득점권 상황에서의
                                  컨택을 대신합니다. 능력치가 높을수록 PCI
                                  크기가 커집니다.
                                </li>
                              </ul>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">좌타 컨택</span>
                        <span
                          className={`font-semibold ${getStatColor(player.contact_left)}`}
                        >
                          {player.contact_left}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">우타 컨택</span>
                        <span
                          className={`font-semibold ${getStatColor(player.contact_right)}`}
                        >
                          {player.contact_right}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">좌타 파워</span>
                        <span
                          className={`font-semibold ${getStatColor(player.power_left)}`}
                        >
                          {player.power_left}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">우타 파워</span>
                        <span
                          className={`font-semibold ${getStatColor(player.power_right)}`}
                        >
                          {player.power_right}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          타격 클러치
                        </span>
                        <span
                          className={`font-semibold ${getStatColor(player.batting_clutch)}`}
                        >
                          {player.batting_clutch}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 타격 세부 스탯 */}
                {player.is_hitter && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-border pb-2">
                      <h3 className="text-lg font-semibold text-white">
                        타격 보조
                      </h3>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0"
                          >
                            <Info className="h-3 w-3" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                          <div className="space-y-2">
                            <h4 className="font-medium leading-none">
                              타격 보조 스탯 설명
                            </h4>
                            <ul className="text-sm text-muted-foreground list-none space-y-1 break-keep">
                              <li>
                                <strong>타격 시야:</strong> 헛스윙을 줄여주는
                                능력. 능력치가 높을수록 바깥쪽 PCI 크기가
                                커집니다.
                              </li>
                              <li>
                                <strong>선구안:</strong> 공을 칠지 말지를
                                판단하는 능력. 능력치가 높을수록 볼을 더 잘
                                골라내고, 체크스윙 성공 확률이 높아집니다.
                              </li>
                              <li>
                                <strong>타격 내구도:</strong> 부상 확률을
                                줄여주는 능력. 온라인 플레이에서는 사용되지
                                않습니다.
                              </li>
                            </ul>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">타격 시야</span>
                        <span
                          className={`font-semibold ${getStatColor(player.plate_vision)}`}
                        >
                          {player.plate_vision}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">선구안</span>
                        <span
                          className={`font-semibold ${getStatColor(player.plate_discipline)}`}
                        >
                          {player.plate_discipline}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          타격 내구도
                        </span>
                        <span
                          className={`font-semibold ${getStatColor(player.hitting_durability)}`}
                        >
                          {player.hitting_durability}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {player.is_hitter && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-border pb-2">
                      <h3 className="text-lg font-semibold text-white">번트</h3>
                      <div className="flex items-center gap-2">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-4 w-4 p-0"
                            >
                              <Info className="h-3 w-3" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-80">
                            <div className="space-y-2">
                              <h4 className="font-medium leading-none">
                                번트 스탯 설명
                              </h4>
                              <ul className="text-sm text-muted-foreground list-none space-y-1 break-keep">
                                <li>
                                  <strong>번트 능력치:</strong> 능력치가
                                  높을수록 번트를 성공 확률이 높아집니다.
                                </li>
                                <li>
                                  <strong>드래그 번트:</strong> 능력치가
                                  높을수록 기습 번트 성공 확률이 높아집니다.
                                </li>
                              </ul>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">번트 능력</span>
                        <span
                          className={`font-semibold ${getStatColor(player.bunting_ability)}`}
                        >
                          {player.bunting_ability}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          드래그 번트
                        </span>
                        <span
                          className={`font-semibold ${getStatColor(player.drag_bunting_ability)}`}
                        >
                          {player.drag_bunting_ability}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 수비 스탯 */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-border pb-2">
                    <h3 className="text-lg font-semibold text-white">수비</h3>
                    <div className="flex items-center gap-2">
                      {player.fielding_rank_image && (
                        <Image
                          src={player.fielding_rank_image}
                          alt="수비 랭크"
                          width={16}
                          height={16}
                          className="w-4 h-4"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                          }}
                        />
                      )}
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0"
                          >
                            <Info className="h-3 w-3" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                          <div className="space-y-2">
                            <h4 className="font-medium leading-none">
                              수비 스탯 설명
                            </h4>
                            <ul className="text-sm text-muted-foreground list-none space-y-1 break-keep">
                              <li>
                                <strong>수비 능력:</strong> 수비 동작 전반의
                                기본 능력. 능력치가 높을수록 포구실책 확률이
                                줄어들며, 판정 범위가 넓어집니다.
                              </li>
                              <li>
                                <strong>송구 파워:</strong> 공을 던지는 힘.
                                능력치가 높을수록 송구 속도가 빨라집니다.
                              </li>
                              <li>
                                <strong>송구 정확도:</strong> 공을 정확하게
                                던지는 능력. 능력치가 높을수록 송구 실책 확률이
                                줄어들고 송구 게이지 범위도 넓어집니다.
                              </li>
                              <li>
                                <strong>반응 속도:</strong> 타구에 대한 초기
                                반응 속도. 능력치가 높을수록 타구판단이 빨라지고
                                정확하게 반응합니다.
                              </li>
                              <li>
                                <strong>블로킹:</strong> 포수가 공을 빠뜨리지
                                않고 막아내는 능력. 능력치가 높을수록 바운드
                                볼을 안정적으로 블로킹하여 폭투로 이어질 확률을
                                방지합니다.
                              </li>
                            </ul>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">수비 능력</span>
                      <span
                        className={`font-semibold ${getStatColor(player.fielding_ability)}`}
                      >
                        {player.fielding_ability}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">송구 파워</span>
                      <span
                        className={`font-semibold ${getStatColor(player.arm_strength)}`}
                      >
                        {player.arm_strength}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">송구 정확도</span>
                      <span
                        className={`font-semibold ${getStatColor(player.arm_accuracy)}`}
                      >
                        {player.arm_accuracy}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">반응 속도</span>
                      <span
                        className={`font-semibold ${getStatColor(player.reaction_time)}`}
                      >
                        {player.reaction_time}
                      </span>
                    </div>
                    {player.blocking > 0 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">블로킹</span>
                        <span
                          className={`font-semibold ${getStatColor(player.blocking)}`}
                        >
                          {player.blocking}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* 주루 스탯 */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-border pb-2">
                    <h3 className="text-lg font-semibold text-white">주루</h3>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0"
                        >
                          <Info className="h-3 w-3" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80">
                        <div className="space-y-2">
                          <h4 className="font-medium leading-none">
                            주루 스탯 설명
                          </h4>
                          <ul className="text-sm text-muted-foreground list-none space-y-1 break-keep">
                            <li>
                              <strong>스피드:</strong> 달리기 속도. 능력치가
                              높을수록 달리기 속도가 빨라집니다.
                            </li>
                            <li>
                              <strong>도루 능력:</strong> 도루를 성공시키는
                              능력. 능력치가 높을수록 도루 시 스타트 타이밍이
                              정확해집니다.
                            </li>
                            <li>
                              <strong>주루 공격성:</strong> 능력치가 높을수록 AI
                              주자들이 주루 플레이에 적극적이게 됩니다. 온라인
                              플레이에서는 사용되지 않습니다.
                            </li>
                          </ul>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">스피드</span>
                      <span
                        className={`font-semibold ${getStatColor(player.speed)}`}
                      >
                        {player.speed}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">도루 능력</span>
                      <span
                        className={`font-semibold ${getStatColor(player.baserunning_ability)}`}
                      >
                        {player.baserunning_ability}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">주루 공격성</span>
                      <span
                        className={`font-semibold ${getStatColor(player.baserunning_aggression)}`}
                      >
                        {player.baserunning_aggression}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 투구 스탯 */}
                {!player.is_hitter && (
                  <>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-border pb-2">
                        <h3 className="text-lg font-semibold text-white">
                          투구
                        </h3>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-4 w-4 p-0"
                            >
                              <Info className="h-3 w-3" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-80">
                            <div className="space-y-2">
                              <h4 className="font-medium leading-none">
                                투구 스탯 설명
                              </h4>
                              <ul className="text-sm text-muted-foreground list-none space-y-1 break-keep">
                                <li>
                                  <strong>체력:</strong> 투수가 얼마나 오래 던질
                                  수 있는지를 나타내는 능력. 능력치가 높을수록
                                  체력이 천천히 줄어듭니다.
                                </li>

                                <li>
                                  <strong>H/9:</strong> 상대 타자의 안타 허용을
                                  억제하는 능력. 능력치가 높을수록 상대의{" "}
                                  <span className="text-primary font-semibold">
                                    안쪽 PCI가 작아져 안타 확률이 줄어듭니다.
                                  </span>
                                </li>

                                <li>
                                  <strong>K/9:</strong> 삼진을 유도하는 능력.
                                  능력치가 높을수록 상대의{" "}
                                  <span className="text-primary font-semibold">
                                    바깥쪽 PCI가 작아져 헛스윙 확률이
                                    올라갑니다.
                                  </span>
                                </li>

                                <li>
                                  <strong>BB/9:</strong> 볼넷을 줄이는 능력.
                                  능력치가 높을수록 투구 시{" "}
                                  <span className="text-primary font-semibold">
                                    제구 원의 반경이 작아집니다.
                                  </span>
                                </li>

                                <li>
                                  <strong>HR/9:</strong> 홈런 허용을 억제하는
                                  능력. 능력치가 높을수록 실투 시 홈런 허용
                                  빈도가 줄어들지만, 온라인 플레이에서는
                                  사용되지 않습니다.
                                </li>

                                <li>
                                  <strong>Pitching Clutch (PCLT):</strong>{" "}
                                  득점권이나 경기 후반 상황에서의 피칭 능력.
                                  능력치가 높을수록 퍼펙트 타이밍 제구가
                                  쉬워지고,{" "}
                                  <span className="text-primary font-semibold">
                                    클러치 상황에서의 H/9를 대체하여 PCI를
                                    줄이는 효과를 가집니다.
                                  </span>
                                </li>

                                <li>
                                  <strong>구속:</strong> 구종의 구속을 결정하는
                                  능력. 능력치가 높을수록 구속이 빨라집니다.
                                </li>

                                <li>
                                  <strong>제구력:</strong> 구종을 정확히 원하는
                                  위치에 던질 수 있는 능력. 능력치가 높을수록
                                  퍼펙트 타이밍 제구 성공률이 높고,{" "}
                                  <span className="text-primary font-semibold">
                                    제구 원의 중심에 더 가깝게 제구됩니다.
                                  </span>
                                </li>

                                <li>
                                  <strong>투구 무브먼트:</strong> 구종의
                                  무브먼트를 결정하는 능력. 능력치가 높을수록
                                  공의 움직임이 좋아집니다.
                                </li>
                              </ul>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">체력</span>
                          <span
                            className={`font-semibold ${getStatColor(player.stamina)}`}
                          >
                            {player.stamina}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">H/9</span>
                          <span
                            className={`font-semibold ${getStatColor(player.hits_per_bf)}`}
                          >
                            {player.hits_per_bf}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">K/9</span>
                          <span
                            className={`font-semibold ${getStatColor(player.k_per_bf)}`}
                          >
                            {player.k_per_bf}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">BB/9</span>
                          <span
                            className={`font-semibold ${getStatColor(player.bb_per_bf)}`}
                          >
                            {player.bb_per_bf}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">HR/9</span>
                          <span
                            className={`font-semibold ${getStatColor(player.hr_per_bf)}`}
                          >
                            {player.hr_per_bf}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">구속</span>
                          <span
                            className={`font-semibold ${getStatColor(player.pitch_velocity)}`}
                          >
                            {player.pitch_velocity}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            투구 클러치
                          </span>
                          <span
                            className={`font-semibold ${getStatColor(player.pitching_clutch)}`}
                          >
                            {player.pitching_clutch}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">제구력</span>
                          <span
                            className={`font-semibold ${getStatColor(player.pitch_control)}`}
                          >
                            {player.pitch_control}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            투구 무브먼트
                          </span>
                          <span
                            className={`font-semibold ${getStatColor(player.pitch_movement)}`}
                          >
                            {player.pitch_movement}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-border pb-2">
                        <h3 className="text-lg font-semibold text-white">
                          구종
                        </h3>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-4 w-4 p-0"
                            >
                              <Info className="h-3 w-3" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-80">
                            <div className="space-y-2">
                              <h4 className="font-medium leading-none">
                                구종 스탯 설명
                              </h4>
                              <ul className="text-sm text-muted-foreground list-none space-y-1 break-keep">
                                <li>
                                  <strong>구속:</strong> 해당 구종의 구속을
                                  결정하는 능력. 능력치가 높을수록 공의 속도가
                                  빨라집니다.
                                </li>
                                <li>
                                  <strong>제구력:</strong> 해당 구종을 정확히
                                  원하는 위치에 던질 수 있는 능력. 능력치가
                                  높을수록 퍼펙트 타이밍 제구 성공률이 높고,
                                  제구 원의 중심에 더 가깝게 제구됩니다.
                                </li>
                                <li>
                                  <strong>무브먼트:</strong> 해당 구종의
                                  무브먼트를 결정하는 능력. 능력치가 높을수록
                                  슬라이더나 커브 등 변화구의 움직임이
                                  좋아집니다.
                                </li>
                              </ul>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>

                      {player.pitches?.map((pitch) => {
                        return (
                          <div key={pitch.name}>
                            <div className="space-y-2">
                              <h4 className="text-sm font-semibold text-white">
                                {pitch.name}
                              </h4>
                              <div className="space-y-3">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">
                                    구속
                                  </span>
                                  <span
                                    className={`font-semibold ${getStatColor(pitch.speed)}`}
                                  >
                                    {pitch.speed}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">
                                    제구력
                                  </span>
                                  <span
                                    className={`font-semibold ${getStatColor(pitch.control)}`}
                                  >
                                    {pitch.control}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">
                                    투구 무브먼트
                                  </span>
                                  <span
                                    className={`font-semibold ${getStatColor(pitch.movement)}`}
                                  >
                                    {pitch.movement}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {player.quirks && player.quirks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-white">히든 특성</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {player.quirks.map((quirk, index) => (
                <div
                  key={`${index}_${quirk.name}`}
                  className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card/50"
                >
                  <Image
                    src={quirk.img}
                    alt={quirk.name}
                    height={32}
                    width={32}
                    className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs sm:text-sm">
                        {quirk.name}
                      </Badge>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {quirk.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {player.locations && player.locations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-white">획득 방법</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {player.locations.map((location, index) => (
                <Badge key={index} variant="outline">
                  {location}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
