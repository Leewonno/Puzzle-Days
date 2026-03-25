import { useEffect } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import HomeScreen from "./screen/HomeScreen";
import CreateScreen from "./screen/CreateScreen";
import LoginScreen from "./screen/LoginScreen";
import MyScreen from "./screen/MyScreen";
import GameScreen from "./screen/GameScreen";
import GameListScreen from "./screen/GameListScreen";
import { Header } from "./nav/Header";
import { Layout } from "./components";
import { useAndroidBackButton } from "./hooks/useAndroidBackButton";
import { initAdMob } from "./utils/admob";

function LayoutRoutes() {
  return (
    <Layout>
      <Header />
      <Routes>
        <Route path="/create" element={<CreateScreen />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/my" element={<MyScreen />} />
        <Route path="/game" element={<GameScreen />} />
        <Route path="/gamelist" element={<GameListScreen />} />
      </Routes>
    </Layout>
  );
}

function AppContent() {
  useAndroidBackButton();
  useEffect(() => { void initAdMob(); }, []);
  return (
    <Routes>
      <Route path="/" element={<HomeScreen />} />
      <Route path="/*" element={<LayoutRoutes />} />
    </Routes>
  );
}

function App() {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
}

export default App;
