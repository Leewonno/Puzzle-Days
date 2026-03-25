import { createPortal } from "react-dom";

interface ModalProps {
  open: boolean;
  children: React.ReactNode;
}

export function Modal({ open, children }: ModalProps) {
  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{ zIndex: 1000, background: "rgba(0,0,0,0.5)" }}
    >
      <div className="bg-white w-full rounded-lg p-8 flex flex-col items-center gap-6 mx-6">
        {children}
      </div>
    </div>,
    document.body,
  );
}
