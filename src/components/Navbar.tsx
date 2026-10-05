"use client";

import Link from "next/link";
import { Sparkles, LayoutDashboard, ExternalLink, Link2 } from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/60 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <Link2 className="w-5 h-5 -rotate-45" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg tracking-tight text-white flex items-center gap-1.5">
              마이링크 <span className="text-xs px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 font-medium">BETA</span>
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-400">
          <Link href="/alex" target="_blank" className="hover:text-white transition-colors flex items-center gap-1">
            <span>테크 크리에이터 데모</span>
            <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
          </Link>
          <Link href="/sora" target="_blank" className="hover:text-white transition-colors flex items-center gap-1">
            <span>일러스트레이터 데모</span>
            <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
          </Link>
          <Link href="/#features" className="hover:text-white transition-colors">
            주요 기능
          </Link>
          <Link href="/#themes" className="hover:text-white transition-colors">
            테마 모음
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-medium text-zinc-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/5 transition-all"
          >
            로그인
          </Link>
          <Link
            href="/dashboard"
            className="text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 px-4 py-2 rounded-full shadow-md shadow-blue-500/25 hover:shadow-cyan-500/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-1.5"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>대시보드</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
