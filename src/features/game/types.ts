export type Piece = { src: string; originalIndex: number };

export type BoardCell = {
  src: string;
  originalIndex: number;
  locked: boolean;
  zIndex: number;
} | null;

export type Selected = {
  piece: Piece;
  from: "storage" | "board";
  index: number;
} | null;
