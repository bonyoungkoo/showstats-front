"use client";

import * as React from "react";
import { Column } from "@tanstack/react-table";
import { Check, PlusCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { useFilterStore } from "@/lib/filter-store";

interface DataTableFacetedFilterProps<TData, TValue> {
  column?: Column<TData, TValue>;
  title?: string;
  options: {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
  showPitchStats?: boolean;
  showHeightSlider?: boolean;
  showStatSliders?: boolean;
}

export function DataTableFacetedFilter<TData, TValue>({
  column,
  title,
  options,
  showPitchStats = false,
  showHeightSlider = false,
  showStatSliders = false,
}: DataTableFacetedFilterProps<TData, TValue>) {
  const facets = column?.getFacetedUniqueValues();
  const selectedValues = new Set(column?.getFilterValue() as string[]);

  // Zustand 스토어에서 상태 가져오기
  const {
    pitchStats,
    heightRange,
    statRanges,
    updatePitchStat,
    setHeightRange,
    updateStatRange,
  } = useFilterStore();

  // 선택된 구종들의 기본 능력치 계산
  const computedPitchStats = React.useMemo(() => {
    const stats: {
      [key: string]: {
        speed: [number, number];
        control: [number, number];
        movement: [number, number];
      };
    } = {};
    selectedValues.forEach((pitchName) => {
      stats[pitchName] = pitchStats[pitchName] || {
        speed: [0, 100],
        control: [0, 100],
        movement: [0, 100],
      };
    });
    return stats;
  }, [selectedValues, pitchStats]);

  const handlePitchStatChange = (
    pitchName: string,
    stat: "speed" | "control" | "movement",
    value: number[]
  ) => {
    updatePitchStat(pitchName, stat, [value[0], value[1]]);
  };

  // 인치를 피트+인치로 변환하는 함수
  const inchesToFeetInches = (inches: number): string => {
    const feet = Math.floor(inches / 12);
    const remainingInches = inches % 12;
    return `${feet}'${remainingInches}"`;
  };

  // 신장 슬라이더 핸들러
  const handleHeightChange = (value: number[]) => {
    const newRange: [number, number] = [value[0], value[1]];
    setHeightRange(newRange);
    // 기본값이 아닐 때만 필터 값으로 설정
    if (newRange[0] !== 60 || newRange[1] !== 85) {
      column?.setFilterValue(newRange);
    } else {
      column?.setFilterValue(undefined);
    }
  };

  // 능력치 슬라이더 핸들러
  const handleStatChange = (statName: string, value: number[]) => {
    const newRange: [number, number] = [value[0], value[1]];
    updateStatRange(statName, newRange);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <PlusCircle className="mr-2 h-4 w-4" />
          {title}
          {showHeightSlider &&
            heightRange[0] !== 60 &&
            heightRange[1] !== 85 && (
              <>
                <Badge
                  variant="secondary"
                  className="rounded-sm px-1 font-normal lg:hidden"
                >
                  {inchesToFeetInches(heightRange[0])} -{" "}
                  {inchesToFeetInches(heightRange[1])}
                </Badge>
                <div className="hidden space-x-1 lg:flex">
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {inchesToFeetInches(heightRange[0])} -{" "}
                    {inchesToFeetInches(heightRange[1])}
                  </Badge>
                </div>
              </>
            )}
          {!showHeightSlider && selectedValues?.size > 0 && (
            <div className="space-x-1">
              {options
                .filter((option) => selectedValues.has(option.value))
                .map((option) => (
                  <Badge
                    variant="secondary"
                    key={option.value}
                    className="rounded-sm px-1 font-normal"
                  >
                    {option.label}
                  </Badge>
                ))}
            </div>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        {showHeightSlider ? (
          <div className="p-4 space-y-4">
            <div className="text-sm font-medium">신장 설정</div>
            <div className="space-y-3">
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <Label>신장</Label>
                  <span className="text-xs text-muted-foreground">
                    {inchesToFeetInches(heightRange[0])} -{" "}
                    {inchesToFeetInches(heightRange[1])}
                  </span>
                </div>
                <Slider
                  value={heightRange}
                  onValueChange={handleHeightChange}
                  max={85}
                  min={60}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        ) : (
          <Command>
            <CommandInput placeholder={title} />
            <CommandList>
              <CommandEmpty>결과가 없습니다.</CommandEmpty>
              <CommandGroup>
                {options.map((option) => {
                  const isSelected = selectedValues.has(option.value);
                  return (
                    <CommandItem
                      key={option.value}
                      onSelect={() => {
                        if (isSelected) {
                          selectedValues.delete(option.value);
                        } else {
                          selectedValues.add(option.value);
                        }
                        const filterValues = Array.from(selectedValues);

                        column?.setFilterValue(
                          filterValues.length ? filterValues : undefined
                        );
                      }}
                    >
                      <div
                        className={cn(
                          "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                          isSelected
                            ? "bg-primary text-primary-foreground"
                            : "opacity-50 [&_svg]:invisible"
                        )}
                      >
                        <Check className={cn("h-4 w-4")} />
                      </div>
                      {option.icon && (
                        <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                      )}
                      <span>{option.label}</span>
                      {facets?.get(option.value) && (
                        <span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
                          {facets.get(option.value)}
                        </span>
                      )}
                    </CommandItem>
                  );
                })}
              </CommandGroup>

              {/* 구종 능력치 슬라이더 */}
              {showPitchStats && selectedValues.size > 0 && (
                <>
                  <CommandSeparator />
                  <div className="p-4 space-y-4">
                    <div className="text-sm font-medium">구종 능력치 설정</div>
                    {Array.from(selectedValues).map((pitchName) => {
                      const stats = computedPitchStats[pitchName];
                      return (
                        <div key={pitchName} className="space-y-3">
                          <div className="text-xs font-medium text-muted-foreground">
                            {
                              options.find((opt) => opt.value === pitchName)
                                ?.label
                            }
                          </div>
                          <div className="space-y-2">
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <Label>구속</Label>
                                <span className="text-xs text-muted-foreground">
                                  {stats.speed?.[0] || 0} -{" "}
                                  {stats.speed?.[1] || 100}
                                </span>
                              </div>
                              <Slider
                                value={stats.speed || [0, 100]}
                                onValueChange={(value) =>
                                  handlePitchStatChange(
                                    pitchName,
                                    "speed",
                                    value
                                  )
                                }
                                max={100}
                                min={0}
                                step={1}
                                className="w-full"
                              />
                            </div>
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <Label>제구</Label>
                                <span className="text-xs text-muted-foreground">
                                  {stats.control?.[0] || 0} -{" "}
                                  {stats.control?.[1] || 100}
                                </span>
                              </div>
                              <Slider
                                value={stats.control || [0, 100]}
                                onValueChange={(value) =>
                                  handlePitchStatChange(
                                    pitchName,
                                    "control",
                                    value
                                  )
                                }
                                max={100}
                                min={0}
                                step={1}
                                className="w-full"
                              />
                            </div>
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <Label>구종</Label>
                                <span className="text-xs text-muted-foreground">
                                  {stats.movement?.[0] || 0} -{" "}
                                  {stats.movement?.[1] || 100}
                                </span>
                              </div>
                              <Slider
                                value={stats.movement || [0, 100]}
                                onValueChange={(value) =>
                                  handlePitchStatChange(
                                    pitchName,
                                    "movement",
                                    value
                                  )
                                }
                                max={100}
                                min={0}
                                step={1}
                                className="w-full"
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}

              {/* 능력치 슬라이더 */}
              {showStatSliders && selectedValues.size > 0 && (
                <>
                  <CommandSeparator />
                  <div className="p-4 space-y-4">
                    <div className="text-sm font-medium">능력치 설정</div>
                    {Array.from(selectedValues).map((statName) => {
                      const statRange = statRanges[statName] || [0, 125];
                      const option = options.find(
                        (opt) => opt.value === statName
                      );
                      return (
                        <div key={statName} className="space-y-3">
                          <div className="text-xs font-medium text-muted-foreground">
                            {option?.label}
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <Label>능력치</Label>
                              <span className="text-xs text-muted-foreground">
                                {statRange[0]} - {statRange[1]}
                              </span>
                            </div>
                            <Slider
                              value={statRange}
                              onValueChange={(value) =>
                                handleStatChange(statName, value)
                              }
                              max={100}
                              min={0}
                              step={1}
                              className="w-full"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}

              {selectedValues.size > 0 && (
                <>
                  <CommandSeparator />
                  <CommandGroup>
                    <CommandItem
                      onSelect={() => column?.setFilterValue(undefined)}
                      className="justify-center text-center"
                    >
                      필터 초기화
                    </CommandItem>
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        )}
      </PopoverContent>
    </Popover>
  );
}
