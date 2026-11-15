import { Metadata } from "next";
import { notFound } from "next/navigation";
import { findUserByDisplayNameOrUsername } from "@/lib/firestoreProfile";
import { getLinksFromFirestore } from "@/lib/firestoreLinks";
import PublicProfilePageView from "@/components/profile/PublicProfilePageView";

interface PageProps {
  params: Promise<{
    username: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = await params;
  const decodedName = decodeURIComponent(username || "");
  const profile = await findUserByDisplayNameOrUsername(decodedName);

  if (!profile || !profile.username) {
    return {
      title: "프로필을 찾을 수 없습니다",
      description: "존재하지 않거나 비공개된 마이링크 사용자 페이지입니다.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = `${profile.displayName} (@${profile.username})`;
  const description =
    profile.bio ||
    `${profile.displayName}님의 공식 마이링크 모음입니다. 유튜브, 인스타그램, 블로그 등 모든 채널을 한눈에 확인하세요.`;

  return {
    title,
    description,
    keywords: [
      profile.displayName,
      profile.username,
      "마이링크",
      "링크인바이오",
      "프로필 링크",
    ],
    alternates: {
      canonical: `/${profile.username}`,
    },
    openGraph: {
      title: `${title} | 마이링크`,
      description,
      url: `/${profile.username}`,
      siteName: "마이링크 (MyLink)",
      type: "profile",
      locale: "ko_KR",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | 마이링크`,
      description,
    },
  };
}

export default async function PublicProfilePage({ params }: PageProps) {
  const { username } = await params;
  const decodedName = decodeURIComponent(username || "");
  
  // 1. displayName 또는 username으로 유저 검색
  const userProfile = await findUserByDisplayNameOrUsername(decodedName);

  // 2. 일치하는 유저가 없거나 username이 없으면 404 페이지 이동
  if (!userProfile || !userProfile.username) {
    notFound();
  }

  // 3. Firestore users/{userId}/links 에서 링크 목록 조회
  const links = await getLinksFromFirestore(userProfile.userId);

  return <PublicProfilePageView profile={userProfile} links={links} />;
}
