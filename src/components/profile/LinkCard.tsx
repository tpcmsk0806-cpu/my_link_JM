"use client";

import React from "react";
import { LinkItem, ButtonShape, ButtonStyle, ThemeConfig } from "@/types";
import { ExternalLink } from "lucide-react";

interface LinkCardProps {
  link: LinkItem;
  theme: ThemeConfig;
  buttonShape: ButtonShape;
  buttonStyle: ButtonStyle;
  onLinkClick?: (id: string, url: string) => void;
  showClickCount?: boolean;
}

export default function LinkCard({
  link,
  theme,
  buttonShape,
  buttonStyle,
  onLinkClick,
  showClickCount = false,
}: LinkCardProps) {
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

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onLinkClick) {
      onLinkClick(link.id, link.url);
    }
  };

  const isNeoBrutalist = theme.id === "neo-brutalism";

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

  const faviconUrl = getFaviconUrl(link.url);

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={`group relative w-full py-4 px-5 flex items-center justify-between font-semibold text-sm sm:text-base transition-all duration-200 cursor-pointer ${getShapeClass()} ${getStyleClass()} ${
        isNeoBrutalist
          ? "hover:-translate-y-0.5 active:translate-y-0.5"
          : "hover:scale-[1.015] active:scale-[0.985] shadow-sm hover:shadow-md"
      }`}
      style={{
        color: buttonStyle === "solid" ? theme.cardText : undefined,
      }}
    >
      {/* Left favicon or click indicator for perfect center balance */}
      <div className="w-6 h-6 flex items-center justify-center shrink-0">
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
        ) : showClickCount && link.clickCount > 0 ? (
          <span className="text-[10px] opacity-50 font-normal">
            {link.clickCount}회
          </span>
        ) : null}
      </div>

      {/* Main Title */}
      <span className="truncate max-w-[78%] text-center font-medium tracking-tight">
        {link.title}
      </span>

      {/* Right External Link Icon */}
      <div className="w-6 flex items-center justify-end">
        <ExternalLink className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
      </div>
    </a>
  );
}
