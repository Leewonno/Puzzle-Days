import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal } from "../components/Modal";
import { useGameStore } from "../stores/useGameStore";

type SortKey = "latest" | "popular";

const MOCK_GAMES = [
  { id: 1, title: "🌊 제주 에메랄드빛 바다", playCount: 128, createdAt: 10, img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600" },
  { id: 2, title: "🌸 경복궁 봄날", playCount: 94, createdAt: 9, img: "https://images.unsplash.com/photo-1583400541828-c4ec8ead5eed?w=600" },
  { id: 3, title: "🏔️ 설악산 단풍", playCount: 210, createdAt: 8, img: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600" },
  { id: 4, title: "🌅 부산 해운대 일출", playCount: 77, createdAt: 7, img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600" },
  { id: 5, title: "🗼 남산 타워 야경", playCount: 56, createdAt: 6, img: "https://images.unsplash.com/photo-1538669715315-155098f0fb1d?w=600" },
  { id: 6, title: "🌿 담양 대나무숲", playCount: 43, createdAt: 5, img: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=600" },
  { id: 7, title: "🦋 순천만 갈대밭", playCount: 31, createdAt: 4, img: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=600" },
  { id: 8, title: "🍊 제주 감귤 농장", playCount: 88, createdAt: 3, img: "https://images.unsplash.com/photo-1502803616952-b05cc9e3d27a?w=600" },
  { id: 9, title: "🌺 하동 십리벚꽃길", playCount: 62, createdAt: 2, img: "https://images.unsplash.com/photo-1522383225653-ed111181a951?w=600" },
  { id: 10, title: "🌁 여수 밤바다", playCount: 145, createdAt: 1, img: "https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=600" },
];

const GRID_SIZES = [5, 8, 10, 12, 16] as const;
const DIFFICULTY: Record<number, string> = { 5: "쉬움", 8: "보통", 10: "보통", 12: "어려움", 16: "매우 어려움" };

type Game = (typeof MOCK_GAMES)[number];

export default function GameListScreen() {
  const navigate = useNavigate();
  const setGame = useGameStore((s) => s.setGame);

  const [sort, setSort] = useState<SortKey>("latest");
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [gridSize, setGridSize] = useState<number>(8);

  const sorted = [...MOCK_GAMES].sort((a, b) =>
    sort === "latest" ? b.createdAt - a.createdAt : b.playCount - a.playCount,
  );

  function handleStart() {
    if (!selectedGame) return;
    setGame(selectedGame.img, gridSize);
    setSelectedGame(null);
    navigate("/game");
  }

  return (
    <div className="flex flex-col gap-4">
      {/* 정렬 탭 */}
      <div className="flex gap-2">
        <button
          className="rounded-full px-4 py-1.5 text-sm font-semibold transition-colors"
          style={{
            background: sort === "latest" ? "#6366f1" : "white",
            color: sort === "latest" ? "white" : "#6b7280",
            boxShadow: sort === "latest" ? "none" : "0 1px 4px rgba(0,0,0,0.1)",
          }}
          onClick={() => setSort("latest")}
        >
          최신순
        </button>
        <button
          className="rounded-full px-4 py-1.5 text-sm font-semibold transition-colors"
          style={{
            background: sort === "popular" ? "#6366f1" : "white",
            color: sort === "popular" ? "white" : "#6b7280",
            boxShadow: sort === "popular" ? "none" : "0 1px 4px rgba(0,0,0,0.1)",
          }}
          onClick={() => setSort("popular")}
        >
          인기순
        </button>
      </div>

      {/* 2열 카드 그리드 */}
      <div className="grid grid-cols-2 gap-3">
        {sorted.map((game) => (
          <div
            key={game.id}
            className="bg-white rounded-2xl overflow-hidden shadow cursor-pointer active:scale-95 transition-transform"
            onClick={() => { setSelectedGame(game); setGridSize(8); }}
          >
            <div className="aspect-square w-full overflow-hidden">
              <img
                src={game.img}
                alt={game.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="px-3 py-2.5">
              <p className="font-bold text-sm text-gray-800 truncate">{game.title}</p>
              <p className="text-xs text-gray-400 mt-0.5">
                {game.playCount}명 플레이
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* 난이도 선택 모달 */}
      <Modal open={selectedGame !== null}>
        <div className="w-full flex flex-col gap-5">
          <div>
            <h2 className="text-lg font-bold text-gray-800 text-center">난이도 선택</h2>
            {selectedGame && (
              <p className="text-sm text-gray-500 text-center mt-1 truncate">{selectedGame.title}</p>
            )}
          </div>

          <div className="grid grid-cols-5 gap-2">
            {GRID_SIZES.map((size) => (
              <button
                key={size}
                className="flex flex-col items-center gap-1 rounded-xl py-3 transition-colors"
                style={{
                  background: gridSize === size ? "#6366f1" : "#f3f4f6",
                  color: gridSize === size ? "white" : "#374151",
                }}
                onClick={() => setGridSize(size)}
              >
                <span className="text-sm font-bold">{size}×{size}</span>
                <span className="text-xs opacity-80">{DIFFICULTY[size]}</span>
              </button>
            ))}
          </div>

          <div className="flex gap-2 w-full">
            <button
              className="flex-1 py-3 rounded-xl text-sm font-semibold text-gray-500 bg-gray-100"
              onClick={() => setSelectedGame(null)}
            >
              취소
            </button>
            <button
              className="flex-2 py-3 rounded-xl text-sm font-bold text-white"
              style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", flex: 2 }}
              onClick={handleStart}
            >
              시작하기
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
