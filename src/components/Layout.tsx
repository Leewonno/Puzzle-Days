import type React from "react";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="relative min-h-screen w-full">
      {/* background */}
      <div className="fixed inset-0 -z-10 h-screen"></div>
      <div
        className="flex flex-col gap-4 p-4"
        style={{ paddingTop: "calc(env(safe-area-inset-top) + 1rem)" }}
      >
        {children}
      </div>
    </div>
  );
}
