"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { PlayerCard } from "@/types/player";

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
                  <img
                    src={player.img}
                    alt={player.name}
                    className="w-full rounded-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/icon.png";
                    }}
                  />
                  <div className="absolute top-2 right-2">
                    <div className="relative">
                      <img
                        src={`/rarity/shield-${player.rarity.toLowerCase()}.webp`}
                        alt={`${player.rarity} shield`}
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
                      {player.hit_rank_image && (
                        <img
                          src={player.hit_rank_image}
                          alt="타격 랭크"
                          className="w-8 h-8"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                          }}
                        />
                      )}
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

                {/* 수비 스탯 */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-border pb-2">
                    <h3 className="text-lg font-semibold text-white">수비</h3>
                    {player.fielding_rank_image && (
                      <img
                        src={player.fielding_rank_image}
                        alt="수비 랭크"
                        className="w-8 h-8"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                        }}
                      />
                    )}
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
                  <h3 className="text-lg font-semibold text-white border-b border-border pb-2">
                    주루
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">주루 능력</span>
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
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">스피드</span>
                      <span
                        className={`font-semibold ${getStatColor(player.speed)}`}
                      >
                        {player.speed}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 타격 세부 스탯 */}
                {player.is_hitter && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white border-b border-border pb-2">
                      타격 세부
                    </h3>
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

                {/* 투구 스탯 */}
                {!player.is_hitter && (
                  <>
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-white border-b border-border pb-2">
                        투구
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">구속</span>
                          <span
                            className={`font-semibold ${getStatColor(player.pitch_velocity)}`}
                          >
                            {player.pitch_velocity}
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
                          <span className="text-muted-foreground">체력</span>
                          <span
                            className={`font-semibold ${getStatColor(player.stamina)}`}
                          >
                            {player.stamina}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-white border-b border-border pb-2">
                        구종
                      </h3>

                      {player.pitches?.map((pitch) => {
                        return (
                          <>
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
                          </>
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

      {/* 추가 정보 */}
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
