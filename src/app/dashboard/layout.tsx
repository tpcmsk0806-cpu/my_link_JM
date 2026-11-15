import { Metadata } from "next";

export const metadata: Metadata = {
  title: "링크 관리 대시보드",
  description: "내 프로필과 링크를 실시간으로 추가, 수정 및 정렬 관리하세요.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
