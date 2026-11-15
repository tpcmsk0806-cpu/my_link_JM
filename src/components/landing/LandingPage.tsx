"use client";

import React, { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import {
  Link2,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Zap,
  Smartphone,
  Share2,
  Check,
  Mail,
  ArrowRight,
} from "lucide-react";
import { Instagram, Youtube, Github, Twitter } from "@/components/SocialIcons";

interface LandingPageProps {
  onLoginSuccess?: () => void;
}

export default function LandingPage({ onLoginSuccess }: LandingPageProps) {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    try {
      setIsLoggingIn(true);
      setErrorMsg(null);
      await signInWithPopup(auth, googleProvider);
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    } catch (err: any) {
      console.error("Google 로그인 오류:", err);
      if (
        err.code !== "auth/popup-closed-by-user" &&
        err.code !== "auth/cancelled-popup-request"
      ) {
        setErrorMsg(err?.message || "Google 로그인에 실패했습니다. 다시 시도해 주세요.");
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-slate-950 via-zinc-900 to-black text-white flex flex-col items-center justify-between px-4 py-6 sm:py-10">
      {/* Top Header Bar */}
      <header className="w-full max-w-5xl flex items-center justify-between py-2 mb-8 sm:mb-12">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/25">
            <Link2 className="w-5 h-5 -rotate-45 stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-base tracking-tight text-white">
              마이링크 <span className="text-cyan-400 font-mono text-xs">MyLink</span>
            </span>
            <span className="text-[10px] text-zinc-400 -mt-0.5 hidden sm:inline">
              모바일 최적화 링크인바이오
            </span>
          </div>
        </div>

        {/* Top Right Quick Google Login Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isLoggingIn}
          className="px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-900 shadow-md transition-all active:scale-95 disabled:opacity-60 cursor-pointer"
        >
          {isLoggingIn ? (
            <div className="w-3.5 h-3.5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
          )}
          <span>로그인</span>
        </button>
      </header>

      {/* Main Hero & Wireframe Container */}
      <main className="w-full max-w-5xl flex-1 flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-14 my-auto">
        {/* Left Column: Hero Text & Main CTA */}
        <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left max-w-xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-5 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>단 하나의 링크로 당신의 모든 채널을 연결하세요</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight mb-4">
            세상의 모든 나를 <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">
              하나의 링크에 담다
            </span>
          </h1>

          {/* Description */}
          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed mb-7 max-w-lg">
            인스타그램, 유튜브, 블로그, 포트폴리오를 한 곳에 모으세요.
            Google 계정으로 로그인하면 나만의 링크 페이지가 생성되어
            링크를 자유롭게 인라인 수정하고 관리할 수 있습니다.
          </p>

          {/* Primary Big Google Login CTA Button */}
          <div className="w-full sm:w-auto flex flex-col gap-3">
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoggingIn}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-950 font-extrabold text-base shadow-xl shadow-cyan-500/10 hover:shadow-cyan-500/20 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-60"
            >
              {isLoggingIn ? (
                <>
                  <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                  <span>Google 로그인 진행 중...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Google로 시작하기</span>
                  <ArrowRight className="w-4 h-4 ml-1 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            {errorMsg && (
              <p className="text-xs text-rose-400 font-medium">{errorMsg}</p>
            )}

            <span className="text-[11px] text-zinc-500 font-medium">
              ⚡ 별도 가입 절차 없이 3초 만에 시작할 수 있습니다.
            </span>
          </div>

          {/* 3 Core Feature Bullets */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-8 pt-8 border-t border-zinc-800/80 w-full text-left">
            <div className="flex items-start gap-2.5">
              <div className="p-2 rounded-xl bg-cyan-950/80 text-cyan-400 border border-cyan-800/50">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">간편한 링크 관리</h4>
                <p className="text-[11px] text-zinc-400">나만의 고유 링크 목록 생성</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="p-2 rounded-xl bg-blue-950/80 text-blue-400 border border-blue-800/50">
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">모바일 최적화</h4>
                <p className="text-[11px] text-zinc-400">와이어프레임 규격 반응형</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="p-2 rounded-xl bg-purple-950/80 text-purple-400 border border-purple-800/50">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">인라인 편집 & 삭제</h4>
                <p className="text-[11px] text-zinc-400">확인 모달로 안전한 관리</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Visual Wireframe Mockup based on WIREFRAME.md */}
        <div className="flex-1 w-full flex items-center justify-center">
          <div className="relative w-full max-w-[360px] sm:max-w-[380px] rounded-[36px] p-4 bg-zinc-900/90 border-2 border-zinc-700/60 shadow-2xl shadow-cyan-500/10 backdrop-blur-xl">
            {/* Top Device Notch / Status Bar */}
            <div className="flex items-center justify-between text-[11px] text-zinc-400 px-3 pt-1 pb-3">
              <span className="font-semibold">9:41</span>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-[10px] text-cyan-400 font-mono">MyLink Preview</span>
                <div className="p-1 rounded-full bg-zinc-800 text-zinc-400 ml-1">
                  <Share2 className="w-3 h-3" />
                </div>
              </div>
            </div>

            {/* Inner Profile View conforming to WIREFRAME.md */}
            <div className="rounded-[28px] bg-slate-950 border border-zinc-800 p-5 flex flex-col items-center text-center">
              {/* [B] Avatar */}
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-cyan-500 via-sky-400 to-indigo-500 p-0.5 shadow-lg shadow-cyan-500/20 mb-3 ring-2 ring-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80"
                  alt="Profile Avatar"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>

              {/* [B] Display Name & Bio */}
              <h3 className="text-base font-bold text-white mb-1">
                김링크 | Tech & Creator 🚀
              </h3>
              <p className="text-xs text-zinc-400 max-w-[260px] leading-relaxed mb-3">
                새로운 기술을 탐구하고 유용한 정보를 공유합니다. 아래 링크에서 만나보세요!
              </p>

              {/* [C] Social Icons Bar */}
              <div className="flex items-center justify-center gap-2 mb-5">
                <div className="w-7 h-7 rounded-full bg-zinc-800/90 text-zinc-300 flex items-center justify-center">
                  <Instagram className="w-3.5 h-3.5 text-pink-400" />
                </div>
                <div className="w-7 h-7 rounded-full bg-zinc-800/90 text-zinc-300 flex items-center justify-center">
                  <Youtube className="w-3.5 h-3.5 text-red-400" />
                </div>
                <div className="w-7 h-7 rounded-full bg-zinc-800/90 text-zinc-300 flex items-center justify-center">
                  <Github className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="w-7 h-7 rounded-full bg-zinc-800/90 text-zinc-300 flex items-center justify-center">
                  <Twitter className="w-3.5 h-3.5 text-sky-400" />
                </div>
                <div className="w-7 h-7 rounded-full bg-zinc-800/90 text-zinc-300 flex items-center justify-center">
                  <Mail className="w-3.5 h-3.5 text-amber-400" />
                </div>
              </div>

              {/* [D] Wireframe Link Blocks Stack */}
              <div className="w-full flex flex-col gap-2.5">
                <div className="w-full py-3 px-4 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between text-xs font-semibold text-white shadow-sm hover:border-cyan-500/50 transition-colors">
                  <span className="truncate">유튜브 최신 영상 보러가기 🎬</span>
                  <ExternalLink className="w-3.5 h-3.5 text-zinc-500 flex-shrink-0" />
                </div>

                <div className="w-full py-3 px-4 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between text-xs font-semibold text-white shadow-sm hover:border-cyan-500/50 transition-colors">
                  <span className="truncate">2026 다이어리 & 굿즈 마켓 🛍️</span>
                  <ExternalLink className="w-3.5 h-3.5 text-zinc-500 flex-shrink-0" />
                </div>

                <div className="w-full py-3 px-4 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between text-xs font-semibold text-white shadow-sm hover:border-cyan-500/50 transition-colors">
                  <span className="truncate">개발 블로그 (Next.js & AI) 💻</span>
                  <ExternalLink className="w-3.5 h-3.5 text-zinc-500 flex-shrink-0" />
                </div>

                <div className="w-full py-3 px-4 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between text-xs font-semibold text-white shadow-sm hover:border-cyan-500/50 transition-colors">
                  <span className="truncate">GitHub 오픈소스 포트폴리오 ⭐</span>
                  <ExternalLink className="w-3.5 h-3.5 text-zinc-500 flex-shrink-0" />
                </div>
              </div>

              {/* [E] Footer Badge */}
              <div className="mt-5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900/80 border border-zinc-800 text-[10px] text-zinc-400 font-medium">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                <span>마이링크로 나만의 링크 만들기</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Branding */}
      <footer className="w-full max-w-5xl py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-500 border-t border-zinc-800/60 mt-10">
        <p>MyLink · 모바일 최적화 링크인바이오</p>
        <p className="text-[11px]">© MyLink</p>
      </footer>
    </div>
  );
}
