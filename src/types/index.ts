export interface UserProfileData {
  userId: string;
  username: string; // URL slug용 (e.g. "jinmo")
  displayName: string; // 표시 이름
  bio: string; // 소개글
  avatarUrl?: string;
  updatedAt?: string;
}

export type ButtonShape = "pill" | "rounded" | "sharp";
export type ButtonStyle = "solid" | "outline" | "glass";

export interface SocialLinks {
  instagram?: string;
  youtube?: string;
  github?: string;
  twitter?: string;
  linkedin?: string;
  email?: string;
  tiktok?: string;
  threads?: string;
}

export interface Profile {
  id: string;
  userId: string;
  username: string; // e.g. "alex"
  displayName: string;
  bio: string;
  avatarUrl: string;
  themeId: string;
  buttonShape: ButtonShape;
  buttonStyle: ButtonStyle;
  socialLinks: SocialLinks;
  createdAt: string;
  updatedAt: string;
}

export interface LinkItem {
  id: string;
  profileId: string;
  title: string;
  url: string;
  orderIndex: number;
  isActive: boolean;
  clickCount: number;
  createdAt: string;
  updatedAt?: string;
}

export interface User {
  id: string;
  email: string;
  password?: string;
  profileId: string;
  createdAt: string;
}

export interface ThemeConfig {
  id: string;
  name: string;
  description: string;
  bgGradient: string;
  bgColor: string;
  textColor: string;
  bioColor: string;
  cardBg: string;
  cardText: string;
  cardBorder?: string;
  accentColor: string;
  socialIconColor: string;
  badgeBg: string;
  previewBg: string;
}

export interface AnalyticsSummary {
  totalViews: number;
  totalClicks: number;
  ctr: number;
}
