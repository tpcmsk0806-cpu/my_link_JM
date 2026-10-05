import { Metadata } from "next";
import ProfilePageView from "@/components/profile/ProfilePageView";

export const metadata: Metadata = {
  title: "마이링크 (MyLink) — 모바일 최적화 링크인바이오",
  description:
    "사용자의 다양한 온라인 채널을 단 하나의 모바일 최적화 페이지로 통합하여 보여주는 링크인바이오 서비스",
  openGraph: {
    title: "마이링크 (MyLink) — 모바일 최적화 링크인바이오",
    description: "단 하나의 링크로 당신의 모든 채널을 연결하세요.",
  },
};

export default function Home() {
  return <ProfilePageView />;
}
