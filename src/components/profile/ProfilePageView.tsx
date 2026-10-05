"use client";

import React, { useState } from "react";
import { useProfileStore } from "@/lib/store";
import { useIsHydrated } from "@/lib/useIsHydrated";
import { getTheme } from "@/lib/themes";
import ProfileHeader from "./ProfileHeader";
import LinkCard from "./LinkCard";
import QuickEditor from "./QuickEditor";
import AddLinkDialog from "./AddLinkDialog";
import {
  Share2,
  Edit3,
  Eye,
  Sparkles,
  Check,
  Link as LinkIcon,
  Plus,
} from "lucide-react";

export default function ProfilePageView() {
  const isHydrated = useIsHydrated();
  const store = useProfileStore();

  const [isEditMode, setIsEditMode] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [copiedToast, setCopiedToast] = useState(false);
  const [addedToastMessage, setAddedToastMessage] = useState<string | null>(null);

  const theme = getTheme(store.themeId);

  // Active links for visitor mode
  const visibleLinks = isEditMode
    ? store.links
    : store.links.filter((l) => l.isActive);

  // Share handler
  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (typeof window !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: `${store.displayName} | 마이링크`,
          text: store.bio,
          url: url,
        });
        return;
      } catch (err) {
        // Fallback to clipboard
      }
    }

    if (typeof window !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2500);
    }
  };

  const handleLinkClick = (linkId: string, url: string) => {
    store.recordClick(linkId);
  };

  const handleAddSuccess = (newTitle: string) => {
    setAddedToastMessage(`‘${newTitle}’ 링크가 로컬 상태에 추가되었습니다! 🎉`);
    setTimeout(() => setAddedToastMessage(null), 3000);
  };

  if (!isHydrated) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-zinc-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full border-4 border-cyan-500 border-t-transparent animate-spin" />
          <p className="text-xs font-semibold text-slate-500">마이링크 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen w-full flex flex-col items-center justify-between transition-colors duration-300 ${theme.bgGradient}`}
      style={{
        backgroundColor: theme.bgColor,
        color: theme.textColor,
      }}
    >
      {/* Toast Notification (Copy URL) */}
      {copiedToast && (
        <div className="fixed top-5 z-50 animate-bounce flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-900 text-white text-xs font-bold shadow-2xl border border-white/20">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>링크가 클립보드에 복사되었습니다! 🎉</span>
        </div>
      )}

      {/* Toast Notification (Link Added) */}
      {addedToastMessage && (
        <div className="fixed top-5 z-50 animate-in fade-in slide-in-from-top-3 duration-300 flex items-center gap-2 px-4 py-2.5 rounded-full bg-cyan-900 text-white text-xs font-bold shadow-2xl border border-cyan-400/40">
          <Check className="w-4 h-4 text-cyan-300" />
          <span>{addedToastMessage}</span>
        </div>
      )}

      {/* Top Floating Control Bar */}
      <header className="w-full max-w-md px-4 pt-4 pb-2 flex items-center justify-between z-30">
        <div className="flex items-center gap-2">
          <div className="px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm bg-black/10 dark:bg-white/10 backdrop-blur-md">
            <LinkIcon className="w-3.5 h-3.5 text-cyan-500" />
            <span className="tracking-tight">MyLink</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Quick Add Link Button in Header */}
          <button
            onClick={() => setIsAddDialogOpen(true)}
            className="px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 bg-[#0070d1] hover:bg-[#0064b7] active:bg-[#004d8d] text-white shadow-sm shadow-[#0070d1]/25 active:scale-95 transition-all"
            title="새 링크 추가하기 다이얼로그 열기"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span className="hidden sm:inline">링크 추가</span>
            <span className="sm:hidden">추가</span>
          </button>

          {/* Edit Mode Toggle Button */}
          <button
            onClick={() => setIsEditMode(!isEditMode)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm active:scale-95 ${
              isEditMode
                ? "bg-cyan-500 text-black hover:bg-cyan-400 shadow-cyan-500/30"
                : "bg-black/10 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20 backdrop-blur-md text-current"
            }`}
          >
            {isEditMode ? (
              <>
                <Eye className="w-3.5 h-3.5" />
                <span>미리보기</span>
              </>
            ) : (
              <>
                <Edit3 className="w-3.5 h-3.5" />
                <span>편집 모드</span>
              </>
            )}
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            aria-label="공유하기"
            className="w-8 h-8 rounded-full flex items-center justify-center bg-black/10 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20 backdrop-blur-md transition-all text-current shadow-sm active:scale-95"
            title="프로필 공유하기"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Main Content Container (Mobile-first width: max-w-md) */}
      <main className="w-full max-w-md px-5 py-4 flex flex-col items-center flex-1">
        {/* Quick Editor Panel (When in Edit Mode) */}
        {isEditMode && (
          <div className="w-full mb-6 animate-in fade-in slide-in-from-top-4 duration-300">
            <QuickEditor
              onClose={() => setIsEditMode(false)}
              onOpenAddDialog={() => setIsAddDialogOpen(true)}
            />
          </div>
        )}

        {/* Profile Header */}
        <ProfileHeader
          displayName={store.displayName}
          username={store.username}
          bio={store.bio}
          avatarUrl={store.avatarUrl}
          theme={theme}
          socialLinks={store.socialLinks}
        />

        {/* Primary Add Link CTA Button (Relocated to top & Styled with Primary Color) */}
        <div className="w-full mb-3">
          <button
            type="button"
            onClick={() => setIsAddDialogOpen(true)}
            className={`w-full py-4 px-5 flex items-center justify-center gap-2.5 font-bold text-sm sm:text-base text-white bg-[#0070d1] hover:bg-[#0064b7] active:bg-[#004d8d] transition-all duration-200 shadow-lg shadow-[#0070d1]/30 hover:shadow-xl hover:shadow-[#0070d1]/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.985] cursor-pointer ${
              store.buttonShape === "pill"
                ? "rounded-full"
                : store.buttonShape === "sharp"
                ? "rounded-none"
                : "rounded-2xl"
            }`}
          >
            <div className="w-5 h-5 rounded-full bg-white/25 flex items-center justify-center">
              <Plus className="w-3.5 h-3.5 text-white stroke-[3]" />
            </div>
            <span>새 링크 추가하기</span>
          </button>
        </div>

        {/* Link Blocks List */}
        <div className="w-full flex flex-col gap-3.5 my-2">
          {visibleLinks.length === 0 ? (
            <div className="py-12 px-4 text-center rounded-2xl border border-dashed border-black/15 dark:border-white/15 my-2">
              <p className="text-sm font-semibold opacity-75 mb-2">
                등록된 링크가 없습니다.
              </p>
              <p className="text-xs text-slate-400 dark:text-zinc-500">
                위의 [새 링크 추가하기] 버튼을 눌러 첫 번째 링크를 등록해보세요!
              </p>
            </div>
          ) : (
            visibleLinks.map((link) => (
              <div key={link.id} className="relative group w-full">
                <LinkCard
                  link={link}
                  theme={theme}
                  buttonShape={store.buttonShape}
                  buttonStyle={store.buttonStyle}
                  onLinkClick={handleLinkClick}
                  showClickCount={isEditMode}
                />
                {isEditMode && !link.isActive && (
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-white shadow pointer-events-none">
                    숨김 상태
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </main>

      {/* Global Add Link Dialog */}
      <AddLinkDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSuccess={handleAddSuccess}
      />

      {/* Footer Branding */}
      <footer className="w-full max-w-md py-6 px-4 flex flex-col items-center justify-center gap-2">
        <a
          href="/"
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md opacity-80 hover:opacity-100 hover:scale-105 active:scale-95 transition-all shadow-sm ${theme.badgeBg}`}
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
          <span>마이링크로 나만의 링크 만들기</span>
        </a>
        <p className="text-[10px] opacity-40 font-medium tracking-tight">
          MyLink · Powered by Zustand & Next.js
        </p>
      </footer>
    </div>
  );
}
