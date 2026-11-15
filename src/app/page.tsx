import { Metadata } from "next";
import ProfilePageView from "@/components/profile/ProfilePageView";

export const metadata: Metadata = {
  title: "세상의 모든 나를 하나의 링크에 담다",
  description:
    "인스타그램, 유튜브, 블로그, 포트폴리오를 한곳에 모으세요. 단 1초 만에 나만의 프로필 페이지를 만들고 실시간 방문자 클릭 수까지 손쉽게 관리할 수 있습니다.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "마이링크 (MyLink) — 세상의 모든 나를 하나의 링크에 담다",
    description:
      "인스타그램, 유튜브, 블로그, 포트폴리오를 한곳에 모으고 실시간 클릭을 분석하세요.",
    url: "/",
    type: "website",
  },
};

export default function Home() {
  return <ProfilePageView />;
}
