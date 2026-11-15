import { Metadata } from "next";

export const metadata: Metadata = {
  title: "로그인",
  description:
    "마이링크에 로그인하고 나만의 모바일 최적화 링크인바이오 페이지를 시작하세요.",
  alternates: {
    canonical: "/login",
  },
  openGraph: {
    title: "로그인 | 마이링크 (MyLink)",
    description: "Google 원클릭 로그인으로 나만의 링크 페이지를 관리하세요.",
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
