import { useState, useEffect } from "react";
import { PlayerCard } from "@/types/player";

export function usePlayerCard(playerId: string) {
  const [player, setPlayer] = useState<PlayerCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlayer = async () => {
      if (!playerId) return;

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/player-cards/${playerId}`
        );

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("선수를 찾을 수 없습니다.");
          }
          throw new Error("선수 정보를 불러올 수 없습니다.");
        }

        const data = await response.json();
        setPlayer(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다."
        );
        console.error("선수 데이터를 불러오는 중 오류가 발생했습니다:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayer();
  }, [playerId]);

  return {
    player,
    loading,
    error,
  };
}
