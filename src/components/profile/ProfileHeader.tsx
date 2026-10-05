"use client";

import React, { useState } from "react";
import { SocialLinks, ThemeConfig } from "@/types";
import { Mail } from "lucide-react";
import { Instagram, Youtube, Github, Twitter, Linkedin } from "@/components/SocialIcons";

interface ProfileHeaderProps {
  displayName: string;
  username: string;
  bio: string;
  avatarUrl: string;
  theme: ThemeConfig;
  socialLinks: SocialLinks;
}

export default function ProfileHeader({
  displayName,
  username,
  bio,
  avatarUrl,
  theme,
  socialLinks,
}: ProfileHeaderProps) {
  const [imageError, setImageError] = useState(false);

  const hasSocials =
    socialLinks && Object.values(socialLinks).some((val) => typeof val === "string" && val.trim().length > 0);

  return (
    <div className="flex flex-col items-center text-center w-full mb-6 pt-2">
      {/* Avatar */}
      <div className="relative mb-4 group">
        <div
          className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden shadow-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105 ${
            theme.id === "neo-brutalism"
              ? "border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white"
              : "ring-4 ring-white/60 dark:ring-white/20 bg-slate-200 dark:bg-zinc-800"
          }`}
        >
          {avatarUrl && !imageError ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatarUrl}
              alt={displayName}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center font-bold text-3xl select-none"
              style={{ color: theme.textColor }}
            >
              {displayName ? displayName.trim().slice(0, 1) : "M"}
            </div>
          )}
        </div>

        {/* Special theme decorative badge */}
        {theme.id === "cyber-gaming" && (
          <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-cyan-400 border-2 border-black flex items-center justify-center text-xs text-black font-extrabold shadow-md animate-pulse">
            ★
          </div>
        )}
      </div>

      {/* Display Name & Handle */}
      <h1
        className="text-xl sm:text-2xl font-bold tracking-tight mb-1.5 px-2"
        style={{ color: theme.textColor }}
      >
        {displayName || `@${username || "user"}`}
      </h1>

      {/* Bio */}
      {bio && (
        <p
          className="text-xs sm:text-sm font-medium leading-relaxed max-w-xs break-words px-4"
          style={{ color: theme.bioColor }}
        >
          {bio}
        </p>
      )}

      {/* Social Links Bar */}
      {hasSocials && (
        <div className="flex items-center gap-3 mt-4 flex-wrap justify-center px-4">
          {socialLinks.instagram && (
            <a
              href={socialLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="p-2 rounded-full hover:scale-115 active:scale-95 transition-all opacity-85 hover:opacity-100"
              style={{ color: theme.socialIconColor }}
            >
              <Instagram className="w-5 h-5" />
            </a>
          )}
          {socialLinks.youtube && (
            <a
              href={socialLinks.youtube}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="p-2 rounded-full hover:scale-115 active:scale-95 transition-all opacity-85 hover:opacity-100"
              style={{ color: theme.socialIconColor }}
            >
              <Youtube className="w-5 h-5" />
            </a>
          )}
          {socialLinks.github && (
            <a
              href={socialLinks.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="p-2 rounded-full hover:scale-115 active:scale-95 transition-all opacity-85 hover:opacity-100"
              style={{ color: theme.socialIconColor }}
            >
              <Github className="w-5 h-5" />
            </a>
          )}
          {socialLinks.twitter && (
            <a
              href={socialLinks.twitter}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter / X"
              className="p-2 rounded-full hover:scale-115 active:scale-95 transition-all opacity-85 hover:opacity-100"
              style={{ color: theme.socialIconColor }}
            >
              <Twitter className="w-5 h-5" />
            </a>
          )}
          {socialLinks.linkedin && (
            <a
              href={socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="p-2 rounded-full hover:scale-115 active:scale-95 transition-all opacity-85 hover:opacity-100"
              style={{ color: theme.socialIconColor }}
            >
              <Linkedin className="w-5 h-5" />
            </a>
          )}
          {socialLinks.email && (
            <a
              href={
                socialLinks.email.startsWith("mailto:")
                  ? socialLinks.email
                  : `mailto:${socialLinks.email}`
              }
              aria-label="Email"
              className="p-2 rounded-full hover:scale-115 active:scale-95 transition-all opacity-85 hover:opacity-100"
              style={{ color: theme.socialIconColor }}
            >
              <Mail className="w-5 h-5" />
            </a>
          )}
        </div>
      )}
    </div>
  );
}
