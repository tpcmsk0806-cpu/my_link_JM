"use client";

import React, { useState } from "react";
import { LinkItem, ButtonShape, ButtonStyle, ThemeConfig } from "@/types";
import { useProfileStore } from "@/lib/store";
import { doc, updateDoc } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { updateLinkInFirestore, deleteLinkFromFirestore } from "@/lib/firestoreLinks";
import { validateTitle, validateUrl } from "@/lib/validation";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import {
  Edit2,
  Trash2,
  Check,
  X,
  AlertCircle,
  CheckCircle2,
  Link2,
  ExternalLink,
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

interface InlineLinkItemProps {
  link: LinkItem;
  theme: ThemeConfig;
  buttonShape: ButtonShape;
  buttonStyle: ButtonStyle;
  onLinkClick?: (id: string, url: string) => void;
  showClickCount?: boolean;
}

export default function InlineLinkItem({
  link,
  theme,
  buttonShape,
  buttonStyle,
  onLinkClick,
  showClickCount = false,
}: InlineLinkItemProps) {
  const store = useProfileStore();

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(link.title);
  const [editUrl, setEditUrl] = useState(link.url);
  const [touchedTitle, setTouchedTitle] = useState(false);
  const [touchedUrl, setTouchedUrl] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Validation
  const titleValidation = validateTitle(editTitle);
  const urlValidation = validateUrl(editUrl);
  const isFormValid = titleValidation.isValid && urlValidation.isValid;

  // 파비콘 URL
  const faviconUrl = getFaviconUrl(link.url);
  const editFaviconUrl = getFaviconUrl(
    urlValidation.isValid ? urlValidation.formattedUrl : editUrl
  );

  const showTitleError = (touchedTitle || submitAttempted) && !titleValidation.isValid;
  const showUrlError = (touchedUrl || submitAttempted) && !urlValidation.isValid;

  // Start Edit
  const handleStartEdit = () => {
    setEditTitle(link.title);
    setEditUrl(link.url);
    setTouchedTitle(false);
    setTouchedUrl(false);
    setSubmitAttempted(false);
    setSaveError(null);
    setIsEditing(true);
  };

  // Cancel Edit: Restore original values
  const handleCancelEdit = () => {
    setEditTitle(link.title);
    setEditUrl(link.url);
    setTouchedTitle(false);
    setTouchedUrl(false);
    setSubmitAttempted(false);
    setSaveError(null);
    setIsEditing(false);
  };

  // Save Edit: Validation + Firestore updateDoc + Store update
  const handleSaveEdit = async () => {
    setSubmitAttempted(true);
    if (!isFormValid || isSaving) return;

    try {
      setIsSaving(true);
      setSaveError(null);

      const targetTitle = editTitle.trim();
      const targetUrl = urlValidation.formattedUrl;
      const targetUpdatedAt = new Date().toISOString();
      const currentUid = auth.currentUser?.uid || "anonymous";

      // 1. Firebase Firestore updateDoc 실행 (users/{user.uid}/links)
      try {
        const linkDocRef = doc(db, "users", currentUid, "links", link.id);
        await updateDoc(linkDocRef, {
          title: targetTitle,
          url: targetUrl,
          updatedAt: targetUpdatedAt,
        });
      } catch (directUpdateErr: any) {
        console.warn("Direct updateDoc fallback to updateLinkInFirestore:", directUpdateErr);
        await updateLinkInFirestore(
          link.id,
          {
            title: targetTitle,
            url: targetUrl,
            updatedAt: targetUpdatedAt,
          },
          currentUid
        );
      }

      // 2. Zustand Store 업데이트 (화면 즉시 반영)
      store.updateLink(link.id, {
        title: targetTitle,
        url: targetUrl,
        updatedAt: targetUpdatedAt,
      });

      setIsEditing(false);
    } catch (err: any) {
      console.error("Firestore updateDoc error:", err);
      setSaveError(err?.message || "수정 사항 저장 중 오류가 발생했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  // Confirm Delete: Firebase deleteDoc + Store delete
  const handleConfirmDelete = async () => {
    try {
      setIsDeleting(true);
      const currentUid = auth.currentUser?.uid || "anonymous";

      // 1. Firebase Firestore deleteDoc (users/{user.uid}/links)
      try {
        await deleteLinkFromFirestore(link.id, currentUid);
      } catch (fbErr) {
        console.warn("Firestore delete warning:", fbErr);
      }

      // 2. Zustand Store에서 삭제
      store.deleteLink(link.id);
      setShowDeleteModal(false);
    } catch (err) {
      console.error("Link delete error:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  // Shape Class
  const getShapeClass = () => {
    switch (buttonShape) {
      case "pill":
        return "rounded-full";
      case "rounded":
        return "rounded-2xl";
      case "sharp":
        return "rounded-none";
      default:
        return "rounded-2xl";
    }
  };

  // Button Style Class
  const getStyleClass = () => {
    switch (buttonStyle) {
      case "solid":
        return `${theme.cardBg} ${theme.cardBorder || "border border-transparent"}`;
      case "outline":
        if (theme.id === "clean-white") {
          return "bg-transparent border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white";
        }
        if (theme.id === "midnight-dark" || theme.id === "cyber-gaming") {
          return "bg-transparent border-2 border-white/80 text-white hover:bg-white/10";
        }
        if (theme.id === "neo-brutalism") {
          return "bg-white border-2 border-black text-black hover:bg-yellow-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]";
        }
        return "bg-transparent border-2 border-current hover:bg-black/5";
      case "glass":
        return "bg-white/35 dark:bg-black/35 backdrop-blur-md border border-white/40 dark:border-white/15 shadow-md hover:bg-white/45 dark:hover:bg-black/45";
      default:
        return `${theme.cardBg} ${theme.cardBorder || ""}`;
    }
  };

  const isNeoBrutalist = theme.id === "neo-brutalism";

  if (isEditing) {
    return (
      <div
        className={`w-full p-4 bg-white/95 dark:bg-zinc-900/95 border-2 border-cyan-500 shadow-2xl backdrop-blur-md transition-all animate-in fade-in duration-200 ${
          buttonShape === "sharp" ? "rounded-none" : "rounded-3xl"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3 border-b border-slate-200 dark:border-zinc-800 pb-2">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-pulse" />
            <span className="text-xs font-bold text-slate-900 dark:text-white">링크 인라인 수정</span>
          </div>
          <button
            type="button"
            onClick={handleCancelEdit}
            disabled={isSaving}
            className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded transition-colors"
            title="취소"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Title Input Field */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-bold text-slate-800 dark:text-zinc-200 flex items-center gap-1">
              <span>버튼 제목</span>
              <span className="text-rose-500">*</span>
            </label>
            <span
              className={`text-[11px] font-mono transition-colors ${
                editTitle.length > 40
                  ? "text-rose-500 font-bold"
                  : editTitle.length >= 35
                  ? "text-amber-500 font-semibold"
                  : "text-slate-400 dark:text-zinc-500"
              }`}
            >
              {editTitle.length}/40자
            </span>
          </div>
          <div className="relative">
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={() => setTouchedTitle(true)}
              disabled={isSaving}
              maxLength={45}
              placeholder="예: 구글 바로가기"
              className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-white dark:bg-zinc-800/80 text-slate-900 dark:text-white focus:outline-none transition-all placeholder:text-slate-400 ${
                showTitleError
                  ? "border-rose-400 bg-rose-50/20 text-rose-900 dark:text-rose-200 focus:ring-1 focus:ring-rose-400"
                  : touchedTitle && titleValidation.isValid
                  ? "border-emerald-400 bg-emerald-50/10 focus:ring-1 focus:ring-emerald-400"
                  : "border-slate-200 dark:border-zinc-700 focus:ring-1 focus:ring-[#0070d1]"
              }`}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              {showTitleError ? (
                <AlertCircle className="w-4 h-4 text-rose-500 animate-in fade-in" />
              ) : touchedTitle && titleValidation.isValid ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 animate-in fade-in" />
              ) : null}
            </div>
          </div>
          {showTitleError && (
            <p className="mt-1 text-xs text-rose-500 font-medium flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{titleValidation.error}</span>
            </p>
          )}
        </div>

        {/* URL Input Field */}
        <div className="mb-3.5">
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-bold text-slate-800 dark:text-zinc-200 flex items-center gap-1">
              <span>목적지 URL</span>
              <span className="text-rose-500">*</span>
            </label>
            <div className="flex items-center gap-2">
              {editFaviconUrl && (
                <span className="text-[10px] text-[#0070d1] dark:text-[#38bdf8] font-semibold flex items-center gap-1 animate-in fade-in">
                  <img
                    key={editFaviconUrl}
                    src={editFaviconUrl}
                    alt=""
                    className="w-3.5 h-3.5 rounded-xs object-contain"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = "none";
                    }}
                  />
                  <span>파비콘 감지됨</span>
                </span>
              )}
              {urlValidation.isValid && urlValidation.isCorrected && (
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-0.5">
                  <Check className="w-3 h-3" /> https:// 자동 적용됨
                </span>
              )}
            </div>
          </div>
          <div className="relative">
            {/* Left Favicon / Link icon */}
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center w-5 h-5">
              {editFaviconUrl ? (
                <img
                  key={editFaviconUrl}
                  src={editFaviconUrl}
                  alt=""
                  className="w-4 h-4 rounded-xs object-contain"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                  }}
                />
              ) : (
                <Link2 className="w-4 h-4 text-slate-400 dark:text-zinc-500" />
              )}
            </div>
            <input
              type="text"
              value={editUrl}
              onChange={(e) => setEditUrl(e.target.value)}
              onBlur={() => setTouchedUrl(true)}
              disabled={isSaving}
              placeholder="example.com 또는 https://..."
              className={`w-full pl-10 pr-8 py-2.5 text-sm font-mono rounded-xl border bg-white dark:bg-zinc-800/80 text-slate-900 dark:text-white focus:outline-none transition-all placeholder:text-slate-400 ${
                showUrlError
                  ? "border-rose-400 bg-rose-50/20 text-rose-900 dark:text-rose-200 focus:ring-1 focus:ring-rose-400"
                  : touchedUrl && urlValidation.isValid
                  ? "border-emerald-400 bg-emerald-50/10 focus:ring-1 focus:ring-emerald-400"
                  : "border-slate-200 dark:border-zinc-700 focus:ring-1 focus:ring-[#0070d1]"
              }`}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              {showUrlError ? (
                <AlertCircle className="w-4 h-4 text-rose-500 animate-in fade-in" />
              ) : touchedUrl && urlValidation.isValid ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 animate-in fade-in" />
              ) : null}
            </div>
          </div>
          {showUrlError && (
            <p className="mt-1 text-xs text-rose-500 font-medium flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{urlValidation.error}</span>
            </p>
          )}
          {editUrl.trim() && urlValidation.isValid && urlValidation.isCorrected && (
            <p className="mt-1 text-[11px] text-slate-500 dark:text-zinc-400">
              저장될 주소: <span className="font-mono text-[#0070d1] font-semibold">{urlValidation.formattedUrl}</span>
            </p>
          )}
        </div>

        {/* Error Alert */}
        {saveError && (
          <div className="p-2.5 mb-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{saveError}</span>
          </div>
        )}

        {/* Actions: [취소] [저장] */}
        <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-100 dark:border-zinc-800">
          <button
            type="button"
            onClick={handleCancelEdit}
            disabled={isSaving}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 transition-colors disabled:opacity-50"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleSaveEdit}
            disabled={!isFormValid || isSaving}
            className={`px-4 py-2 text-xs font-bold rounded-xl text-white transition-all flex items-center gap-1.5 ${
              isFormValid && !isSaving
                ? "bg-[#0070d1] hover:bg-[#0064b7] active:bg-[#004d8d] shadow-md shadow-[#0070d1]/30 active:scale-95 cursor-pointer"
                : "bg-slate-300 dark:bg-zinc-700 text-slate-400 dark:text-zinc-500 opacity-60 cursor-not-allowed"
            }`}
          >
            {isSaving ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>저장 중...</span>
              </>
            ) : (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>저장</span>
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Unified Link Card with Embedded [Edit] & [Delete] Buttons */}
      <div
        className={`group relative w-full py-3.5 px-4 sm:px-5 flex items-center justify-between font-semibold text-sm sm:text-base transition-all duration-200 ${getShapeClass()} ${getStyleClass()} ${
          isNeoBrutalist
            ? "hover:-translate-y-0.5 active:translate-y-0.5"
            : "hover:scale-[1.01] shadow-sm hover:shadow-md"
        }`}
        style={{
          color: buttonStyle === "solid" ? theme.cardText : undefined,
        }}
      >
        {/* Left balance spacer & favicon */}
        <div className="w-8 sm:w-9 flex items-center justify-start flex-shrink-0 pl-1">
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
          ) : (
            <div className="w-5" />
          )}
        </div>

        {/* Center Main Link Anchor */}
        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            if (onLinkClick) onLinkClick(link.id, link.url);
          }}
          className="flex-1 min-w-0 text-center font-medium tracking-tight hover:underline flex items-center justify-center py-0.5 cursor-pointer"
          title={`${link.title} 바로가기 (${link.url})`}
        >
          <div className="flex items-center justify-center gap-1.5 max-w-full">
            <span className="truncate max-w-[85%]">{link.title}</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-40 group-hover:opacity-80 transition-opacity flex-shrink-0" />
          </div>
        </a>

        {/* Right Embedded Actions: [Click Count] + [Edit] & [Delete] inside the Card */}
        <div className="flex items-center gap-1.5 flex-shrink-0 z-10 pl-1">
          {/* Click Count Pill */}
          {showClickCount && (
            <span
              title={`누적 클릭 수: ${link.clickCount ?? 0}회`}
              className="text-[10px] sm:text-[11px] font-semibold opacity-75 px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10 flex items-center gap-1 select-none hover:opacity-100 transition-opacity"
            >
              <MousePointerClick className="w-3 h-3 opacity-70" />
              <span>{link.clickCount ?? 0}회</span>
            </span>
          )}

          {/* Edit Button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleStartEdit();
            }}
            className="p-1.5 sm:p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/15 active:scale-90 transition-all flex items-center justify-center text-cyan-600 dark:text-cyan-400 opacity-80 hover:opacity-100"
            title="이 링크 수정하기"
          >
            <Edit2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2]" />
          </button>

          {/* Delete Button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowDeleteModal(true);
            }}
            className="p-1.5 sm:p-2 rounded-full hover:bg-rose-500/15 active:scale-90 transition-all flex items-center justify-center text-rose-500 opacity-80 hover:opacity-100"
            title="이 링크 삭제하기"
          >
            <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2]" />
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        linkTitle={link.title}
        linkUrl={link.url}
        isDeleting={isDeleting}
        onClose={() => {
          if (!isDeleting) setShowDeleteModal(false);
        }}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
