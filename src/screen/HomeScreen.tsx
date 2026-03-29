import { useNavigate } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";

export default function HomeScreen() {
  const navigate = useNavigate();
  const { isAuthenticated } = useUserStore();

  return (
    <div
      className="relative flex flex-col justify-between w-full px-6 overflow-x-hidden"
      style={{
        minHeight: "100svh",
        maxHeight: "100svh",
        background: "#f8f9fa",
        paddingTop: "calc(env(safe-area-inset-top) + 3rem)",
        paddingBottom: "calc(env(safe-area-inset-bottom) + 5rem)",
      }}
    >
      {/* 배경 장식 */}
      <div
        className="absolute pointer-events-none"
        style={{
          right: -24,
          top: 48,
          width: 160,
          height: 160,
          background: "linear-gradient(135deg, #ede9fe, #ddd6fe)",
          borderRadius: 40,
          transform: "rotate(18deg)",
          opacity: 0.7,
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          right: 28,
          top: 110,
          width: 80,
          height: 80,
          background: "linear-gradient(135deg, #c7d2fe, #a5b4fc)",
          borderRadius: 22,
          transform: "rotate(8deg)",
          opacity: 0.4,
        }}
      />

      {/* 히어로 텍스트 */}
      <div className="flex flex-col gap-4 relative">
        <p
          className="text-xs font-semibold tracking-widest"
          style={{ color: "#a5b4fc" }}
        >
          PUZZLE DAYS
        </p>
        <p className="text-[28px] font-bold text-gray-900 leading-tight">
          나만의 사진으로
          <br />
          퍼즐을 만들어요
        </p>
        <p className="text-sm text-gray-400">나만의 퍼즐, 바로 시작해보세요</p>
      </div>

      {/* 버튼 영역 */}
      <div className="flex flex-col gap-3 relative">
        <button
          className="w-full text-white rounded-2xl py-3.5 font-bold text-base active:scale-95 transition-transform"
          style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
          onClick={async () => {
            await new Promise((resolve) => setTimeout(resolve, 120));
            navigate("/gamelist");
          }}
        >
          시작하기
        </button>
        <div className="flex gap-3">
          <button
            className="flex-1 bg-white text-gray-700 rounded-2xl py-3 font-semibold text-sm active:scale-95 transition-transform shadow-sm"
            onClick={async () => {
              await new Promise((resolve) => setTimeout(resolve, 120));
              navigate("/create");
            }}
          >
            퍼즐 만들기
          </button>
          <button
            className="flex-1 bg-white text-gray-400 rounded-2xl py-3 font-semibold text-sm active:scale-95 transition-transform shadow-sm"
            onClick={async () => {
              await new Promise((resolve) => setTimeout(resolve, 120));
              navigate(isAuthenticated ? "/my" : "/login");
            }}
          >
            {isAuthenticated ? "내 정보" : "로그인"}
          </button>
        </div>
      </div>
    </div>
  );
}
