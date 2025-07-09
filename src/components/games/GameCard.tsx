import { Card } from "@/components/ui/card";
import type { GameListItem } from "@/hooks/useUserGames";

interface GameCardProps {
  game: GameListItem & { display_date?: string; display_pitcher_info?: string };
  isUserWin: boolean;
  onClick: () => void;
}

export default function GameCard({ game, isUserWin, onClick }: GameCardProps) {
  return (
    <Card
      className="bg-card border border-border shadow-md rounded-xl mb-3 cursor-pointer transition-colors hover:bg-muted/60"
      onClick={onClick}
    >
      {/* 데스크탑: 가로, 모바일: 세로 */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 min-w-0">
        {/* 점수/팀명 영역 */}
        <div className="flex flex-col sm:flex-row items-center gap-4 flex-1 min-w-0 w-full">
          {/* 홈팀 */}
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-bold text-lg text-foreground truncate max-w-[120px]">
              {game.home_full_name}
            </span>
            <span className="px-2 py-0.5 rounded bg-muted text-foreground text-xs font-medium">
              홈
            </span>
            <span className="ml-2 text-xl font-bold text-foreground">
              {game.home_runs}
            </span>
          </div>
          {/* 구분자 */}
          <span className="mx-2 text-lg font-bold text-muted-foreground hidden sm:inline">
            :
          </span>
          {/* 어웨이팀 */}
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-bold text-lg text-foreground truncate max-w-[120px]">
              {game.away_full_name}
            </span>
            <span className="px-2 py-0.5 rounded bg-rose-900/80 text-white text-xs font-medium">
              어웨이
            </span>
            <span className="ml-2 text-xl font-bold text-foreground">
              {game.away_runs}
            </span>
          </div>
        </div>
        {/* 결과/날짜/투수 */}
        <div className="flex flex-col items-end gap-1 min-w-[120px]">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold ${isUserWin ? "bg-primary/80 text-white" : "bg-muted text-foreground"}`}
          >
            {isUserWin ? "승리" : "패배"}
          </span>
          <span className="text-xs text-muted-foreground">
            {game.display_date}
          </span>
          <span className="text-xs text-muted-foreground max-w-[120px] truncate">
            {game.display_pitcher_info}
          </span>
        </div>
      </div>
    </Card>
  );
}
