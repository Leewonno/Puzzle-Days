import type React from "react";
import { Link } from "react-router-dom";

interface ButtonProps {
  to?: string;
  children: React.ReactNode;
}

const COMMON_CLASS =
  "flex justify-center p-3 bg-white rounded-lg font-semibold shadow hover:shadow-md active:bg-gray-50 transition-shadow";

export function Button({ to, children }: ButtonProps) {
  return (
    <>
      {to ? (
        <Link className={COMMON_CLASS} to={to}>
          {children}
        </Link>
      ) : (
        <button className={COMMON_CLASS}>{children}</button>
      )}
    </>
  );
}
