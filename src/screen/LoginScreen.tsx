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

          {/* Google 로그인 버튼 */}
          <button
            className="w-full flex items-center justify-center gap-3 bg-white text-gray-700 font-semibold text-sm py-3 rounded-xl border border-gray-200 shadow-sm active:bg-gray-50 transition-colors"
            style={{ fontFamily: "Roboto, sans-serif" }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="#4285F4"
                d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z"
              />
              <path
                fill="#34A853"
                d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"
              />
              <path
                fill="#FBBC05"
                d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332Z"
              />
              <path
                fill="#EA4335"
                d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58Z"
              />
            </svg>
            Google로 계속하기
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
