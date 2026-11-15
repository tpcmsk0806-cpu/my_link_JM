"use client";

import React, { useState } from "react";
import Link from "next/link";
import { UserProfileData, LinkItem } from "@/types";
import { recordLinkClickInFirestore } from "@/lib/firestoreLinks";
import {
  Link2,
  ExternalLink,
  Share2,
  Check,
  User as UserIcon,
  Sparkles,
  MousePointerClick,
} from "lucide-react";

// Google Favicon 서비스 기반 파비콘 URL 추출
const getFaviconUrl = (urlStr: string) => {
  try {
    const trimmed = urlStr?.trim();
    if (!trimmed) return null;
    const candidate =
      trimmed.startsWith("http://") || trimmed.startsWith("https://")
        ? trimmed
        : `https://${trimmed}`;
    const parsed = new URL(candidate);
    if (!parsed.hostname || !parsed.hostname.includes(".")) return null;
    return `https://www.google.com/s2/favicons?domain=${parsed.hostname}&sz=64`;
  } catch {
    return null;
  }
};

interface PublicProfilePageViewProps {
  profile: UserProfileData;
  links: LinkItem[];
}

export default function PublicProfilePageView({
  profile,
  links,
}: PublicProfilePageViewProps) {
  const [copiedToast, setCopiedToast] = useState(false);

  // Link copy handler
  const handleCopy = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (typeof window !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(url);
      }
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2500);
    } catch (err) {
      console.error("복사 오류:", err);
    }
  };

  const activeLinks = links.filter((l) => l.isActive);

  // 로컬 클릭 수 즉시 반영 상태
  const [localClickCounts, setLocalClickCounts] = useState<Record<string, number>>({});

  const handleLinkClick = (linkId: string) => {
    // 1. 화면 즉시 +1 반영
    setLocalClickCounts((prev) => ({
      ...prev,
      [linkId]: (prev[linkId] ?? links.find((l) => l.id === linkId)?.clickCount ?? 0) + 1,
    }));
    // 2. Firestore 누적 저장
    recordLinkClickInFirestore(linkId, profile.userId);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-between bg-gradient-to-b from-slate-950 via-zinc-900 to-black text-white px-4 py-6 transition-colors">
      {/* Toast Notification */}
      {copiedToast && (
        <div className="fixed top-5 z-50 animate-bounce flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-900 text-white text-xs font-bold shadow-2xl border border-white/20">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>링크가 클립보드에 복사되었습니다! 🎉</span>
        </div>
      )}

      {/* Top Header */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between border-b border-white/10 mb-6">
        <Link href="/" className="flex items-center gap-2 group cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Link2 className="w-4 h-4 -rotate-45" />
          </div>
          <span className="font-extrabold text-sm sm:text-base tracking-tight text-white">
            MyLink
          </span>
        </Link>

        <div className="flex items-center gap-2">
          {/* Share Profile Link Button */}
          <button
            type="button"
            onClick={handleCopy}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white transition-all active:scale-95 cursor-pointer"
            title="프로필 링크 복사"
          >
            <Share2 className="w-4 h-4" />
          </button>

          {/* CTA: Create MyLink */}
          <Link
            href="/"
            className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-white text-slate-950 hover:bg-slate-100 transition-all active:scale-95 shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
            <span>나도 만들기</span>
          </Link>
        </div>
      </header>

      {/* Main Profile Container (Compact Mobile Ratio: max-w-md) */}
      <main className="w-full max-w-md px-5 py-4 flex flex-col items-center flex-1 my-auto">
        {/* Profile Avatar */}
        <div className="relative mb-4 group">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden shadow-2xl ring-4 ring-cyan-500/30 bg-zinc-800 flex items-center justify-center">
            {profile.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.avatarUrl}
                alt={profile.displayName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-bold text-3xl text-cyan-400 select-none">
                {profile.displayName?.slice(0, 1) || "U"}
              </div>
            )}
          </div>
        </div>

        {/* Display Name */}
        <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight mb-0.5 text-white text-center">
          {profile.displayName}
        </h1>

        {/* Username Slug */}
        {profile.username && (
          <span className="text-xs font-mono text-cyan-400 opacity-80 mb-2 block text-center">
            @{profile.username}
          </span>
        )}

        {/* Bio */}
        {profile.bio && (
          <p className="text-xs sm:text-sm font-medium leading-relaxed max-w-xs text-zinc-400 text-center break-words px-2 mb-6">
            {profile.bio}
          </p>
        )}

        {/* Links Stack (users/{userId}/links) */}
        <div className="w-full flex flex-col gap-3 my-2">
          {activeLinks.length === 0 ? (
            <div className="py-10 px-4 text-center rounded-2xl border border-dashed border-zinc-800 text-zinc-500 text-xs">
              아직 등록된 공개 링크가 없습니다.
            </div>
          ) : (
            activeLinks.map((link) => {
              const faviconUrl = getFaviconUrl(link.url);
              const currentClicks = localClickCounts[link.id] ?? link.clickCount ?? 0;
              return (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleLinkClick(link.id)}
                  className="w-full py-4 px-5 rounded-2xl bg-zinc-900/90 hover:bg-zinc-800/90 border border-zinc-800/80 hover:border-cyan-500/50 text-white font-semibold text-sm sm:text-base flex items-center justify-between shadow-lg shadow-black/20 hover:shadow-cyan-500/10 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.985] transition-all cursor-pointer"
                >
                  <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                    {faviconUrl ? (
                      <img
                        key={faviconUrl}
                        src={faviconUrl}
                        alt=""
                        className="w-5 h-5 rounded-md object-contain shadow-xs"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : null}
                  </div>
                  <span className="flex-1 text-center truncate px-2 font-bold">
                    {link.title}
                  </span>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span
                      title={`누적 클릭 수: ${currentClicks}회`}
                      className="text-[10px] sm:text-[11px] font-semibold text-zinc-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full flex items-center gap-1"
                    >
                      <MousePointerClick className="w-3 h-3 text-cyan-400" />
                      <span>{currentClicks}회</span>
                    </span>
                    <ExternalLink className="w-4 h-4 text-zinc-500 group-hover:text-cyan-400" />
                  </div>
                </a>
              );
            })
          )}
        </div>
      </main>

      {/* Footer Branding */}
      <footer className="w-full max-w-7xl mx-auto py-6 px-4 flex flex-col items-center justify-center gap-2 border-t border-white/5 mt-8">
        <Link
          href="/"
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-all shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>마이링크로 나만의 링크 만들기</span>
        </Link>
        <p className="text-[10px] text-zinc-600 font-medium tracking-tight">
          © MyLink
        </p>
      </footer>
    </div>
  );
}
