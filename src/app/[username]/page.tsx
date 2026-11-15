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
      title: "프로필을 찾을 수 없습니다 | 마이링크",
      description: "존재하지 않거나 비공개된 마이링크 사용자 페이지입니다.",
    };
  }

  return {
    title: `${profile.displayName} (@${profile.username}) | 마이링크`,
    description: profile.bio || `${profile.displayName}님의 공식 마이링크 모음입니다.`,
    openGraph: {
      title: `${profile.displayName} | 마이링크`,
      description: profile.bio || `${profile.displayName}님의 모든 채널을 한눈에 확인하세요.`,
      images: profile.avatarUrl ? [{ url: profile.avatarUrl }] : [],
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
