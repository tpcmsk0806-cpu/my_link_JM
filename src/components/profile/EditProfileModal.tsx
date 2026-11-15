"use client";

import React, { useState, useEffect } from "react";
import { useProfileStore } from "@/lib/store";
import { auth } from "@/lib/firebase";
import { useUpdateProfileMutation } from "@/hooks/useProfileQuery";
import {
  checkUsernameAvailable,
  validateUsernameFormat,
  normalizeUsername,
} from "@/lib/firestoreProfile";
import {
  X,
  User as UserIcon,
  AtSign,
  FileText,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Sparkles,
} from "lucide-react";

interface EditProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (savedData: { username: string; displayName: string; bio: string }) => void;
}

export default function EditProfileModal({
  open,
  onOpenChange,
  onSuccess,
}: EditProfileModalProps) {
  const store = useProfileStore();
  const updateProfileMutation = useUpdateProfileMutation(auth.currentUser?.uid);

  const [username, setUsername] = useState(store.username || "");
  const [displayName, setDisplayName] = useState(store.displayName || "");
  const [bio, setBio] = useState(store.bio || "");

  // Validation & Check States
  const [usernameStatus, setUsernameStatus] = useState<
    "idle" | "checking" | "available" | "error"
  >("idle");
  const [usernameError, setUsernameError] = useState<string | null>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  // Sync store values when modal opens
  useEffect(() => {
    if (open) {
      setUsername(store.username || "");
      setDisplayName(store.displayName || "");
      setBio(store.bio || "");
      setUsernameStatus("idle");
      setUsernameError(null);
      setGeneralError(null);
    }
  }, [open, store.username, store.displayName, store.bio]);

  // Username change handler
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setUsername(val);
    setUsernameStatus("idle");
    setUsernameError(null);
    setGeneralError(null);
  };

  // Perform username availability check
  const handleCheckUsername = async (candidateUsername: string) => {
    const trimmed = candidateUsername.trim();
    if (!trimmed) {
      setUsernameStatus("error");
      setUsernameError("사용자 이름을 입력해주세요.");
      return false;
    }

    const format = validateUsernameFormat(trimmed);
    if (!format.isValid) {
      setUsernameStatus("error");
      setUsernameError(format.error || "형식이 올바르지 않습니다.");
      return false;
    }

    const currentUid = auth.currentUser?.uid || "";
    setUsernameStatus("checking");

    try {
      const res = await checkUsernameAvailable(trimmed, currentUid);
      if (res.available) {
        setUsernameStatus("available");
        setUsernameError(null);
        return true;
      } else {
        setUsernameStatus("error");
        setUsernameError(res.reason || "이미 사용 중인 사용자 이름입니다.");
        return false;
      }
    } catch {
      setUsernameStatus("idle");
      return true;
    }
  };

  // Handle Form Submit with TanStack Query Optimistic Update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);

    const currentUser = auth.currentUser;
    if (!currentUser) {
      setGeneralError("로그인이 필요합니다.");
      return;
    }

    // 1. Username 유효성 검사
    const normalizedUser = normalizeUsername(username);
    const format = validateUsernameFormat(normalizedUser);
    if (!format.isValid) {
      setUsernameStatus("error");
      setUsernameError(format.error || "형식이 올바르지 않습니다.");
      return;
    }

    if (!displayName.trim()) {
      setGeneralError("표시 이름을 입력해주세요.");
      return;
    }

    const optimisticData = {
      username: normalizedUser,
      displayName: displayName.trim(),
      bio: bio.trim(),
    };

    // 2. ✨ [0ms 즉각 반응] 모달 즉시 닫기 및 성공 콜백 실행
    if (onSuccess) {
      onSuccess(optimisticData);
    }
    onOpenChange(false);

    // 3. TanStack Query Mutation 실행 (낙관적 업데이트 및 실패 시 자동 롤백)
    try {
      await updateProfileMutation.mutateAsync({
        username: normalizedUser,
        displayName: displayName.trim(),
        bio: bio.trim(),
        avatarUrl: currentUser.photoURL || store.avatarUrl || "",
      });
    } catch (err: any) {
      alert(`프로필 저장 실패로 이전 상태로 복구되었습니다: ${err?.message || "중복 또는 네트워크 오류"}`);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => !isSaving && onOpenChange(false)}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-zinc-800 p-6 z-10 flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
              <UserIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                프로필 수정
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                마이페이지 정보 및 공유 URL을 설정합니다.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* General Error Banner */}
        {generalError && (
          <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-start gap-2 text-rose-600 dark:text-rose-300 text-xs font-medium animate-in fade-in">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{generalError}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* 1. Username Field (공유 URL용) */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 dark:text-zinc-200 flex items-center gap-1">
                <AtSign className="w-3.5 h-3.5 text-cyan-500" />
                <span>사용자 이름 (URL 슬러그)</span>
                <span className="text-rose-500">*</span>
              </label>

              {/* Status Indicator */}
              {usernameStatus === "checking" && (
                <span className="text-[11px] text-cyan-500 flex items-center gap-1 font-medium">
                  <Loader2 className="w-3 h-3 animate-spin" /> 확인 중...
                </span>
              )}
              {usernameStatus === "available" && (
                <span className="text-[11px] text-emerald-500 flex items-center gap-1 font-semibold">
                  <CheckCircle2 className="w-3 h-3" /> 사용 가능
                </span>
              )}
            </div>

            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={handleUsernameChange}
                onBlur={() => handleCheckUsername(username)}
                disabled={isSaving}
                placeholder="예: jinmo"
                maxLength={30}
                className={`w-full px-3.5 py-2.5 rounded-xl border bg-slate-50 dark:bg-zinc-800/80 text-sm font-mono text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none transition-all ${
                  usernameStatus === "error"
                    ? "border-rose-400 focus:ring-1 focus:ring-rose-400 bg-rose-50/20"
                    : usernameStatus === "available"
                    ? "border-emerald-400 focus:ring-1 focus:ring-emerald-400 bg-emerald-50/10"
                    : "border-slate-200 dark:border-zinc-700 focus:ring-1 focus:ring-cyan-500"
                }`}
              />

              <button
                type="button"
                onClick={() => handleCheckUsername(username)}
                disabled={isSaving || !username.trim()}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-white dark:bg-zinc-700 border border-slate-200 dark:border-zinc-600 text-slate-700 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-600 transition-colors disabled:opacity-40 cursor-pointer"
              >
                중복 확인
              </button>
            </div>

            {/* Error Message */}
            {usernameStatus === "error" && usernameError && (
              <p className="text-xs text-rose-500 font-medium flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{usernameError}</span>
              </p>
            )}

            {/* URL Preview */}
            <p className="text-[11px] text-slate-400 dark:text-zinc-500">
              내 공유 프로필 주소:{" "}
              <span className="font-mono text-cyan-600 dark:text-cyan-400 font-semibold">
                /{normalizeUsername(username) || "username"}
              </span>
            </p>
          </div>

          {/* 2. Display Name Field (표시 이름) */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-800 dark:text-zinc-200 flex items-center gap-1">
              <UserIcon className="w-3.5 h-3.5 text-blue-500" />
              <span>표시 이름 (DisplayName)</span>
              <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              disabled={isSaving}
              placeholder="예: 김링크 | Tech Creator"
              maxLength={40}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800/80 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all"
            />
          </div>

          {/* 3. Bio Field (소개글) */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 dark:text-zinc-200 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-indigo-500" />
                <span>한 줄 소개 (Bio)</span>
              </label>
              <span className="text-[11px] text-slate-400 font-mono">
                {bio.length}/150
              </span>
            </div>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              disabled={isSaving}
              placeholder="방문자들에게 나를 소개할 짧은 소개글을 적어주세요."
              maxLength={150}
              rows={3}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800/80 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all resize-none leading-relaxed"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-zinc-800 mt-1">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              disabled={isSaving}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer disabled:opacity-50"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#0070d1] hover:bg-[#0064b7] active:bg-[#004d8d] text-white shadow-md shadow-[#0070d1]/30 hover:shadow-lg transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>저장 중...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>프로필 저장</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
