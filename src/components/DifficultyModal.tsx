import { useRef, useEffect } from "react";
import { Modal } from "./Modal";

const GRID_SIZES = [3, 5, 8, 10, 12] as const;
const DIFFICULTY: Record<number, { label: string; color: string; bg: string }> =
  {
    3: { label: "쉬움", color: "#16a34a", bg: "#dcfce7" },
    5: { label: "보통", color: "#ca8a04", bg: "#fef9c3" },
    8: { label: "보통", color: "#ca8a04", bg: "#fef9c3" },
    10: { label: "어려움", color: "#dc2626", bg: "#fee2e2" },
    12: { label: "어려움", color: "#dc2626", bg: "#fee2e2" },
  };

const ITEM_H = 52;

interface Props {
  open: boolean;
  title?: string;
  gridSize: number;
  onGridSizeChange: (size: number) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DifficultyModal({
  open,
  title,
  gridSize,
  onGridSizeChange,
  onConfirm,
  onCancel,
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const initialGridSize = useRef(gridSize);

  // 모달 열릴 때 현재 선택값 위치로 스크롤
  useEffect(() => {
    if (!open) return;
    initialGridSize.current = gridSize;
    const idx = GRID_SIZES.indexOf(
      initialGridSize.current as (typeof GRID_SIZES)[number],
    );
    if (idx < 0) return;
    setTimeout(() => {
      scrollRef.current?.scrollTo({ top: idx * ITEM_H, behavior: "instant" });
    }, 0);
  }, [open]);

  function handleScroll() {
    const el = scrollRef.current;
    if (!el) return;
    const idx = Math.round(el.scrollTop / ITEM_H);
    const snapped =
      GRID_SIZES[Math.max(0, Math.min(idx, GRID_SIZES.length - 1))];
    if (snapped !== gridSize) onGridSizeChange(snapped);
  }

  return (
    <Modal open={open}>
      <div className="w-full flex flex-col gap-5">
        {/* 헤더 */}
        <div>
          <p
            className="text-xs font-semibold tracking-widest"
            style={{ color: "#a5b4fc" }}
          >
            PUZZLE
          </p>
          <p className="text-xl font-extrabold text-gray-900 mt-1">
            난이도 선택
          </p>
          {title && (
            <p className="text-sm text-gray-400 mt-0.5 truncate">{title}</p>
          )}
        </div>

        {/* 스크롤 피커 */}
        <div
          className="relative rounded-2xl overflow-hidden"
          style={{ height: ITEM_H * 3, background: "#f8f9fa" }}
        >
          {/* 위아래 페이드 */}
          <div
            className="absolute inset-x-0 top-0 z-10 pointer-events-none"
            style={{
              height: ITEM_H,
              background: "linear-gradient(to bottom, #f8f9fa, transparent)",
            }}
          />
          <div
            className="absolute inset-x-0 bottom-0 z-10 pointer-events-none"
            style={{
              height: ITEM_H,
              background: "linear-gradient(to top, #f8f9fa, transparent)",
            }}
          />
          {/* 선택 하이라이트 */}
          <div
            className="absolute inset-x-3 z-0 rounded-xl bg-white shadow-sm pointer-events-none"
            style={{ top: ITEM_H, height: ITEM_H }}
          />
          {/* 스크롤 목록 */}
          <div
            ref={scrollRef}
            className="absolute inset-0 overflow-y-scroll z-20"
            style={{
              scrollSnapType: "y mandatory",
              scrollbarWidth: "none",
              padding: `${ITEM_H}px 0`,
            }}
            onScroll={handleScroll}
          >
            {GRID_SIZES.map((size) => {
              const diff = DIFFICULTY[size];
              const active = size === gridSize;
              return (
                <div
                  key={size}
                  className="flex items-center justify-between px-6"
                  style={{ height: ITEM_H, scrollSnapAlign: "center" }}
                >
                  <span
                    className="text-lg font-bold transition-colors"
                    style={{ color: active ? "#111" : "#c4c9d4" }}
                  >
                    {size} × {size}
                  </span>
                  {active && (
                    <span
                      className="text-xs font-semibold rounded-full px-3 py-1"
                      style={{ background: diff.bg, color: diff.color }}
                    >
                      {diff.label}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex gap-2 w-full">
          <button
            className="flex-1 py-3.5 rounded-2xl text-sm font-semibold text-gray-500 bg-gray-100 active:scale-95 transition-transform"
            onClick={async () => {
              await new Promise((r) => setTimeout(r, 120));
              onCancel();
            }}
          >
            취소
          </button>
          <button
            className="flex-1 py-3.5 rounded-2xl text-sm font-bold text-white active:scale-95 transition-transform"
            style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
            onClick={async () => {
              await new Promise((r) => setTimeout(r, 120));
              onConfirm();
            }}
          >
            시작하기
          </button>
        </div>
      </div>
    </Modal>
  );
}
