"use client";

import React, { useState, useId } from "react";
import { useProfileStore } from "@/lib/store";
import { getTheme } from "@/lib/themes";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import LinkCard from "./LinkCard";
import { LinkItem } from "@/types";
import {
  Link2,
  Plus,
  Sparkles,
  Check,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Info,
} from "lucide-react";

interface AddLinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (newLinkTitle: string) => void;
}

const EMOJI_PRESETS = [
  "🛍️", "📺", "💻", "📝", "☕", "🎨", "⭐", "🚀", "🔗", "📸", "💬", "💼"
];

// Validation Helper Functions
function validateTitle(rawTitle: string): { isValid: boolean; error?: string } {
  const trimmed = rawTitle.trim();
  if (!trimmed) {
    return { isValid: false, error: "버튼 제목을 입력해주세요." };
  }
  if (trimmed.length < 2) {
    return { isValid: false, error: "제목은 최소 2자 이상 입력해주세요." };
  }
  if (trimmed.length > 40) {
    return { isValid: false, error: "제목은 최대 40자까지 입력 가능합니다." };
  }
  return { isValid: true };
}

function validateUrl(rawUrl: string): {
  isValid: boolean;
  formattedUrl: string;
  error?: string;
  isCorrected?: boolean;
} {
  const trimmed = rawUrl.trim();
  if (!trimmed) {
    return { isValid: false, formattedUrl: "", error: "연결할 URL 주소를 입력해주세요." };
  }

  if (/\s/.test(trimmed)) {
    return { isValid: false, formattedUrl: "", error: "URL에는 공백이 포함될 수 없습니다." };
  }

  // mailto check
  if (trimmed.startsWith("mailto:")) {
    const email = trimmed.replace("mailto:", "");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        isValid: false,
        formattedUrl: "",
        error: "올바른 이메일 주소(예: mailto:name@domain.com)를 입력해주세요.",
      };
    }
    return { isValid: true, formattedUrl: trimmed, isCorrected: false };
  }

  // Auto-prepend https:// if missing
  let withProto = trimmed;
  let isCorrected = false;
  if (!/^https?:\/\//i.test(trimmed)) {
    withProto = `https://${trimmed}`;
    isCorrected = true;
  }

  try {
    const parsed = new URL(withProto);
    const hostname = parsed.hostname;
    // Hostname must contain at least one dot or be localhost
    const domainRegex = /^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;

    if (!domainRegex.test(hostname) && hostname !== "localhost") {
      return {
        isValid: false,
        formattedUrl: "",
        error: "올바른 웹 도메인 주소(예: example.com)를 입력해주세요.",
      };
    }

    return { isValid: true, formattedUrl: withProto, isCorrected };
  } catch {
    return { isValid: false, formattedUrl: "", error: "올바른 웹 주소 형식이 아닙니다." };
  }
}

export default function AddLinkDialog({
  open,
  onOpenChange,
  onSuccess,
}: AddLinkDialogProps) {
  const store = useProfileStore();
  const theme = getTheme(store.themeId);

  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  // Touched state to trigger error display after user interactions
  const [touchedTitle, setTouchedTitle] = useState(false);
  const [touchedUrl, setTouchedUrl] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  // Validation results
  const titleValidation = validateTitle(title);
  const urlValidation = validateUrl(url);

  // Duplicate URL check warning
  const isDuplicateUrl =
    urlValidation.isValid &&
    store.links.some(
      (l) => l.url.toLowerCase() === urlValidation.formattedUrl.toLowerCase()
    );

  const isFormValid = titleValidation.isValid && urlValidation.isValid;

  const showTitleError = (touchedTitle || submitAttempted) && !titleValidation.isValid;
  const showUrlError = (touchedUrl || submitAttempted) && !urlValidation.isValid;

  const handleEmojiSelect = (emoji: string) => {
    setTouchedTitle(true);
    if (!title) {
      setTitle(`${emoji} `);
    } else {
      setTitle(`${emoji} ${title}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);

    if (!isFormValid) {
      return;
    }

    // Add link to Zustand local store (persisted to localStorage)
    store.addLink(title.trim(), urlValidation.formattedUrl);

    // Reset form states
    resetForm();
    onOpenChange(false);

    if (onSuccess) {
      onSuccess(title.trim());
    }
  };

  const resetForm = () => {
    setTitle("");
    setUrl("");
    setTouchedTitle(false);
    setTouchedUrl(false);
    setSubmitAttempted(false);
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  // Live preview link card object
  const previewLink: LinkItem = {
    id: "preview-link",
    profileId: "profile-1",
    title: title.trim() || "버튼 제목 미리보기",
    url: urlValidation.isValid ? urlValidation.formattedUrl : "https://example.com",
    orderIndex: 0,
    isActive: true,
    clickCount: 0,
    createdAt: new Date().toISOString(),
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent onClose={handleClose} className="sm:max-w-md">
        <DialogHeader>
          <div className="w-10 h-10 rounded-2xl bg-[#0070d1]/10 text-[#0070d1] flex items-center justify-center mb-2 shadow-sm">
            <Plus className="w-5 h-5 stroke-[2.5]" />
          </div>
          <DialogTitle>새 링크 추가하기</DialogTitle>
          <DialogDescription>
            방문자에게 안내할 링크의 제목과 목적지 주소를 입력하세요.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* ================= Title Input ================= */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-800 dark:text-zinc-200 flex items-center gap-1">
                <span>버튼 제목</span>
                <span className="text-rose-500">*</span>
              </label>
              {/* Character counter */}
              <span
                className={`text-[11px] font-medium transition-colors ${
                  title.length > 40
                    ? "text-rose-500 font-bold"
                    : title.length >= 35
                    ? "text-amber-500 font-semibold"
                    : "text-slate-400 dark:text-zinc-500"
                }`}
              >
                {title.length}/40자
              </span>
            </div>

            <div className="relative">
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
                onBlur={() => setTouchedTitle(true)}
                placeholder="예: 🛍️ 2026 다이어리 마켓"
                maxLength={45}
                className={`w-full px-3.5 py-2.5 text-sm rounded-xl border transition-all placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 ${
                  showTitleError
                    ? "border-rose-400 bg-rose-50/20 text-rose-900 dark:text-rose-200 focus:ring-rose-400 focus:border-rose-400"
                    : touchedTitle && titleValidation.isValid
                    ? "border-emerald-400 bg-emerald-50/10 text-slate-900 dark:text-white focus:ring-emerald-400 focus:border-emerald-400"
                    : "border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800/70 text-slate-900 dark:text-white focus:ring-[#0070d1]"
                }`}
              />

              {/* Status Icon */}
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                {showTitleError ? (
                  <AlertCircle className="w-4 h-4 text-rose-500 animate-in fade-in" />
                ) : touchedTitle && titleValidation.isValid ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 animate-in fade-in" />
                ) : null}
              </div>
            </div>

            {/* Title Error Message */}
            {showTitleError && (
              <p className="mt-1.5 text-xs text-rose-500 font-medium flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{titleValidation.error}</span>
              </p>
            )}

            {/* Quick Emoji Bar */}
            <div className="mt-2 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
              <span className="text-[11px] text-slate-400 dark:text-zinc-500 shrink-0 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" /> 추천:
              </span>
              {EMOJI_PRESETS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => handleEmojiSelect(emoji)}
                  className="px-1.5 py-0.5 rounded-lg hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors shrink-0 text-sm active:scale-95"
                  title="이모지 삽입"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* ================= URL Input ================= */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-800 dark:text-zinc-200 flex items-center gap-1">
                <span>목적지 URL</span>
                <span className="text-rose-500">*</span>
              </label>
              {urlValidation.isValid && urlValidation.isCorrected && (
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-0.5">
                  <Check className="w-3 h-3" /> https:// 자동 적용됨
                </span>
              )}
            </div>

            <div className="relative">
              <input
                type="text"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                }}
                onBlur={() => setTouchedUrl(true)}
                placeholder="example.com 또는 https://..."
                className={`w-full pl-3.5 pr-8 py-2.5 text-sm rounded-xl border transition-all placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 ${
                  showUrlError
                    ? "border-rose-400 bg-rose-50/20 text-rose-900 dark:text-rose-200 focus:ring-rose-400 focus:border-rose-400"
                    : touchedUrl && urlValidation.isValid
                    ? "border-emerald-400 bg-emerald-50/10 text-slate-900 dark:text-white focus:ring-emerald-400 focus:border-emerald-400"
                    : "border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800/70 text-slate-900 dark:text-white focus:ring-[#0070d1]"
                }`}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                {showUrlError ? (
                  <AlertCircle className="w-4 h-4 text-rose-500 animate-in fade-in" />
                ) : touchedUrl && urlValidation.isValid ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 animate-in fade-in" />
                ) : (
                  <Link2 className="w-4 h-4 text-slate-400 dark:text-zinc-500" />
                )}
              </div>
            </div>

            {/* URL Error Message */}
            {showUrlError && (
              <p className="mt-1.5 text-xs text-rose-500 font-medium flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{urlValidation.error}</span>
              </p>
            )}

            {/* Duplicate URL Warning */}
            {isDuplicateUrl && (
              <p className="mt-1.5 text-xs text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1">
                <Info className="w-3.5 h-3.5 shrink-0" />
                <span>이미 등록되어 있는 링크 주소입니다. (중복 등록 가능)</span>
              </p>
            )}

            {/* Corrected URL Preview Helper */}
            {url.trim() && urlValidation.isValid && urlValidation.isCorrected && (
              <p className="mt-1 text-[11px] text-slate-500 dark:text-zinc-400 flex items-center gap-1">
                <span>저장될 주소:</span>
                <span className="font-mono text-[#0070d1] font-semibold truncate">
                  {urlValidation.formattedUrl}
                </span>
              </p>
            )}
          </div>

          {/* ================= Live Preview Card ================= */}
          <div className="pt-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
                실시간 버튼 미리보기
              </span>
              <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-semibold">
                {theme.name.split(" ")[0]} 테마 적용 중
              </span>
            </div>
            <div
              className={`p-3 rounded-2xl border transition-all ${theme.bgGradient} flex items-center justify-center`}
              style={{ backgroundColor: theme.bgColor }}
            >
              <div className="w-full pointer-events-none opacity-95">
                <LinkCard
                  link={previewLink}
                  theme={theme}
                  buttonShape={store.buttonShape}
                  buttonStyle={store.buttonStyle}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2.5 text-xs font-semibold rounded-xl text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={!isFormValid}
              className={`px-5 py-2.5 text-xs font-bold rounded-xl text-white transition-all flex items-center justify-center gap-1.5 ${
                isFormValid
                  ? "bg-[#0070d1] hover:bg-[#0064b7] active:bg-[#004d8d] shadow-md shadow-[#0070d1]/30 active:scale-95 cursor-pointer"
                  : "bg-slate-300 dark:bg-zinc-700 text-slate-400 dark:text-zinc-500 opacity-60 cursor-not-allowed"
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              <span>링크 추가하기</span>
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
