"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { PlayerCard } from "@/types/player";

export const createColumns = (
  onCompareClick: (player: PlayerCard) => void
): ColumnDef<PlayerCard>[] => [
  {
    accessorKey: "ovr",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          오버롤
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const player = row.original;
      return (
        <div className="flex items-center justify-center gap-2">
          <img
            src={`/rarity/shield-${player.rarity.toLowerCase()}.webp`}
            alt={`${player.rarity} shield`}
            className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/rarity/shield-common.webp";
            }}
          />
          <span className="font-bold text-sm sm:text-base">{player.ovr}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "card",
    header: "카드",
    cell: ({ row }) => {
      const player = row.original;
      return (
        <div className="flex items-center gap-3">
          <img
            src={player.img}
            alt={player.name}
            className="w-8 sm:w-10 md:w-12 object-cover rounded"
            style={{ aspectRatio: "40/56.38", height: "auto" }}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/icon.png";
            }}
          />
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {player.display_position}
              </Badge>
              <Link
                href={`/players/${player.uuid}`}
                className="font-medium hover:underline text-sm sm:text-base"
              >
                {player.name}
              </Link>
            </div>
            <Badge variant="outline" className="text-xs w-fit">
              {player.series}
            </Badge>
          </div>
        </div>
      );
    },
  },

  {
    accessorKey: "bat_hand",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          타격
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const player = row.original;
      return (
        <div className="flex justify-center">
          <span className="text-sm text-muted-foreground">
            {player.bat_hand === "S"
              ? "양타"
              : player.bat_hand === "L"
                ? "좌타"
                : "우타"}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "throw_hand",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          투구
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const player = row.original;
      return (
        <div className="flex justify-center">
          <span className="text-sm text-muted-foreground">
            {player.throw_hand === "L" ? "좌투" : "우투"}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "display_position",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          포지션
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const player = row.original;

      const convertPositionToKorean = (position: string) => {
        const positionMap: { [key: string]: string } = {
          SP: "선발",
          RP: "계투",
          CP: "마무리",
          DH: "지명타자",
          C: "포수",
          "1B": "1루수",
          "2B": "2루수",
          "3B": "3루수",
          SS: "유격수",
          LF: "좌익수",
          CF: "중견수",
          RF: "우익수",
        };
        return positionMap[position] || position;
      };

      return (
        <div className="flex justify-center">
          <Badge variant="secondary" className="text-xs">
            {convertPositionToKorean(player.display_position)}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "display_secondary_positions",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          서브 포지션
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const player = row.original;

      const convertPositionToKorean = (position: string) => {
        const positionMap: { [key: string]: string } = {
          SP: "선발",
          RP: "계투",
          CP: "마무리",
          DH: "지명타자",
          C: "포수",
          "1B": "1루수",
          "2B": "2루수",
          "3B": "3루수",
          SS: "유격수",
          LF: "좌익수",
          CF: "중견수",
          RF: "우익수",
        };
        return positionMap[position] || position;
      };

      const convertSecondaryPositions = (positions: string) => {
        if (!positions) return "-";
        return positions
          .split(", ")
          .map((pos) => convertPositionToKorean(pos))
          .join(", ");
      };

      return (
        <div className="flex justify-center">
          <span className="text-sm text-muted-foreground">
            {convertSecondaryPositions(player.display_secondary_positions)}
          </span>
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const player = row.original;

      return (
        <div className="flex justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => onCompareClick(player)}>
                선수 비교
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
