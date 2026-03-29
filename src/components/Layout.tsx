import type React from "react";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="w-full" style={{ minHeight: "calc(100vh - 60px)", background: "#f8f9fa", paddingBottom: "calc(env(safe-area-inset-bottom) + 5rem)" }}>
      {/* background */}
      <div className="fixed inset-0 -z-10 h-screen overflow-hidden" style={{ background: "#f8f9fa" }}>
        <div style={{
          position: "absolute", right: -24, top: 48,
          width: 160, height: 160,
          background: "linear-gradient(135deg, #ede9fe, #ddd6fe)",
          borderRadius: 40, transform: "rotate(18deg)", opacity: 0.7,
        }} />
        <div style={{
          position: "absolute", right: 28, top: 110,
          width: 80, height: 80,
          background: "linear-gradient(135deg, #c7d2fe, #a5b4fc)",
          borderRadius: 22, transform: "rotate(8deg)", opacity: 0.4,
        }} />
      </div>
      <div
        className="flex flex-col gap-4 p-4"
        style={{ paddingTop: "calc(env(safe-area-inset-top) + 1rem)" }}
      >
        {children}
      </div>
    </div>
  );
}
