import { Modal } from "./Modal";

const GRID_SIZES = [3, 5, 8, 10, 12] as const;
const DIFFICULTY: Record<number, string> = {
  3: "쉬움",
  5: "보통",
  8: "보통",
  10: "어려움",
  12: "어려움",
};

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
  return (
    <Modal open={open}>
      <div className="w-full flex flex-col gap-5">
        <div>
          <h2 className="text-lg font-bold text-gray-800 text-center">
            난이도 선택
          </h2>
          {title && (
            <p className="text-sm text-gray-500 text-center mt-1 truncate">
              {title}
            </p>
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
              onClick={() => onGridSizeChange(size)}
            >
              <span className="text-sm font-bold">
                {size}×{size}
              </span>
              <span className="text-xs opacity-80">{DIFFICULTY[size]}</span>
            </button>
          ))}
        </div>

        <div className="flex gap-2 w-full">
          <button
            className="flex-2 py-3 rounded-xl text-sm font-semibold text-gray-500 bg-gray-100"
            onClick={onCancel}
          >
            취소
          </button>
          <button
            className="py-3 rounded-xl text-sm font-bold text-white"
            style={{
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              flex: 2,
            }}
            onClick={onConfirm}
          >
            시작하기
          </button>
        </div>
      </div>
    </Modal>
  );
}
