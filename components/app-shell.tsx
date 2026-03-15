"use client";

import Header from "@/components/Landing/header";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const HIDDEN_HEADER_PREFIXES = ["/app", "/auth", "/admin"];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const showHeader = !HIDDEN_HEADER_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  return (
    <>
      {showHeader ? <Header /> : null}
      <main className={showHeader ? "pt-24" : ""}>{children}</main>
    </>
  );
}
