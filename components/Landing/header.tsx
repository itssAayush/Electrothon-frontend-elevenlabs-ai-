"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Activity, ArrowRight, MapPin, Menu, Sparkles, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navigationItems = [
  {
    title: "Platform",
    href: "#platform",
  },
  {
    title: "Network",
    href: "#network",
  },
  {
    title: "Contact",
    href: "#contact",
  },
];

export default function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const resolveHref = (href: string) =>
    pathname === "/" ? href : `/${href}`;

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[#ece4d9] bg-[#f7f6f2]/92 px-4 py-4 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-full border border-[#ece4d9] bg-white/88 px-5 py-3 shadow-[0_16px_36px_rgba(15,23,42,0.06)]">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#0f172a] text-white shadow-[0_10px_28px_rgba(15,23,42,0.22)]">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <div className="text-lg font-semibold tracking-tight text-slate-950">
              MedConnect
            </div>
            <div className="hidden text-xs uppercase tracking-[0.28em] text-slate-500 sm:block">
              Healthcare AI Platform
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {navigationItems.map((item) => (
            <Link
              key={item.title}
              href={resolveHref(item.href)}
              className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-950"
            >
              {item.title}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Button
            asChild
            className="h-12 rounded-full border border-[#d9e3ff] bg-[#edf2ff] px-6 text-sm font-medium text-[#2748b7] shadow-[0_12px_28px_rgba(91,110,225,0.12)] hover:bg-[#e5ecff]"
          >
            <Link href="/auth">
              Experience MedConnect
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-12 rounded-full border-[#d9d8d3] bg-white px-6 text-sm font-medium text-slate-900 shadow-[0_10px_28px_rgba(15,23,42,0.04)] hover:bg-[#fcfbf8]"
          >
            <Link href="/hospitals">
              Find Hospitals
              <MapPin className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-[#ece7df] bg-white text-slate-900 md:hidden"
          aria-label="Toggle navigation"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div
        className={cn(
          "mx-auto mt-3 max-w-7xl overflow-hidden rounded-[2rem] border border-[#ece4d9] bg-white/95 px-5 shadow-[0_18px_45px_rgba(15,23,42,0.08)] backdrop-blur transition-all md:hidden",
          isOpen ? "max-h-[420px] py-5 opacity-100" : "max-h-0 py-0 opacity-0"
        )}
      >
        <div className="space-y-2">
          {navigationItems.map((item) => (
            <Link
              key={item.title}
              href={resolveHref(item.href)}
              className="block rounded-2xl px-4 py-3 text-base font-medium text-slate-700 transition-colors hover:bg-[#f4f6fb] hover:text-slate-950"
            >
              {item.title}
            </Link>
          ))}
        </div>

        <div className="mt-5 space-y-3 border-t border-[#ebe5db] pt-5">
          <Button
            asChild
            className="h-12 w-full rounded-full border border-[#d9e3ff] bg-[#edf2ff] text-sm font-medium text-[#2748b7] hover:bg-[#e5ecff]"
          >
            <Link href="/auth">
              Experience MedConnect
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-12 w-full rounded-full border-[#ebe5db] bg-white text-sm font-medium text-slate-950 hover:bg-[#faf8f4]"
          >
            <Link href="/hospitals">
              Find Hospitals
              <MapPin className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <div className="inline-flex items-center gap-2 rounded-full bg-[#eef3ff] px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#4660d2]">
            <Sparkles className="h-3.5 w-3.5" />
            AI healthcare intelligence
          </div>
        </div>
      </div>
    </header>
  );
}
