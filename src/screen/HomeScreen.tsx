import { useUserStore } from "../stores/useUserStore";
import { Button } from "../components";

export default function HomeScreen() {
  const { isAuthenticated } = useUserStore();

  return (
    <>
      {isAuthenticated ? (
        <>
          <Button to={"/my"}>MY</Button>
        </>
      ) : (
        <>
          <Button to={"/login"}>LOGIN</Button>
        </>
      )}

      <Button to={"/create"}>CREATE</Button>
      <Button to={"/game"}>PLAY</Button>

      {/* 게임 목록은 홈 스크린에서 보여주기 */}
      {/* <Link to={"/gamelist"}>게임목록</Link> */}
    </>
  );
}
