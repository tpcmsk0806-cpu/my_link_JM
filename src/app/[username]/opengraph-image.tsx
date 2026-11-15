import { ImageResponse } from "next/og";
import { findUserByDisplayNameOrUsername } from "@/lib/firestoreProfile";
import { getLinksFromFirestore } from "@/lib/firestoreLinks";

export const runtime = "nodejs";

export const alt = "마이링크 프로필";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

interface ImageProps {
  params: Promise<{
    username: string;
  }>;
}

export default async function Image({ params }: ImageProps) {
  const { username } = await params;
  const decodedName = decodeURIComponent(username || "");

  // 1. Fetch user profile from Firestore
  let profile = null;
  let links: any[] = [];

  try {
    profile = await findUserByDisplayNameOrUsername(decodedName);
    if (profile && profile.userId) {
      links = await getLinksFromFirestore(profile.userId);
    }
  } catch (error) {
    console.error("OG Image 데이터 조회 오류:", error);
  }

  const displayName = profile?.displayName || decodedName || "마이링크 사용자";
  const userHandle = profile?.username || decodedName;
  const bio =
    profile?.bio ||
    "새로운 기술을 탐구하고 유용한 정보를 공유합니다. 링크에서 만나보세요!";
  const avatarUrl = profile?.avatarUrl;
  const totalClicks = links.reduce((sum, l) => sum + (l.clickCount || 0), 0);

  // Preview up to 3 links
  const previewLinks =
    links.length > 0
      ? links.slice(0, 3)
      : [
          { title: "유튜브 공식 채널 🎬", clickCount: 142 },
          { title: "인스타그램 데일리 일상 📸", clickCount: 98 },
          { title: "포트폴리오 & 개발 블로그 💻", clickCount: 65 },
        ];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "54px 64px",
          backgroundColor: "#090b10",
          backgroundImage:
            "radial-gradient(circle at 18% 25%, rgba(6, 182, 212, 0.25) 0%, transparent 45%), radial-gradient(circle at 82% 80%, rgba(139, 92, 246, 0.22) 0%, transparent 48%)",
          color: "#ffffff",
          fontFamily: "system-ui, -apple-system, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle decorative inner border */}
        <div
          style={{
            position: "absolute",
            top: 20,
            left: 20,
            right: 20,
            bottom: 20,
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: 32,
            pointerEvents: "none",
          }}
        />

        {/* Top Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 16,
                background: "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 20px rgba(6, 182, 212, 0.35)",
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ffffff"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
            </div>
            <div
              style={{
                fontSize: 22,
                fontWeight: 900,
                letterSpacing: "-0.5px",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <span>마이링크</span>
              <span style={{ color: "#22d3ee", fontFamily: "monospace" }}>
                MyLink
              </span>
            </div>
          </div>

          <div
            style={{
              padding: "8px 18px",
              borderRadius: 20,
              background: "rgba(255, 255, 255, 0.06)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              fontSize: 13,
              fontFamily: "monospace",
              color: "#38bdf8",
              fontWeight: 700,
            }}
          >
            my-link-jm-phi.vercel.app/{userHandle}
          </div>
        </div>

        {/* Center Card Stage: 2 Columns */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 40,
            width: "100%",
            margin: "20px 0",
          }}
        >
          {/* Left Column: Avatar & Profile Bio */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
              maxWidth: 530,
            }}
          >
            {/* Avatar & Names Row */}
            <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
              {/* Avatar Frame */}
              <div
                style={{
                  width: 108,
                  height: 108,
                  borderRadius: 54,
                  padding: 4,
                  background:
                    "linear-gradient(135deg, #06b6d4 0%, #38bdf8 50%, #8b5cf6 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 10px 30px rgba(6, 182, 212, 0.3)",
                }}
              >
                {avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={avatarUrl}
                    alt={displayName}
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: 50,
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: 50,
                      background: "#0f172a",
                      color: "#38bdf8",
                      fontSize: 42,
                      fontWeight: 900,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Names */}
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <div
                  style={{
                    fontSize: 36,
                    fontWeight: 900,
                    letterSpacing: "-0.8px",
                    color: "#ffffff",
                    lineHeight: 1.2,
                  }}
                >
                  {displayName}
                </div>
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    fontFamily: "monospace",
                    color: "#22d3ee",
                  }}
                >
                  @{userHandle}
                </div>
              </div>
            </div>

            {/* Bio text */}
            <div
              style={{
                fontSize: 17,
                color: "#cbd5e1",
                lineHeight: 1.5,
                fontWeight: 400,
                marginTop: 4,
              }}
            >
              {bio.length > 90 ? bio.slice(0, 90) + "..." : bio}
            </div>

            {/* Stats chips */}
            <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
              <div
                style={{
                  padding: "6px 14px",
                  borderRadius: 12,
                  background: "rgba(6, 182, 212, 0.15)",
                  border: "1px solid rgba(6, 182, 212, 0.3)",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#67e8f9",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <span>🔗</span>
                <span>링크 {links.length || 3}개</span>
              </div>

              <div
                style={{
                  padding: "6px 14px",
                  borderRadius: 12,
                  background: "rgba(139, 92, 246, 0.15)",
                  border: "1px solid rgba(139, 92, 246, 0.3)",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#c084fc",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <span>👆</span>
                <span>총 클릭 {totalClicks > 0 ? totalClicks : 305}회</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Link Cards Stack */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
              width: 450,
              padding: 20,
              borderRadius: 24,
              background: "rgba(15, 23, 42, 0.7)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                paddingBottom: 8,
                borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                fontSize: 12,
                fontWeight: 700,
                color: "#94a3b8",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              <span>Featured Links</span>
              <span style={{ color: "#22d3ee" }}>● Live Bio</span>
            </div>

            {previewLinks.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "13px 18px",
                  borderRadius: 14,
                  background: "rgba(255, 255, 255, 0.06)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  fontSize: 15,
                  fontWeight: 600,
                  color: "#ffffff",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span>{item.title}</span>
                </div>
                <div
                  style={{
                    padding: "3px 8px",
                    borderRadius: 8,
                    background: "rgba(6, 182, 212, 0.2)",
                    color: "#22d3ee",
                    fontSize: 12,
                    fontWeight: 700,
                    fontFamily: "monospace",
                  }}
                >
                  👆 {item.clickCount || 0}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: 20,
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            fontSize: 14,
            color: "#64748b",
          }}
        >
          <div>단 하나의 링크로 연결되는 나만의 공간</div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              color: "#38bdf8",
              fontWeight: 700,
            }}
          >
            <span>MyLink</span>
            <span>·</span>
            <span>모바일 최적화 링크인바이오</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
