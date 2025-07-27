"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Search } from "lucide-react";
import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "@/components/ui/data-table-view-options";
import { DataTableRadioFilter } from "@/components/ui/data-table-radio-filter";
import { DataTableFacetedFilter } from "@/components/ui/data-table-faceted-filter";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Quirk } from "@/types/player-card-filters";

// PitchType 정의
type PitchType =
  | "4-Seam Fastball"
  | "2-Seam Fastball"
  | "Running Fastball"
  | "Sinker"
  | "Cutter"
  | "ChangeUp"
  | "Circle Change"
  | "Vulcan Change"
  | "Forkball"
  | "Palmball"
  | "Splitter"
  | "Screwball"
  | "Knuckleball"
  | "Curveball"
  | "12-6 Curve"
  | "Knuckle Curve"
  | "Sweeping Curve"
  | "Slider"
  | "Sweeper"
  | "Slurve";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  onSearch?: () => void;
  onReset?: () => void;
}

export function DataTableToolbar<TData>({
  table,
  onSearch,
  onReset,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  const batHandOptions = [
    { label: "좌타", value: "L" },
    { label: "우타", value: "R" },
    { label: "양타", value: "S" },
  ];

  const throwHandOptions = [
    { label: "좌투", value: "L" },
    { label: "우투", value: "R" },
    { label: "양투", value: "S" },
  ];

  const positionOptions = [
    { label: "선발", value: "SP" },
    { label: "계투", value: "RP" },
    { label: "마무리", value: "CP" },
    { label: "포수", value: "C" },
    { label: "1루수", value: "1B" },
    { label: "2루수", value: "2B" },
    { label: "3루수", value: "3B" },
    { label: "유격수", value: "SS" },
    { label: "좌익수", value: "LF" },
    { label: "중견수", value: "CF" },
    { label: "우익수", value: "RF" },
  ];

  const secondaryPositionOptions = [
    { label: "선발", value: "SP" },
    { label: "계투", value: "RP" },
    { label: "마무리", value: "CP" },
    { label: "포수", value: "C" },
    { label: "1루수", value: "1B" },
    { label: "2루수", value: "2B" },
    { label: "3루수", value: "3B" },
    { label: "유격수", value: "SS" },
    { label: "좌익수", value: "LF" },
    { label: "중견수", value: "CF" },
    { label: "우익수", value: "RF" },
  ];

  const pitchTypeOptions: { label: string; value: PitchType }[] = [
    { label: "4-Seam Fastball", value: "4-Seam Fastball" },
    { label: "2-Seam Fastball", value: "2-Seam Fastball" },
    { label: "Running Fastball", value: "Running Fastball" },
    { label: "Sinker", value: "Sinker" },
    { label: "Cutter", value: "Cutter" },
    { label: "ChangeUp", value: "ChangeUp" },
    { label: "Circle Change", value: "Circle Change" },
    { label: "Vulcan Change", value: "Vulcan Change" },
    { label: "Forkball", value: "Forkball" },
    { label: "Palmball", value: "Palmball" },
    { label: "Splitter", value: "Splitter" },
    { label: "Screwball", value: "Screwball" },
    { label: "Knuckleball", value: "Knuckleball" },
    { label: "Curveball", value: "Curveball" },
    { label: "12-6 Curve", value: "12-6 Curve" },
    { label: "Knuckle Curve", value: "Knuckle Curve" },
    { label: "Sweeping Curve", value: "Sweeping Curve" },
    { label: "Slider", value: "Slider" },
    { label: "Sweeper", value: "Sweeper" },
    { label: "Slurve", value: "Slurve" },
  ];

  // 타격 능력치 옵션
  const battingOptions = [
    { label: "좌타 컨택", value: "contact_left" },
    { label: "우타 컨택", value: "contact_right" },
    { label: "좌타 파워", value: "power_left" },
    { label: "우타 파워", value: "power_right" },
    { label: "타격 시야", value: "plate_vision" },
    { label: "선구안", value: "plate_discipline" },
    { label: "타격 클러치", value: "batting_clutch" },
    { label: "번트 능력", value: "bunting_ability" },
    { label: "드래그 번트", value: "drag_bunting_ability" },
    { label: "타격 내구성", value: "hitting_durability" },
  ];

  // 수비 능력치 옵션
  const fieldingOptions = [
    { label: "수비 능력", value: "fielding_ability" },
    { label: "송구 파워", value: "arm_strength" },
    { label: "송구 정확도", value: "arm_accuracy" },
    { label: "반응 속도", value: "reaction_time" },
    { label: "블로킹", value: "blocking" },
  ];

  // 주루 능력치 옵션
  const baserunningOptions = [
    { label: "스피드", value: "speed" },
    { label: "도루 능력", value: "baserunning_ability" },
    { label: "주루 공격성", value: "baserunning_aggression" },
  ];

  // 투구 능력치 옵션
  const pitchingOptions = [
    { label: "체력", value: "stamina" },
    { label: "피안타율", value: "hits_per_bf" },
    { label: "탈삼진율", value: "k_per_bf" },
    { label: "볼넷율", value: "bb_per_bf" },
    { label: "홈런율", value: "hr_per_bf" },
    { label: "구속", value: "pitch_velocity" },
    { label: "제구", value: "pitch_control" },
    { label: "구종", value: "pitch_movement" },
    { label: "투구 클러치", value: "pitching_clutch" },
  ];

  // 시리즈 옵션 (API 응답 기반)
  const seriesOptions = [
    { label: "All", value: "All" },
    { label: "2025 All-Star", value: "2025 All-Star" },
    { label: "2025 Draft", value: "2025 Draft" },
    { label: "2025 Home Run Derby", value: "2025 Home Run Derby" },
    { label: "20th Anniversary", value: "20th Anniversary" },
    { label: "2nd Half Heroes", value: "2nd Half Heroes" },
    { label: "All-Star", value: "All-Star" },
    { label: "Awards", value: "Awards" },
    { label: "Breakout", value: "Breakout" },
    { label: "Color Storm", value: "Color Storm" },
    { label: "Contributor", value: "Contributor" },
    { label: "Cover Athlete", value: "Cover Athlete" },
    { label: "Diamond Dynasty", value: "Diamond Dynasty" },
    { label: "Draft", value: "Draft" },
    { label: "Finest", value: "Finest" },
    { label: "Future Stars", value: "Future Stars" },
    { label: "Headliners", value: "Headliners" },
    { label: "Home Run Derby", value: "Home Run Derby" },
    { label: "Live", value: "Live" },
    { label: "Milestone", value: "Milestone" },
    { label: "Monthly Awards", value: "Monthly Awards" },
    { label: "Out of Position", value: "Out of Position" },
    { label: "Prime", value: "Prime" },
    { label: "Prospect", value: "Prospect" },
    { label: "Rookie", value: "Rookie" },
    { label: "Signature", value: "Signature" },
    { label: "Topps Now", value: "Topps Now" },
    { label: "Veteran", value: "Veteran" },
    { label: "WBC", value: "WBC" },
  ];

  // 히든특성 옵션
  const quirkOptions: { label: string; value: Quirk }[] = [
    { label: "Bad Ball Hitter", value: "Bad Ball Hitter" },
    { label: "Breaking Ball Hitter", value: "Breaking Ball Hitter" },
    { label: "Break Outlier", value: "Break Outlier" },
    { label: "Outlier I", value: "Outlier I" },
    { label: "Outlier II", value: "Outlier II" },
    { label: "Catcher Pop Time", value: "Catcher Pop Time" },
    { label: "Pinch Hitter", value: "Pinch Hitter" },
    { label: "Pressure Cooker", value: "Pressure Cooker" },
    { label: "Stopper", value: "Stopper" },
    { label: "Rally Monkey", value: "Rally Monkey" },
    { label: "Road Warrior", value: "Road Warrior" },
    { label: "Table Setter", value: "Table Setter" },
    { label: "Homebody", value: "Homebody" },
    { label: "Day Player", value: "Day Player" },
    { label: "Night Player", value: "Night Player" },
    { label: "Fighter", value: "Fighter" },
    { label: "First-Pitch Hitter", value: "First-Pitch Hitter" },
    { label: "Situational Hitter", value: "Situational Hitter" },
    { label: "Dead Red", value: "Dead Red" },
    { label: "Unfazed", value: "Unfazed" },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* 필터 버튼들 - 가로로 일렬 배치 */}
      <ScrollArea className="w-full">
        <div className="flex flex-row items-center gap-2 pb-3">
          <DataTableRadioFilter
            column={table.getColumn("bat_hand")}
            title="타격 방향"
            options={batHandOptions}
          />
          <DataTableRadioFilter
            column={table.getColumn("throw_hand")}
            title="투구 방향"
            options={throwHandOptions}
          />
          <DataTableRadioFilter
            column={table.getColumn("display_position")}
            title="포지션"
            options={positionOptions}
          />
          <DataTableRadioFilter
            column={table.getColumn("display_secondary_positions")}
            title="서브포지션"
            options={secondaryPositionOptions}
          />
          <DataTableFacetedFilter
            column={table.getColumn("height")}
            title="신장"
            options={[]}
            showHeightSlider={true}
          />
          <DataTableFacetedFilter
            column={table.getColumn("pitches")}
            title="구종"
            options={pitchTypeOptions}
            showPitchStats={true}
          />
          <DataTableFacetedFilter
            column={table.getColumn("batting_stats")}
            title="타격"
            options={battingOptions}
            showStatSliders={true}
          />
          <DataTableFacetedFilter
            column={table.getColumn("fielding_stats")}
            title="수비"
            options={fieldingOptions}
            showStatSliders={true}
          />
          <DataTableFacetedFilter
            column={table.getColumn("baserunning_stats")}
            title="주루"
            options={baserunningOptions}
            showStatSliders={true}
          />
          <DataTableFacetedFilter
            column={table.getColumn("pitching_stats")}
            title="투구"
            options={pitchingOptions}
            showStatSliders={true}
          />
          <DataTableFacetedFilter
            column={table.getColumn("series")}
            title="시리즈"
            options={seriesOptions}
          />
          <DataTableFacetedFilter
            column={table.getColumn("quirks")}
            title="히든특성"
            options={quirkOptions}
          />
          {isFiltered && (
            <Button
              variant="ghost"
              onClick={onReset || (() => table.resetColumnFilters())}
              className="h-8 px-2 lg:px-3"
            >
              초기화
              <Cross2Icon className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {/* 검색 입력 필드와 보기 옵션 */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        {/* 모바일: 검색 입력창과 버튼들 */}
        <div className="flex flex-col gap-2 sm:hidden">
          <Input
            placeholder="선수명으로 검색..."
            value={(table.getColumn("카드")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("카드")?.setFilterValue(event.target.value)
            }
            className="h-8 w-full"
          />
          <div className="flex items-center gap-2">
            <Button onClick={onSearch} size="sm" className="h-8 px-3">
              <Search className="h-4 w-4 mr-1" />
              검색
            </Button>
            <Button
              variant="ghost"
              onClick={onReset || (() => table.resetColumnFilters())}
              className="h-8 px-2 lg:px-3"
            >
              초기화
              <Cross2Icon className="ml-2 h-4 w-4" />
            </Button>
            <DataTableViewOptions table={table} />
          </div>
        </div>

        {/* 데스크탑: 기존 레이아웃 */}
        <div className="hidden sm:flex items-center gap-2">
          <Input
            placeholder="선수명으로 검색..."
            value={(table.getColumn("카드")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("카드")?.setFilterValue(event.target.value)
            }
            className="h-8 w-[250px] lg:w-[250px]"
          />
          <Button onClick={onSearch} size="sm" className="h-8 px-3">
            <Search className="h-4 w-4 mr-1" />
            검색
          </Button>
          <Button
            variant="ghost"
            onClick={onReset || (() => table.resetColumnFilters())}
            className="h-8 px-2 lg:px-3"
          >
            초기화
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <DataTableViewOptions table={table} />
        </div>
      </div>
    </div>
  );
}
