import { useState } from "react";
import icon from "../assets/icon_no_bg.png";
import { TermsModal, PrivacyModal } from "../features";

export default function LoginScreen() {
  const [termsOpen, setTermsOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);

  return (
    <div
      className="flex flex-col items-center justify-center w-full bg-white"
      style={{
        minHeight: "calc(100svh - env(safe-area-inset-top) - 5.5rem)",
      }}
    >
      {/* 플로팅 카드 */}
      <div className="w-full max-w-sm mx-auto px-6">
        <div className="bg-white rounded-3xl px-6 py-8 flex flex-col items-center gap-8 shadow-xl">
          {/* 앱 아이콘 */}
          <img
            src={icon}
            className="rounded-2xl"
            style={{ width: 72, height: 72 }}
          />

          {/* 앱명 + 태그라인 */}
          <div className="text-center flex flex-col gap-1">
            <p className="text-xs text-gray-400">사진으로 만드는 나만의 퍼즐</p>
          </div>

          <button
            className="
              w-full
              flex items-center justify-center gap-3
              h-10 px-4
              bg-white text-gray-700
              border border-gray-300 rounded-md
              shadow-sm
              hover:shadow-md hover:bg-gray-50
              active:bg-gray-100
              transition
            "
          >
            <svg className="w-5 h-5" viewBox="0 0 48 48">
              <path
                fill="#EA4335"
                d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
              />
              <path
                fill="#4285F4"
                d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
              />
              <path
                fill="#FBBC05"
                d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
              />
              <path
                fill="#34A853"
                d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
              />
            </svg>

            <span className="text-sm font-medium font-[Roboto]">
              Sign in with Google
            </span>
          </button>

          {/* 약관 안내 */}
          <p className="text-[10px] text-gray-400 text-center leading-relaxed">
            계속하면{" "}
            <button
              className="text-indigo-400 underline"
              onClick={() => setTermsOpen(true)}
            >
              서비스 약관
            </button>
            과{" "}
            <button
              className="text-indigo-400 underline"
              onClick={() => setPrivacyOpen(true)}
            >
              개인정보처리방침
            </button>
            에 동의하는 것으로 간주됩니다.
          </p>
        </div>
      </div>

      <TermsModal open={termsOpen} onClose={() => setTermsOpen(false)} />
      <PrivacyModal open={privacyOpen} onClose={() => setPrivacyOpen(false)} />
    </div>
  );
}
