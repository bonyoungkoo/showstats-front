"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "@/components/ui/data-table-view-options";

import { DataTableRadioFilter } from "@/components/ui/data-table-radio-filter";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  const batHandOptions = [
    { label: "좌타", value: "L" },
    { label: "우타", value: "R" },
    { label: "양타", value: "S" },
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

  return (
    <div className="flex flex-col gap-4">
      {/* 필터 버튼들 - 가로로 일렬 배치 */}
      <div className="flex flex-row items-center gap-2 overflow-x-auto">
        <DataTableRadioFilter
          column={table.getColumn("bat_hand")}
          title="타격"
          options={batHandOptions}
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
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            초기화
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>

      {/* 검색 입력 필드와 보기 옵션 */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <Input
          placeholder="선수명으로 검색..."
          value={(table.getColumn("card")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("card")?.setFilterValue(event.target.value)
          }
          className="h-8 w-full sm:w-[150px] lg:w-[250px]"
        />
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
