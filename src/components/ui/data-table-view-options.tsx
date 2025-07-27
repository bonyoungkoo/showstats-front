"use client";

import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { MixerHorizontalIcon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>;
}

export function DataTableViewOptions<TData>({
  table,
}: DataTableViewOptionsProps<TData>) {
  const getColumnDisplayName = (columnId: string) => {
    const columnNames: Record<string, string> = {
      ovr: "오버롤",
      카드: "카드",
      bat_hand: "타격 방향",
      display_position: "포지션",
      throw_hand: "투구 방향",
      display_secondary_positions: "서브 포지션",
      compare: "선수 비교",
    };
    return columnNames[columnId] || columnId;
  };

  const hiddenColumns = [
    "pitches",
    "height",
    "batting_stats",
    "fielding_stats",
    "baserunning_stats",
    "pitching_stats",
    "series",
    "quirks",
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="ml-auto h-8">
          <MixerHorizontalIcon className="mr-2 h-4 w-4" />
          보기
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px]">
        <DropdownMenuLabel>컬럼 표시</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {table
          .getAllColumns()
          .filter(
            (column) =>
              typeof column.accessorFn !== "undefined" &&
              column.getCanHide() &&
              !hiddenColumns.includes(column.id)
          )
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {getColumnDisplayName(column.id)}
              </DropdownMenuCheckboxItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
