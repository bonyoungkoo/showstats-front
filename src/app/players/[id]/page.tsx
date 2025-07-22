import PlayerDetailClient from "@/components/players/PlayerDetailClient";

interface PlayerDetailPageProps {
  params: {
    id: string;
  };
}

export default function PlayerDetailPage({ params }: PlayerDetailPageProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <PlayerDetailClient playerId={params.id} />
    </div>
  );
}
