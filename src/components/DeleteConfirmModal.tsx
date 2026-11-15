"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, Trash2, X } from "lucide-react";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  linkTitle: string;
  linkUrl?: string;
  isDeleting?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteConfirmModal({
  isOpen,
  linkTitle,
  linkUrl,
  isDeleting = false,
  onClose,
  onConfirm,
}: DeleteConfirmModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isDeleting) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isDeleting, onClose]);

  if (!mounted || !isOpen) return null;

  const content = (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-dialog-title"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isDeleting) {
          onClose();
        }
      }}
    >
      <div className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-7 shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isDeleting}
          className="absolute top-5 right-5 text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition-colors disabled:opacity-50"
          title="닫기"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Warning Icon Header */}
        <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center mb-4">
          <Trash2 className="w-6 h-6 stroke-[2.2]" />
        </div>

        {/* Modal Title */}
        <h3
          id="delete-dialog-title"
          className="text-lg sm:text-xl font-bold text-white mb-2"
        >
          정말 삭제하시겠습니까?
        </h3>

        {/* Target Link Information */}
        <div className="bg-zinc-950/80 border border-zinc-800 rounded-xl p-3.5 my-3">
          <p className="text-xs font-semibold text-zinc-400 mb-1">삭제 대상 링크</p>
          <p className="text-sm font-bold text-white truncate break-all">
            {linkTitle}
          </p>
          {linkUrl && (
            <p className="text-xs text-zinc-500 font-mono truncate mt-0.5">
              {linkUrl}
            </p>
          )}
        </div>

        {/* Red Warning Message */}
        <p className="text-xs font-semibold text-red-500 flex items-center gap-1.5 my-4">
          <AlertTriangle className="w-4 h-4 shrink-0 text-red-500" />
          <span>이 작업은 되돌릴 수 없습니다</span>
        </p>

        {/* Action Buttons: [취소] [삭제하기] */}
        <div className="flex items-center gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 py-3 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-600 text-zinc-200 font-semibold text-sm transition-colors disabled:opacity-50"
          >
            취소
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 py-3 px-4 rounded-xl bg-red-600 hover:bg-red-500 active:bg-red-700 text-white font-semibold text-sm transition-all shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {isDeleting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>삭제 중...</span>
              </>
            ) : (
              <span>삭제하기</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}
