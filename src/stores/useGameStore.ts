import { create } from "zustand";

interface GameState {
  gridSize: number;
  img: string | null;
  setGame: (img: string, gridSize: number) => void;
  reset: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  gridSize: 3,
  img: "https://xpwlrdlenywtgvylupqc.supabase.co/storage/v1/object/public/novawiki/documents/fc8c81b4-9d71-433e-bf1c-5a26e049a2ae/1773466259783-bmcehmkr5no.jpg",
  setGame: (img, gridSize) => set({ img, gridSize }),
  reset: () => set({ gridSize: 0, img: null }),
}));
