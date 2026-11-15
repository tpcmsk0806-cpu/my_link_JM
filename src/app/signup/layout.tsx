import { Metadata } from "next";

export const metadata: Metadata = {
  title: "회원가입",
  description:
    "마이링크에 간편하게 가입하고 나만의 고유 프로필 링크를 만드세요.",
  alternates: {
    canonical: "/signup",
  },
  openGraph: {
    title: "회원가입 | 마이링크 (MyLink)",
    description: "단 3초 만에 나만의 링크인바이오를 시작하세요.",
  },
};

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
