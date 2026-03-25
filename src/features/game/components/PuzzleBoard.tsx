import { Eye, EyeOff } from "lucide-react";
import type { BoardCell, Selected } from "../types";

const TAB_RATIO = 0.3;

interface PuzzleBoardProps {
  board: BoardCell[];
  gridSize: number;
  img: string | null;
  selected: Selected;
  showPreview: boolean;
  elapsedSeconds: number;
  onCellTap: (cellIndex: number) => void;
  onBoardPieceTap: (cell: NonNullable<BoardCell>, cellIndex: number) => void;
  onTogglePreview: () => void;
}

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

export function PuzzleBoard({
  board,
  gridSize,
  img,
  selected,
  showPreview,
  elapsedSeconds,
  onCellTap,
  onBoardPieceTap,
  onTogglePreview,
}: PuzzleBoardProps) {
  return (
    <>
      {/* 타이머 + 미리보기 버튼 */}
      <div className="flex items-center justify-between mb-2">
        <div className="w-8" />
        <span className="text-gray-500 text-sm font-mono">
          {formatTime(elapsedSeconds)}
        </span>
        <button
          className="bg-white rounded-full p-1.5 shadow-md"
          onClick={onTogglePreview}
        >
          {showPreview ? (
            <Eye size={18} className="text-indigo-500" />
          ) : (
            <EyeOff size={18} className="text-gray-400" />
          )}
        </button>
      </div>

      {/* 퍼즐판 */}
      <div className="relative aspect-square w-full">
        {/* 미리보기 오버레이 (그리드 뒤에 위치) */}
        {showPreview && img && (
          <img
            src={img}
            className="absolute inset-0 w-full h-full rounded-lg object-cover pointer-events-none"
            style={{ zIndex: 0, opacity: 0.5 }}
          />
        )}

        <div
          className="border border-gray-300 aspect-square rounded-lg w-full overflow-hidden"
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
            position: "relative",
            zIndex: 1,
          }}
        >
          {Array.from({ length: gridSize * gridSize }).map((_, i) => {
            const cell = board[i] ?? null;
            const isTarget = !!selected && cell === null;
            return (
              <div
                key={i}
                className={`relative aspect-square flex items-center justify-center overflow-visible ${
                  isTarget ? "border" : ""
                } border-[rgba(99,102,241,0.5)] border-dotted`}
                onClick={() => (cell ? onBoardPieceTap(cell, i) : onCellTap(i))}
              >
                {cell && (
                  <>
                    <img
                      src={cell.src}
                      className="absolute pointer-events-none max-w-none"
                      style={{
                        width: `${(1 + 2 * TAB_RATIO) * 100}%`,
                        height: `${(1 + 2 * TAB_RATIO) * 100}%`,
                        top: `${-TAB_RATIO * 100}%`,
                        left: `${-TAB_RATIO * 100}%`,
                        cursor: cell.locked ? "default" : "pointer",
                        zIndex:
                          selected?.from === "board" && selected.index === i
                            ? 9999
                            : cell.zIndex,
                        filter:
                          selected?.from === "board" && selected.index === i
                            ? "drop-shadow(0 0 4px rgba(99,102,241,0.8))"
                            : undefined,
                      }}
                    />
                    {cell.locked && (
                      <div
                        className="absolute inset-0 pointer-events-none overflow-hidden"
                        style={{ zIndex: 30 }}
                      >
                        <div
                          className="absolute inset-0"
                          style={{
                            background:
                              "linear-gradient(105deg, transparent 10%, rgba(255,255,255,0.5) 50%, transparent 60%)",
                            animation: "shimmer 1.5s ease-out forwards",
                          }}
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
