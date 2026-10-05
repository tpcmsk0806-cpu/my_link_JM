"use client";

import React, { useState } from "react";
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
import { Link2, Plus, Sparkles, Check, AlertCircle } from "lucide-react";

interface AddLinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (newLinkTitle: string) => void;
}

const EMOJI_PRESETS = [
  "🛍️", "📺", "💻", "📝", "☕", "🎨", "⭐", "🚀", "🔗", "📸", "💬", "💼"
];

export default function AddLinkDialog({
  open,
  onOpenChange,
  onSuccess,
}: AddLinkDialogProps) {
  const store = useProfileStore();
  const theme = getTheme(store.themeId);

  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  const handleEmojiSelect = (emoji: string) => {
    // If title already starts with an emoji, or just append/prepend
    if (!title) {
      setTitle(`${emoji} `);
    } else {
      setTitle(`${emoji} ${title}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    let trimmedUrl = url.trim();

    if (!trimmedTitle) {
      setError("버튼 제목을 입력해주세요.");
      return;
    }

    if (!trimmedUrl) {
      setError("연결할 URL을 입력해주세요.");
      return;
    }

    // PRD 6.3: Automatically correct missing https:// protocol
    if (!/^https?:\/\//i.test(trimmedUrl) && !trimmedUrl.startsWith("mailto:")) {
      trimmedUrl = `https://${trimmedUrl}`;
    }

    // Add link to Zustand local store (persisted to localStorage)
    store.addLink(trimmedTitle, trimmedUrl);

    // Reset form
    setTitle("");
    setUrl("");
    setError("");
    onOpenChange(false);

    if (onSuccess) {
      onSuccess(trimmedTitle);
    }
  };

  const handleClose = () => {
    setTitle("");
    setUrl("");
    setError("");
    onOpenChange(false);
  };

  // Temporary mock link for live preview
  const previewLink: LinkItem = {
    id: "preview-link",
    profileId: "profile-1",
    title: title.trim() || "버튼 제목 미리보기",
    url: url.trim() || "https://example.com",
    orderIndex: 0,
    isActive: true,
    clickCount: 0,
    createdAt: new Date().toISOString(),
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent onClose={handleClose} className="sm:max-w-md">
        <DialogHeader>
          <div className="w-10 h-10 rounded-2xl bg-cyan-100 dark:bg-cyan-950/80 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-2 shadow-sm">
            <Plus className="w-5 h-5" />
          </div>
          <DialogTitle>새 링크 추가하기</DialogTitle>
          <DialogDescription>
            방문자에게 안내할 링크의 제목과 목적지 주소를 입력하세요.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 text-xs rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Title Input */}
          <div>
            <label className="block text-xs font-bold text-slate-800 dark:text-zinc-200 mb-1.5">
              버튼 제목 <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError("");
              }}
              placeholder="예: 🛍️ 2026 다이어리 마켓"
              maxLength={40}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800/70 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
            />

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
                  className="px-1.5 py-0.5 rounded-lg hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors shrink-0 text-sm"
                  title="이모지 삽입"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* URL Input */}
          <div>
            <label className="block text-xs font-bold text-slate-800 dark:text-zinc-200 mb-1.5">
              목적지 URL <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  if (error) setError("");
                }}
                placeholder="smartstore.naver.com/... 또는 https://..."
                className="w-full pl-3.5 pr-8 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800/70 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
              />
              <Link2 className="w-4 h-4 text-slate-400 dark:text-zinc-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            <p className="text-[11px] text-slate-400 dark:text-zinc-500 mt-1">
              https:// 프로토콜이 누락된 경우 자동으로 보정됩니다.
            </p>
          </div>

          {/* Live Preview Card */}
          <div className="pt-2">
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
              disabled={!title.trim() || !url.trim()}
              className="px-5 py-2.5 text-xs font-bold rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white shadow-md shadow-cyan-600/25 active:scale-95 transition-all disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center gap-1.5"
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
