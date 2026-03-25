import { useEffect, useRef, useState } from "react";
import { useGameStore } from "../../stores/useGameStore";
import { playFanfare, playSuccessSound } from "../../utils/sound";
import {
  showInterstitialAd,
  showBannerAd,
  hideBannerAd,
} from "../../utils/admob";
import { CompletionModal } from "./components/CompletionModal";
import { PuzzleBoard } from "./components/PuzzleBoard";
import type { Piece, BoardCell, Selected } from "./types";

const TAB_RATIO = 0.3;

function drawJigsawEdge(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  dir: number,
) {
  if (dir === 0) {
    ctx.lineTo(x2, y2);
    return;
  }

  const dx = x2 - x1,
    dy = y2 - y1;
  const L = Math.sqrt(dx * dx + dy * dy);
  const nx = (dy / L) * dir;
  const ny = (-dx / L) * dir;
  const t = L * 0.25;

  const pt = (f: number, d: number) => ({
    x: x1 + dx * f + nx * d,
    y: y1 + dy * f + ny * d,
  });

  ctx.lineTo(pt(0.35, 0).x, pt(0.35, 0).y);
  ctx.bezierCurveTo(
    pt(0.38, 0).x, pt(0.38, 0).y,
    pt(0.43, t * 0.2).x, pt(0.43, t * 0.2).y,
    pt(0.43, t * 0.3).x, pt(0.43, t * 0.3).y,
  );
  ctx.bezierCurveTo(
    pt(0.43, t * 0.75).x, pt(0.43, t * 0.75).y,
    pt(0.34, t * 0.92).x, pt(0.34, t * 0.92).y,
    pt(0.5, t).x, pt(0.5, t).y,
  );
  ctx.bezierCurveTo(
    pt(0.66, t * 0.92).x, pt(0.66, t * 0.92).y,
    pt(0.57, t * 0.75).x, pt(0.57, t * 0.75).y,
    pt(0.57, t * 0.3).x, pt(0.57, t * 0.3).y,
  );
  ctx.bezierCurveTo(
    pt(0.57, t * 0.2).x, pt(0.57, t * 0.2).y,
    pt(0.62, 0).x, pt(0.62, 0).y,
    pt(0.65, 0).x, pt(0.65, 0).y,
  );
  ctx.lineTo(x2, y2);
}

function drawPiecePath(
  ctx: CanvasRenderingContext2D,
  ox: number,
  oy: number,
  ps: number,
  top: number,
  right: number,
  bottom: number,
  left: number,
) {
  ctx.beginPath();
  ctx.moveTo(ox, oy);
  drawJigsawEdge(ctx, ox, oy, ox + ps, oy, top);
  drawJigsawEdge(ctx, ox + ps, oy, ox + ps, oy + ps, right);
  drawJigsawEdge(ctx, ox + ps, oy + ps, ox, oy + ps, bottom);
  drawJigsawEdge(ctx, ox, oy + ps, ox, oy, left);
  ctx.closePath();
}

export function Game() {
  const { img, gridSize } = useGameStore();
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [board, setBoard] = useState<BoardCell[]>([]);
  const [selected, setSelected] = useState<Selected>(null);
  const [restartKey, setRestartKey] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerStarted = useRef(false);
  const zIndexCounter = useRef(1);
  const fanfarePlayed = useRef(false);

  const isCompleted =
    board.length > 0 && board.every((cell) => cell?.locked === true);

  useEffect(() => {
    void showBannerAd();
    return () => {
      void hideBannerAd();
    };
  }, []);

  const startTimer = () => {
    if (timerStarted.current) return;
    timerStarted.current = true;
    timerRef.current = setInterval(() => {
      setElapsedSeconds((s) => s + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const resetTimer = () => {
    stopTimer();
    timerStarted.current = false;
    setElapsedSeconds(0);
  };

  useEffect(() => {
    if (isCompleted && !fanfarePlayed.current) {
      fanfarePlayed.current = true;
      stopTimer();
      void playFanfare();
    }
  }, [isCompleted]);

  useEffect(() => () => stopTimer(), []);

  const handleRestart = async () => {
    await showInterstitialAd();
    fanfarePlayed.current = false;
    zIndexCounter.current = 1;
    resetTimer();
    setSelected(null);
    setRestartKey((k) => k + 1);
  };

  useEffect(() => {
    if (!img || gridSize <= 0) return;

    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = img;

    image.onload = () => {
      const size = Math.min(image.width, image.height);
      const sx = (image.width - size) / 2;
      const sy = (image.height - size) / 2;

      const offscreen = document.createElement("canvas");
      offscreen.width = size;
      offscreen.height = size;
      const ctx = offscreen.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(image, sx, sy, size, size, 0, 0, size, size);

      const pieceSize = size / gridSize;
      const padding = Math.ceil(pieceSize * TAB_RATIO);
      const canvasSize = pieceSize + 2 * padding;
      const newPieces: Piece[] = [];

      const hEdge = Array.from({ length: gridSize - 1 }, () =>
        Array.from({ length: gridSize }, () => (Math.random() > 0.5 ? 1 : -1)),
      );
      const vEdge = Array.from({ length: gridSize }, () =>
        Array.from({ length: gridSize - 1 }, () =>
          Math.random() > 0.5 ? 1 : -1,
        ),
      );

      for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
          const originalIndex = row * gridSize + col;
          const topType = row === 0 ? 0 : -hEdge[row - 1][col];
          const bottomType = row === gridSize - 1 ? 0 : hEdge[row][col];
          const leftType = col === 0 ? 0 : -vEdge[row][col - 1];
          const rightType = col === gridSize - 1 ? 0 : vEdge[row][col];

          const pieceCanvas = document.createElement("canvas");
          pieceCanvas.width = canvasSize;
          pieceCanvas.height = canvasSize;
          const pieceCtx = pieceCanvas.getContext("2d");
          if (!pieceCtx) continue;

          drawPiecePath(pieceCtx, padding, padding, pieceSize, topType, rightType, bottomType, leftType);
          pieceCtx.clip();
          pieceCtx.drawImage(offscreen, col * pieceSize - padding, row * pieceSize - padding, canvasSize, canvasSize, 0, 0, canvasSize, canvasSize);

          drawPiecePath(pieceCtx, padding, padding, pieceSize, topType, rightType, bottomType, leftType);
          pieceCtx.strokeStyle = "rgba(0,0,0,0.25)";
          pieceCtx.lineWidth = 1.5;
          pieceCtx.stroke();

          newPieces.push({ src: pieceCanvas.toDataURL(), originalIndex });
        }
      }

      for (let i = newPieces.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newPieces[i], newPieces[j]] = [newPieces[j], newPieces[i]];
      }

      setPieces(newPieces);
      setBoard(Array(gridSize * gridSize).fill(null));
    };
  }, [img, gridSize, restartKey]);

  const handlePieceTap = (piece: Piece, index: number) => {
    if (selected?.from === "storage" && selected.index === index) {
      setSelected(null);
      return;
    }
    setSelected({ piece, from: "storage", index });
  };

  const handleBoardPieceTap = (
    cell: NonNullable<BoardCell>,
    cellIndex: number,
  ) => {
    if (cell.locked) return;

    if (selected?.from === "board" && selected.index === cellIndex) {
      setBoard((prev) => {
        const next = [...prev];
        next[cellIndex] = null;
        return next;
      });
      setPieces((prev) => [
        ...prev,
        { src: cell.src, originalIndex: cell.originalIndex },
      ]);
      setSelected(null);
      return;
    }

    setSelected({
      piece: { src: cell.src, originalIndex: cell.originalIndex },
      from: "board",
      index: cellIndex,
    });
  };

  const handleCellTap = (cellIndex: number) => {
    if (!selected) return;
    if (board[cellIndex] !== null) return;

    const isCorrect = selected.piece.originalIndex === cellIndex;
    if (isCorrect) void playSuccessSound();
    startTimer();

    setBoard((prev) => {
      const next = [...prev];
      if (selected.from === "board") next[selected.index] = null;
      next[cellIndex] = {
        ...selected.piece,
        locked: isCorrect,
        zIndex: zIndexCounter.current++,
      };
      return next;
    });

    if (selected.from === "storage") {
      setPieces((prev) => prev.filter((_, i) => i !== selected.index));
    }

    setSelected(null);
  };

  const handleStorageTap = () => {
    if (!selected || selected.from === "storage") return;
    const cell = board[selected.index];
    if (!cell) return;
    setBoard((prev) => {
      const next = [...prev];
      next[selected.index] = null;
      return next;
    });
    setPieces((prev) => [
      ...prev,
      { src: cell.src, originalIndex: cell.originalIndex },
    ]);
    setSelected(null);
  };

  return (
    <>
      <PuzzleBoard
        board={board}
        gridSize={gridSize}
        img={img}
        selected={selected}
        showPreview={showPreview}
        elapsedSeconds={elapsedSeconds}
        onCellTap={handleCellTap}
        onBoardPieceTap={handleBoardPieceTap}
        onTogglePreview={() => setShowPreview((v) => !v)}
      />

      {/* 퍼즐 조각 보관함 */}
      <div
        className="flex gap-1 overflow-x-auto scrollbar-hide border border-gray-300 rounded-lg p-4 min-h-20"
        onClick={handleStorageTap}
      >
        {pieces.map((piece, i) => (
          <img
            key={i}
            src={piece.src}
            className="h-20 shrink-0 cursor-pointer"
            style={{
              outline:
                selected?.from === "storage" && selected.index === i
                  ? "1px solid rgba(99,102,241,0.8)"
                  : undefined,
              opacity:
                selected?.from === "storage" && selected.index !== i ? 0.5 : 1,
            }}
            onClick={(e) => {
              e.stopPropagation();
              handlePieceTap(piece, i);
            }}
          />
        ))}
      </div>

      <CompletionModal
        open={isCompleted}
        elapsedSeconds={elapsedSeconds}
        onRestart={() => void handleRestart()}
      />
    </>
  );
}
