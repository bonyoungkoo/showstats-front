import { useState, useEffect } from "react";
import {
  PlayerCard,
  PlayersResponse,
  UsePlayerCardsOptions,
} from "@/types/player";

export function usePlayerCards(options: UsePlayerCardsOptions = {}) {
  const [players, setPlayers] = useState<PlayerCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 25,
    total: 0,
    totalPages: 0,
  });

  const fetchPlayers = async (newOptions: UsePlayerCardsOptions = {}) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: (newOptions.page || options.page || 1).toString(),
        limit: (newOptions.limit || options.limit || 25).toString(),
      });

      if (newOptions.search || options.search) {
        params.append("search", newOptions.search || options.search || "");
      }
      if (newOptions.rarity || options.rarity) {
        params.append("rarity", newOptions.rarity || options.rarity || "");
      }
      if (newOptions.position || options.position) {
        params.append(
          "position",
          newOptions.position || options.position || ""
        );
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/player-cards?${params}`
      );

      if (!response.ok) {
        throw new Error("선수 데이터를 불러올 수 없습니다.");
      }

      const data: PlayersResponse = await response.json();

      setPlayers(data.data);
      setPagination({
        page: data.page,
        limit: data.limit,
        total: data.total,
        totalPages: data.totalPages,
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다."
      );
      console.error("선수 데이터를 불러오는 중 오류가 발생했습니다:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  return {
    players,
    loading,
    error,
    pagination,
    fetchPlayers,
  };
}
