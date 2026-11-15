import { Metadata } from "next";

export const metadata: Metadata = {
  title: "링크 클릭 통계 대시보드",
  description:
    "등록된 링크의 실시간 누적 클릭수, 링크별 인기 순위 및 점유율 차트를 확인하세요.",
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "링크 클릭 통계 대시보드 | 마이링크 (MyLink)",
    description: "실시간 클릭수 비교 차트와 점유율 도넛 그래프를 확인하세요.",
  },
};

export default function StatsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
