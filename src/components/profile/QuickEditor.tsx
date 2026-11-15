"use client";

import React, { useState } from "react";
import { useProfileStore } from "@/lib/store";
import { THEMES } from "@/lib/themes";
import { updateLinkInFirestore, deleteLinkFromFirestore } from "@/lib/firestoreLinks";
import { ButtonShape, ButtonStyle } from "@/types";
import {
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Edit2,
  Check,
  RotateCcw,
  Palette,
  User,
  Link2,
  X,
  ExternalLink,
  RefreshCw,
  Clock,
} from "lucide-react";
import AddLinkDialog from "./AddLinkDialog";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import { validateTitle, validateUrl } from "@/lib/validation";

interface QuickEditorProps {
  onClose: () => void;
  onOpenAddDialog?: () => void;
}

export default function QuickEditor({ onClose, onOpenAddDialog }: QuickEditorProps) {
  const store = useProfileStore();

  const [activeTab, setActiveTab] = useState<"links" | "profile" | "appearance">("links");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Edit link form states
  const [editingLinkId, setEditingLinkId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editUrl, setEditUrl] = useState("");
  const [editTouched, setEditTouched] = useState(false);

  // Delete modal state
  const [deletingLink, setDeletingLink] = useState<{ id: string; title: string; url?: string } | null>(null);

  // Loading states for updates/refreshes
  const [isSavingLink, setIsSavingLink] = useState<string | null>(null);
  const [isDeletingLinkId, setIsDeletingLinkId] = useState<string | null>(null);
  const [isTogglingLinkId, setIsTogglingLinkId] = useState<string | null>(null);

  const isUpdatingAny = Boolean(isSavingLink || isDeletingLinkId || isTogglingLinkId);

  const editTitleVal = validateTitle(editTitle);
  const editUrlVal = validateUrl(editUrl);
  const isEditValid = editTitleVal.isValid && editUrlVal.isValid;

  const startEditLink = (linkId: string, title: string, url: string) => {
    setEditingLinkId(linkId);
    setEditTitle(title);
    setEditUrl(url);
    setEditTouched(false);
  };

  const handleSaveEdit = async (linkId: string) => {
    setEditTouched(true);
    if (!isEditValid) return;

    try {
      setIsSavingLink(linkId);
      const cleanTitle = editTitle.trim();
      const cleanUrl = editUrlVal.formattedUrl;
      const targetUpdatedAt = new Date().toISOString();

      // Firebase Firestore 업데이트
      try {
        await updateLinkInFirestore(linkId, {
          title: cleanTitle,
          url: cleanUrl,
          updatedAt: targetUpdatedAt,
        });
      } catch (fbErr) {
        console.warn("Firestore update warning:", fbErr);
      }

      // 로컬 스토어 업데이트
      store.updateLink(linkId, {
        title: cleanTitle,
        url: cleanUrl,
        updatedAt: targetUpdatedAt,
      });
      setEditingLinkId(null);
    } finally {
      setIsSavingLink(null);
    }
  };

  const handleToggleActive = async (linkId: string, currentActive: boolean) => {
    try {
      setIsTogglingLinkId(linkId);
      try {
        await updateLinkInFirestore(linkId, { isActive: !currentActive });
      } catch (fbErr) {
        console.warn("Firestore toggle warning:", fbErr);
      }
      store.toggleLinkActive(linkId);
    } finally {
      setIsTogglingLinkId(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingLink) return;
    const linkId = deletingLink.id;

    try {
      setIsDeletingLinkId(linkId);
      try {
        await deleteLinkFromFirestore(linkId);
      } catch (fbErr) {
        console.warn("Firestore delete warning:", fbErr);
      }
      store.deleteLink(linkId);
      setDeletingLink(null);
    } finally {
      setIsDeletingLinkId(null);
    }
  };

  const handleReset = () => {
    if (confirm("정말로 모든 설정을 PRD 기본 시드 데이터로 초기화하시겠습니까?")) {
      store.resetToDefault();
      alert("기본값으로 초기화되었습니다.");
    }
  };

  return (
    <div className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl shadow-2xl overflow-hidden transition-all duration-300">
      {/* Editor Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-zinc-800 bg-slate-50/80 dark:bg-zinc-900/80 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-pulse" />
          <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
            실시간 편집 패널
          </h2>
          {isUpdatingAny && (
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 font-semibold flex items-center gap-1 animate-pulse">
              <RefreshCw className="w-3 h-3 animate-spin" />
              <span>업데이트 중...</span>
            </span>
          )}
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-zinc-800 text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
          title="편집기 닫기"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-100 dark:border-zinc-800 text-xs sm:text-sm font-semibold bg-slate-50/50 dark:bg-zinc-950/40">
        <button
          onClick={() => setActiveTab("links")}
          className={`flex-1 py-3 px-2 flex items-center justify-center gap-1.5 border-b-2 transition-all ${
            activeTab === "links"
              ? "border-cyan-500 text-cyan-600 dark:text-cyan-400 bg-white dark:bg-zinc-900"
              : "border-transparent text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Link2 className="w-4 h-4" />
          <span>링크 관리 ({store.links.length})</span>
        </button>
        <button
          onClick={() => setActiveTab("profile")}
          className={`flex-1 py-3 px-2 flex items-center justify-center gap-1.5 border-b-2 transition-all ${
            activeTab === "profile"
              ? "border-cyan-500 text-cyan-600 dark:text-cyan-400 bg-white dark:bg-zinc-900"
              : "border-transparent text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <User className="w-4 h-4" />
          <span>프로필 설정</span>
        </button>
        <button
          onClick={() => setActiveTab("appearance")}
          className={`flex-1 py-3 px-2 flex items-center justify-center gap-1.5 border-b-2 transition-all ${
            activeTab === "appearance"
              ? "border-cyan-500 text-cyan-600 dark:text-cyan-400 bg-white dark:bg-zinc-900"
              : "border-transparent text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>테마 & 스타일</span>
        </button>
      </div>

      {/* Tab Contents */}
      <div className="p-4 sm:p-5 max-h-[60vh] overflow-y-auto space-y-4">
        {/* ==================== 1. LINKS TAB ==================== */}
        {activeTab === "links" && (
          <div className="space-y-4">
            {/* Add Link Section via Dialog */}
            <button
              onClick={() => {
                if (onOpenAddDialog) {
                  onOpenAddDialog();
                } else {
                  setIsAddDialogOpen(true);
                }
              }}
              className="w-full py-3.5 px-4 rounded-2xl border-2 border-dashed border-cyan-400 dark:border-cyan-700 bg-cyan-50/50 dark:bg-cyan-950/20 text-cyan-700 dark:text-cyan-300 font-bold text-sm flex items-center justify-center gap-2 hover:bg-cyan-100/60 dark:hover:bg-cyan-900/40 transition-all active:scale-[0.99] shadow-sm hover:shadow"
            >
              <Plus className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <span>새 링크 추가하기 (다이얼로그)</span>
            </button>

            {/* Add Link Modal Dialog */}
            <AddLinkDialog
              open={isAddDialogOpen}
              onOpenChange={setIsAddDialogOpen}
            />

            {/* Links List */}
            <div className="space-y-2.5">
              {store.links.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400 dark:text-zinc-500">
                  등록된 링크가 없습니다. 위 버튼을 눌러 추가해보세요!
                </div>
              ) : (
                store.links.map((link, index) => {
                  const isEditingThis = editingLinkId === link.id;

                  return (
                    <div
                      key={link.id}
                      className={`p-3 rounded-2xl border transition-all ${
                        link.isActive
                          ? "bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800"
                          : "bg-slate-50 dark:bg-zinc-950/60 border-slate-200/60 dark:border-zinc-800/40 opacity-70"
                      }`}
                    >
                      {isEditingThis ? (
                        /* Edit Mode Form */
                        <div className="space-y-2 p-2 bg-slate-50 dark:bg-zinc-800/60 rounded-xl border border-cyan-500/30">
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[10px] font-bold text-slate-700 dark:text-zinc-300">
                                제목 *
                              </span>
                              <span className="text-[10px] font-mono text-slate-400">
                                {editTitle.length}/40자
                              </span>
                            </div>
                            <input
                              type="text"
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              placeholder="링크 제목"
                              maxLength={45}
                              className={`w-full px-2.5 py-1.5 text-xs rounded-lg border bg-white dark:bg-zinc-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 ${
                                editTouched && !editTitleVal.isValid
                                  ? "border-rose-500 focus:ring-rose-500"
                                  : "border-slate-200 dark:border-zinc-700 focus:ring-cyan-500"
                              }`}
                            />
                            {editTouched && !editTitleVal.isValid && (
                              <p className="text-[10px] text-rose-500 mt-0.5">
                                {editTitleVal.error}
                              </p>
                            )}
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[10px] font-bold text-slate-700 dark:text-zinc-300">
                                URL 주소 *
                              </span>
                              {editUrlVal.isValid && editUrlVal.isCorrected && (
                                <span className="text-[10px] text-emerald-500 font-semibold">
                                  https:// 자동 적용됨
                                </span>
                              )}
                            </div>
                            <input
                              type="text"
                              value={editUrl}
                              onChange={(e) => setEditUrl(e.target.value)}
                              placeholder="example.com 또는 https://..."
                              className={`w-full px-2.5 py-1.5 text-xs font-mono rounded-lg border bg-white dark:bg-zinc-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 ${
                                editTouched && !editUrlVal.isValid
                                  ? "border-rose-500 focus:ring-rose-500"
                                  : "border-slate-200 dark:border-zinc-700 focus:ring-cyan-500"
                              }`}
                            />
                            {editTouched && !editUrlVal.isValid && (
                              <p className="text-[10px] text-rose-500 mt-0.5">
                                {editUrlVal.error}
                              </p>
                            )}
                          </div>

                          <div className="flex justify-end gap-1.5 pt-1">
                            <button
                              type="button"
                              disabled={isSavingLink === link.id}
                              onClick={() => setEditingLinkId(null)}
                              className="px-2.5 py-1 text-[11px] rounded bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 disabled:opacity-50"
                            >
                              취소
                            </button>
                            <button
                              type="button"
                              disabled={isSavingLink === link.id || (editTouched && !isEditValid)}
                              onClick={() => handleSaveEdit(link.id)}
                              className="px-3 py-1 text-[11px] font-semibold rounded bg-cyan-600 hover:bg-cyan-500 text-white flex items-center gap-1 transition-all disabled:opacity-60"
                            >
                              {isSavingLink === link.id ? (
                                <>
                                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                  <span>저장 중...</span>
                                </>
                              ) : (
                                <>
                                  <Check className="w-3 h-3" />
                                  <span>저장</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* Normal Link Item Row */
                        <div className="flex items-center justify-between gap-2">
                          {/* Order Buttons */}
                          <div className="flex flex-col gap-0.5">
                            <button
                              disabled={index === 0}
                              onClick={() => store.moveLink(link.id, "up")}
                              className="p-1 rounded hover:bg-slate-100 dark:hover:bg-zinc-800 disabled:opacity-20 text-slate-500 dark:text-zinc-400"
                              title="위로 이동"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              disabled={index === store.links.length - 1}
                              onClick={() => store.moveLink(link.id, "down")}
                              className="p-1 rounded hover:bg-slate-100 dark:hover:bg-zinc-800 disabled:opacity-20 text-slate-500 dark:text-zinc-400"
                              title="아래로 이동"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Link Title & URL */}
                          <div className="flex-1 min-w-0 px-2">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                                {link.title}
                              </span>
                              {!link.isActive && (
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 font-medium">
                                  숨김
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-400 dark:text-zinc-500 truncate flex items-center gap-1">
                              <span>{link.url}</span>
                              <ExternalLink className="w-2.5 h-2.5 inline" />
                            </p>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-1">
                            {/* Toggle Show/Hide */}
                            <button
                              onClick={() => handleToggleActive(link.id, link.isActive)}
                              disabled={isTogglingLinkId === link.id}
                              className={`p-1.5 rounded-lg transition-colors ${
                                link.isActive
                                  ? "text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                                  : "text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800"
                              }`}
                              title={link.isActive ? "노출 끄기 (숨기기)" : "노출 켜기 (보이기)"}
                            >
                              {isTogglingLinkId === link.id ? (
                                <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                              ) : link.isActive ? (
                                <Eye className="w-4 h-4" />
                              ) : (
                                <EyeOff className="w-4 h-4" />
                              )}
                            </button>

                            {/* Edit Button */}
                            <button
                              onClick={() => startEditLink(link.id, link.title, link.url)}
                              className="p-1.5 rounded-lg text-slate-500 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-white"
                              title="수정하기"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            {/* Delete Button */}
                            <button
                              onClick={() => setDeletingLink({ id: link.id, title: link.title, url: link.url })}
                              disabled={isDeletingLinkId === link.id}
                              className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 disabled:opacity-50"
                              title="삭제하기"
                            >
                              {isDeletingLinkId === link.id ? (
                                <div className="w-3.5 h-3.5 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <Trash2 className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* ==================== 2. PROFILE TAB ==================== */}
        {activeTab === "profile" && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                표시 이름 (Display Name, 최대 30자)
              </label>
              <input
                type="text"
                maxLength={30}
                value={store.displayName}
                onChange={(e) => store.updateProfile({ displayName: e.target.value })}
                placeholder="홍길동 | Tech & Life"
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                한 줄 소개 (Bio, 최대 150자)
              </label>
              <textarea
                rows={2}
                maxLength={150}
                value={store.bio}
                onChange={(e) => store.updateProfile({ bio: e.target.value })}
                placeholder="자신을 자유롭게 소개해보세요!"
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                프로필 아바타 이미지 URL
              </label>
              <input
                type="text"
                value={store.avatarUrl}
                onChange={(e) => store.updateProfile({ avatarUrl: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <p className="text-[11px] text-slate-400 dark:text-zinc-500 mt-1">
                비워둘 경우 표시 이름의 첫 글자로 기본 아바타가 생성됩니다.
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-zinc-800">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white mb-2">
                SNS 소셜 채널 링크 (비워두면 숨겨짐)
              </h3>
              <div className="space-y-2">
                <div>
                  <label className="block text-[11px] font-medium text-slate-500 dark:text-zinc-400">
                    Instagram URL
                  </label>
                  <input
                    type="text"
                    value={store.socialLinks?.instagram || ""}
                    onChange={(e) => store.updateSocialLinks({ instagram: e.target.value })}
                    placeholder="https://instagram.com/username"
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-500 dark:text-zinc-400">
                    YouTube URL
                  </label>
                  <input
                    type="text"
                    value={store.socialLinks?.youtube || ""}
                    onChange={(e) => store.updateSocialLinks({ youtube: e.target.value })}
                    placeholder="https://youtube.com/@channel"
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-500 dark:text-zinc-400">
                    GitHub URL
                  </label>
                  <input
                    type="text"
                    value={store.socialLinks?.github || ""}
                    onChange={(e) => store.updateSocialLinks({ github: e.target.value })}
                    placeholder="https://github.com/username"
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-500 dark:text-zinc-400">
                    Twitter / X URL
                  </label>
                  <input
                    type="text"
                    value={store.socialLinks?.twitter || ""}
                    onChange={(e) => store.updateSocialLinks({ twitter: e.target.value })}
                    placeholder="https://x.com/username"
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-500 dark:text-zinc-400">
                    이메일 주소
                  </label>
                  <input
                    type="text"
                    value={store.socialLinks?.email || ""}
                    onChange={(e) => store.updateSocialLinks({ email: e.target.value })}
                    placeholder="contact@example.com"
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== 3. APPEARANCE TAB ==================== */}
        {activeTab === "appearance" && (
          <div className="space-y-5">
            {/* 6 Curated Themes */}
            <div>
              <label className="block text-xs font-bold text-slate-900 dark:text-white mb-2">
                큐레이션 프리셋 테마 (6종)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {Object.values(THEMES).map((t) => {
                  const isSelected = store.themeId === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => store.updateTheme(t.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all flex flex-col items-start ${
                        isSelected
                          ? "border-cyan-500 ring-2 ring-cyan-500/20 bg-cyan-50/20 dark:bg-cyan-950/30"
                          : "border-slate-200 dark:border-zinc-700 hover:border-slate-300 dark:hover:border-zinc-600 bg-white dark:bg-zinc-800"
                      }`}
                    >
                      {/* Theme color miniature preview */}
                      <div
                        className={`w-full h-8 rounded-lg mb-2 shadow-inner border border-black/10 flex items-center justify-center ${t.bgGradient}`}
                      >
                        <div
                          className="w-12 h-2.5 rounded-full shadow-sm"
                          style={{ backgroundColor: t.cardBg, color: t.cardText }}
                        />
                      </div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white truncate w-full">
                        {t.name.split(" ")[0]}
                      </span>
                      <span className="text-[10px] text-slate-400 dark:text-zinc-400 truncate w-full">
                        {t.name.split("(")[1]?.replace(")", "") || ""}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Button Shape */}
            <div>
              <label className="block text-xs font-bold text-slate-900 dark:text-white mb-2">
                버튼 모서리 형태 (Button Shape)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "pill" as ButtonShape, label: "알약형 (Pill)", previewClass: "rounded-full" },
                  { id: "rounded" as ButtonShape, label: "라운드 (Rounded)", previewClass: "rounded-xl" },
                  { id: "sharp" as ButtonShape, label: "각진형 (Sharp)", previewClass: "rounded-none" },
                ].map((shape) => {
                  const isSelected = store.buttonShape === shape.id;
                  return (
                    <button
                      key={shape.id}
                      type="button"
                      onClick={() => store.updateButtonShape(shape.id)}
                      className={`py-2 px-3 border text-xs font-semibold transition-all flex flex-col items-center gap-1.5 ${shape.previewClass} ${
                        isSelected
                          ? "border-cyan-500 bg-cyan-500 text-white shadow-md shadow-cyan-500/20"
                          : "border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800"
                      }`}
                    >
                      <span>{shape.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Button Style (Fill) */}
            <div>
              <label className="block text-xs font-bold text-slate-900 dark:text-white mb-2">
                버튼 채우기 스타일 (Button Style)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "solid" as ButtonStyle, label: "솔리드 (Solid)", desc: "기본 채우기" },
                  { id: "outline" as ButtonStyle, label: "아웃라인 (Outline)", desc: "외곽선 테두리" },
                  { id: "glass" as ButtonStyle, label: "글래스 (Glass)", desc: "반투명 블러" },
                ].map((style) => {
                  const isSelected = store.buttonStyle === style.id;
                  return (
                    <button
                      key={style.id}
                      type="button"
                      onClick={() => store.updateButtonStyle(style.id)}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        isSelected
                          ? "border-cyan-500 bg-cyan-500 text-white shadow-md shadow-cyan-500/20"
                          : "border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800"
                      }`}
                    >
                      <div className="text-xs font-bold">{style.label}</div>
                      <div className="text-[10px] opacity-75 mt-0.5">{style.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Reset to Default */}
            <div className="pt-4 border-t border-slate-100 dark:border-zinc-800">
              <button
                type="button"
                onClick={handleReset}
                className="w-full py-2.5 px-3 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-rose-100/60 dark:hover:bg-rose-900/40 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>PRD 기본값으로 초기화 (Reset)</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer info */}
      <div className="px-5 py-3 border-t border-slate-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950/40 flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400">
        <span>모든 변경 사항은 브라우저에 즉시 저장됩니다.</span>
        <button
          onClick={onClose}
          className="font-bold text-cyan-600 dark:text-cyan-400 hover:underline"
        >
          완료 및 닫기
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(deletingLink)}
        linkTitle={deletingLink?.title || ""}
        linkUrl={deletingLink?.url || ""}
        isDeleting={Boolean(isDeletingLinkId)}
        onClose={() => {
          if (!isDeletingLinkId) setDeletingLink(null);
        }}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
