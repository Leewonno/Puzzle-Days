import { useState } from "react";
import { useUserStore } from "../stores/useUserStore";

type Tab = "created" | "played";

const MOCK_CREATED = [
  {
    id: 1,
    title: "제주 에메랄드빛 바다",
    size: "16×16",
    daysAgo: "2일 전",
    bg: "#fef3c7",
    emoji: "🌊",
  },
  {
    id: 2,
    title: "경복궁 봄날",
    size: "8×8",
    daysAgo: "5일 전",
    bg: "#fce7f3",
    emoji: "🌸",
  },
  {
    id: 3,
    title: "설악산 단풍",
    size: "12×12",
    daysAgo: "1주 전",
    bg: "#d1fae5",
    emoji: "🏔️",
  },
  {
    id: 4,
    title: "부산 해운대 일출",
    size: "10×10",
    daysAgo: "2주 전",
    bg: "#ede9fe",
    emoji: "🌅",
  },
];

const MOCK_PLAYED = [
  {
    id: 1,
    title: "남산 타워 야경",
    size: "16×16",
    daysAgo: "어제",
    bg: "#ede9fe",
    emoji: "🗼",
  },
  {
    id: 2,
    title: "담양 대나무숲",
    size: "8×8",
    daysAgo: "3일 전",
    bg: "#ecfdf5",
    emoji: "🌿",
  },
  {
    id: 3,
    title: "순천만 갈대밭",
    size: "12×12",
    daysAgo: "5일 전",
    bg: "#fff7ed",
    emoji: "🦋",
  },
  {
    id: 4,
    title: "제주 감귤 농장",
    size: "10×10",
    daysAgo: "1주 전",
    bg: "#fef9c3",
    emoji: "🍊",
  },
];

export default function MyScreen() {
  const { user } = useUserStore();
  const [tab, setTab] = useState<Tab>("created");
  const [withdrawConfirm, setWithdrawConfirm] = useState(false);

  const list = tab === "created" ? MOCK_CREATED : MOCK_PLAYED;

  return (
    <div className="flex flex-col gap-4">
      {/* 프로필 카드 */}
      <div
        className="bg-white rounded-2xl px-5 py-5 flex flex-col items-center gap-3 shadow"
        style={{ border: "1px solid #f0f0ff" }}
      >
        {/* 아바타 */}
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold text-white"
          style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
        >
          {user ? "나" : "?"}
        </div>

        <div className="text-center">
          <p className="text-sm font-bold text-gray-800">김지소</p>
          <p className="text-xs text-gray-400 mt-0.5">jisaw@gmail.com</p>
        </div>

        {/* 회원탈퇴 버튼 */}
        {!withdrawConfirm ? (
          <button
            className="text-xs text-red-300 underline"
            onClick={() => setWithdrawConfirm(true)}
          >
            회원탈퇴
          </button>
        ) : (
          <div className="flex gap-2 items-center">
            <p className="text-xs text-gray-500">정말 탈퇴할까요?</p>
            <button
              className="text-xs font-semibold text-red-400 underline"
              onClick={() => {
                /* TODO: withdraw */
                setWithdrawConfirm(false);
              }}
            >
              탈퇴
            </button>
            <button
              className="text-xs text-gray-400"
              onClick={() => setWithdrawConfirm(false)}
            >
              취소
            </button>
          </div>
        )}
      </div>

      {/* 탭 */}
      <div
        className="flex gap-0 rounded-xl p-1"
        style={{ background: "#f8f9ff" }}
      >
        <button
          className="flex-1 text-center text-xs font-semibold py-2 rounded-lg transition-colors"
          style={
            tab === "created"
              ? {
                  background: "white",
                  color: "#6366f1",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                }
              : { color: "#94a3b8" }
          }
          onClick={() => setTab("created")}
        >
          만든 퍼즐
        </button>
        <button
          className="flex-1 text-center text-xs font-semibold py-2 rounded-lg transition-colors"
          style={
            tab === "played"
              ? {
                  background: "white",
                  color: "#6366f1",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                }
              : { color: "#94a3b8" }
          }
          onClick={() => setTab("played")}
        >
          플레이한 퍼즐
        </button>
      </div>

      {/* 2열 카드 그리드 */}
      <div className="grid grid-cols-2 gap-3">
        {list.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl overflow-hidden shadow cursor-pointer active:scale-95 transition-transform"
          >
            <div
              className="w-full aspect-square flex items-center justify-center text-4xl"
              style={{ background: item.bg }}
            >
              {item.emoji}
            </div>
            <div className="px-3 py-2.5">
              <p className="font-bold text-sm text-gray-800 truncate">
                {item.title}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                {item.size} · {item.daysAgo}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
