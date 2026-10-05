"use client";

import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { LinkItem } from "@/types";
import {
  GripVertical,
  ExternalLink,
  Trash2,
  MousePointerClick,
  Check,
  Edit2,
  X,
} from "lucide-react";

interface SortableLinkItemProps {
  link: LinkItem;
  onUpdate: (id: string, updates: Partial<LinkItem>) => void;
  onDelete: (id: string) => void;
}

export default function SortableLinkItem({
  link,
  onUpdate,
  onDelete,
}: SortableLinkItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: link.id });

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(link.title);
  const [url, setUrl] = useState(link.url);

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : "auto",
  };

  const handleSave = () => {
    if (!title.trim() || !url.trim()) return;
    onUpdate(link.id, { title: title.trim(), url: url.trim() });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTitle(link.title);
    setUrl(link.url);
    setIsEditing(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative bg-zinc-900 border rounded-2xl p-4 transition-all ${
        isDragging
          ? "border-cyan-500 shadow-2xl bg-zinc-800 scale-[1.02] opacity-90"
          : "border-zinc-800/80 hover:border-zinc-700 shadow-sm"
      }`}
    >
      <div className="flex items-center gap-3">
        {/* Drag Handle */}
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="text-zinc-500 hover:text-zinc-300 p-1 rounded cursor-grab active:cursor-grabbing hover:bg-zinc-800 transition-colors"
          title="드래그하여 순서 변경"
        >
          <GripVertical className="w-5 h-5" />
        </button>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="flex flex-col gap-2 my-1">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="링크 제목 (예: 유튜브 채널)"
                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-cyan-500"
              />
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://..."
                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-cyan-500 font-mono"
              />
              <div className="flex items-center gap-2 mt-1">
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded-md text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <Check className="w-3.5 h-3.5" /> 저장
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-md text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <X className="w-3.5 h-3.5" /> 취소
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-white text-sm sm:text-base truncate">
                  {link.title}
                </h3>
                <button
                  onClick={() => setIsEditing(true)}
                  className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-white p-1 transition-opacity"
                  title="수정하기"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-zinc-400 hover:text-cyan-400 truncate flex items-center gap-1 mt-0.5 font-mono max-w-sm"
              >
                <span>{link.url}</span>
                <ExternalLink className="w-3 h-3 flex-shrink-0" />
              </a>
            </div>
          )}
        </div>

        {/* Right Action Group */}
        <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
          {/* Clicks Pill */}
          <div
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-zinc-800/80 border border-zinc-700/60 text-xs font-medium text-zinc-300"
            title="총 클릭수"
          >
            <MousePointerClick className="w-3 h-3 text-cyan-400" />
            <span>{link.clickCount.toLocaleString()}</span>
          </div>

          {/* Active Switch Toggle */}
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={link.isActive}
              onChange={(e) => onUpdate(link.id, { isActive: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-10 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
          </label>

          {/* Delete Button */}
          <button
            type="button"
            onClick={() => {
              if (confirm(`'${link.title}' 링크를 삭제하시겠습니까?`)) {
                onDelete(link.id);
              }
            }}
            className="text-zinc-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
            title="삭제"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
