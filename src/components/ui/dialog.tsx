"use client";

import * as React from "react";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export function Dialog({
  open,
  onOpenChange,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      {children}
    </DialogPrimitive.Root>
  );
}

export function DialogContent({
  className,
  children,
  onClose,
}: {
  className?: string;
  children: React.ReactNode;
  onClose?: () => void;
}) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-200 animate-in fade-in" />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-none">
        <DialogPrimitive.Popup
          className={cn(
            "pointer-events-auto relative w-full max-w-lg rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-6 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200",
            className
          )}
        >
          {onClose && (
            <DialogPrimitive.Close
              onClick={onClose}
              aria-label="닫기"
              className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </DialogPrimitive.Close>
          )}
          {children}
        </DialogPrimitive.Popup>
      </div>
    </DialogPrimitive.Portal>
  );
}

export function DialogHeader({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("flex flex-col space-y-1.5 text-left mb-5", className)}>
      {children}
    </div>
  );
}

export function DialogTitle({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <DialogPrimitive.Title
      className={cn(
        "text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white",
        className
      )}
    >
      {children}
    </DialogPrimitive.Title>
  );
}

export function DialogDescription({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <DialogPrimitive.Description
      className={cn(
        "text-xs sm:text-sm text-slate-500 dark:text-zinc-400 leading-relaxed",
        className
      )}
    >
      {children}
    </DialogPrimitive.Description>
  );
}

export function DialogFooter({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 gap-2 mt-6 pt-4 border-t border-slate-100 dark:border-zinc-800",
        className
      )}
    >
      {children}
    </div>
  );
}
