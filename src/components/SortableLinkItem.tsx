"use client";

import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { updateLinkInFirestore, deleteLinkFromFirestore } from "@/lib/firestoreLinks";
import { validateTitle, validateUrl } from "@/lib/validation";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import { LinkItem } from "@/types";
import {
  GripVertical,
  ExternalLink,
  Trash2,
  MousePointerClick,
  Check,
  Edit2,
  X,
  AlertCircle,
  CheckCircle2,
  Link2,
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

interface SortableLinkItemProps {
  link: LinkItem;
  onUpdate: (id: string, updates: Partial<LinkItem>) => Promise<void> | void;
  onDelete: (id: string) => Promise<void> | void;
}

export default function SortableLinkItem({
  link,
  onUpdate,
  onDelete,
}: SortableLinkItemProps) {
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

  // Disable dnd-kit sortable while editing to prevent accidental drag
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: link.id,
    disabled: isEditing,
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : "auto",
  };

  // Validation
  const titleValidation = validateTitle(editTitle);
  const urlValidation = validateUrl(editUrl);
  const isFormValid = titleValidation.isValid && urlValidation.isValid;

  const showTitleError = (touchedTitle || submitAttempted) && !titleValidation.isValid;
  const showUrlError = (touchedUrl || submitAttempted) && !urlValidation.isValid;

  // Open Edit Mode
  const handleStartEdit = () => {
    setEditTitle(link.title);
    setEditUrl(link.url);
    setTouchedTitle(false);
    setTouchedUrl(false);
    setSubmitAttempted(false);
    setSaveError(null);
    setIsEditing(true);
  };

  // Cancel Edit Mode: Restore original values
  const handleCancelEdit = () => {
    setEditTitle(link.title);
    setEditUrl(link.url);
    setTouchedTitle(false);
    setTouchedUrl(false);
    setSubmitAttempted(false);
    setSaveError(null);
    setIsEditing(false);
  };

  // Save Edit: Validation + Firestore updateDoc
  const handleSaveEdit = async () => {
    setSubmitAttempted(true);

    if (!isFormValid || isSaving) {
      return;
    }

    try {
      setIsSaving(true);
      setSaveError(null);

      const targetTitle = editTitle.trim();
      const targetUrl = urlValidation.formattedUrl;
      const targetUpdatedAt = new Date().toISOString();

      // 1. Direct Firestore updateDoc execution
      try {
        const linkDocRef = doc(db, "users", "anonymous", "links", link.id);
        await updateDoc(linkDocRef, {
          title: targetTitle,
          url: targetUrl,
          updatedAt: targetUpdatedAt,
        });
      } catch (directUpdateErr: any) {
        // Fallback using updateLinkInFirestore (handles create if not found)
        console.warn("Direct updateDoc fallback to updateLinkInFirestore:", directUpdateErr);
        await updateLinkInFirestore(link.id, {
          title: targetTitle,
          url: targetUrl,
          updatedAt: targetUpdatedAt,
        });
      }

      // 2. Propagate to parent state & backend API
      await onUpdate(link.id, {
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

  // Confirm Delete: Firebase deleteDoc + parent onDelete
  const handleConfirmDelete = async () => {
    try {
      setIsDeleting(true);

      // 1. Delete from Firestore
      try {
        await deleteLinkFromFirestore(link.id);
      } catch (fbErr) {
        console.warn("Firestore delete warning:", fbErr);
      }

      // 2. Propagate to parent state & backend API
      await onDelete(link.id);
      setShowDeleteModal(false);
    } catch (err) {
      console.error("Link delete error:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={`group relative bg-zinc-900 border rounded-2xl p-4 transition-all ${
          isDragging
            ? "border-cyan-500 shadow-2xl bg-zinc-800 scale-[1.02] opacity-90"
            : isEditing
            ? "border-cyan-500/70 shadow-lg bg-zinc-900 ring-1 ring-cyan-500/20"
            : "border-zinc-800/80 hover:border-zinc-700 shadow-sm"
        }`}
      >
        {isEditing ? (
          /* ================= Inline Edit Mode UI ================= */
          <div className="flex flex-col gap-3.5 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-xs font-bold text-white">링크 인라인 편집</span>
              </div>
              <button
                type="button"
                onClick={handleCancelEdit}
                disabled={isSaving}
                className="text-zinc-400 hover:text-white p-1 rounded hover:bg-zinc-800 transition-colors"
                title="취소"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Title Input Field with Validation */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1">
                  <span>버튼 제목</span>
                  <span className="text-rose-500">*</span>
                </label>
                <span
                  className={`text-[11px] font-mono transition-colors ${
                    editTitle.length > 40
                      ? "text-rose-500 font-bold"
                      : editTitle.length >= 35
                      ? "text-amber-400"
                      : "text-zinc-500"
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
                  placeholder="예: 2026 포트폴리오 구경하기 🎨"
                  maxLength={45}
                  className={`w-full bg-zinc-950 border rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none transition-all placeholder:text-zinc-600 ${
                    showTitleError
                      ? "border-rose-500 bg-rose-500/5 focus:border-rose-500"
                      : touchedTitle && titleValidation.isValid
                      ? "border-emerald-500/70 focus:border-emerald-400"
                      : "border-zinc-700 focus:border-cyan-500"
                  }`}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  {showTitleError ? (
                    <AlertCircle className="w-4 h-4 text-rose-500" />
                  ) : touchedTitle && titleValidation.isValid ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : null}
                </div>
              </div>

              {showTitleError && (
                <p className="mt-1 text-xs text-rose-400 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{titleValidation.error}</span>
                </p>
              )}
            </div>

            {/* URL Input Field with Validation */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1">
                  <span>목적지 URL</span>
                  <span className="text-rose-500">*</span>
                </label>
                {urlValidation.isValid && urlValidation.isCorrected && (
                  <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-0.5">
                    <Check className="w-3 h-3" /> https:// 자동 적용됨
                  </span>
                )}
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={editUrl}
                  onChange={(e) => setEditUrl(e.target.value)}
                  onBlur={() => setTouchedUrl(true)}
                  disabled={isSaving}
                  placeholder="example.com 또는 https://..."
                  className={`w-full bg-zinc-950 border rounded-xl pl-3.5 pr-8 py-2 text-sm text-white font-mono focus:outline-none transition-all placeholder:text-zinc-600 ${
                    showUrlError
                      ? "border-rose-500 bg-rose-500/5 focus:border-rose-500"
                      : touchedUrl && urlValidation.isValid
                      ? "border-emerald-500/70 focus:border-emerald-400"
                      : "border-zinc-700 focus:border-cyan-500"
                  }`}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  {showUrlError ? (
                    <AlertCircle className="w-4 h-4 text-rose-500" />
                  ) : touchedUrl && urlValidation.isValid ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Link2 className="w-4 h-4 text-zinc-500" />
                  )}
                </div>
              </div>

              {showUrlError && (
                <p className="mt-1 text-xs text-rose-400 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{urlValidation.error}</span>
                </p>
              )}

              {editUrl.trim() && urlValidation.isValid && urlValidation.isCorrected && (
                <p className="mt-1 text-[11px] text-zinc-400">
                  저장될 주소: <span className="font-mono text-cyan-400">{urlValidation.formattedUrl}</span>
                </p>
              )}
            </div>

            {/* Save Error Alert */}
            {saveError && (
              <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{saveError}</span>
              </div>
            )}

            {/* Action Buttons: [취소] [저장] */}
            <div className="flex items-center justify-end gap-2.5 pt-1">
              <button
                type="button"
                onClick={handleCancelEdit}
                disabled={isSaving}
                className="px-3.5 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <X className="w-3.5 h-3.5" />
                <span>취소</span>
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                disabled={!isFormValid || isSaving}
                className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  isFormValid && !isSaving
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-md shadow-cyan-500/20 active:scale-95 cursor-pointer"
                    : "bg-zinc-800 text-zinc-500 opacity-60 cursor-not-allowed"
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
        ) : (
          /* ================= Normal Display Mode ================= */
          <div className="flex items-center gap-3">
            {/* Drag Handle */}
            <button
              type="button"
              {...attributes}
              {...listeners}
              className="text-zinc-500 hover:text-zinc-300 p-1.5 rounded cursor-grab active:cursor-grabbing hover:bg-zinc-800 transition-colors"
              title="드래그하여 순서 변경"
            >
              <GripVertical className="w-5 h-5" />
            </button>

            {/* Favicon */}
            {getFaviconUrl(link.url) && (
              <div className="w-8 h-8 rounded-xl bg-zinc-800/90 border border-zinc-700/60 flex items-center justify-center flex-shrink-0">
                <img
                  src={getFaviconUrl(link.url)!}
                  alt=""
                  className="w-4 h-4 rounded-xs object-contain"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            )}

            {/* Content Area */}
            <div className="flex-1 min-w-0 pr-2">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-white text-sm sm:text-base truncate">
                  {link.title}
                </h3>
                {/* Secondary edit icon next to title */}
                <button
                  type="button"
                  onClick={handleStartEdit}
                  className="text-zinc-500 hover:text-cyan-400 p-1 rounded hover:bg-zinc-800 transition-colors"
                  title="인라인 수정"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-zinc-400 hover:text-cyan-400 truncate flex items-center gap-1 font-mono max-w-sm"
                >
                  <span>{link.url}</span>
                  <ExternalLink className="w-3 h-3 flex-shrink-0" />
                </a>
              </div>
            </div>

            {/* Right Action Group */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              {/* Clicks Pill */}
              <div
                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-zinc-800/80 border border-zinc-700/60 text-xs font-medium text-zinc-300"
                title="총 클릭수"
              >
                <MousePointerClick className="w-3 h-3 text-cyan-400" />
                <span>{link.clickCount.toLocaleString()}</span>
              </div>

              {/* Active Switch Toggle */}
              <label className="relative inline-flex items-center cursor-pointer" title={link.isActive ? "노출 중" : "비노출"}>
                <input
                  type="checkbox"
                  checked={link.isActive}
                  onChange={(e) => onUpdate(link.id, { isActive: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-10 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
              </label>

              {/* Primary Edit Button (Requirement 1) */}
              <button
                type="button"
                onClick={handleStartEdit}
                className="px-2.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700/80 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                title="링크 수정"
              >
                <Edit2 className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">수정</span>
              </button>

              {/* Delete Button (Opens Confirmation Modal) */}
              <button
                type="button"
                onClick={() => setShowDeleteModal(true)}
                className="text-zinc-500 hover:text-red-400 p-2 rounded-xl hover:bg-red-500/10 transition-colors border border-transparent hover:border-red-500/20"
                title="링크 삭제"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal (Requirement 5) */}
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
