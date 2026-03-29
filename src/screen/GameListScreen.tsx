import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useInfiniteQuery } from "@tanstack/react-query";
import { DifficultyModal } from "../components/DifficultyModal";
import { useGameStore } from "../stores/useGameStore";
import { usePlayScoreStore } from "../stores/usePlayScoreStore";
import { showInterstitialAd } from "../utils/admob";
import { supabase } from "../lib/supabase";

type SortKey = "latest" | "popular";

interface Puzzle {
  id: number;
  title: string;
  img: string;
  play_count: number;
  created_at: string;
}

const PAGE_SIZE = 10;

async function fetchPuzzles({
  pageParam,
  sort,
}: {
  pageParam: number;
  sort: SortKey;
}): Promise<Puzzle[]> {
  const from = pageParam * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;
  const orderColumn = sort === "latest" ? "created_at" : "play_count";

  const { data, error } = await supabase
    .from("puzzle")
    .select("id, title, img, play_count, created_at")
    .order(orderColumn, { ascending: false })
    .range(from, to);

  if (error) throw error;
  return data as Puzzle[];
}

export default function GameListScreen() {
  const navigate = useNavigate();
  const setGame = useGameStore((s) => s.setGame);
  const { playScore, resetScore } = usePlayScoreStore();
  const sentinelRef = useRef<HTMLDivElement>(null);

  const [sort, setSort] = useState<SortKey>("latest");
  const [selectedPuzzle, setSelectedPuzzle] = useState<Puzzle | null>(null);
  const [gridSize, setGridSize] = useState<number>(8);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ["puzzles", sort],
    queryFn: ({ pageParam }) =>
      fetchPuzzles({ pageParam: pageParam as number, sort }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length < PAGE_SIZE ? undefined : allPages.length,
  });

  const puzzles = data?.pages.flat() ?? [];

  // 무한 스크롤: sentinel이 화면에 들어오면 다음 페이지 로드
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          void fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  async function handleStart() {
    if (!selectedPuzzle) return;
    if (playScore >= 6) {
      await showInterstitialAd();
      resetScore();
    }
    setGame(selectedPuzzle.img, gridSize, selectedPuzzle.id);
    setSelectedPuzzle(null);
    navigate("/game");
  }

  return (
    <div className="flex flex-col gap-4">
      {/* 페이지 타이틀 */}
      <div>
        <p className="text-2xl font-bold text-gray-900">퍼즐 목록</p>
        <p className="text-sm text-gray-400 mt-1">플레이할 퍼즐을 골라보세요</p>
      </div>

      {/* 정렬 탭 */}
      <div className="flex gap-2">
        {(["latest", "popular"] as SortKey[]).map((key) => (
          <button
            key={key}
            className="rounded-full px-4 py-1.5 text-sm font-semibold transition-colors"
            style={{
              background: sort === key ? "#6366f1" : "white",
              color: sort === key ? "white" : "#6b7280",
              boxShadow: sort === key ? "none" : "0 1px 4px rgba(0,0,0,0.1)",
            }}
            onClick={() => setSort(key)}
          >
            {key === "latest" ? "최신순" : "인기순"}
          </button>
        ))}
      </div>

      {/* 카드 그리드 */}
      {isLoading ? (
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-gray-100 rounded-2xl overflow-hidden animate-pulse"
            >
              <div className="aspect-square w-full bg-gray-200" />
              <div className="px-3 py-2.5 flex flex-col gap-1.5">
                <div className="h-3 bg-gray-200 rounded w-3/4" />
                <div className="h-2.5 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <p className="text-center text-sm text-gray-400 py-10">
          불러오지 못했어요
        </p>
      ) : puzzles.length === 0 ? (
        <p className="text-center text-sm text-gray-400 py-10">
          아직 퍼즐이 없어요
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {puzzles.map((puzzle) => (
            <div
              key={puzzle.id}
              className="bg-white rounded-2xl overflow-hidden shadow cursor-pointer active:scale-95 transition-transform"
              onClick={() => {
                setSelectedPuzzle(puzzle);
                setGridSize(8);
              }}
            >
              <div className="aspect-square w-full overflow-hidden">
                <img
                  src={puzzle.img}
                  alt={puzzle.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="px-3 py-2.5">
                <p className="font-bold text-sm text-gray-800 truncate">
                  {puzzle.title}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {puzzle.play_count}회 플레이
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 무한 스크롤 sentinel */}
      <div ref={sentinelRef} className="h-4" />
      {isFetchingNextPage && (
        <p className="text-center text-xs text-gray-400 pb-2">불러오는 중...</p>
      )}

      <DifficultyModal
        open={selectedPuzzle !== null}
        title={selectedPuzzle?.title}
        gridSize={gridSize}
        onGridSizeChange={setGridSize}
        onConfirm={handleStart}
        onCancel={() => setSelectedPuzzle(null)}
      />
    </div>
  );
}
