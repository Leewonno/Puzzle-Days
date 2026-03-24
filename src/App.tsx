import { HashRouter, Routes, Route } from "react-router-dom";
import HomeScreen from "./screen/HomeScreen";
import CreateScreen from "./screen/CreateScreen";
import LoginScreen from "./screen/LoginScreen";
import MyScreen from "./screen/MyScreen";
import GameScreen from "./screen/GameScreen";
import GameListScreen from "./screen/GameListScreen";
import { Header } from "./nav/Header";
import { Layout } from "./components";

function App() {
  return (
    <HashRouter>
      <Layout>
        <Header />
        <Routes>
          {/* 홈 화면 */}
          <Route path="/" element={<HomeScreen />} />
          {/* 게임 만들기 화면 */}
          <Route path="/create" element={<CreateScreen />} />
          {/* 로그인 화면 : 구글 소셜 로그인만 제공 */}
          <Route path="/login" element={<LoginScreen />} />
          {/* 개인정보관리 화면 : 회원탈퇴 */}
          <Route path="/my" element={<MyScreen />} />
          {/* 게임 플레이 화면 */}
          <Route path="/game" element={<GameScreen />} />
          {/* 게임 목록 화면 */}
          <Route path="/gamelist" element={<GameListScreen />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
}

export default App;
