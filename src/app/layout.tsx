import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "마이링크 (MyLink) — 모든 나를 하나로 연결하는 링크인바이오",
  description:
    "인스타그램, 유튜브, 깃허브, 쇼핑몰 등 당신의 모든 링크를 모바일에 최적화된 단 하나의 페이지로 통합하세요. 실시간 미리보기와 6가지 프리셋 테마 지원.",
  openGraph: {
    title: "마이링크 (MyLink) — 모바일 최적화 링크인바이오",
    description: "세상의 모든 나를 하나의 링크로 연결하세요.",
    type: "website",
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
      <body className="min-h-full flex flex-col bg-black text-white">{children}</body>
    </html>
  );
}
