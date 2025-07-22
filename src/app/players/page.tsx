import PlayersClient from "@/components/players/PlayersClient";

export default function PlayersPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">
          선수 데이터베이스
        </h1>
        <p className="text-muted-foreground">
          MLB The Show 25 선수 데이터베이스를 조회하세요
        </p>
      </div>
      <PlayersClient />
    </div>
  );
}
