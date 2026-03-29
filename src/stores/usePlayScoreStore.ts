import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PlayScoreState {
  playScore: number;
  addScore: (gridSize: number) => void;
  resetScore: () => void;
}

function scoreForGridSize(gridSize: number): number {
  if (gridSize <= 3) return 1; // 쉬움
  if (gridSize <= 8) return 2; // 보통
  return 3; // 어려움
}

export const usePlayScoreStore = create<PlayScoreState>()(
  persist(
    (set) => ({
      playScore: 0,
      addScore: (gridSize) =>
        set((s) => ({ playScore: s.playScore + scoreForGridSize(gridSize) })),
      resetScore: () => set({ playScore: 0 }),
    }),
    { name: "play-score" },
  ),
);
