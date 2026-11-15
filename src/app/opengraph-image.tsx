import { ImageResponse } from "next/og";

export const runtime = "nodejs";

// Image metadata
export const alt = "마이링크 MyLink — 모바일 최적화 링크인바이오";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px 70px",
          backgroundColor: "#090b10",
          backgroundImage:
            "radial-gradient(circle at 15% 20%, rgba(6, 182, 212, 0.22) 0%, transparent 45%), radial-gradient(circle at 85% 75%, rgba(99, 102, 241, 0.20) 0%, transparent 45%)",
          color: "#ffffff",
          fontFamily: "system-ui, -apple-system, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle grid pattern border decoration */}
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

        {/* Top Header: Logo & Service Category */}
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
              gap: 16,
            }}
          >
            {/* Logo Badge */}
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 18,
                background: "linear-gradient(135deg, #06b6d4 0%, #2563eb 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 10px 25px rgba(6, 182, 212, 0.35)",
              }}
            >
              <svg
                width="28"
                height="28"
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
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  fontSize: 26,
                  fontWeight: 900,
                  letterSpacing: "-0.5px",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span>마이링크</span>
                <span
                  style={{
                    color: "#22d3ee",
                    fontSize: 20,
                    fontFamily: "monospace",
                    fontWeight: 700,
                  }}
                >
                  MyLink
                </span>
              </div>
              <span style={{ fontSize: 13, color: "#94a3b8", fontWeight: 500 }}>
                모바일 최적화 링크인바이오
              </span>
            </div>
          </div>

          {/* Live Indicator */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 16px",
              borderRadius: 20,
              background: "rgba(6, 182, 212, 0.12)",
              border: "1px solid rgba(6, 182, 212, 0.3)",
              fontSize: 13,
              fontWeight: 700,
              color: "#67e8f9",
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#22d3ee",
              }}
            />
            <span>LINK-IN-BIO</span>
          </div>
        </div>

        {/* Center Main Stage */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            marginTop: 10,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              color: "#38bdf8",
              fontSize: 16,
              fontWeight: 700,
            }}
          >
            <span>✨</span>
            <span>단 하나의 링크로 당신의 모든 채널을 연결하세요</span>
          </div>

          <div
            style={{
              fontSize: 56,
              fontWeight: 900,
              lineHeight: 1.15,
              letterSpacing: "-1.5px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span>세상의 모든 나를</span>
            <span
              style={{
                backgroundImage: "linear-gradient(90deg, #22d3ee 0%, #38bdf8 50%, #818cf8 100%)",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              하나의 링크에 담다
            </span>
          </div>

          <div
            style={{
              fontSize: 20,
              color: "#94a3b8",
              fontWeight: 400,
              lineHeight: 1.5,
              maxWidth: 780,
            }}
          >
            인스타그램, 유튜브, 블로그, 포트폴리오를 한곳에 모으고 실시간 방문자 클릭 수까지 한눈에 분석하세요.
          </div>
        </div>

        {/* Bottom Feature Badges */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: 24,
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          <div style={{ display: "flex", gap: 12 }}>
            <div
              style={{
                padding: "8px 16px",
                borderRadius: 12,
                background: "rgba(255, 255, 255, 0.06)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                fontSize: 14,
                fontWeight: 600,
                color: "#cbd5e1",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <span>📊</span>
              <span>실시간 클릭 분석 (/stats)</span>
            </div>

            <div
              style={{
                padding: "8px 16px",
                borderRadius: 12,
                background: "rgba(255, 255, 255, 0.06)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                fontSize: 14,
                fontWeight: 600,
                color: "#cbd5e1",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <span>🌐</span>
              <span>스마트 파비콘 자동 감지</span>
            </div>

            <div
              style={{
                padding: "8px 16px",
                borderRadius: 12,
                background: "rgba(255, 255, 255, 0.06)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                fontSize: 14,
                fontWeight: 600,
                color: "#cbd5e1",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <span>📱</span>
              <span>모바일 최적화 9:16</span>
            </div>
          </div>

          <div
            style={{
              fontSize: 15,
              fontFamily: "monospace",
              fontWeight: 800,
              color: "#22d3ee",
            }}
          >
            my-link-jm-phi.vercel.app
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
