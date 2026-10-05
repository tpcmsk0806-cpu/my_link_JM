"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Profile, LinkItem, ButtonShape, ButtonStyle } from "@/types";
import { getTheme } from "@/lib/themes";
import { ExternalLink, Mail, Share2, Sparkles } from "lucide-react";
import { Instagram, Youtube, Github, Twitter, Linkedin } from "@/components/SocialIcons";

interface ProfileViewProps {
  profile: Profile;
  links: LinkItem[];
  isPreview?: boolean;
  onLinkClick?: (linkId: string, url: string) => void;
}

export default function ProfileView({
  profile,
  links,
  isPreview = false,
  onLinkClick,
}: ProfileViewProps) {
  const theme = getTheme(profile.themeId);

  // Filter links for display (if in public mode, only show active links)
  const displayLinks = isPreview ? links : links.filter((l) => l.isActive);

  // Shape class generator
  const getShapeClass = (shape?: ButtonShape) => {
    switch (shape || profile.buttonShape) {
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

  // Button Style class generator
  const getButtonStyleClass = (style?: ButtonStyle) => {
    const currentStyle = style || profile.buttonStyle;
    switch (currentStyle) {
      case "solid":
        return `${theme.cardBg} ${theme.cardBorder || ""}`;
      case "outline":
        return `bg-transparent border-2 ${
          theme.id === "clean-white"
            ? "border-slate-800 text-slate-900 hover:bg-slate-100"
            : theme.id === "midnight-dark" || theme.id === "cyber-gaming"
            ? "border-white/80 text-white hover:bg-white/10"
            : "border-current hover:bg-black/5"
        }`;
      case "glass":
        return `bg-white/30 dark:bg-black/30 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-lg`;
      default:
        return `${theme.cardBg} ${theme.cardBorder || ""}`;
    }
  };

  const handleLinkAction = async (link: LinkItem, e: React.MouseEvent) => {
    if (isPreview) {
      e.preventDefault();
      return;
    }

    if (onLinkClick) {
      onLinkClick(link.id, link.url);
    } else {
      // Default tracking beacon
      try {
        fetch("/api/clicks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ linkId: link.id }),
        }).catch(() => {});
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleShare = async () => {
    if (typeof window !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: `${profile.displayName} | 마이링크`,
          text: profile.bio,
          url: window.location.href,
        });
      } catch (e) {
        // Fallback copy
        copyUrl();
      }
    } else {
      copyUrl();
    }
  };

  const copyUrl = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      alert("프로필 링크가 클립보드에 복사되었습니다! 🎉");
    }
  };

  return (
    <div
      className={`w-full min-h-full flex flex-col items-center justify-between p-6 sm:p-8 transition-colors duration-300 ${theme.bgGradient}`}
      style={{
        backgroundColor: theme.bgColor,
        color: theme.textColor,
      }}
    >
      <div className="w-full max-w-md flex flex-col items-center flex-1">
        {/* Top Share Bar */}
        <div className="w-full flex justify-end mb-4">
          <button
            onClick={handleShare}
            aria-label="공유하기"
            className="w-10 h-10 rounded-full flex items-center justify-center bg-black/10 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20 backdrop-blur-sm transition-all text-current shadow-sm active:scale-95"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        {/* Profile Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="relative mb-3 group">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden ring-4 ring-white/50 dark:ring-white/20 shadow-xl bg-slate-200">
              {profile.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.avatarUrl}
                  alt={profile.displayName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-bold text-2xl text-slate-500">
                  {profile.displayName?.slice(0, 1) || "U"}
                </div>
              )}
            </div>
            {profile.themeId === "cyber-gaming" && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-cyan-400 border-2 border-black flex items-center justify-center text-[10px] text-black font-extrabold shadow-lg">
                ★
              </div>
            )}
          </div>

          <h1 className="text-xl sm:text-2xl font-bold tracking-tight mb-1">
            {profile.displayName || `@${profile.username}`}
          </h1>

          <p
            className="text-sm font-medium leading-relaxed max-w-xs break-words"
            style={{ color: theme.bioColor }}
          >
            {profile.bio || "환영합니다! 연결된 링크를 확인해보세요."}
          </p>

          {/* Social Icons Bar */}
          {profile.socialLinks && Object.values(profile.socialLinks).some(Boolean) && (
            <div className="flex items-center gap-3.5 mt-4 flex-wrap justify-center">
              {profile.socialLinks.instagram && (
                <a
                  href={profile.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full hover:scale-110 transition-transform text-current opacity-85 hover:opacity-100"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              )}
              {profile.socialLinks.youtube && (
                <a
                  href={profile.socialLinks.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full hover:scale-110 transition-transform text-current opacity-85 hover:opacity-100"
                  aria-label="YouTube"
                >
                  <Youtube className="w-5 h-5" />
                </a>
              )}
              {profile.socialLinks.github && (
                <a
                  href={profile.socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full hover:scale-110 transition-transform text-current opacity-85 hover:opacity-100"
                  aria-label="GitHub"
                >
                  <Github className="w-5 h-5" />
                </a>
              )}
              {profile.socialLinks.twitter && (
                <a
                  href={profile.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full hover:scale-110 transition-transform text-current opacity-85 hover:opacity-100"
                  aria-label="Twitter / X"
                >
                  <Twitter className="w-5 h-5" />
                </a>
              )}
              {profile.socialLinks.linkedin && (
                <a
                  href={profile.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full hover:scale-110 transition-transform text-current opacity-85 hover:opacity-100"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              )}
              {profile.socialLinks.email && (
                <a
                  href={profile.socialLinks.email.startsWith("mailto:") ? profile.socialLinks.email : `mailto:${profile.socialLinks.email}`}
                  className="p-2 rounded-full hover:scale-110 transition-transform text-current opacity-85 hover:opacity-100"
                  aria-label="Email"
                >
                  <Mail className="w-5 h-5" />
                </a>
              )}
            </div>
          )}
        </div>

        {/* Links List */}
        <div className="w-full flex flex-col gap-3.5 my-2">
          {displayLinks.length === 0 ? (
            <div className="py-8 text-center text-sm opacity-60">
              아직 등록된 링크가 없습니다.
            </div>
          ) : (
            displayLinks.map((link) => (
              <a
                key={link.id}
                href={isPreview ? "#" : link.url}
                target={isPreview ? "_self" : "_blank"}
                rel="noopener noreferrer"
                onClick={(e) => handleLinkAction(link, e)}
                className={`group relative w-full py-4 px-5 flex items-center justify-between font-semibold text-sm sm:text-base text-center transition-all duration-200 hover:scale-[1.015] active:scale-[0.985] cursor-pointer ${getShapeClass()} ${getButtonStyleClass()}`}
                style={{
                  color: profile.buttonStyle === "solid" ? theme.cardText : undefined,
                }}
              >
                <div className="w-5" /> {/* Left spacer for center alignment */}
                <span className="truncate max-w-[80%] font-medium">
                  {link.title}
                </span>
                <ExternalLink className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
              </a>
            ))
          )}
        </div>
      </div>

      {/* Footer Branding */}
      <footer className="mt-8 mb-2 flex items-center justify-center">
        <Link
          href="/"
          target={isPreview ? "_blank" : "_self"}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md opacity-75 hover:opacity-100 hover:scale-105 transition-all shadow-sm ${theme.badgeBg}`}
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
          <span>마이링크로 나만의 링크 만들기</span>
        </Link>
      </footer>
    </div>
  );
}
