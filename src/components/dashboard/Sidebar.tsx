"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  Search,
  Wallet2,
  LogOut,
  Bot,
  Newspaper,
  Share2,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

type Item = { label: string; href: string; icon: React.ReactNode };

const NAV: Item[] = [
  { label: "Dashboard",        href: "/dashboard", icon: <LayoutDashboard className="size-5" /> },
  { label: "Danh mục đầu tư",  href: "/dashboard/portfolio", icon: <Search className="size-5" /> },
  { label: "Quản lý tài chính",href: "/dashboard/wallet",    icon: <Wallet2 className="size-5" /> },
  { label: "Chatbot",          href: "/dashboard/chatbot",   icon: <Bot className="size-5" /> },
  { label: "Báo chí",          href: "/dashboard/news",     icon: <Newspaper className="size-5" /> },
  { label: "Mạng xã hội",      href: "/dashboard/social",    icon: <Share2 className="size-5" /> },
  { label: "Đăng xuất",        href: "/dashboard/logout",    icon: <LogOut className="size-5" /> },
];

const WIDTH = 260;

export default function Sidebar() {
  const activePath = usePathname();

  // ---- next-themes: chỉ dùng sau khi mounted để tránh hydration mismatch
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = mounted && resolvedTheme === "dark";

  return (
    <aside
      style={{ ["--sbw" as string]: `${WIDTH}px` }}
      className={[
        "sticky top-0 h-[100dvh] w-[var(--sbw)]",
        "bg-[#0B162C]/95 dark:bg-[#0A1226]/95 text-slate-200",
        "backdrop-blur-md border-r border-white/10 rounded-r-3xl",
        "shadow-[inset_-1px_0_0_rgba(255,255,255,0.06),0_16px_40px_rgba(0,0,0,0.35)]",
        "px-3 pt-5 pb-6",
      ].join(" ")}
      aria-label="Sidebar"
    >
      {/* Brand + Theme switch */}
      <div className="flex text-2xl mb-8 items-center justify-center gap-4">
        <div className="font-semibold tracking-wide">Walleto</div>

        {/* Switch chỉ render sau khi mounted để không lệch SSR/CSR */}
        {mounted ? (
          <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            role="switch"
            aria-checked={isDark}
            aria-label="Toggle theme"
            className={[
              "group relative h-6 w-14 rounded-full cursor-pointer",
              "ring-1 ring-white/15",
              "bg-gradient-to-br from-white/10 via-white/5 to-white/10",
              "dark:from-blue-500/25 dark:via-blue-400/20 dark:to-blue-500/25",
              "before:absolute before:inset-0 before:rounded-full before:blur-md",
              "before:bg-white/10 dark:before:bg-blue-500/20",
              "overflow-hidden backdrop-blur-sm",
              "transition-[background,box-shadow] duration-300",
              "hover:ring-white/25 hover:shadow-[0_10px_30px_rgba(0,0,0,0.28)]",
              "active:scale-[0.98]",
            ].join(" ")}
          >
            <span
              className={[
                "pointer-events-none absolute -inset-x-10 inset-y-0",
                "bg-[linear-gradient(100deg,transparent,rgba(255,255,255,0.12),transparent)]",
                "translate-x-[-60%] group-hover:translate-x-[60%]",
                "transition-transform duration-700 ease-out",
              ].join(" ")}
            />
            <span
              className={[
                "absolute top-1/2 -translate-y-1/2 h-5 w-5 rounded-full",
                "grid place-items-center bg-white/95",
                "shadow-[0_6px_18px_rgba(0,0,0,0.25)] ring-1 ring-white/60",
                "transition-transform duration-300 group-active:scale-95",
                isDark ? "translate-x-8" : "translate-x-1",
                "before:absolute before:inset-[-1px] before:rounded-full before:content-['']",
                "before:bg-[conic-gradient(from_220deg_at_50%_50%,rgba(255,255,255,0.65),rgba(255,255,255,0)_60%)]",
              ].join(" ")}
            >
              {isDark ? (
                <svg viewBox="0 0 24 24" className="h-4 w-4 text-blue-600">
                  <path fill="currentColor" d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 1 0 9.79 9.79Z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="h-4 w-4 text-amber-500">
                  <path fill="currentColor" d="M6.76 4.84 5.34 3.42 3.92 4.84 5.34 6.26 6.76 4.84zM1 13h3v-2H1v2zm10 10h2v-3h-2v3zm9-10v-2h-3v2h3zm-2.76 7.16 1.42 1.42 1.42-1.42-1.42-1.42-1.42 1.42zM13 1h-2v3h2V1zm6.24 3.84-1.42 1.42 1.42 1.42 1.42-1.42-1.42-1.42zM4.84 17.24 3.42 18.66l1.42 1.42 1.42-1.42-1.42-1.42zM12 6a6 6 0 1 0 .001 12.001A6 6 0 0 0 12 6z" />
                </svg>
              )}
            </span>
          </button>
        ) : (
          // skeleton nhỏ để SSR/CSR trùng nhau
          <div className="h-6 w-14 rounded-full bg-white/10 ring-1 ring-white/10" />
        )}
      </div>

      {/* Nav */}
      <nav>
        <ul className="flex flex-col gap-1.5">
          {NAV.map((it) => {
            const active = activePath === it.href;
            return (
              <li key={it.href}>
                <Link
                  href={it.href}
                  className={[
                    "group flex items-center gap-3 rounded-2xl px-3 py-2.5 transition-colors",
                    active
                      ? "bg-white/10 ring-1 ring-white/10 text-white"
                      : "hover:bg-white/6 text-slate-300 hover:text-white",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "shrink-0 grid place-items-center size-9 rounded-xl",
                      "border border-white/10 bg-white/6",
                      "transition-transform motion-safe:group-hover:scale-[1.03]",
                    ].join(" ")}
                  >
                    {it.icon}
                  </span>
                  <span className="text-[13px] font-medium tracking-wide">{it.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logo card */}
      <div className="absolute inset-x-0 bottom-5 px-4">
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
          <div className="flex items-center gap-3">
            <div className="size-12 rounded-2xl bg-white/10 grid place-items-center">
              <img src="/logo.png" alt="Walleto" className="h-6 w-6 invert" />
            </div>
            <div>
              <div className="text-base font-semibold leading-tight">Walleto</div>
              <div className="text-[11px] text-slate-400">Personal finance</div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
