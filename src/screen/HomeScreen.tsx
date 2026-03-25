import { useNavigate } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import icon from "../assets/icon_no_bg.png";

export default function HomeScreen() {
  const navigate = useNavigate();
  const { isAuthenticated } = useUserStore();

  return (
    <div
      className="flex flex-col items-center justify-between px-6 pb-10 w-full"
      style={{
        minHeight: "100svh",
        paddingTop: "calc(env(safe-area-inset-top) + 3rem)",
      }}
    >
      {/* 히어로 영역 */}
      <div className="flex-1 flex flex-col items-center justify-center gap-4 w-full">
        {/* 앱 아이콘 */}
        <img
          src={icon}
          className="rounded-3xl"
          style={{ width: 200, height: 200 }}
        />

        {/* 타이틀 */}
        <div className="text-center flex flex-col gap-4">
          <p className="text-gray-400 text-sm mt-2">
            사진으로 만드는 나만의 퍼즐
          </p>
        </div>
      </div>

      {/* 버튼 영역 */}
      <div className="w-full flex flex-col gap-3">
        <button
          className="w-full text-white rounded-2xl py-4 font-semibold text-lg shadow-lg"
          style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
          onClick={() => navigate("/gamelist")}
        >
          퍼즐 시작하기
        </button>
        <button
          className="w-full bg-white text-gray-700 rounded-2xl py-4 font-semibold shadow"
          onClick={() => navigate("/create")}
        >
          내 퍼즐 만들기
        </button>
        <button
          className="w-full text-gray-400 py-3 font-medium text-sm"
          onClick={() => navigate(isAuthenticated ? "/my" : "/login")}
        >
          {isAuthenticated ? "내 정보" : "로그인"}
        </button>
      </div>
    </div>
  );
}
