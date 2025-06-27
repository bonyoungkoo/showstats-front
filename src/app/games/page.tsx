import GamesClient from "@/components/games/GamesClient";

interface SearchParams {
  search?: string;
}

interface GamesPageProps {
  searchParams: Promise<SearchParams>;
}

// 게임 데이터 (실제로는 데이터베이스나 API에서 가져올 것)
const getGameData = () => {
  return [
    {
      id: 1,
      date: "2024-01-15",
      time: "14:30",
      mode: "Ranked Seasons",
      opponent: "Yankees_Master",
      myTeam: "Los Angeles Dodgers",
      opponentTeam: "New York Yankees",
      score: "8:5",
      result: "승리",
      myStats: { H: 4, RBI: 3, HR: 2, AVG: ".325" },
      innings: 9,
      duration: "2:15",
    },
    {
      id: 2,
      date: "2024-01-15",
      time: "12:45",
      mode: "Battle Royale",
      opponent: "RedSox_Pro",
      myTeam: "Boston Red Sox",
      opponentTeam: "Tampa Bay Rays",
      score: "3:7",
      result: "패배",
      myStats: { H: 2, RBI: 1, HR: 0, AVG: ".275" },
      innings: 9,
      duration: "1:58",
    },
    {
      id: 3,
      date: "2024-01-14",
      time: "20:15",
      mode: "Events",
      opponent: "Astros_King",
      myTeam: "Houston Astros",
      opponentTeam: "Seattle Mariners",
      score: "6:4",
      result: "승리",
      myStats: { H: 3, RBI: 2, HR: 1, AVG: ".300" },
      innings: 9,
      duration: "2:03",
    },
    {
      id: 4,
      date: "2024-01-14",
      time: "18:30",
      mode: "Ranked Seasons",
      opponent: "Braves_Fan",
      myTeam: "Atlanta Braves",
      opponentTeam: "New York Mets",
      score: "2:9",
      result: "패배",
      myStats: { H: 1, RBI: 0, HR: 0, AVG: ".200" },
      innings: 8,
      duration: "1:45",
    },
    {
      id: 5,
      date: "2024-01-13",
      time: "16:20",
      mode: "Battle Royale",
      opponent: "Cubs_Legend",
      myTeam: "Chicago Cubs",
      opponentTeam: "Milwaukee Brewers",
      score: "10:3",
      result: "승리",
      myStats: { H: 5, RBI: 4, HR: 3, AVG: ".400" },
      innings: 9,
      duration: "2:25",
    },
  ];
};

export default async function GamesPage({ searchParams }: GamesPageProps) {
  // 서버 사이드에서 searchParams Promise 처리
  const resolvedSearchParams = await searchParams;
  const searchQuery = resolvedSearchParams.search || "";

  // 게임 데이터 가져오기 (서버 사이드)
  const gameData = getGameData();

  return (
    <div className="container mx-auto px-4 py-8">
      <GamesClient
        initialGameData={gameData}
        initialSearchQuery={searchQuery}
      />
    </div>
  );
}
