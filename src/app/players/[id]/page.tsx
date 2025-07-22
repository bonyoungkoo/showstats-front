import PlayerDetailClient from "@/components/players/PlayerDetailClient";

interface PlayerDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PlayerDetailPage({
  params,
}: PlayerDetailPageProps) {
  const { id } = await params;

  return (
    <div className="container mx-auto px-4 py-8">
      <PlayerDetailClient playerId={id} />
    </div>
  );
}
