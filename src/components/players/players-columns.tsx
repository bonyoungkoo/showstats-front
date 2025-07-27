"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Users } from "lucide-react";
import Link from "next/link";
import { PitchType, PlayerCard } from "@/types/player";

export const createColumns = (
  onAddToCompare: (player: PlayerCard) => void,
  compareCandidates: PlayerCard[] = []
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
    accessorKey: "name",
    id: "카드",
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
          타격 방향
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
          투구 방향
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
    id: "compare",
    header: "선수 비교",
    enableHiding: false,
    cell: ({ row }) => {
      const player = row.original;
      const isAlreadySelected = compareCandidates.some(
        (candidate) => candidate.uuid === player.uuid
      );
      const isMaxReached = compareCandidates.length >= 2;

      return (
        <div className="flex justify-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onAddToCompare(player)}
            disabled={isAlreadySelected || isMaxReached}
            className={`h-8 w-8 p-0 ${
              isAlreadySelected || isMaxReached
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-blue-50 dark:hover:bg-blue-950/20"
            }`}
          >
            <Users
              className={`h-4 w-4 ${
                isAlreadySelected
                  ? "text-green-600 dark:text-green-400"
                  : isMaxReached
                    ? "text-gray-400"
                    : "text-blue-600 dark:text-blue-400"
              }`}
            />
            <span className="sr-only">
              {isAlreadySelected
                ? "이미 선택됨"
                : isMaxReached
                  ? "최대 선택 완료"
                  : "비교에 추가"}
            </span>
          </Button>
        </div>
      );
    },
  },
  // Hidden filter columns (no visual representation)
  {
    accessorKey: "pitches",
    header: () => null,
    cell: () => null,
    enableHiding: false,
    size: 0,
    minSize: 0,
    maxSize: 0,
    filterFn: (row, id, value) => {
      const player = row.original;
      if (!player.pitches || player.pitches.length === 0) return false;

      const selectedPitchTypes = value as string[];
      const playerPitchTypes = player.pitches.map((pitch) => pitch.name);

      return selectedPitchTypes.some((pitchType) =>
        playerPitchTypes.includes(pitchType as PitchType)
      );
    },
  },
  {
    accessorKey: "height",
    header: () => null,
    cell: () => null,
    enableHiding: false,
    size: 0,
    minSize: 0,
    maxSize: 0,
    filterFn: (row, id, value) => {
      const player = row.original;
      if (!player.height) return false;

      const heightRange = value as [number, number];
      const playerHeight = Number(player.height);

      return playerHeight >= heightRange[0] && playerHeight <= heightRange[1];
    },
  },
  {
    accessorKey: "batting_stats",
    header: () => null,
    cell: () => null,
    enableHiding: false,
    size: 0,
    minSize: 0,
    maxSize: 0,
    filterFn: (row, id, value) => {
      const player = row.original;
      const selectedStats = value as string[];

      return selectedStats.every((stat) => {
        const playerValue = player[stat as keyof PlayerCard];
        return playerValue !== undefined && playerValue !== null;
      });
    },
  },
  {
    accessorKey: "fielding_stats",
    header: () => null,
    cell: () => null,
    enableHiding: false,
    size: 0,
    minSize: 0,
    maxSize: 0,
    filterFn: (row, id, value) => {
      const player = row.original;
      const selectedStats = value as string[];

      return selectedStats.every((stat) => {
        const playerValue = player[stat as keyof PlayerCard];
        return playerValue !== undefined && playerValue !== null;
      });
    },
  },
  {
    accessorKey: "baserunning_stats",
    header: () => null,
    cell: () => null,
    enableHiding: false,
    size: 0,
    minSize: 0,
    maxSize: 0,
    filterFn: (row, id, value) => {
      const player = row.original;
      const selectedStats = value as string[];

      return selectedStats.every((stat) => {
        const playerValue = player[stat as keyof PlayerCard];
        return playerValue !== undefined && playerValue !== null;
      });
    },
  },
  {
    accessorKey: "pitching_stats",
    header: () => null,
    cell: () => null,
    enableHiding: false,
    size: 0,
    minSize: 0,
    maxSize: 0,
    filterFn: (row, id, value) => {
      const player = row.original;
      const selectedStats = value as string[];

      return selectedStats.every((stat) => {
        const playerValue = player[stat as keyof PlayerCard];
        return playerValue !== undefined && playerValue !== null;
      });
    },
  },
  {
    accessorKey: "series",
    header: () => null,
    cell: () => null,
    enableHiding: false,
    size: 0,
    minSize: 0,
    maxSize: 0,
    filterFn: (row, id, value) => {
      const player = row.original;
      if (!player.series) return false;

      const selectedSeries = value as string[];
      return selectedSeries.includes(player.series);
    },
  },
  {
    accessorKey: "quirks",
    header: () => null,
    cell: () => null,
    enableHiding: false,
    size: 0,
    minSize: 0,
    maxSize: 0,
    filterFn: (row, id, value) => {
      const player = row.original;
      if (!player.quirks || player.quirks.length === 0) return false;

      const selectedQuirks = value as string[];
      const playerQuirkNames = player.quirks.map((quirk) => quirk.name);

      return selectedQuirks.some((quirkName) =>
        playerQuirkNames.includes(quirkName)
      );
    },
  },
];
