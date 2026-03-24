import { useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const canGoBack = location.key !== "default";

  return (
    <header className={`h-10 ${canGoBack ? "flex" : "hidden"} items-center`}>
      <button onClick={() => (canGoBack ? navigate(-1) : null)}>
        <ChevronLeft
          size={24}
          className="text-white drop-shadow-md cursor-pointer"
        />
      </button>
    </header>
  );
}
