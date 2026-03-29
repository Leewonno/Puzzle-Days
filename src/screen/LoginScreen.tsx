import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import icon from "../assets/icon.png";
import { TermsModal, PrivacyModal } from "../features";
import { signInWithGoogle } from "../utils/auth";
import { useUserStore } from "../stores/useUserStore";
import google_login from "../assets/google_login.png";

export default function LoginScreen() {
  const navigate = useNavigate();
  const isAuthenticated = useUserStore((s) => s.isAuthenticated);
  const [termsOpen, setTermsOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [signingIn, setSigningIn] = useState(false);

  // 로그인 성공 시 이전 화면으로
  useEffect(() => {
    if (isAuthenticated) navigate(-1);
  }, [isAuthenticated, navigate]);

  async function handleGoogleSignIn() {
    setSigningIn(true);
    try {
      await signInWithGoogle();
    } finally {
      setSigningIn(false);
    }
  }

  return (
    <div
      className="flex flex-col justify-between w-full px-7"
      style={{
        minHeight: "calc(100svh - env(safe-area-inset-top) - 12.5rem)",
      }}
    >
      {/* 상단: 아이콘 + 카피 */}
      <div className="flex flex-col gap-5 pt-12">
        <img
          src={icon}
          className="rounded-2xl"
          style={{ width: 52, height: 52 }}
        />
        <div className="flex flex-col gap-1.5">
          <p className="text-[26px] font-bold text-gray-900 leading-tight">
            사진으로 만드는
            <br />
            나만의 퍼즐
          </p>
        </div>
      </div>

      {/* 하단: Google 버튼 + 약관 */}
      <div className="flex flex-col gap-3 pb-8">
        <button
          disabled={signingIn}
          onClick={() => void handleGoogleSignIn()}
          className="flex items-center active:scale-95 transition-transform"
        >
          <img src={google_login} className="h-10" />
        </button>
        <p className="text-[11px] text-gray-400 leading-relaxed">
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

      <TermsModal open={termsOpen} onClose={() => setTermsOpen(false)} />
      <PrivacyModal open={privacyOpen} onClose={() => setPrivacyOpen(false)} />
    </div>
  );
}
