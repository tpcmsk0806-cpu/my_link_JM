import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import QueryProvider from "@/components/providers/QueryProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://my-link-jm-phi.vercel.app"
  ),
  title: {
    default: "마이링크 (MyLink) — 모바일 최적화 링크인바이오",
    template: "%s | 마이링크 (MyLink)",
  },
  description:
    "인스타그램, 유튜브, 블로그, 포트폴리오를 단 하나의 링크로 연결하세요. 모바일 최적화 링크인바이오 및 실시간 클릭 통계 분석 서비스.",
  keywords: [
    "링크인바이오",
    "마이링크",
    "MyLink",
    "인스타 링크",
    "프로필 링크",
    "멀티링크",
    "클릭 분석",
    "포트폴리오",
    "Link in bio",
  ],
  authors: [{ name: "MyLink" }],
  creator: "MyLink",
  publisher: "MyLink",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "마이링크 (MyLink) — 모바일 최적화 링크인바이오",
    description: "세상의 모든 나를 하나의 링크에 담다. 나만의 프로필과 실시간 클릭 분석.",
    url: "/",
    siteName: "마이링크 (MyLink)",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "마이링크 (MyLink) — 모바일 최적화 링크인바이오",
    description: "세상의 모든 나를 하나의 링크에 담다.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-black text-white">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
