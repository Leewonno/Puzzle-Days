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
      <div className="text-5xl">🎉</div>
      <p className="text-xl font-bold text-gray-800">SUCCESS!</p>
      <p className="text-gray-500 text-sm font-mono">
        {formatTime(elapsedSeconds)}
      </p>
      <div className="flex flex-col gap-3 w-full">
        <button
          className="bg-white text-indigo-500 rounded-xl py-3 px-6 font-semibold shadow hover:shadow-md active:bg-gray-50 transition-shadow uppercase"
          onClick={onRestart}
        >
          Try Again
        </button>
        <button
          className="bg-white text-gray-700 rounded-xl py-3 px-6 font-semibold shadow hover:shadow-md active:bg-gray-50 transition-shadow uppercase"
          onClick={() => navigate(-1)}
        >
          Exit
        </button>
      </div>
    </Modal>
  );
}
