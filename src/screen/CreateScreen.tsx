import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { ImagePlus, ZoomIn, ZoomOut } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useUserStore } from "../stores/useUserStore";
import { uploadImage } from "../lib/storage";
import { hasProfanity } from "../utils/profanity";

export default function CreateScreen() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const loadedImgRef = useRef<HTMLImageElement | null>(null);
  const dragRef = useRef<{
    startX: number;
    startY: number;
    startOX: number;
    startOY: number;
  } | null>(null);

  const { user } = useUserStore();

  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [naturalW, setNaturalW] = useState(0);
  const [naturalH, setNaturalH] = useState(0);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [title, setTitle] = useState("");

  function containerSize() {
    return containerRef.current?.getBoundingClientRect().width ?? 300;
  }

  function clamp(ox: number, oy: number, s: number, nw: number, nh: number) {
    const C = containerSize();
    return {
      x: Math.min(0, Math.max(ox, C - nw * s)),
      y: Math.min(0, Math.max(oy, C - nh * s)),
    };
  }

  function handleFile(file: File) {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      loadedImgRef.current = img;
      const C = containerSize();
      const s = Math.max(C / img.naturalWidth, C / img.naturalHeight);
      setNaturalW(img.naturalWidth);
      setNaturalH(img.naturalHeight);
      setScale(s);
      setOffset({
        x: (C - img.naturalWidth * s) / 2,
        y: (C - img.naturalHeight * s) / 2,
      });
      setImgSrc(url);
    };
    img.src = url;
  }

  function handlePointerDown(e: React.PointerEvent) {
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startOX: offset.x,
      startOY: offset.y,
    };
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    setOffset(
      clamp(
        dragRef.current.startOX + dx,
        dragRef.current.startOY + dy,
        scale,
        naturalW,
        naturalH,
      ),
    );
  }

  function handlePointerUp() {
    dragRef.current = null;
  }

  function zoom(factor: number) {
    const C = containerSize();
    const minS = Math.max(C / naturalW, C / naturalH);
    const newS = Math.max(scale * factor, minS);
    const newOX = C / 2 - (C / 2 - offset.x) * (newS / scale);
    const newOY = C / 2 - (C / 2 - offset.y) * (newS / scale);
    setScale(newS);
    setOffset(clamp(newOX, newOY, newS, naturalW, naturalH));
  }

  function getCroppedDataURL(): string {
    const C = containerSize();
    const canvas = document.createElement("canvas");
    canvas.width = 1000;
    canvas.height = 1000;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(
      loadedImgRef.current!,
      -offset.x / scale,
      -offset.y / scale,
      C / scale,
      C / scale,
      0,
      0,
      1000,
      1000,
    );
    return canvas.toDataURL("image/jpeg", 0.9);
  }

  const createPuzzle = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("로그인이 필요합니다.");
      const dataUrl = getCroppedDataURL();
      const path = `${user.id}/${Date.now()}.jpg`;
      const imgUrl = await uploadImage(dataUrl, path);
      const { error } = await supabase
        .from("puzzle")
        .insert({ auth_id: user.id, title: title.trim(), img: imgUrl });
      if (error) throw error;
    },
    onSuccess: () => navigate("/my"),
  });

  const titleHasProfanity = hasProfanity(title);
  const canCreate = !!imgSrc && title.trim().length > 0 && !titleHasProfanity;

  return (
    <div className="flex flex-col gap-6">
      {/* 페이지 타이틀 */}
      <div className="flex flex-col gap-1">
        <p className="text-2xl font-bold text-gray-900">나만의 퍼즐 만들기</p>
        <p className="text-sm text-gray-400">
          사진을 골라 나만의 퍼즐을 완성해요
        </p>
      </div>

      {/* 크롭 영역 */}
      <div
        ref={containerRef}
        className="w-full rounded-2xl overflow-hidden relative select-none"
        style={{
          aspectRatio: "1 / 1",
          touchAction: imgSrc ? "none" : "auto",
          background: imgSrc ? "#000" : "#f0f0ff",
        }}
        onPointerDown={imgSrc ? handlePointerDown : undefined}
        onPointerMove={imgSrc ? handlePointerMove : undefined}
        onPointerUp={imgSrc ? handlePointerUp : undefined}
        onPointerCancel={imgSrc ? handlePointerUp : undefined}
      >
        {imgSrc ? (
          <>
            <img
              src={imgSrc}
              alt="crop"
              draggable={false}
              style={{
                position: "absolute",
                left: offset.x,
                top: offset.y,
                width: naturalW * scale,
                height: naturalH * scale,
                maxWidth: "none",
                pointerEvents: "none",
                userSelect: "none",
              }}
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.25) 1px, transparent 1px)",
                backgroundSize: "33.333% 33.333%",
                boxShadow: "inset 0 0 0 2px rgba(255,255,255,0.5)",
              }}
            />
          </>
        ) : (
          <button
            className="absolute inset-0 flex flex-col items-center justify-center gap-3"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-white shadow-sm">
              <ImagePlus
                size={28}
                className="text-indigo-400"
                strokeWidth={1.5}
              />
            </div>
            <p className="text-sm font-semibold text-indigo-400">
              사진 선택하기
            </p>
            <p className="text-xs text-gray-400">탭해서 갤러리에서 불러오기</p>
          </button>
        )}
      </div>

      {/* 줌 & 사진 변경 */}
      {imgSrc && (
        <div className="flex items-center justify-between">
          <button
            className="text-sm font-semibold text-indigo-500 active:opacity-60 transition-opacity"
            onClick={() => fileInputRef.current?.click()}
          >
            사진 변경
          </button>
          <div className="flex gap-2">
            <button
              className="w-9 h-9 rounded-full bg-white shadow flex items-center justify-center text-gray-600 active:scale-95 transition-transform"
              onClick={() => zoom(0.85)}
            >
              <ZoomOut size={18} />
            </button>
            <button
              className="w-9 h-9 rounded-full bg-white shadow flex items-center justify-center text-gray-600 active:scale-95 transition-transform"
              onClick={() => zoom(1.15)}
            >
              <ZoomIn size={18} />
            </button>
          </div>
        </div>
      )}

      {/* 제목 입력 */}
      <div className="flex flex-col gap-1.5">
        {/* <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
          퍼즐 이름
        </label> */}
        <input
          type="text"
          placeholder="퍼즐 이름을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={30}
          className="w-full px-0 py-2.5 text-base font-semibold text-gray-900 outline-none bg-transparent placeholder:text-gray-300"
          style={{
            borderBottom: `2px solid ${
              title.length > 0 ? "#6366f1" : "#e5e7eb"
            }`,
          }}
        />
        {titleHasProfanity ? (
          <span className="text-xs text-red-400">사용할 수 없는 단어가 포함되어 있어요</span>
        ) : (
          <span className="text-xs text-gray-300 text-right">{title.length} / 30</span>
        )}
      </div>

      {/* 만들기 버튼 */}
      <button
        disabled={!canCreate || createPuzzle.isPending}
        className="w-full py-3.5 rounded-2xl font-bold text-base transition-all active:scale-95"
        style={{
          background:
            canCreate && !createPuzzle.isPending
              ? "linear-gradient(135deg, #6366f1, #8b5cf6)"
              : "#f3f4f6",
          color: canCreate && !createPuzzle.isPending ? "white" : "#d1d5db",
        }}
        onClick={() => createPuzzle.mutate()}
      >
        {createPuzzle.isPending ? "업로드 중..." : "만들기"}
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}
