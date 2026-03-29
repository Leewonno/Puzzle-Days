import { useNavigate } from "react-router-dom";
import { Modal } from "../../../components/Modal";

interface CompletionModalProps {
  open: boolean;
  elapsedSeconds: number;
  onRestart: () => void;
}

export function CompletionModal({
  open,
  elapsedSeconds,
  onRestart,
}: CompletionModalProps) {
  const navigate = useNavigate();

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  return (
    <Modal open={open}>
      <div className="flex items-end gap-2" key={open ? "open" : "closed"}>
        {([0, 150, 300] as const).map((delay, i) => (
          <span
            key={delay}
            style={{
              display: "inline-block",
              fontSize: i === 1 ? "3rem" : "2.1rem",
              opacity: 0,
              animation: `starPop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}ms forwards`,
            }}
          >
            ⭐
          </span>
        ))}
      </div>
      <p className="text-xl font-bold text-gray-800">CLEAR!</p>
      <p className="text-gray-500 text-sm font-mono">
        {formatTime(elapsedSeconds)}
      </p>
      <div className="flex flex-col gap-3 w-full">
        <button
          className="bg-white text-indigo-500 rounded-xl py-3 px-6 font-semibold shadow hover:shadow-md transition-transform uppercase active:scale-95"
          onClick={onRestart}
        >
          다시하기
        </button>
        <button
          className="bg-white text-gray-700 rounded-xl py-3 px-6 font-semibold shadow hover:shadow-md transition-transform uppercase active:scale-95"
          onClick={async () => {
            await new Promise((resolve) => setTimeout(resolve, 120));
            navigate(-1);
          }}
        >
          나가기
        </button>
      </div>
    </Modal>
  );
}
