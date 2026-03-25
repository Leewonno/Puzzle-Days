import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Capacitor } from "@capacitor/core";

export function useAndroidBackButton() {
  const navigate = useNavigate();
  const location = useLocation();
  const lastBackPress = useRef<number | null>(null);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    let cleanup: (() => void) | undefined;

    const setup = async () => {
      const { App } = await import("@capacitor/app");
      const { Toast } = await import("@capacitor/toast");

      const listener = App.addListener("backButton", async () => {
        const isHome = location.pathname === "/";

        if (!isHome) {
          navigate(-1);
          return;
        }

        const now = Date.now();
        if (lastBackPress.current && now - lastBackPress.current < 2000) {
          App.exitApp();
        } else {
          lastBackPress.current = now;
          await Toast.show({ text: "한 번 더 누르면 종료됩니다.", duration: "short" });
        }
      });

      cleanup = () => listener.then((l) => l.remove());
    };

    void setup();

    return () => cleanup?.();
  }, [navigate, location.pathname]);
}
