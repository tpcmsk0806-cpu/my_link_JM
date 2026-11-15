"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import PhoneMockup from "@/components/PhoneMockup";
import SortableLinkItem from "@/components/SortableLinkItem";
import { THEMES } from "@/lib/themes";
import { Profile, LinkItem, ButtonShape, ButtonStyle, AnalyticsSummary } from "@/types";
import { validateTitle, validateUrl } from "@/lib/validation";
import {
  Link2,
  ExternalLink,
  Copy,
  Plus,
  Palette,
  User,
  BarChart2,
  Layers,
  LogOut,
  Sparkles,
  Smartphone,
  Eye,
  MousePointerClick,
  Percent,
  Check,
  Mail,
  X,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Instagram, Youtube, Github, Twitter, Linkedin } from "@/components/SocialIcons";

export default function DashboardPage() {
  const router = useRouter();

  // State
  const [profile, setProfile] = useState<Profile | null>(null);
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsSummary>({
    totalViews: 0,
    totalClicks: 0,
    ctr: 0,
  });

  const [activeTab, setActiveTab] = useState<"links" | "profile" | "themes" | "analytics">("links");
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isAddingLink, setIsAddingLink] = useState(false);

  // New Link inputs & validation states
  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [addTouchedTitle, setAddTouchedTitle] = useState(false);
  const [addTouchedUrl, setAddTouchedUrl] = useState(false);
  const [addAttempted, setAddAttempted] = useState(false);

  const addTitleVal = validateTitle(newTitle);
  const addUrlVal = validateUrl(newUrl);
  const isAddFormValid = addTitleVal.isValid && addUrlVal.isValid;

  // Sensors for Drag & Drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Fetch initial profile & links
  useEffect(() => {
    async function loadData() {
      try {
        const profileRes = await fetch("/api/profile");
        if (!profileRes.ok) {
          router.push("/login");
          return;
        }
        const profileData = await profileRes.json();
        setProfile(profileData.profile);
        if (profileData.analytics) {
          setAnalytics(profileData.analytics);
        }

        const linksRes = await fetch(`/api/links?profileId=${profileData.profile.id}`);
        const linksData = await linksRes.json();
        if (linksData.links) {
          setLinks(linksData.links);
        }
      } catch (err) {
        console.error("Dashboard load error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [router]);

  // Copy Profile URL
  const handleCopyLink = () => {
    if (!profile) return;
    const url = `${window.location.origin}/${profile.username}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Add Link
  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddAttempted(true);
    if (!profile || !isAddFormValid || isAddingLink) return;

    try {
      setIsAddingLink(true);
      setIsSyncing(true);
      const res = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profileId: profile.id,
          title: newTitle.trim(),
          url: addUrlVal.formattedUrl,
        }),
      });

      const data = await res.json();
      if (data.link) {
        setLinks((prev) => [...prev, data.link]);
        setNewTitle("");
        setNewUrl("");
        setAddTouchedTitle(false);
        setAddTouchedUrl(false);
        setAddAttempted(false);
        setShowAddModal(false);
      }
    } catch (err) {
      console.error("Add link error:", err);
    } finally {
      setIsAddingLink(false);
      setIsSyncing(false);
    }
  };

  // Update Link
  const handleUpdateLink = async (id: string, updates: Partial<LinkItem>) => {
    // Optimistic update
    setLinks((prev) =>
      prev.map((l) => (l.id === id ? { ...l, ...updates } : l))
    );

    try {
      setIsSyncing(true);
      await fetch("/api/links", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, updates }),
      });
    } catch (err) {
      console.error("Update link error:", err);
    } finally {
      setIsSyncing(false);
    }
  };

  // Delete Link
  const handleDeleteLink = async (id: string) => {
    setLinks((prev) => prev.filter((l) => l.id !== id));

    try {
      setIsSyncing(true);
      await fetch(`/api/links?id=${id}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.error("Delete link error:", err);
    } finally {
      setIsSyncing(false);
    }
  };

  // Drag End for Reordering
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id || !profile) return;

    const oldIndex = links.findIndex((item) => item.id === active.id);
    const newIndex = links.findIndex((item) => item.id === over.id);

    const reordered = arrayMove(links, oldIndex, newIndex);
    setLinks(reordered);

    try {
      setIsSyncing(true);
      await fetch("/api/links", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profileId: profile.id,
          linkIds: reordered.map((l) => l.id),
        }),
      });
    } catch (err) {
      console.error("Reorder error:", err);
    } finally {
      setIsSyncing(false);
    }
  };

  // Update Profile
  const handleUpdateProfile = async (updates: Partial<Profile>) => {
    if (!profile) return;
    setProfile((prev) => (prev ? { ...prev, ...updates } : prev));

    try {
      await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: profile.id, updates }),
      });
    } catch (err) {
      console.error("Profile update error:", err);
    }
  };

  // Logout
  const handleLogout = async () => {
    await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "logout" }),
    });
    router.push("/");
  };

  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-zinc-400 text-sm">마이링크 대시보드를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
                <Link2 className="w-4 h-4 -rotate-45" />
              </div>
              <span className="font-extrabold text-base tracking-tight text-white hidden sm:inline">
                마이링크
              </span>
            </Link>

            {/* Public Link Pill */}
            <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-full px-3 py-1.5 text-xs text-zinc-300">
              <span className="text-zinc-500">mylink.io/</span>
              <span className="font-semibold text-white">{profile.username}</span>
              <button
                onClick={handleCopyLink}
                className="hover:text-cyan-400 p-0.5 ml-1 transition-colors"
                title="링크 복사"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <Link
                href={`/${profile.username}`}
                target="_blank"
                className="hover:text-cyan-400 p-0.5 transition-colors"
                title="내 링크 페이지 열기"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Syncing Loading Indicator */}
            {isSyncing && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-950/60 border border-cyan-800 text-cyan-400 text-xs font-medium animate-pulse">
                <RefreshCw className="w-3 h-3 animate-spin" />
                <span>갱신 중...</span>
              </div>
            )}
          </div>

          {/* Quick Analytics Summary */}
          <div className="hidden lg:flex items-center gap-6 text-xs">
            <div className="flex items-center gap-1.5 text-zinc-400">
              <Eye className="w-3.5 h-3.5 text-zinc-500" />
              <span>총 조회수:</span>
              <span className="font-bold text-white">{analytics.totalViews.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1.5 text-zinc-400">
              <MousePointerClick className="w-3.5 h-3.5 text-cyan-400" />
              <span>총 클릭수:</span>
              <span className="font-bold text-white">{analytics.totalClicks.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1.5 text-zinc-400">
              <Percent className="w-3.5 h-3.5 text-emerald-400" />
              <span>평균 클릭률:</span>
              <span className="font-bold text-emerald-400">{analytics.ctr}%</span>
            </div>
          </div>

          {/* Logout */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowMobilePreview(true)}
              className="lg:hidden px-3 py-1.5 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-semibold flex items-center gap-1.5"
            >
              <Smartphone className="w-3.5 h-3.5" /> 미리보기
            </button>
            <button
              onClick={handleLogout}
              className="text-zinc-400 hover:text-red-400 p-2 rounded-lg hover:bg-zinc-900 transition-colors"
              title="로그아웃"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Split Content */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Control Panel (7 cols on Desktop) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Dashboard Navigation Tabs */}
          <div className="flex items-center gap-2 p-1.5 bg-zinc-900 border border-zinc-800 rounded-2xl">
            <button
              onClick={() => setActiveTab("links")}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === "links"
                  ? "bg-zinc-800 text-white shadow-md border border-zinc-700/60"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>링크 관리 ({links.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("profile")}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === "profile"
                  ? "bg-zinc-800 text-white shadow-md border border-zinc-700/60"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <User className="w-4 h-4 text-blue-400" />
              <span>프로필 설정</span>
            </button>

            <button
              onClick={() => setActiveTab("themes")}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === "themes"
                  ? "bg-zinc-800 text-white shadow-md border border-zinc-700/60"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Palette className="w-4 h-4 text-purple-400" />
              <span>테마 & 디자인</span>
            </button>

            <button
              onClick={() => setActiveTab("analytics")}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === "analytics"
                  ? "bg-zinc-800 text-white shadow-md border border-zinc-700/60"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <BarChart2 className="w-4 h-4 text-emerald-400" />
              <span>통계</span>
            </button>
          </div>

          {/* TAB 1: LINKS */}
          {activeTab === "links" && (
            <div className="flex flex-col gap-4">
              {/* Add Link Button */}
              <button
                onClick={() => setShowAddModal(true)}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-xl shadow-cyan-500/20 flex items-center justify-center gap-2 active:scale-98 transition-all"
              >
                <Plus className="w-5 h-5" />
                <span>새 링크 추가하기</span>
              </button>

              {/* DnD Sortable Links List */}
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={links.map((l) => l.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="flex flex-col gap-3">
                    {links.length === 0 ? (
                      <div className="p-12 text-center border border-dashed border-zinc-800 rounded-3xl text-zinc-500">
                        <Layers className="w-8 h-8 mx-auto mb-3 opacity-40" />
                        <p className="font-medium text-sm">아직 등록된 링크가 없습니다.</p>
                        <p className="text-xs text-zinc-600 mt-1">
                          상단의 '새 링크 추가하기'를 눌러 첫 링크를 등록하세요!
                        </p>
                      </div>
                    ) : (
                      links.map((link) => (
                        <SortableLinkItem
                          key={link.id}
                          link={link}
                          onUpdate={handleUpdateLink}
                          onDelete={handleDeleteLink}
                        />
                      ))
                    )}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
          )}

          {/* TAB 2: PROFILE */}
          {activeTab === "profile" && (
            <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-6 sm:p-8 flex flex-col gap-6">
              <div>
                <h2 className="text-lg font-bold text-white mb-1">프로필 정보</h2>
                <p className="text-xs text-zinc-400">
                  방문자들에게 노출될 사진, 이름, 한 줄 소개를 설정하세요.
                </p>
              </div>

              {/* Avatar URL */}
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-2">
                  프로필 아바타 이미지 URL
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-zinc-800 border-2 border-zinc-700 flex-shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={profile.avatarUrl}
                      alt={profile.displayName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <input
                    type="url"
                    value={profile.avatarUrl}
                    onChange={(e) => handleUpdateProfile({ avatarUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Display Name */}
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
                  표시 이름 (Display Name)
                </label>
                <input
                  type="text"
                  maxLength={30}
                  value={profile.displayName}
                  onChange={(e) => handleUpdateProfile({ displayName: e.target.value })}
                  placeholder="예: 홍길동 | 크리에이터"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
                  한 줄 소개 (Bio)
                </label>
                <textarea
                  rows={3}
                  maxLength={150}
                  value={profile.bio}
                  onChange={(e) => handleUpdateProfile({ bio: e.target.value })}
                  placeholder="자신을 소개하는 문구를 입력하세요 (최대 150자)"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 resize-none"
                />
                <span className="text-[11px] text-zinc-500 block text-right">
                  {profile.bio?.length || 0}/150자
                </span>
              </div>

              <div className="h-[1px] bg-zinc-800 my-1" />

              {/* Social Channels */}
              <div>
                <h3 className="text-sm font-bold text-white mb-1">소셜 미디어 아이콘 바</h3>
                <p className="text-xs text-zinc-400 mb-4">
                  프로필 상단에 노출될 SNS 링크 URL을 입력하세요.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="text-xs text-zinc-400 flex items-center gap-1.5 mb-1">
                      <Instagram className="w-3.5 h-3.5 text-pink-400" /> Instagram
                    </label>
                    <input
                      type="url"
                      value={profile.socialLinks?.instagram || ""}
                      onChange={(e) =>
                        handleUpdateProfile({
                          socialLinks: { ...profile.socialLinks, instagram: e.target.value },
                        })
                      }
                      placeholder="https://instagram.com/..."
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-zinc-400 flex items-center gap-1.5 mb-1">
                      <Youtube className="w-3.5 h-3.5 text-red-500" /> YouTube
                    </label>
                    <input
                      type="url"
                      value={profile.socialLinks?.youtube || ""}
                      onChange={(e) =>
                        handleUpdateProfile({
                          socialLinks: { ...profile.socialLinks, youtube: e.target.value },
                        })
                      }
                      placeholder="https://youtube.com/@..."
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-zinc-400 flex items-center gap-1.5 mb-1">
                      <Github className="w-3.5 h-3.5 text-white" /> GitHub
                    </label>
                    <input
                      type="url"
                      value={profile.socialLinks?.github || ""}
                      onChange={(e) =>
                        handleUpdateProfile({
                          socialLinks: { ...profile.socialLinks, github: e.target.value },
                        })
                      }
                      placeholder="https://github.com/..."
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-zinc-400 flex items-center gap-1.5 mb-1">
                      <Twitter className="w-3.5 h-3.5 text-sky-400" /> Twitter / X
                    </label>
                    <input
                      type="url"
                      value={profile.socialLinks?.twitter || ""}
                      onChange={(e) =>
                        handleUpdateProfile({
                          socialLinks: { ...profile.socialLinks, twitter: e.target.value },
                        })
                      }
                      placeholder="https://x.com/..."
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-zinc-400 flex items-center gap-1.5 mb-1">
                      <Linkedin className="w-3.5 h-3.5 text-blue-500" /> LinkedIn
                    </label>
                    <input
                      type="url"
                      value={profile.socialLinks?.linkedin || ""}
                      onChange={(e) =>
                        handleUpdateProfile({
                          socialLinks: { ...profile.socialLinks, linkedin: e.target.value },
                        })
                      }
                      placeholder="https://linkedin.com/in/..."
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-zinc-400 flex items-center gap-1.5 mb-1">
                      <Mail className="w-3.5 h-3.5 text-amber-400" /> Email
                    </label>
                    <input
                      type="email"
                      value={profile.socialLinks?.email?.replace("mailto:", "") || ""}
                      onChange={(e) =>
                        handleUpdateProfile({
                          socialLinks: {
                            ...profile.socialLinks,
                            email: e.target.value ? `mailto:${e.target.value}` : "",
                          },
                        })
                      }
                      placeholder="contact@example.com"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: THEMES & DESIGN */}
          {activeTab === "themes" && (
            <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-6 sm:p-8 flex flex-col gap-8">
              {/* Presets Grid */}
              <div>
                <h2 className="text-lg font-bold text-white mb-1">프리셋 테마 선택</h2>
                <p className="text-xs text-zinc-400 mb-5">
                  클릭하면 우측 모바일 프리뷰에 실시간으로 반영됩니다.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                  {Object.values(THEMES).map((theme) => (
                    <div
                      key={theme.id}
                      onClick={() => handleUpdateProfile({ themeId: theme.id })}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col items-center text-center ${
                        profile.themeId === theme.id
                          ? "border-cyan-500 bg-zinc-800/90 shadow-lg shadow-cyan-500/20 scale-[1.02]"
                          : "border-zinc-800 bg-zinc-950/60 hover:border-zinc-700"
                      }`}
                    >
                      <div
                        className={`w-full h-20 rounded-xl mb-2.5 flex flex-col items-center justify-center p-2 bg-gradient-to-b ${theme.previewBg} border border-white/10`}
                      >
                        <div className="w-5 h-5 rounded-full bg-white/40 mb-1" />
                        <div className="w-10 h-1.5 rounded-full bg-white/50 mb-1" />
                        <div className="w-14 h-2.5 rounded-md bg-black/20" />
                      </div>
                      <h4 className="text-xs font-bold text-white truncate w-full mb-0.5">
                        {theme.name.split(" ")[0]}
                      </h4>
                      <span className="text-[10px] text-zinc-500 line-clamp-1">
                        {theme.description}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Button Shape */}
              <div className="border-t border-zinc-800 pt-6">
                <h3 className="text-sm font-bold text-white mb-1">버튼 형태</h3>
                <p className="text-xs text-zinc-400 mb-3">링크 버튼의 모서리 곡률을 지정합니다.</p>

                <div className="grid grid-cols-3 gap-3">
                  {(
                    [
                      { id: "pill", label: "알약형 (Pill)", previewClass: "rounded-full" },
                      { id: "rounded", label: "라운드형 (Rounded)", previewClass: "rounded-xl" },
                      { id: "sharp", label: "각진형 (Sharp)", previewClass: "rounded-none" },
                    ] as const
                  ).map((shape) => (
                    <button
                      key={shape.id}
                      type="button"
                      onClick={() => handleUpdateProfile({ buttonShape: shape.id as ButtonShape })}
                      className={`p-3 rounded-xl border text-center text-xs font-semibold flex flex-col items-center gap-2 transition-all ${
                        profile.buttonShape === shape.id
                          ? "border-cyan-500 bg-cyan-500/10 text-cyan-300"
                          : "border-zinc-800 bg-zinc-950 hover:border-zinc-700 text-zinc-400"
                      }`}
                    >
                      <div className={`w-16 h-5 bg-zinc-700 border border-zinc-600 ${shape.previewClass}`} />
                      <span>{shape.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Button Style */}
              <div className="border-t border-zinc-800 pt-6">
                <h3 className="text-sm font-bold text-white mb-1">버튼 채우기 스타일</h3>
                <p className="text-xs text-zinc-400 mb-3">배경 채우기 및 테두리 방식을 선택합니다.</p>

                <div className="grid grid-cols-3 gap-3">
                  {(
                    [
                      { id: "solid", label: "솔리드 (Solid)", desc: "꽉 찬 배경" },
                      { id: "outline", label: "아웃라인 (Outline)", desc: "선 스타일" },
                      { id: "glass", label: "글래스 (Glass)", desc: "반투명 블러" },
                    ] as const
                  ).map((style) => (
                    <button
                      key={style.id}
                      type="button"
                      onClick={() => handleUpdateProfile({ buttonStyle: style.id as ButtonStyle })}
                      className={`p-3 rounded-xl border text-center text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
                        profile.buttonStyle === style.id
                          ? "border-cyan-500 bg-cyan-500/10 text-cyan-300"
                          : "border-zinc-800 bg-zinc-950 hover:border-zinc-700 text-zinc-400"
                      }`}
                    >
                      <span>{style.label}</span>
                      <span className="text-[10px] text-zinc-500">{style.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ANALYTICS */}
          {activeTab === "analytics" && (
            <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-6 sm:p-8 flex flex-col gap-6">
              <div>
                <h2 className="text-lg font-bold text-white mb-1">방문자 및 클릭 통계</h2>
                <p className="text-xs text-zinc-400">
                  내 링크 페이지의 유입과 클릭 반응을 분석합니다.
                </p>
              </div>

              {/* Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-zinc-400 mb-3">
                    <span className="text-xs font-medium">총 페이지 조회수</span>
                    <Eye className="w-4 h-4 text-cyan-400" />
                  </div>
                  <span className="text-3xl font-extrabold text-white">
                    {analytics.totalViews.toLocaleString()}
                  </span>
                </div>

                <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-zinc-400 mb-3">
                    <span className="text-xs font-medium">총 링크 클릭수</span>
                    <MousePointerClick className="w-4 h-4 text-blue-400" />
                  </div>
                  <span className="text-3xl font-extrabold text-white">
                    {analytics.totalClicks.toLocaleString()}
                  </span>
                </div>

                <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-zinc-400 mb-3">
                    <span className="text-xs font-medium">평균 클릭률 (CTR)</span>
                    <Percent className="w-4 h-4 text-emerald-400" />
                  </div>
                  <span className="text-3xl font-extrabold text-emerald-400">
                    {analytics.ctr}%
                  </span>
                </div>
              </div>

              {/* Per-Link Breakdown */}
              <div className="mt-4">
                <h3 className="text-sm font-bold text-white mb-3">링크별 클릭 수</h3>
                <div className="flex flex-col gap-2.5">
                  {links.length === 0 ? (
                    <p className="text-xs text-zinc-500">등록된 링크가 없습니다.</p>
                  ) : (
                    links.map((link) => {
                      const linkCtr =
                        analytics.totalViews > 0
                          ? ((link.clickCount / analytics.totalViews) * 100).toFixed(1)
                          : "0.0";

                      return (
                        <div
                          key={link.id}
                          className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800/80 flex items-center justify-between"
                        >
                          <div className="min-w-0 pr-4">
                            <h4 className="text-sm font-semibold text-white truncate">
                              {link.title}
                            </h4>
                            <p className="text-xs text-zinc-500 font-mono truncate">{link.url}</p>
                          </div>
                          <div className="flex items-center gap-4 flex-shrink-0 text-right">
                            <div>
                              <div className="text-sm font-bold text-white">
                                {link.clickCount.toLocaleString()} 회
                              </div>
                              <div className="text-[10px] text-zinc-500">CTR {linkCtr}%</div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Phone Mockup (5 cols on Desktop) */}
        <div className="hidden lg:block lg:col-span-5 sticky top-24">
          <div className="flex flex-col items-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] font-semibold text-zinc-400 mb-4">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>실시간 모바일 스마트폰 프리뷰</span>
            </div>
            <PhoneMockup profile={profile} links={links} />
          </div>
        </div>
      </div>

      {/* Mobile Live Preview Modal */}
      {showMobilePreview && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col justify-end lg:hidden">
          <div className="w-full bg-zinc-900 rounded-t-[32px] p-6 max-h-[90vh] overflow-y-auto flex flex-col items-center relative">
            <button
              onClick={() => setShowMobilePreview(false)}
              className="absolute top-5 right-5 text-zinc-400 hover:text-white p-2"
            >
              <X className="w-6 h-6" />
            </button>
            <h3 className="text-sm font-bold text-zinc-300 mb-4">모바일 미리보기</h3>
            <PhoneMockup profile={profile} links={links} />
          </div>
        </div>
      )}

      {/* Add Link Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-5 right-5 text-zinc-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-1">새 링크 추가</h3>
            <p className="text-xs text-zinc-400 mb-6">
              방문자에게 보여줄 제목과 연결할 웹사이트 주소를 입력하세요.
            </p>

            <form onSubmit={handleAddLink} className="flex flex-col gap-4" noValidate>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1">
                    <span>버튼 제목</span>
                    <span className="text-rose-500">*</span>
                  </label>
                  <span
                    className={`text-[11px] font-mono transition-colors ${
                      newTitle.length > 40
                        ? "text-rose-500 font-bold"
                        : newTitle.length >= 35
                        ? "text-amber-400"
                        : "text-zinc-500"
                    }`}
                  >
                    {newTitle.length}/40자
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    onBlur={() => setAddTouchedTitle(true)}
                    placeholder="예: 2026 포트폴리오 구경하기 🎨"
                    maxLength={45}
                    className={`w-full bg-zinc-950 border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-all placeholder:text-zinc-600 ${
                      (addTouchedTitle || addAttempted) && !addTitleVal.isValid
                        ? "border-rose-500 bg-rose-500/5 focus:border-rose-500"
                        : addTouchedTitle && addTitleVal.isValid
                        ? "border-emerald-500/70 focus:border-emerald-400"
                        : "border-zinc-800 focus:border-cyan-500"
                    }`}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    {(addTouchedTitle || addAttempted) && !addTitleVal.isValid ? (
                      <AlertCircle className="w-4 h-4 text-rose-500" />
                    ) : addTouchedTitle && addTitleVal.isValid ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : null}
                  </div>
                </div>
                {(addTouchedTitle || addAttempted) && !addTitleVal.isValid && (
                  <p className="mt-1 text-xs text-rose-400 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{addTitleVal.error}</span>
                  </p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1">
                    <span>URL 주소</span>
                    <span className="text-rose-500">*</span>
                  </label>
                  {addUrlVal.isValid && addUrlVal.isCorrected && (
                    <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-0.5">
                      <Check className="w-3 h-3" /> https:// 자동 적용됨
                    </span>
                  )}
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    onBlur={() => setAddTouchedUrl(true)}
                    placeholder="example.com 또는 https://..."
                    className={`w-full bg-zinc-950 border rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none transition-all placeholder:text-zinc-600 ${
                      (addTouchedUrl || addAttempted) && !addUrlVal.isValid
                        ? "border-rose-500 bg-rose-500/5 focus:border-rose-500"
                        : addTouchedUrl && addUrlVal.isValid
                        ? "border-emerald-500/70 focus:border-emerald-400"
                        : "border-zinc-800 focus:border-cyan-500"
                    }`}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    {(addTouchedUrl || addAttempted) && !addUrlVal.isValid ? (
                      <AlertCircle className="w-4 h-4 text-rose-500" />
                    ) : addTouchedUrl && addUrlVal.isValid ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Link2 className="w-4 h-4 text-zinc-500" />
                    )}
                  </div>
                </div>
                {(addTouchedUrl || addAttempted) && !addUrlVal.isValid && (
                  <p className="mt-1 text-xs text-rose-400 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{addUrlVal.error}</span>
                  </p>
                )}
                {newUrl.trim() && addUrlVal.isValid && addUrlVal.isCorrected && (
                  <p className="mt-1 text-[11px] text-zinc-400">
                    저장될 주소: <span className="font-mono text-cyan-400">{addUrlVal.formattedUrl}</span>
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setNewTitle("");
                    setNewUrl("");
                    setAddTouchedTitle(false);
                    setAddTouchedUrl(false);
                    setAddAttempted(false);
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold text-sm transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={!isAddFormValid || isAddingLink}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-60 text-white font-semibold text-sm shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                >
                  {isAddingLink ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>추가 중...</span>
                    </>
                  ) : (
                    <span>링크 추가하기</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
