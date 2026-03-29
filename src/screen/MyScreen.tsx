import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useUserStore } from "../stores/useUserStore";
import { useGameStore } from "../stores/useGameStore";
import { signOut } from "../utils/auth";
import { supabase } from "../lib/supabase";
import { DifficultyModal } from "../components/DifficultyModal";
import { Modal } from "../components/Modal";

type Tab = "created" | "played";

interface MyPuzzle {
  id: number;
  title: string;
  img: string;
  created_at: string;
}

interface PlayedPuzzle {
  puzzle_id: number;
  title: string;
  img: string;
  gridSize: number;
  time: number;
  created_at: string;
}

const PAGE_SIZE = 10;

async function fetchMyPuzzles(
  userId: string,
  page: number,
): Promise<MyPuzzle[]> {
  const { data, error } = await supabase
    .from("puzzle")
    .select("id, title, img, created_at")
    .eq("auth_id", userId)
    .order("created_at", { ascending: false })
    .range(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE - 1);
  if (error) throw error;
  return data as MyPuzzle[];
}

async function fetchPlayedPuzzles(
  userId: string,
  page: number,
): Promise<PlayedPuzzle[]> {
  const { data, error } = await supabase
    .from("record")
    .select(`puzzle_id, gridSize, time, created_at, puzzle(title, img)`)
    .eq("auth_id", userId)
    .order("created_at", { ascending: false })
    .range(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE - 1);
  if (error) throw error;
  return (
    data as unknown as Array<{
      puzzle_id: number;
      gridSize: number;
      time: number;
      created_at: string;
      puzzle: { title: string; img: string };
    }>
  ).map((r) => ({
    puzzle_id: r.puzzle_id,
    title: r.puzzle.title,
    img: r.puzzle.img,
    gridSize: r.gridSize,
    time: r.time,
    created_at: r.created_at,
  }));
}

interface SelectedPuzzle {
  id: number;
  title: string;
  img: string;
  defaultGridSize?: number;
}

export default function MyScreen() {
  const navigate = useNavigate();
  const { user, clearUser } = useUserStore();
  const setGame = useGameStore((s) => s.setGame);
  const [tab, setTab] = useState<Tab>("created");
  const [withdrawConfirm, setWithdrawConfirm] = useState(false);
  const [selectedPuzzle, setSelectedPuzzle] = useState<SelectedPuzzle | null>(
    null,
  );
  const [gridSize, setGridSize] = useState(8);

  function handleSignOut() {
    clearUser();
    navigate("/");
    void signOut();
  }

  async function handleWithdraw() {
    await supabase.rpc("delete_user");
    clearUser();
    navigate("/");
  }

  function handleStart() {
    if (!selectedPuzzle) return;
    setGame(selectedPuzzle.img, gridSize, selectedPuzzle.id);
    setSelectedPuzzle(null);
    navigate("/game");
  }

  const sentinelRef = useRef<HTMLDivElement>(null);

  const {
    data: createdData,
    fetchNextPage: fetchNextCreated,
    hasNextPage: hasNextCreated,
    isFetchingNextPage: isFetchingCreated,
    isLoading: createdLoading,
  } = useInfiniteQuery({
    queryKey: ["myPuzzles", user?.id],
    queryFn: ({ pageParam }) => fetchMyPuzzles(user!.id, pageParam as number),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length < PAGE_SIZE ? undefined : allPages.length,
    enabled: !!user,
  });

  const {
    data: playedData,
    fetchNextPage: fetchNextPlayed,
    hasNextPage: hasNextPlayed,
    isFetchingNextPage: isFetchingPlayed,
    isLoading: playedLoading,
  } = useInfiniteQuery({
    queryKey: ["playedPuzzles", user?.id],
    queryFn: ({ pageParam }) =>
      fetchPlayedPuzzles(user!.id, pageParam as number),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length < PAGE_SIZE ? undefined : allPages.length,
    enabled: !!user,
  });

  const createdPuzzles = createdData?.pages.flat() ?? [];
  const playedPuzzles = playedData?.pages.flat() ?? [];
  const isLoading = tab === "created" ? createdLoading : playedLoading;
  const isFetchingNextPage =
    tab === "created" ? isFetchingCreated : isFetchingPlayed;
  const hasNextPage = tab === "created" ? hasNextCreated : hasNextPlayed;
  const fetchNextPage = tab === "created" ? fetchNextCreated : fetchNextPlayed;

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

  function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return m > 0 ? `${m}분 ${s}초` : `${s}초`;
  }

  return (
    <div className="flex flex-col gap-4">
      {/* 페이지 타이틀 + 로그아웃 */}
      <div className="flex items-center justify-between">
        <p className="text-2xl font-bold text-gray-900">내 정보</p>
        <button
          className="text-xs font-semibold text-gray-500 bg-white rounded-full px-4 py-1.5 shadow-sm active:scale-90 transition-transform"
          onClick={async () => {
            await new Promise((resolve) => setTimeout(resolve, 120));
            void handleSignOut();
          }}
        >
          로그아웃
        </button>
      </div>

      {/* 프로필 행 */}
      <div className="flex items-center gap-3">
        {user?.avatar ? (
          <img
            src={user.avatar}
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white shrink-0"
            style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
          >
            {user?.name?.[0] ?? "?"}
          </div>
        )}
        <div>
          <p className="text-sm font-bold text-gray-900">{user?.name ?? ""}</p>
          <p className="text-xs text-gray-400 mt-0.5">{user?.email ?? ""}</p>
        </div>
      </div>

      {/* 탭 */}
      <div className="flex gap-0 rounded-xl" style={{ background: "#f8f9ff" }}>
        <button
          className="flex-1 text-center text-xs font-semibold py-2 rounded-lg transition-colors"
          style={
            tab === "created"
              ? {
                  background: "white",
                  color: "#6366f1",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                }
              : { color: "#94a3b8" }
          }
          onClick={() => setTab("created")}
        >
          만든 퍼즐
        </button>
        <button
          className="flex-1 text-center text-xs font-semibold py-2 rounded-lg transition-colors"
          style={
            tab === "played"
              ? {
                  background: "white",
                  color: "#6366f1",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                }
              : { color: "#94a3b8" }
          }
          onClick={() => setTab("played")}
        >
          플레이한 퍼즐
        </button>
      </div>

      {/* 카드 그리드 */}
      {isLoading ? (
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
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
      ) : tab === "created" ? (
        createdPuzzles.length === 0 ? (
          <p className="text-center text-sm text-gray-400 py-10">
            아직 만든 퍼즐이 없어요
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {createdPuzzles.map((puzzle) => (
              <div
                key={puzzle.id}
                className="bg-white rounded-2xl overflow-hidden shadow cursor-pointer active:scale-95 transition-transform"
                onClick={() => {
                  setSelectedPuzzle({
                    id: puzzle.id,
                    title: puzzle.title,
                    img: puzzle.img,
                  });
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
                    {new Date(puzzle.created_at).toLocaleDateString("ko-KR")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )
      ) : playedPuzzles.length === 0 ? (
        <p className="text-center text-sm text-gray-400 py-10">
          플레이 기록이 없어요
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {playedPuzzles.map((puzzle) => (
            <div
              key={`${puzzle.puzzle_id}-${puzzle.gridSize}`}
              className="bg-white rounded-2xl overflow-hidden shadow cursor-pointer active:scale-95 transition-transform"
              onClick={() => {
                setSelectedPuzzle({
                  id: puzzle.puzzle_id,
                  title: puzzle.title,
                  img: puzzle.img,
                  defaultGridSize: puzzle.gridSize,
                });
                setGridSize(puzzle.gridSize);
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
                  {puzzle.gridSize}×{puzzle.gridSize} ·{" "}
                  {formatTime(puzzle.time)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div ref={sentinelRef} className="h-4" />
      {isFetchingNextPage && (
        <p className="text-center text-xs text-gray-400 pb-2">불러오는 중...</p>
      )}

      <button
        className="text-xs text-red-300 underline"
        onClick={() => setWithdrawConfirm(true)}
      >
        회원탈퇴
      </button>

      <Modal open={withdrawConfirm}>
        <div className="w-full flex flex-col gap-5">
          <div>
            <p
              className="text-xs font-semibold tracking-widest mb-2!"
              style={{ color: "#fca5a5" }}
            >
              주의
            </p>
            <p className="text-xl font-extrabold text-gray-900 mt-1">
              회원탈퇴
            </p>
            <p className="text-sm text-gray-400 mt-1 leading-relaxed">
              탈퇴하면 만든 퍼즐과 기록이
              <br />
              모두 삭제됩니다.
            </p>
          </div>
          <div className="flex gap-2 w-full">
            <button
              className="flex-1 py-3.5 rounded-2xl text-sm font-semibold text-gray-500 bg-gray-100 active:scale-95 transition-transform"
              onClick={async () => {
                await new Promise((resolve) => setTimeout(resolve, 120));
                setWithdrawConfirm(false);
              }}
            >
              취소
            </button>
            <button
              className="flex-1 py-3.5 rounded-2xl text-sm font-bold text-white bg-red-400 active:scale-95 transition-transform"
              onClick={async () => {
                await new Promise((resolve) => setTimeout(resolve, 120));
                void handleWithdraw();
              }}
            >
              탈퇴하기
            </button>
          </div>
        </div>
      </Modal>

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
