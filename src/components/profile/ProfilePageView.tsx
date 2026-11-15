"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useProfileStore } from "@/lib/store";
import { useIsHydrated } from "@/lib/useIsHydrated";
import { getTheme } from "@/lib/themes";
import { auth, googleProvider } from "@/lib/firebase";
import { onAuthStateChanged, signInWithPopup, signOut, User } from "firebase/auth";
import { useQueryClient } from "@tanstack/react-query";
import { useLinksQuery } from "@/hooks/useLinksQuery";
import { useProfileQuery } from "@/hooks/useProfileQuery";
import ProfileHeader from "./ProfileHeader";
import InlineLinkItem from "./InlineLinkItem";
import QuickEditor from "./QuickEditor";
import AddLinkDialog from "./AddLinkDialog";
import EditProfileModal from "./EditProfileModal";
import LandingPage from "@/components/landing/LandingPage";
import { initUserProfileIfAbsent, getUserProfile } from "@/lib/firestoreProfile";
import {
  Edit3,
  Eye,
  Check,
  Link as LinkIcon,
  Plus,
  RefreshCw,
  LogOut,
  User as UserIcon,
  ChevronDown,
  Copy,
  Settings,
  ExternalLink,
} from "lucide-react";

export default function ProfilePageView() {
  const isHydrated = useIsHydrated();
  const store = useProfileStore();
  const queryClient = useQueryClient();

  // Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const activeUid = currentUser ? currentUser.uid : "anonymous";

  // TanStack Query Cache Hooks
  const { refetch: refetchLinks } = useLinksQuery(activeUid);
  const { refetch: refetchProfile } = useProfileQuery(currentUser?.uid);

  // UI States
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const [copiedToast, setCopiedToast] = useState(false);
  const [addedToastMessage, setAddedToastMessage] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    if (isProfileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileMenuOpen]);

  const theme = getTheme(store.themeId);

  // Active links for visitor mode
  const visibleLinks = isEditMode
    ? store.links
    : store.links.filter((l) => l.isActive);

  // 1. Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsAuthLoading(false);

      if (user) {
        // Logged In: personalized welcome
        setAddedToastMessage(`${user.displayName || "사용자"}님, 반갑습니다! ✨`);
        setTimeout(() => setAddedToastMessage(null), 3000);

        // Firestore users/{userId}/profile 1회성 조회/초기화 (실시간 X)
        initUserProfileIfAbsent(user)
          .then((p) => {
            if (p) {
              store.updateProfile({
                username: p.username,
                displayName: p.displayName,
                bio: p.bio,
                avatarUrl: p.avatarUrl || user.photoURL || store.avatarUrl,
              });
            }
          })
          .catch((err) => console.warn("프로필 초기화 오류:", err));
      }
    });

    return () => unsubscribe();
  }, []);

  // Google Login Handler
  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      console.error("Google 로그인 오류:", err);
      if (
        err.code !== "auth/popup-closed-by-user" &&
        err.code !== "auth/cancelled-popup-request"
      ) {
        alert("Google 로그인 중 오류가 발생했습니다: " + (err.message || err.code));
      }
    }
  };

  // Logout Handler
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setAddedToastMessage("로그아웃되었습니다.");
      setTimeout(() => setAddedToastMessage(null), 2500);
    } catch (err) {
      console.error("로그아웃 오류:", err);
    }
  };

  // Pure Link Copy Handler (순수 링크 복사 & 알림)
  const handleCopyLink = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (typeof window !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(url);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2500);
    } catch (err) {
      console.error("Link copy error:", err);
    }
  };

  // Manual Refresh with TanStack Query Invalidation
  const handleManualRefresh = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    try {
      await Promise.all([
        queryClient.invalidateQueries(),
        refetchLinks(),
        refetchProfile(),
      ]);
      setAddedToastMessage("최신 데이터를 성공적으로 갱신했습니다! ✨");
      setTimeout(() => setAddedToastMessage(null), 2500);
    } catch (err) {
      console.error("Refresh error:", err);
    } finally {
      setTimeout(() => {
        setIsRefreshing(false);
      }, 400);
    }
  };

  const handleLinkClick = (linkId: string, url: string) => {
    store.recordClick(linkId);
  };

  const handleAddSuccess = (newTitle: string) => {
    setAddedToastMessage(`‘${newTitle}’ 링크가 성공적으로 추가되었습니다! 🎉`);
    setTimeout(() => setAddedToastMessage(null), 3000);
  };

  if (!isHydrated || isAuthLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-4 border-cyan-400 border-t-transparent animate-spin" />
          <p className="text-xs font-semibold text-zinc-400">마이링크 연결 중...</p>
        </div>
      </div>
    );
  }

  // 비로그인 상태: 구글 로그인 랜딩페이지 렌더링
  if (!currentUser) {
    return <LandingPage />;
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

      {/* Toast Notification (Link Added / Auth Message) */}
      {addedToastMessage && (
        <div className="fixed top-5 z-50 animate-in fade-in slide-in-from-top-3 duration-300 flex items-center gap-2 px-4 py-2.5 rounded-full bg-cyan-900 text-white text-xs font-bold shadow-2xl border border-cyan-400/40">
          <Check className="w-4 h-4 text-cyan-300" />
          <span>{addedToastMessage}</span>
        </div>
      )}

      {/* Manual refresh indicator */}
      {isRefreshing && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-2 duration-200 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 text-white text-xs font-semibold shadow-2xl backdrop-blur-md border border-white/20 pointer-events-none">
          <RefreshCw className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
          <span>데이터 새로고침 중...</span>
        </div>
      )}

      {/* ================= Top Navigation Header (Full Responsive Wide Bar) ================= */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4 z-30 transition-all duration-300 border-b border-black/5 dark:border-white/10">
        {/* Left: Logo & Quick Refresh */}
        <div className="flex items-center gap-2.5">
          <div className="px-3 py-1.5 rounded-full text-xs sm:text-sm font-extrabold flex items-center gap-1.5 shadow-sm bg-black/10 dark:bg-white/10 backdrop-blur-md">
            <LinkIcon className="w-4 h-4 text-cyan-500" />
            <span className="tracking-tight font-black text-sm sm:text-base">MyLink</span>
          </div>

          {/* Refresh Button */}
          <button
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-full text-xs font-bold flex items-center justify-center bg-black/10 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20 backdrop-blur-md text-current transition-all disabled:opacity-60 cursor-pointer"
            title="최신 데이터 갱신 (새로고침)"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform ${
                isRefreshing ? "animate-spin text-cyan-400" : ""
              }`}
            />
          </button>
        </div>

        {/* Right: Actions & Profile Menu */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Edit Mode Toggle Button */}
          <button
            onClick={() => setIsEditMode(!isEditMode)}
            className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer ${
              isEditMode
                ? "bg-cyan-500 text-black hover:bg-cyan-400 shadow-cyan-500/30"
                : "bg-black/10 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20 backdrop-blur-md text-current"
            }`}
          >
            {isEditMode ? (
              <>
                <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>미리보기</span>
              </>
            ) : (
              <>
                <Edit3 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>편집</span>
              </>
            )}
          </button>

          {/* 내 개인별 공개 페이지 바로가기 버튼 */}
          {currentUser && (
            <Link
              href={`/${encodeURIComponent(store.displayName || store.username || "user")}`}
              target="_blank"
              className="px-3 py-1.5 rounded-full text-xs sm:text-sm font-bold flex items-center gap-1.5 bg-black/10 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20 backdrop-blur-md text-current transition-all shadow-sm active:scale-95 cursor-pointer"
              title="내 개인별 공개 페이지 열기 (새 탭)"
            >
              <span>내 페이지</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </Link>
          )}

          {/* Google Auth Status: [로그인] or [사용자 프로필 드롭다운] */}
          {isAuthLoading ? (
            <div className="w-24 h-8 rounded-full bg-black/5 dark:bg-white/5 animate-pulse" />
          ) : currentUser ? (
            /* ================= Logged In State: Profile Dropdown ================= */
            <div className="relative" ref={profileMenuRef}>
              <button
                type="button"
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-2 bg-black/10 hover:bg-black/15 dark:bg-white/10 dark:hover:bg-white/15 px-3 py-1.5 rounded-full border border-black/5 dark:border-white/15 backdrop-blur-md shadow-sm transition-all cursor-pointer active:scale-95"
                title="내 프로필 메뉴 열기"
              >
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName || "User"}
                    className="w-5 h-5 sm:w-6 sm:h-6 rounded-full object-cover border border-white/40"
                  />
                ) : (
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-cyan-500/20 text-cyan-500 flex items-center justify-center">
                    <UserIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </div>
                )}
                <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate max-w-[100px] sm:max-w-[150px]">
                  {store.displayName || currentUser.displayName || currentUser.email?.split("@")[0] || "사용자"}님
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-current opacity-60 transition-transform duration-200 ${
                    isProfileMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu Modal / Popover */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-zinc-900 shadow-2xl border border-slate-200/80 dark:border-zinc-800 p-2 text-slate-900 dark:text-white z-50 animate-in fade-in slide-in-from-top-2 duration-150 backdrop-blur-xl">
                  {/* 1. User Info Header */}
                  <div className="px-3 py-2.5 mb-1 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-100 dark:border-zinc-700/50">
                    <div className="flex items-center gap-2.5">
                      {currentUser.photoURL ? (
                        <img
                          src={currentUser.photoURL}
                          alt="Profile"
                          className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-zinc-700"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-cyan-500/20 text-cyan-500 flex items-center justify-center font-bold text-sm">
                          {currentUser.displayName?.[0] || "U"}
                        </div>
                      )}
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-extrabold truncate">
                          {store.displayName || currentUser.displayName || "마이링크 회원"}
                        </span>
                        <span className="text-[11px] text-cyan-600 dark:text-cyan-400 font-mono truncate">
                          @{store.username || currentUser.email?.split("@")[0]}
                        </span>
                        <span className="text-[10px] text-slate-400 dark:text-zinc-500 truncate">
                          {currentUser.email}
                        </span>
                      </div>
                    </div>

                    {/* Stats snippet */}
                    <div className="mt-2.5 pt-2 border-t border-slate-200/60 dark:border-zinc-700/60 flex items-center justify-between text-[11px] text-slate-500 dark:text-zinc-400">
                      <span>등록된 링크 <strong className="text-slate-800 dark:text-white">{store.links.length}개</strong></span>
                      <span>총 클릭 <strong className="text-cyan-600 dark:text-cyan-400">{store.links.reduce((acc, l) => acc + (l.clickCount || 0), 0)}회</strong></span>
                    </div>
                  </div>

                  {/* 2. Menu Items: 프로필 수정 / 내 링크 복사 / 내 페이지 미리보기 */}
                  <div className="flex flex-col gap-1 py-1">
                    {/* 프로필 수정 (마이페이지) */}
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditProfileModalOpen(true);
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2.5 hover:bg-slate-100 dark:hover:bg-zinc-800 text-left transition-colors cursor-pointer text-slate-800 dark:text-zinc-100"
                    >
                      <Settings className="w-4 h-4 text-cyan-500 flex-shrink-0" />
                      <div className="flex flex-col">
                        <span>프로필 수정 (마이페이지)</span>
                        <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-normal">
                          아이디, 이름, 소개글 변경
                        </span>
                      </div>
                    </button>

                    {/* 내 공개 페이지 바로가기 (새 탭 이동) */}
                    <Link
                      href={`/${encodeURIComponent(store.displayName || store.username || "user")}`}
                      target="_blank"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="w-full px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between hover:bg-slate-100 dark:hover:bg-zinc-800 text-left transition-colors cursor-pointer text-slate-800 dark:text-zinc-100"
                    >
                      <div className="flex items-center gap-2.5">
                        <ExternalLink className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        <div className="flex flex-col">
                          <span>내 페이지 바로가기</span>
                          <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-mono">
                            /{store.displayName || store.username}
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
                        방문자 뷰
                      </span>
                    </Link>

                    {/* 내 프로필 링크 복사 (순수 클립보드 복사) */}
                    <button
                      type="button"
                      onClick={() => {
                        handleCopyLink();
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2.5 hover:bg-slate-100 dark:hover:bg-zinc-800 text-left transition-colors cursor-pointer"
                    >
                      <Copy className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                      <span>내 링크 복사</span>
                    </button>

                    {/* 내 페이지 미리보기 */}
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditMode(false);
                        setIsProfileMenuOpen(false);
                        setAddedToastMessage("방문자 시점의 미리보기 모드로 전환되었습니다! 📱");
                        setTimeout(() => setAddedToastMessage(null), 2500);
                      }}
                      className="w-full px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2.5 hover:bg-slate-100 dark:hover:bg-zinc-800 text-left transition-colors cursor-pointer"
                    >
                      <Eye className="w-4 h-4 text-cyan-500 flex-shrink-0" />
                      <span>내 페이지 미리보기</span>
                    </button>
                  </div>

                  {/* 3. Divider & Logout Button */}
                  <div className="pt-1 mt-1 border-t border-slate-100 dark:border-zinc-800">
                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        handleSignOut();
                      }}
                      className="w-full px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-left transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-rose-500 flex-shrink-0" />
                      <span>로그아웃</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* ================= Logged Out State: Google로 로그인 ================= */
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold flex items-center gap-1.5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 shadow-sm hover:shadow hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-800 dark:text-white transition-all active:scale-95 cursor-pointer"
              title="Google 계정으로 로그인"
            >
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" viewBox="0 0 24 24">
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
              <span>Google로 로그인</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Content Container (Centered Compact Golden Ratio: max-w-md) */}
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
          displayName={store.displayName || currentUser?.displayName || "사용자"}
          username={store.username || (currentUser?.email?.split("@")[0] || "user")}
          bio={store.bio}
          avatarUrl={currentUser?.photoURL || store.avatarUrl}
          theme={theme}
          socialLinks={store.socialLinks}
        />

        {/* Primary Add Link CTA Button */}
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

        {/* Link Blocks List with Inline Edit & Delete */}
        <div className="w-full flex flex-col gap-3.5 my-2">
          {visibleLinks.length === 0 ? (
            <div className="py-12 px-4 text-center rounded-2xl border border-dashed border-black/15 dark:border-white/15 my-2 w-full">
              <p className="text-sm font-semibold opacity-75 mb-2">
                {currentUser ? `${currentUser.displayName || "사용자"}님의 등록된 링크가 없습니다.` : "등록된 링크가 없습니다."}
              </p>
              <p className="text-xs text-slate-400 dark:text-zinc-500">
                위의 [새 링크 추가하기] 버튼을 눌러 나만의 첫 링크를 등록해보세요!
              </p>
            </div>
          ) : (
            visibleLinks.map((link) => (
              <InlineLinkItem
                key={link.id}
                link={link}
                theme={theme}
                buttonShape={store.buttonShape}
                buttonStyle={store.buttonStyle}
                onLinkClick={handleLinkClick}
                showClickCount={isEditMode}
              />
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

      {/* Edit Profile Modal (마이페이지 프로필 수정) */}
      <EditProfileModal
        open={isEditProfileModalOpen}
        onOpenChange={setIsEditProfileModalOpen}
        onSuccess={(saved) => {
          setAddedToastMessage(`‘${saved.displayName}’ 프로필이 성공적으로 저장되었습니다! 🎉`);
          setTimeout(() => setAddedToastMessage(null), 3000);
        }}
      />

      {/* Footer Branding */}
      <footer className="w-full max-w-7xl mx-auto py-6 px-4 sm:px-8 flex flex-col items-center justify-center gap-2 transition-all duration-300">
        <p className="text-[10px] opacity-40 font-medium tracking-tight">
          MyLink · Powered by Zustand & Next.js
        </p>
      </footer>
    </div>
  );
}
