import { useEffect, useRef, useState } from "react";
import { useGameStore } from "../../stores/useGameStore";
import { useUserStore } from "../../stores/useUserStore";
import { playFanfare, playSuccessSound } from "../../utils/sound";
import { supabase } from "../../lib/supabase";
import { showInterstitialAd } from "../../utils/admob";
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
    pt(0.38, 0).x,
    pt(0.38, 0).y,
    pt(0.43, t * 0.2).x,
    pt(0.43, t * 0.2).y,
    pt(0.43, t * 0.3).x,
    pt(0.43, t * 0.3).y,
  );
  ctx.bezierCurveTo(
    pt(0.43, t * 0.75).x,
    pt(0.43, t * 0.75).y,
    pt(0.34, t * 0.92).x,
    pt(0.34, t * 0.92).y,
    pt(0.5, t).x,
    pt(0.5, t).y,
  );
  ctx.bezierCurveTo(
    pt(0.66, t * 0.92).x,
    pt(0.66, t * 0.92).y,
    pt(0.57, t * 0.75).x,
    pt(0.57, t * 0.75).y,
    pt(0.57, t * 0.3).x,
    pt(0.57, t * 0.3).y,
  );
  ctx.bezierCurveTo(
    pt(0.57, t * 0.2).x,
    pt(0.57, t * 0.2).y,
    pt(0.62, 0).x,
    pt(0.62, 0).y,
    pt(0.65, 0).x,
    pt(0.65, 0).y,
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
  const { img, gridSize, puzzleId } = useGameStore();
  const { user } = useUserStore();
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [board, setBoard] = useState<BoardCell[]>([]);
  const [selected, setSelected] = useState<Selected>(null);
  const [restartKey, setRestartKey] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerStarted = useRef(false);
  const zIndexCounter = useRef(1);
  const fanfarePlayed = useRef(false);
  const finalElapsed = useRef(0);

  const isCompleted =
    board.length > 0 && board.every((cell) => cell?.locked === true);

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
      finalElapsed.current = elapsedSeconds;
    }
  };

  const saveRecord = async () => {
    if (!puzzleId || !user) return;
    await supabase.rpc("complete_puzzle", {
      p_puzzle_id: puzzleId,
      p_user_id: user.id,
      p_time: finalElapsed.current,
      p_grid_size: gridSize,
    });
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
      void saveRecord();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

    let cancelled = false;
    let objectUrl: string | null = null;

    const run = async () => {
      setIsGenerating(true);
      const blob = await fetch(img).then((r) => r.blob());
      if (cancelled) return;

      objectUrl = URL.createObjectURL(blob);

      const image = await new Promise<HTMLImageElement>((resolve, reject) => {
        const el = new Image();
        el.onload = () => resolve(el);
        el.onerror = reject;
        el.src = objectUrl!;
      });
      if (cancelled) return;

      const MAX_SIZE = 800;
      const naturalSize = Math.min(image.width, image.height);
      const size = Math.min(naturalSize, MAX_SIZE);
      const sx = (image.width - naturalSize) / 2;
      const sy = (image.height - naturalSize) / 2;

      const offscreen = document.createElement("canvas");
      offscreen.width = size;
      offscreen.height = size;
      const ctx = offscreen.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(image, sx, sy, naturalSize, naturalSize, 0, 0, size, size);

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

      const yield_ = () => new Promise<void>((r) => setTimeout(r, 0));

      // reuse a single canvas to avoid exhausting GPU command buffers
      const pieceCanvas = document.createElement("canvas");
      pieceCanvas.width = canvasSize;
      pieceCanvas.height = canvasSize;
      const pieceCtx = pieceCanvas.getContext("2d");
      if (!pieceCtx) return;

      for (let row = 0; row < gridSize; row++) {
        if (cancelled) return;

        for (let col = 0; col < gridSize; col++) {
          const originalIndex = row * gridSize + col;
          const topType = row === 0 ? 0 : -hEdge[row - 1][col];
          const bottomType = row === gridSize - 1 ? 0 : hEdge[row][col];
          const leftType = col === 0 ? 0 : -vEdge[row][col - 1];
          const rightType = col === gridSize - 1 ? 0 : vEdge[row][col];

          pieceCtx.clearRect(0, 0, canvasSize, canvasSize);

          pieceCtx.save();
          drawPiecePath(
            pieceCtx,
            padding,
            padding,
            pieceSize,
            topType,
            rightType,
            bottomType,
            leftType,
          );
          pieceCtx.clip();
          pieceCtx.drawImage(
            offscreen,
            col * pieceSize - padding,
            row * pieceSize - padding,
            canvasSize,
            canvasSize,
            0,
            0,
            canvasSize,
            canvasSize,
          );
          pieceCtx.restore();

          drawPiecePath(
            pieceCtx,
            padding,
            padding,
            pieceSize,
            topType,
            rightType,
            bottomType,
            leftType,
          );
          pieceCtx.strokeStyle = "rgba(0,0,0,0.25)";
          pieceCtx.lineWidth = 1.5;
          pieceCtx.stroke();

          newPieces.push({ src: pieceCanvas.toDataURL(), originalIndex });

          // yield after every piece to avoid ANR on Android
          await yield_();
        }
      }

      if (cancelled) return;

      for (let i = newPieces.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newPieces[i], newPieces[j]] = [newPieces[j], newPieces[i]];
      }

      setPieces(newPieces);
      setBoard(Array(gridSize * gridSize).fill(null));
      setIsGenerating(false);
    };

    void run();

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
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
    <div className="flex flex-col gap-4">
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
      <div className="flex flex-col gap-2">
        <div
          className="flex gap-2 overflow-x-auto scrollbar-hide bg-white rounded-2xl px-3 py-2.5"
          style={{
            minHeight: 108,
            boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
          }}
          onClick={handleStorageTap}
        >
          {isGenerating ? (
            <div className="flex flex-1 items-center justify-center gap-2 text-gray-400 text-sm">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              조각 생성 중...
            </div>
          ) : pieces.map((piece, i) => (
            <img
              key={i}
              src={piece.src}
              className="h-24 shrink-0 cursor-pointer"
              style={{
                borderRadius: 8,
                outline:
                  selected?.from === "storage" && selected.index === i
                    ? "2px solid rgba(99,102,241,0.8)"
                    : undefined,
                outlineOffset: 2,
                opacity:
                  selected?.from === "storage" && selected.index !== i
                    ? 0.45
                    : 1,
              }}
              onClick={(e) => {
                e.stopPropagation();
                handlePieceTap(piece, i);
              }}
            />
          ))}
        </div>
      </div>

      <CompletionModal
        open={isCompleted}
        elapsedSeconds={elapsedSeconds}
        onRestart={() => void handleRestart()}
      />
    </div>
  );
}
