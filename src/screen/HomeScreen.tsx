import { useNavigate } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import icon from "../assets/icon_no_bg.png";

export default function HomeScreen() {
  const navigate = useNavigate();
  const { isAuthenticated } = useUserStore();

  return (
    <div
      className="flex flex-col items-center justify-between px-4 pb-25 w-full"
      style={{
        minHeight: "100svh",
        paddingTop: "calc(env(safe-area-inset-top) + 3rem)",
      }}
    >
      {/* 히어로 영역 */}
      <div className="flex-1 flex flex-col items-center justify-center gap-8 w-full">
        {/* 앱 아이콘 */}
        <img
          src={icon}
          className="rounded-3xl"
          style={{ width: 350, height: 350 }}
        />
      </div>

      {/* 버튼 영역 */}
      <div className="w-full flex flex-col gap-3 pb-5">
        <button
          className="w-full text-white rounded-2xl py-3 font-semibold text-lg shadow-lg active:scale-95 transition-transform"
          style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
          onClick={async () => {
            await new Promise((resolve) => setTimeout(resolve, 120));
            navigate("/gamelist");
          }}
        >
          시작
        </button>
        <button
          className="w-full bg-white text-gray-700 rounded-2xl py-3 font-semibold shadow active:scale-95 transition-transform"
          onClick={async () => {
            await new Promise((resolve) => setTimeout(resolve, 120));
            navigate("/create");
          }}
        >
          퍼즐 만들기
        </button>
        <button
          className="w-full text-gray-400 py-3 font-medium text-sm active:scale-90 transition-transform"
          onClick={async () => {
            await new Promise((resolve) => setTimeout(resolve, 120));
            navigate(isAuthenticated ? "/my" : "/login");
          }}
        >
          {isAuthenticated ? "내 정보" : "로그인"}
        </button>
      </div>
    </div>
  );
}
