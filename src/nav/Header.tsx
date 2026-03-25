import { useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { Title } from "../components";

const ScreenTitle: Record<string, string> = {
  "/": "EXPLORE",
  "/login": "LOGIN",
  "/game": "PLAY",
  "/my": "MY",
  "/create": "CREATE",
};

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const canGoBack = location.key !== "default";
  const path = location.pathname;

  return (
    <header className={`h-10 flex items-center gap-4`}>
      <button
        onClick={() => (canGoBack ? navigate(-1) : null)}
        className={` ${canGoBack ? "block" : "hidden"}`}
      >
        <ChevronLeft
          size={24}
          className={`text-black drop-shadow-md cursor-pointer`}
        />
      </button>
      <Title>{ScreenTitle[path]}</Title>
    </header>
  );
}
