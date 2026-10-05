"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import PhoneMockup from "@/components/PhoneMockup";
import { THEMES } from "@/lib/themes";
import { Profile, LinkItem } from "@/types";
import {
  ArrowRight,
  Sparkles,
  MousePointerClick,
  Layers,
  Palette,
  BarChart3,
  Smartphone,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";

const DEMO_PROFILE: Profile = {
  id: "profile-alex-1",
  userId: "user-alex-1",
  username: "alex",
  displayName: "Alex | Tech Creator",
  bio: "개발, 생산성, 테크 리뷰를 만듭니다 🚀 YouTube 50k · Blog 100k",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
  themeId: "cyber-gaming",
  buttonShape: "pill",
  buttonStyle: "solid",
  socialLinks: {
    youtube: "https://youtube.com",
    github: "https://github.com",
    twitter: "https://x.com",
    instagram: "https://instagram.com",
    email: "mailto:alex@example.com",
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const DEMO_LINKS: LinkItem[] = [
  {
    id: "l-1",
    profileId: "profile-alex-1",
    title: "유튜브 최신 영상 보러가기 🎬",
    url: "https://youtube.com",
    orderIndex: 0,
    isActive: true,
    clickCount: 1420,
    createdAt: new Date().toISOString(),
  },
  {
    id: "l-2",
    profileId: "profile-alex-1",
    title: "개발 블로그 (Next.js & AI 가이드) 💻",
    url: "https://velog.io",
    orderIndex: 1,
    isActive: true,
    clickCount: 980,
    createdAt: new Date().toISOString(),
  },
  {
    id: "l-3",
    profileId: "profile-alex-1",
    title: "GitHub 오픈소스 프로젝트 ⭐",
    url: "https://github.com",
    orderIndex: 2,
    isActive: true,
    clickCount: 654,
    createdAt: new Date().toISOString(),
  },
  {
    id: "l-4",
    profileId: "profile-alex-1",
    title: "위클리 테크 뉴스레터 무료 구독 📬",
    url: "https://substack.com",
    orderIndex: 3,
    isActive: true,
    clickCount: 312,
    createdAt: new Date().toISOString(),
  },
];

export default function LandingPage() {
  const router = useRouter();
  const [handle, setHandle] = useState("");
  const [selectedTheme, setSelectedTheme] = useState("cyber-gaming");

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (handle.trim()) {
      router.push(`/signup?username=${encodeURIComponent(handle.trim())}`);
    } else {
      router.push("/signup");
    }
  };

  const previewProfile: Profile = {
    ...DEMO_PROFILE,
    themeId: selectedTheme,
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col selection:bg-cyan-500 selection:text-black">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-12 pb-24 md:pt-20 md:pb-32 overflow-hidden border-b border-white/10">
        {/* Ambient Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-cyan-600/30 to-blue-600/20 blur-[130px] pointer-events-none rounded-full" />

        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Left Hero Copy */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-800/60 text-xs font-semibold text-cyan-300 mb-6 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>차세대 모바일 링크인바이오 서비스</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] mb-6">
              세상의 모든 나를, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500">
                단 하나의 링크
              </span>
              로 연결하세요.
            </h1>

            <p className="text-base sm:text-lg text-zinc-400 max-w-xl mb-8 leading-relaxed">
              인스타그램, 유튜브, 깃허브, 쇼핑몰까지. 당신의 모든 채널을 모바일 최적화된 링크 페이지로 통합하세요. 실시간 미리보기와 드래그 앤 드롭으로 1분 만에 완성됩니다.
            </p>

            {/* Handle Claim Form */}
            <form
              onSubmit={handleStart}
              className="w-full max-w-md p-1.5 rounded-2xl bg-zinc-900 border border-zinc-700/80 shadow-2xl flex flex-col sm:flex-row gap-2 mb-6"
            >
              <div className="flex-1 flex items-center px-3.5 py-2">
                <span className="text-zinc-500 font-medium text-sm">mylink.io/</span>
                <input
                  type="text"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  placeholder="yourname"
                  className="w-full bg-transparent text-white font-medium text-sm placeholder:text-zinc-600 focus:outline-none pl-1"
                />
              </div>
              <button
                type="submit"
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-sm px-6 py-3 rounded-xl shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-1.5 transition-all active:scale-95 whitespace-nowrap"
              >
                <span>무료로 시작하기</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="flex items-center gap-6 text-xs text-zinc-500">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" /> 전 기능 100% 무료
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" /> 실시간 모바일 프리뷰
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" /> 간편 링크 분석
              </span>
            </div>
          </div>

          {/* Right Hero Interactive Preview */}
          <div className="lg:col-span-5 flex flex-col items-center">
            {/* Interactive Theme Switcher for Live Demo */}
            <div className="mb-4 flex items-center gap-2 p-1.5 bg-zinc-900/90 border border-zinc-800 rounded-full backdrop-blur-md shadow-lg">
              <span className="text-xs text-zinc-400 pl-3 pr-1 font-medium flex items-center gap-1">
                <Palette className="w-3.5 h-3.5 text-cyan-400" /> 실시간 테마 체험:
              </span>
              <div className="flex gap-1">
                {Object.values(THEMES).map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTheme(t.id)}
                    className={`px-2.5 py-1 text-xs rounded-full font-medium transition-all ${
                      selectedTheme === t.id
                        ? "bg-cyan-500 text-black font-bold shadow-md"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    {t.name.split(" ")[0]}
                  </button>
                ))}
              </div>
            </div>

            <PhoneMockup profile={previewProfile} links={DEMO_LINKS} />
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section id="features" className="py-24 bg-zinc-950/70 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2">
              WHY MYLINK
            </h2>
            <p className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">
              직관적이고 강력한 기능으로 <br /> 링크 관리가 즐거워집니다
            </p>
            <p className="text-zinc-400 text-sm sm:text-base">
              복잡한 설정 없이 몇 번의 클릭만으로 나만의 개성을 담은 링크 페이지를 완성하세요.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 rounded-3xl bg-zinc-900/60 border border-zinc-800 hover:border-cyan-500/40 transition-all hover:shadow-xl hover:shadow-cyan-500/5 group">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 transition-transform">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                실시간 모바일 프리뷰
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                링크를 수정하거나 순서를 바꿀 때마다 우측의 스마트폰 목업에 즉시 반영됩니다. 방문자가 보게 될 화면을 그대로 확인하세요.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-3xl bg-zinc-900/60 border border-zinc-800 hover:border-blue-500/40 transition-all hover:shadow-xl hover:shadow-blue-500/5 group">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                드래그 앤 드롭 순서 변경
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                가장 강조하고 싶은 중요한 링크를 상단으로 마우스나 터치로 가볍게 끌어다 놓으세요. 온/오프 토글로 즉시 숨길 수도 있습니다.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-3xl bg-zinc-900/60 border border-zinc-800 hover:border-purple-500/40 transition-all hover:shadow-xl hover:shadow-purple-500/5 group">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                클릭률 & 방문자 통계
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                페이지 총 조회수, 링크별 누적 클릭수, CTR(클릭률)을 대시보드에서 실시간으로 확인하고 어떤 콘텐츠가 인기 있는지 분석하세요.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Preset Themes Showcase Section */}
      <section id="themes" className="py-24 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2">
              CURATED THEMES
            </h2>
            <p className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">
              당신의 개성을 표현하는 6가지 테마
            </p>
            <p className="text-zinc-400 text-sm sm:text-base">
              미니멀 라이트부터 감각적인 사이버 게이밍, 볼드한 네오 브루탈리즘까지 클릭 한 번으로 무드를 변경할 수 있습니다.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Object.values(THEMES).map((theme) => (
              <div
                key={theme.id}
                onClick={() => setSelectedTheme(theme.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col items-center text-center ${
                  selectedTheme === theme.id
                    ? "border-cyan-500 bg-zinc-900 shadow-lg shadow-cyan-500/20 scale-105"
                    : "border-zinc-800 bg-zinc-900/40 hover:border-zinc-700"
                }`}
              >
                <div
                  className={`w-full h-24 rounded-xl mb-3 flex flex-col items-center justify-center p-2 bg-gradient-to-b ${theme.previewBg} border border-white/10 shadow-inner`}
                >
                  <div className="w-6 h-6 rounded-full bg-white/40 mb-1.5 shadow-sm" />
                  <div className="w-12 h-2 rounded-full bg-white/50 mb-1" />
                  <div className="w-16 h-3 rounded-lg bg-black/20" />
                </div>
                <h4 className="text-xs font-bold text-white truncate w-full mb-1">
                  {theme.name.split(" ")[0]}
                </h4>
                <span className="text-[11px] text-zinc-500 line-clamp-1">
                  {theme.name.split("(")[1]?.replace(")", "") || ""}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-20 relative overflow-hidden bg-gradient-to-b from-zinc-950 to-black">
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-6 tracking-tight">
            지금 바로 나만의 <span className="text-cyan-400">마이링크</span>를 만들어보세요
          </h2>
          <p className="text-zinc-400 text-base sm:text-lg mb-8 max-w-xl mx-auto">
            회원가입은 30초면 충분합니다. 누구나 손쉽게 제작하고 무료로 공유할 수 있습니다.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-base shadow-xl shadow-cyan-500/20 hover:scale-105 active:scale-95 transition-all"
            >
              무료로 시작하기
            </Link>
            <Link
              href="/alex"
              target="_blank"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 font-semibold text-base transition-all flex items-center justify-center gap-2"
            >
              <span>데모 프로필 둘러보기</span>
              <ExternalLink className="w-4 h-4 text-zinc-400" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-white/10 text-center text-xs text-zinc-600">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 MyLink (마이링크). All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-zinc-400">개인정보처리방침</Link>
            <Link href="/terms" className="hover:text-zinc-400">이용약관</Link>
            <Link href="/alex" className="hover:text-cyan-400">데모 페이지</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
