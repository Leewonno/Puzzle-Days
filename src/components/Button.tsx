import type React from "react";
import { Link } from "react-router-dom";

interface ButtonProps {
  to?: string;
  children: React.ReactNode;
}

const COMMON_CLASS = "";

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
