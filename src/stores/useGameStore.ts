import { create } from "zustand";

interface GameState {
  gridSize: number;
  img: string | null;
  puzzleId: number | null;
  setGame: (img: string, gridSize: number, puzzleId: number) => void;
  reset: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  gridSize: 0,
  img: "",
  puzzleId: null,
  setGame: (img, gridSize, puzzleId) => set({ img, gridSize, puzzleId }),
  reset: () => set({ gridSize: 0, img: null, puzzleId: null }),
}));
