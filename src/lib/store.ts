import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ButtonShape, ButtonStyle, LinkItem, SocialLinks } from "@/types";

export interface ProfileState {
  username: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
  themeId: string;
  buttonShape: ButtonShape;
  buttonStyle: ButtonStyle;
  socialLinks: SocialLinks;
  links: LinkItem[];

  // Actions
  updateProfile: (data: Partial<Pick<ProfileState, "username" | "displayName" | "bio" | "avatarUrl">>) => void;
  updateSocialLinks: (socialLinks: Partial<SocialLinks>) => void;
  updateTheme: (themeId: string) => void;
  updateButtonShape: (shape: ButtonShape) => void;
  updateButtonStyle: (style: ButtonStyle) => void;
  addLink: (title: string, url: string) => void;
  addLinkItem: (link: LinkItem) => void;
  setLinks: (links: LinkItem[]) => void;
  updateLink: (id: string, updates: Partial<LinkItem>) => void;
  deleteLink: (id: string) => void;
  toggleLinkActive: (id: string) => void;
  moveLink: (id: string, direction: "up" | "down") => void;
  reorderLinks: (links: LinkItem[]) => void;
  recordClick: (id: string) => void;
  resetToDefault: () => void;
}

export const DEFAULT_SEED_LINKS: LinkItem[] = [
  {
    id: "link-1",
    profileId: "profile-1",
    title: "🖥️ 개인 포트폴리오 웹사이트",
    url: "https://portfolio.example.com",
    orderIndex: 0,
    isActive: true,
    clickCount: 142,
    createdAt: "2026-03-15T09:00:00.000Z",
  },
  {
    id: "link-2",
    profileId: "profile-1",
    title: "💻 GitHub 프로필 & 프로젝트",
    url: "https://github.com/example",
    orderIndex: 1,
    isActive: true,
    clickCount: 98,
    createdAt: "2026-03-15T09:10:00.000Z",
  },
  {
    id: "link-3",
    profileId: "profile-1",
    title: "📝 기술 블로그 (Velog / Devlog)",
    url: "https://velog.io/@example",
    orderIndex: 2,
    isActive: true,
    clickCount: 65,
    createdAt: "2026-03-15T09:20:00.000Z",
  },
  {
    id: "link-4",
    profileId: "profile-1",
    title: "📄 프로젝트 포트폴리오 (Notion)",
    url: "https://notion.so/example-portfolio",
    orderIndex: 3,
    isActive: true,
    clickCount: 47,
    createdAt: "2026-03-15T09:30:00.000Z",
  },
  {
    id: "link-5",
    profileId: "profile-1",
    title: "📷 일상 & 작업 인스타그램",
    url: "https://instagram.com/example",
    orderIndex: 4,
    isActive: true,
    clickCount: 31,
    createdAt: "2026-03-15T09:40:00.000Z",
  },
  {
    id: "link-6",
    profileId: "profile-1",
    title: "💬 1:1 오픈채팅 / 커피챗 문의",
    url: "https://open.kakao.com/o/example",
    orderIndex: 5,
    isActive: false,
    clickCount: 12,
    createdAt: "2026-03-15T09:50:00.000Z",
  },
];

export const DEFAULT_PROFILE_DATA = {
  username: "mylink",
  displayName: "김링크 | Tech & Creator 🚀",
  bio: "새로운 기술을 탐구하고 유용한 정보를 공유합니다. 아래 링크에서 포트폴리오와 소셜 채널을 만나보세요!",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
  themeId: "clean-white",
  buttonShape: "rounded" as ButtonShape,
  buttonStyle: "solid" as ButtonStyle,
  socialLinks: {
    github: "https://github.com",
    instagram: "https://instagram.com",
    youtube: "https://youtube.com",
    twitter: "https://x.com",
    email: "contact@example.com",
  },
  links: DEFAULT_SEED_LINKS,
};

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      ...DEFAULT_PROFILE_DATA,

      updateProfile: (data) =>
        set((state) => ({
          ...state,
          ...data,
        })),

      updateSocialLinks: (socialLinks) =>
        set((state) => ({
          ...state,
          socialLinks: {
            ...state.socialLinks,
            ...socialLinks,
          },
        })),

      updateTheme: (themeId) =>
        set(() => ({
          themeId,
        })),

      updateButtonShape: (buttonShape) =>
        set(() => ({
          buttonShape,
        })),

      updateButtonStyle: (buttonStyle) =>
        set(() => ({
          buttonStyle,
        })),

      addLink: (title, url) =>
        set((state) => {
          let formattedUrl = url.trim();
          if (formattedUrl && !/^https?:\/\//i.test(formattedUrl) && !formattedUrl.startsWith("mailto:")) {
            formattedUrl = `https://${formattedUrl}`;
          }

          const nowIso = new Date().toISOString();
          const newLink: LinkItem = {
            id: `link-${Date.now()}`,
            profileId: "profile-1",
            title: title.trim() || "새로운 링크",
            url: formattedUrl || "https://",
            orderIndex: state.links.length,
            isActive: true,
            clickCount: 0,
            createdAt: nowIso,
            updatedAt: nowIso,
          };

          return {
            links: [...state.links, newLink],
          };
        }),

      addLinkItem: (link: LinkItem) =>
        set((state) => {
          const exists = state.links.some((l) => l.id === link.id);
          if (exists) {
            return {
              links: state.links.map((l) => (l.id === link.id ? link : l)),
            };
          }
          return {
            links: [...state.links, link],
          };
        }),

      setLinks: (links: LinkItem[]) =>
        set(() => ({
          links,
        })),

      updateLink: (id, updates) =>
        set((state) => {
          let formattedUpdates: any = {
            ...updates,
            updatedAt: updates.updatedAt || new Date().toISOString(),
          };
          if (formattedUpdates.url) {
            let u = formattedUpdates.url.trim();
            if (u && !/^https?:\/\//i.test(u) && !u.startsWith("mailto:")) {
              u = `https://${u}`;
            }
            formattedUpdates.url = u;
          }

          return {
            links: state.links.map((link) =>
              link.id === id ? { ...link, ...formattedUpdates } : link
            ),
          };
        }),

      deleteLink: (id) =>
        set((state) => {
          const filtered = state.links.filter((l) => l.id !== id);
          return {
            links: filtered.map((l, idx) => ({ ...l, orderIndex: idx })),
          };
        }),

      toggleLinkActive: (id) =>
        set((state) => ({
          links: state.links.map((l) =>
            l.id === id ? { ...l, isActive: !l.isActive } : l
          ),
        })),

      moveLink: (id, direction) =>
        set((state) => {
          const index = state.links.findIndex((l) => l.id === id);
          if (index === -1) return state;

          const targetIndex = direction === "up" ? index - 1 : index + 1;
          if (targetIndex < 0 || targetIndex >= state.links.length) return state;

          const newLinks = [...state.links];
          const temp = newLinks[index];
          newLinks[index] = newLinks[targetIndex];
          newLinks[targetIndex] = temp;

          return {
            links: newLinks.map((l, idx) => ({ ...l, orderIndex: idx })),
          };
        }),

      reorderLinks: (links) =>
        set(() => ({
          links: links.map((l, idx) => ({ ...l, orderIndex: idx })),
        })),

      recordClick: (id) =>
        set((state) => ({
          links: state.links.map((l) =>
            l.id === id ? { ...l, clickCount: (l.clickCount || 0) + 1 } : l
          ),
        })),

      resetToDefault: () =>
        set(() => ({
          ...DEFAULT_PROFILE_DATA,
        })),
    }),
    {
      name: "mylink-profile-storage",
    }
  )
);
