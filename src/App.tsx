import { useEffect } from "react";
import {
  HashRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Capacitor } from "@capacitor/core";
import HomeScreen from "./screen/HomeScreen";
import CreateScreen from "./screen/CreateScreen";
import LoginScreen from "./screen/LoginScreen";
import MyScreen from "./screen/MyScreen";
import GameScreen from "./screen/GameScreen";
import GameListScreen from "./screen/GameListScreen";
import { Header } from "./nav/Header";
import { Layout } from "./components";
import { useAndroidBackButton } from "./hooks/useAndroidBackButton";
import { initAdMob, showBannerAd, resumeBanner, pauseBanner } from "./utils/admob";
import { supabase } from "./lib/supabase";
import { useUserStore } from "./stores/useUserStore";
import type { AppUser } from "./stores/useUserStore";
import type { User } from "@supabase/supabase-js";

function toAppUser(user: User): AppUser {
  const meta = user.user_metadata;
  return {
    id: user.id,
    email: user.email ?? null,
    name: (meta.full_name ?? null) as string | null,
    avatar: (meta.avatar_url ?? null) as string | null,
  };
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useUserStore();
  if (isLoading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function LayoutRoutes() {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/login") {
      void pauseBanner();
    } else {
      void resumeBanner();
    }
  }, [location.pathname]);

  return (
    <Layout>
      <Header />
      <Routes>
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/gamelist" element={<GameListScreen />} />
        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <CreateScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my"
          element={
            <ProtectedRoute>
              <MyScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/game"
          element={
            <ProtectedRoute>
              <GameScreen />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Layout>
  );
}

function AppContent() {
  useAndroidBackButton();
  const { setUser, setLoading } = useUserStore();

  // 세션 초기화 + 인증 상태 변화 감지
  useEffect(() => {
    void supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ? toAppUser(session.user) : null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ? toAppUser(session.user) : null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [setUser, setLoading]);

  // 네이티브 앱: OAuth 콜백 딥링크 처리
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;
    let cleanup: (() => void) | undefined;

    const setup = async () => {
      const { App: CapApp } = await import("@capacitor/app");
      const { Browser } = await import("@capacitor/browser");

      const listener = await CapApp.addListener(
        "appUrlOpen",
        async ({ url }) => {
          if (!url.includes("auth/callback")) return;
          const fragment = url.split("#")[1];
          if (fragment) {
            const params = new URLSearchParams(fragment);
            const accessToken = params.get("access_token");
            const refreshToken = params.get("refresh_token");
            if (accessToken && refreshToken) {
              await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken,
              });
            }
          }
          await Browser.close();
        },
      );

      cleanup = () => {
        void listener.remove();
      };
    };

    void setup();
    return () => cleanup?.();
  }, []);

  useEffect(() => {
    const init = async () => {
      await initAdMob();
      await showBannerAd();
    };
    void init();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<HomeScreen />} />
      <Route path="/*" element={<LayoutRoutes />} />
    </Routes>
  );
}

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HashRouter>
        <AppContent />
      </HashRouter>
    </QueryClientProvider>
  );
}

export default App;
