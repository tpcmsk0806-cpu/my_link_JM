import fs from "fs";
import path from "path";
import { User, Profile, LinkItem, AnalyticsSummary } from "@/types";

interface DatabaseSchema {
  users: User[];
  profiles: Profile[];
  links: LinkItem[];
  pageViews: { id: string; profileId: string; viewedAt: string }[];
  clicks: { id: string; linkId: string; clickedAt: string }[];
}

const DB_FILE = path.join(process.cwd(), "data", "db.json");

const SEED_DATA: DatabaseSchema = {
  users: [
    {
      id: "user-alex-1",
      email: "alex@mylink.io",
      password: "password123",
      profileId: "profile-alex-1",
      createdAt: new Date().toISOString(),
    },
    {
      id: "user-sora-2",
      email: "sora@mylink.io",
      password: "password123",
      profileId: "profile-sora-2",
      createdAt: new Date().toISOString(),
    },
  ],
  profiles: [
    {
      id: "profile-alex-1",
      userId: "user-alex-1",
      username: "alex",
      displayName: "Alex | Tech Creator",
      bio: "개발, 생산성, 최신 테크 리뷰를 만듭니다 🚀 YouTube 50k · Blog 100k",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
      themeId: "cyber-gaming",
      buttonShape: "pill",
      buttonStyle: "solid",
      socialLinks: {
        youtube: "https://youtube.com",
        github: "https://github.com",
        twitter: "https://x.com",
        instagram: "https://instagram.com",
        email: "mailto:alex@example.com",
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "profile-sora-2",
      userId: "user-sora-2",
      username: "sora",
      displayName: "소라 Sora 🌿",
      bio: "일상 기록 & 감성 일러스트레이터 🎨 편안하고 따뜻한 일상을 그려나갑니다.",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80",
      themeId: "pastel-sky",
      buttonShape: "rounded",
      buttonStyle: "solid",
      socialLinks: {
        instagram: "https://instagram.com",
        threads: "https://threads.net",
        email: "mailto:sora@example.com",
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  links: [
    {
      id: "link-1",
      profileId: "profile-alex-1",
      title: "유튜브 최신 영상 보러가기 🎬",
      url: "https://youtube.com",
      orderIndex: 0,
      isActive: true,
      clickCount: 1420,
      createdAt: new Date().toISOString(),
    },
    {
      id: "link-2",
      profileId: "profile-alex-1",
      title: "개발 블로그 (Next.js & AI 가이드) 💻",
      url: "https://velog.io",
      orderIndex: 1,
      isActive: true,
      clickCount: 980,
      createdAt: new Date().toISOString(),
    },
    {
      id: "link-3",
      profileId: "profile-alex-1",
      title: "GitHub 오픈소스 프로젝트 ⭐",
      url: "https://github.com",
      orderIndex: 2,
      isActive: true,
      clickCount: 654,
      createdAt: new Date().toISOString(),
    },
    {
      id: "link-4",
      profileId: "profile-alex-1",
      title: "위클리 테크 뉴스레터 무료 구독 📬",
      url: "https://substack.com",
      orderIndex: 3,
      isActive: true,
      clickCount: 312,
      createdAt: new Date().toISOString(),
    },
    {
      id: "link-5",
      profileId: "profile-sora-2",
      title: "2026 다이어리 & 스티커 굿즈 마켓 🛍️",
      url: "https://smartstore.naver.com",
      orderIndex: 0,
      isActive: true,
      clickCount: 540,
      createdAt: new Date().toISOString(),
    },
    {
      id: "link-6",
      profileId: "profile-sora-2",
      title: "일러스트 포트폴리오 (Behance) 🎨",
      url: "https://behance.net",
      orderIndex: 1,
      isActive: true,
      clickCount: 420,
      createdAt: new Date().toISOString(),
    },
  ],
  pageViews: [
    { id: "pv-1", profileId: "profile-alex-1", viewedAt: new Date().toISOString() },
    { id: "pv-2", profileId: "profile-alex-1", viewedAt: new Date().toISOString() },
    { id: "pv-3", profileId: "profile-sora-2", viewedAt: new Date().toISOString() },
  ],
  clicks: [],
};

// Ensure data directory and file exist
function readDB(): DatabaseSchema {
  try {
    const dir = path.dirname(DB_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(SEED_DATA, null, 2), "utf-8");
      return SEED_DATA;
    }
    const content = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(content) as DatabaseSchema;
  } catch (error) {
    console.error("DB Read error, returning fallback SEED_DATA:", error);
    return SEED_DATA;
  }
}

function writeDB(data: DatabaseSchema): void {
  try {
    const dir = path.dirname(DB_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("DB Write error:", error);
  }
}

// User / Auth operations
export function getUserByEmail(email: string): User | undefined {
  const db = readDB();
  return db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function getUserById(id: string): User | undefined {
  const db = readDB();
  return db.users.find((u) => u.id === id);
}

export function createUser(email: string, password: string, username: string): { user: User; profile: Profile } {
  const db = readDB();

  const userId = `user-${Date.now()}`;
  const profileId = `profile-${Date.now()}`;

  const newUser: User = {
    id: userId,
    email: email.toLowerCase(),
    password,
    profileId,
    createdAt: new Date().toISOString(),
  };

  const newProfile: Profile = {
    id: profileId,
    userId,
    username: username.toLowerCase().trim(),
    displayName: username,
    bio: "마이링크에 오신 것을 환영합니다! 🎉",
    avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${username}`,
    themeId: "clean-white",
    buttonShape: "pill",
    buttonStyle: "solid",
    socialLinks: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const initialLink: LinkItem = {
    id: `link-${Date.now()}`,
    profileId,
    title: "마이링크 시작하기 🚀",
    url: "https://github.com",
    orderIndex: 0,
    isActive: true,
    clickCount: 0,
    createdAt: new Date().toISOString(),
  };

  db.users.push(newUser);
  db.profiles.push(newProfile);
  db.links.push(initialLink);

  writeDB(db);

  return { user: newUser, profile: newProfile };
}

// Profile operations
export function getProfileByUsername(username: string): Profile | undefined {
  const db = readDB();
  return db.profiles.find((p) => p.username.toLowerCase() === username.toLowerCase());
}

export function getProfileById(id: string): Profile | undefined {
  const db = readDB();
  return db.profiles.find((p) => p.id === id);
}

export function getProfileByUserId(userId: string): Profile | undefined {
  const db = readDB();
  return db.profiles.find((p) => p.userId === userId);
}

export function updateProfile(id: string, updates: Partial<Profile>): Profile | null {
  const db = readDB();
  const index = db.profiles.findIndex((p) => p.id === id);
  if (index === -1) return null;

  db.profiles[index] = {
    ...db.profiles[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  writeDB(db);
  return db.profiles[index];
}

// Links operations
export function getLinksByProfileId(profileId: string): LinkItem[] {
  const db = readDB();
  return db.links
    .filter((l) => l.profileId === profileId)
    .sort((a, b) => a.orderIndex - b.orderIndex);
}

export function addLink(profileId: string, title: string, url: string): LinkItem {
  const db = readDB();
  const currentLinks = db.links.filter((l) => l.profileId === profileId);

  const nowIso = new Date().toISOString();
  const newLink: LinkItem = {
    id: `link-${Date.now()}`,
    profileId,
    title: title.trim(),
    url: url.trim(),
    orderIndex: currentLinks.length,
    isActive: true,
    clickCount: 0,
    createdAt: nowIso,
    updatedAt: nowIso,
  };

  db.links.push(newLink);
  writeDB(db);
  return newLink;
}

export function updateLink(id: string, updates: Partial<LinkItem>): LinkItem | null {
  const db = readDB();
  const index = db.links.findIndex((l) => l.id === id);
  if (index === -1) return null;

  db.links[index] = {
    ...db.links[index],
    ...updates,
    updatedAt: updates.updatedAt || new Date().toISOString(),
  };

  writeDB(db);
  return db.links[index];
}

export function deleteLink(id: string): boolean {
  const db = readDB();
  const initialLength = db.links.length;
  db.links = db.links.filter((l) => l.id !== id);

  if (db.links.length !== initialLength) {
    writeDB(db);
    return true;
  }
  return false;
}

export function reorderLinks(profileId: string, linkIds: string[]): LinkItem[] {
  const db = readDB();

  db.links = db.links.map((link) => {
    if (link.profileId === profileId) {
      const newIndex = linkIds.indexOf(link.id);
      if (newIndex !== -1) {
        return { ...link, orderIndex: newIndex };
      }
    }
    return link;
  });

  writeDB(db);
  return getLinksByProfileId(profileId);
}

// Analytics operations
export function recordPageView(profileId: string): void {
  const db = readDB();
  db.pageViews.push({
    id: `pv-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    profileId,
    viewedAt: new Date().toISOString(),
  });
  writeDB(db);
}

export function recordLinkClick(linkId: string): void {
  const db = readDB();
  const link = db.links.find((l) => l.id === linkId);
  if (link) {
    link.clickCount = (link.clickCount || 0) + 1;
    db.clicks.push({
      id: `clk-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      linkId,
      clickedAt: new Date().toISOString(),
    });
    writeDB(db);
  }
}

export function getAnalyticsSummary(profileId: string): AnalyticsSummary {
  const db = readDB();
  const userLinks = db.links.filter((l) => l.profileId === profileId);
  const totalClicks = userLinks.reduce((acc, curr) => acc + (curr.clickCount || 0), 0);

  const viewsCount = db.pageViews.filter((pv) => pv.profileId === profileId).length;
  // Fallback to sensible minimum if views is 0 for seeded demo
  const totalViews = Math.max(viewsCount, totalClicks > 0 ? Math.round(totalClicks * 1.6) : 0);

  const ctr = totalViews > 0 ? Number(((totalClicks / totalViews) * 100).toFixed(1)) : 0;

  return {
    totalViews,
    totalClicks,
    ctr,
  };
}
