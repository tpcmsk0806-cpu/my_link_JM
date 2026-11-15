"use client";

import React, { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import {
  Link2,
  Sparkles,
  ExternalLink,
  ArrowRight,
  BarChart3,
  MousePointerClick,
  Share2,
  Zap,
  Palette,
  CheckCircle2,
  Globe,
  TrendingUp,
  Sliders,
  Smartphone,
} from "lucide-react";
import { Instagram, Youtube, Github, Twitter } from "@/components/SocialIcons";

interface LandingPageProps {
  onLoginSuccess?: () => void;
}

export default function LandingPage({ onLoginSuccess }: LandingPageProps) {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Interactive Phone Mockup State (재미있는 인터랙티브 데모)
  const [mockTheme, setMockTheme] = useState<"dark" | "gradient" | "violet">("dark");
  const [mockClickToast, setMockClickToast] = useState<string | null>(null);
  const [mockLinks, setMockLinks] = useState([
    {
      id: "1",
      title: "유튜브 최신 영상 보러가기 🎬",
      clicks: 142,
      domain: "youtube.com",
      badge: "인기",
    },
    {
      id: "2",
      title: "인스타그램 데일리 일상 📸",
      clicks: 98,
      domain: "instagram.com",
    },
    {
      id: "3",
      title: "개발 블로그 (Next.js & AI) 💻",
      clicks: 65,
      domain: "velog.io",
    },
    {
      id: "4",
      title: "GitHub 오픈소스 프로젝트 ⭐",
      clicks: 43,
      domain: "github.com",
    },
  ]);

  const handleGoogleLogin = async () => {
    try {
      setIsLoggingIn(true);
      setErrorMsg(null);
      await signInWithPopup(auth, googleProvider);
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    } catch (err: any) {
      // 사용자가 로그인 팝업 창을 닫거나 취소한 정상적인 인터랙션인 경우 에러 처리 생략
      if (
        err.code === "auth/popup-closed-by-user" ||
        err.code === "auth/cancelled-popup-request"
      ) {
        return;
      }
      console.error("Google 로그인 오류:", err);
      setErrorMsg(err?.message || "Google 로그인에 실패했습니다. 다시 시도해 주세요.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Mockup 링크 클릭 시 실시간 +1 카운트 인터랙션
  const handleMockLinkClick = (id: string, title: string) => {
    setMockLinks((prev) =>
      prev.map((link) =>
        link.id === id ? { ...link, clicks: link.clicks + 1 } : link
      )
    );
    setMockClickToast(`"${title.split(" ")[0]}" 링크 클릭수 +1 카운트! 🚀`);
    setTimeout(() => {
      setMockClickToast(null);
    }, 2200);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#090b10] text-slate-100 overflow-x-hidden selection:bg-cyan-500 selection:text-black">
      {/* Background Ambient Glow Lights */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-cyan-600/20 via-sky-500/15 to-purple-600/10 blur-[130px] rounded-full" />
        <div className="absolute top-[40%] -left-40 w-[450px] h-[450px] bg-indigo-600/10 blur-[140px] rounded-full" />
        <div className="absolute top-[65%] -right-40 w-[500px] h-[500px] bg-cyan-600/10 blur-[150px] rounded-full" />
      </div>

      <div className="relative z-10 w-full flex flex-col items-center">
        {/* ================= 1. Top Navigation Bar ================= */}
        <header className="w-full max-w-6xl px-4 sm:px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/25">
              <Link2 className="w-5 h-5 -rotate-45 stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
                마이링크 <span className="text-cyan-400 font-mono text-xs">MyLink</span>
              </span>
              <span className="text-[10px] text-zinc-400 -mt-0.5 hidden sm:inline font-medium">
                모바일 최적화 링크인바이오
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoggingIn}
              className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-900 shadow-lg shadow-white/5 transition-all active:scale-95 disabled:opacity-60 cursor-pointer"
            >
              {isLoggingIn ? (
                <div className="w-3.5 h-3.5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" viewBox="0 0 24 24">
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
          </div>
        </header>

        {/* ================= 2. Hero Section ================= */}
        <section className="w-full max-w-6xl px-4 sm:px-8 pt-6 pb-16 sm:py-20 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-14">
          {/* Left Column: Hero Copy & CTA */}
          <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left max-w-xl">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-6 backdrop-blur-md shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>나만의 맞춤 링크인바이오 페이지</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.15] mb-5">
              세상의 모든 나를 <br />
              <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
                하나의 링크에 담다
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-zinc-300/90 leading-relaxed mb-8 max-w-lg font-normal">
              인스타그램, 유튜브, 블로그, 포트폴리오를 한곳에 모으세요.
              단 1초 만에 나만의 프로필 페이지를 만들고 실시간 방문자 클릭 수까지 손쉽게 관리할 수 있습니다.
            </p>

            {/* Main Google Login CTA Button */}
            <div className="w-full sm:max-w-xs flex flex-col gap-3">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoggingIn}
                className="w-full py-4 px-7 rounded-2xl bg-white hover:bg-slate-100 text-slate-950 font-extrabold text-base shadow-xl shadow-cyan-500/10 hover:shadow-cyan-500/20 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-60"
              >
                {isLoggingIn ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                    <span>Google 로그인 진행 중...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
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
                  </>
                )}
              </button>

              {errorMsg && (
                <p className="text-xs text-rose-400 font-medium text-center">{errorMsg}</p>
              )}
            </div>
          </div>

          {/* Right Column: Interactive Phone Mockup */}
          <div className="flex-1 w-full flex flex-col items-center justify-center">
            {/* Interactive Theme Switcher Bar above Phone */}
            <div className="flex items-center gap-2 mb-3 bg-zinc-900/80 px-3.5 py-1.5 rounded-full border border-zinc-800 text-xs text-zinc-400 backdrop-blur-md">
              <Palette className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-[11px] font-medium mr-1">테마 미리보기:</span>
              <button
                type="button"
                onClick={() => setMockTheme("dark")}
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-all ${
                  mockTheme === "dark"
                    ? "bg-cyan-500 text-black shadow-sm"
                    : "hover:text-white"
                }`}
              >
                다크
              </button>
              <button
                type="button"
                onClick={() => setMockTheme("gradient")}
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-all ${
                  mockTheme === "gradient"
                    ? "bg-gradient-to-r from-cyan-400 to-blue-500 text-black shadow-sm"
                    : "hover:text-white"
                }`}
              >
                오로라
              </button>
              <button
                type="button"
                onClick={() => setMockTheme("violet")}
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-all ${
                  mockTheme === "violet"
                    ? "bg-purple-500 text-white shadow-sm"
                    : "hover:text-white"
                }`}
              >
                바이올렛
              </button>
            </div>

            {/* Smart Device Mockup Frame */}
            <div className="relative w-full max-w-[340px] sm:max-w-[360px] rounded-[42px] p-3.5 bg-zinc-900/90 border-2 border-zinc-700/70 shadow-2xl shadow-cyan-500/15 backdrop-blur-xl">
              {/* Top Speaker / Dynamic Island */}
              <div className="flex items-center justify-between text-[11px] text-zinc-400 px-4 pt-1.5 pb-2.5">
                <span className="font-semibold text-[10px]">9:41</span>
                <div className="w-16 h-3 bg-zinc-800 rounded-full mx-auto" />
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-[9px] text-cyan-400 font-mono">LIVE</span>
                </div>
              </div>

              {/* Inner Screen */}
              <div
                className={`rounded-[32px] p-5 flex flex-col items-center text-center transition-all duration-500 border border-white/10 ${
                  mockTheme === "dark"
                    ? "bg-slate-950 text-white"
                    : mockTheme === "gradient"
                    ? "bg-gradient-to-b from-cyan-950 via-slate-900 to-black text-white"
                    : "bg-gradient-to-b from-purple-950 via-zinc-900 to-black text-white"
                }`}
              >
                {/* Avatar with Halo Ring */}
                <div className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-full p-0.5 bg-gradient-to-tr from-cyan-400 via-sky-400 to-purple-500 shadow-xl shadow-cyan-500/20 mb-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80"
                    alt="Profile Avatar"
                    className="w-full h-full object-cover rounded-full"
                  />
                  <div className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full bg-cyan-500 text-black text-[9px] font-black uppercase tracking-wider">
                    PRO
                  </div>
                </div>

                {/* Name & Bio */}
                <h3 className="text-sm sm:text-base font-bold text-white mb-1">
                  김링크 | Creator 🚀
                </h3>
                <p className="text-[11px] sm:text-xs text-zinc-300 max-w-[240px] leading-relaxed mb-3">
                  새로운 기술과 일상을 공유합니다. 아래 링크를 눌러 실시간 클릭 집계를 체험해보세요!
                </p>

                {/* Social Icons Bar */}
                <div className="flex items-center justify-center gap-2 mb-4">
                  <div className="w-7 h-7 rounded-full bg-white/10 text-pink-400 flex items-center justify-center hover:scale-110 transition-transform">
                    <Instagram className="w-3.5 h-3.5" />
                  </div>
                  <div className="w-7 h-7 rounded-full bg-white/10 text-red-400 flex items-center justify-center hover:scale-110 transition-transform">
                    <Youtube className="w-3.5 h-3.5" />
                  </div>
                  <div className="w-7 h-7 rounded-full bg-white/10 text-white flex items-center justify-center hover:scale-110 transition-transform">
                    <Github className="w-3.5 h-3.5" />
                  </div>
                  <div className="w-7 h-7 rounded-full bg-white/10 text-sky-400 flex items-center justify-center hover:scale-110 transition-transform">
                    <Twitter className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Click Toast Feedback */}
                {mockClickToast && (
                  <div className="w-full mb-2.5 py-1 px-2 rounded-lg bg-cyan-500 text-black text-[10px] font-bold animate-in fade-in zoom-in-95 duration-150 shadow-md">
                    {mockClickToast}
                  </div>
                )}

                {/* Interactive Demo Links */}
                <div className="w-full flex flex-col gap-2">
                  {mockLinks.map((link) => (
                    <button
                      key={link.id}
                      type="button"
                      onClick={() => handleMockLinkClick(link.id, link.title)}
                      className="group w-full py-2.5 px-3.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-[0.98] border border-white/10 flex items-center justify-between text-left transition-all cursor-pointer backdrop-blur-sm"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        {/* Domain Favicon */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={`https://www.google.com/s2/favicons?domain=${link.domain}&sz=64`}
                          alt=""
                          className="w-4 h-4 rounded-sm flex-shrink-0"
                        />
                        <span className="text-xs font-semibold text-white truncate">
                          {link.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0 ml-1">
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold font-mono">
                          👆 {link.clicks}
                        </span>
                        <ExternalLink className="w-3 h-3 text-zinc-400 group-hover:text-cyan-300 transition-colors" />
                      </div>
                    </button>
                  ))}
                </div>

                {/* Interactive Notice */}
                <div className="mt-3.5 flex items-center gap-1.5 text-[10px] text-zinc-400">
                  <MousePointerClick className="w-3 h-3 text-cyan-400 animate-bounce" />
                  <span>링크를 탭하여 실시간 클릭수 증가를 체험해보세요</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= 3. Feature Bento Grid Section ================= */}
        <section className="w-full max-w-6xl px-4 sm:px-8 py-14 sm:py-20 border-t border-zinc-800/80">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-400 mb-2">
              Powerful & Minimal
            </h2>
            <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              링크 공유에 꼭 필요한 핵심만 담았습니다
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Bento Card 1: 클릭 통계 & 실시간 집계 */}
            <div className="rounded-3xl bg-zinc-900/60 border border-zinc-800 p-6 sm:p-7 flex flex-col justify-between hover:border-cyan-500/40 transition-all hover:-translate-y-1 group">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-5 border border-purple-500/20">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">
                  실시간 클릭 통계 (/stats)
                </h4>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                  어떤 채널과 링크에 반응이 뜨거운지 한눈에 파악하세요.
                  링크별 클릭수 비교 차트와 점유율 도넛 그래프를 기본 제공합니다.
                </p>
              </div>

              {/* Mini Graphic */}
              <div className="mt-6 pt-5 border-t border-zinc-800/80 flex items-center justify-between text-xs font-mono text-zinc-400">
                <span className="flex items-center gap-1 text-cyan-400 font-bold">
                  <TrendingUp className="w-3.5 h-3.5" /> 총 클릭수 1,280회
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300">
                  TOP 1 인기 링크
                </span>
              </div>
            </div>

            {/* Bento Card 2: 자동 파비콘 인식 */}
            <div className="rounded-3xl bg-zinc-900/60 border border-zinc-800 p-6 sm:p-7 flex flex-col justify-between hover:border-cyan-500/40 transition-all hover:-translate-y-1 group">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-5 border border-cyan-500/20">
                  <Globe className="w-5 h-5" />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">
                  스마트 파비콘 자동 감지
                </h4>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                  URL만 붙여넣으면 유튜브, 노션, 깃허브, 블로그 등 웹사이트의 공식 파비콘 아이콘을 실시간으로 자동 감지하여 예쁘게 입혀줍니다.
                </p>
              </div>

              {/* Mini Graphic */}
              <div className="mt-6 pt-5 border-t border-zinc-800/80 flex items-center gap-2">
                {["youtube.com", "github.com", "instagram.com", "notion.so"].map((domain) => (
                  <div
                    key={domain}
                    className="w-7 h-7 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center"
                    title={domain}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`}
                      alt={domain}
                      className="w-4 h-4 rounded-sm"
                    />
                  </div>
                ))}
                <span className="text-[11px] text-zinc-400 ml-1">자동 감지</span>
              </div>
            </div>

            {/* Bento Card 3: 완벽한 모바일 최적화 */}
            <div className="rounded-3xl bg-zinc-900/60 border border-zinc-800 p-6 sm:p-7 flex flex-col justify-between hover:border-cyan-500/40 transition-all hover:-translate-y-1 group md:col-span-2 lg:col-span-1">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-5 border border-emerald-500/20">
                  <Smartphone className="w-5 h-5" />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">
                  모바일 최적화 9:16 핏
                </h4>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                  인스타그램 바이오, 틱톡, 트위터 프로필 링크를 누른 방문자가 가장 편안하게 볼 수 있도록 모바일 화면 규격에 완벽히 맞춰져 있습니다.
                </p>
              </div>

              {/* Mini Graphic */}
              <div className="mt-6 pt-5 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
                <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 빠른 반응형 로딩
                </span>
                <span className="font-mono text-[11px]">Next.js 16</span>
              </div>
            </div>
          </div>
        </section>

        {/* ================= 4. How It Works (3-Step Guide) ================= */}
        <section className="w-full max-w-6xl px-4 sm:px-8 py-12 sm:py-16 border-t border-zinc-800/80">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-400 mb-2">
              Easy 3 Steps
            </h2>
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              단 3단계면 나만의 링크 완성
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono font-black text-sm flex items-center justify-center mb-4">
                01
              </div>
              <h4 className="text-base font-bold text-white mb-1.5">Google 1초 로그인</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                복잡한 회원가입 절차 없이 Google 계정으로 간편하게 시작하세요.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 font-mono font-black text-sm flex items-center justify-center mb-4">
                02
              </div>
              <h4 className="text-base font-bold text-white mb-1.5">내 채널 링크 추가</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                유튜브, 인스타그램, 블로그 등 내가 보여주고 싶은 URL을 자유롭게 등록하세요.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 font-mono font-black text-sm flex items-center justify-center mb-4">
                03
              </div>
              <h4 className="text-base font-bold text-white mb-1.5">프로필 공유 & 통계 확인</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                나만의 고유 링크를 SNS 바이오에 걸고 실시간 방문자 클릭수를 분석하세요.
              </p>
            </div>
          </div>
        </section>

        {/* ================= 5. Bottom Call To Action ================= */}
        <section className="w-full max-w-5xl px-4 sm:px-8 py-12 sm:py-16">
          <div className="relative rounded-3xl p-8 sm:p-12 overflow-hidden bg-gradient-to-r from-cyan-950/60 via-slate-900 to-indigo-950/60 border border-cyan-500/30 shadow-2xl flex flex-col items-center text-center">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-5 border border-cyan-500/30 shadow-lg shadow-cyan-500/20">
              <Sparkles className="w-6 h-6" />
            </div>

            <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight mb-3">
              지금 나만의 마이링크를 시작하세요
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 max-w-md mb-8">
              단 하나의 프로필 링크로 내 모든 활동과 창작물을 세상에 연결해보세요.
            </p>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoggingIn}
              className="px-8 py-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-950 font-extrabold text-sm sm:text-base shadow-xl shadow-cyan-500/20 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all flex items-center gap-2.5 cursor-pointer disabled:opacity-60"
            >
              <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
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
              <span>Google로 무료 시작하기</span>
            </button>
          </div>
        </section>

        {/* ================= 6. Clean Minimal Footer ================= */}
        <footer className="w-full max-w-6xl px-4 sm:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-500 border-t border-zinc-900 mt-6">
          <div className="flex items-center gap-2">
            <span className="font-bold text-zinc-400">마이링크 MyLink</span>
            <span>·</span>
            <span>모바일 최적화 링크인바이오</span>
          </div>
          <p className="text-[11px]">© MyLink. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
