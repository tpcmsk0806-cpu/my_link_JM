import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProfileByUsername, getLinksByProfileId, recordPageView } from "@/lib/db";
import ProfileView from "@/components/ProfileView";

interface PageProps {
  params: Promise<{
    username: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = await params;
  const profile = getProfileByUsername(username);

  if (!profile) {
    return {
      title: "프로필을 찾을 수 없습니다 | 마이링크",
      description: "존재하지 않는 마이링크 사용자 페이지입니다.",
    };
  }

  return {
    title: `${profile.displayName} (@${profile.username}) | 마이링크`,
    description: profile.bio || `${profile.displayName}의 마이링크 프로필입니다.`,
    openGraph: {
      title: `${profile.displayName} | 마이링크`,
      description: profile.bio || `${profile.displayName}의 공식 링크 모음`,
      images: profile.avatarUrl ? [{ url: profile.avatarUrl }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${profile.displayName} | 마이링크`,
      description: profile.bio,
      images: profile.avatarUrl ? [profile.avatarUrl] : [],
    },
  };
}

export default async function PublicProfilePage({ params }: PageProps) {
  const { username } = await params;
  const profile = getProfileByUsername(username);

  if (!profile) {
    notFound();
  }

  // Record page view on server
  recordPageView(profile.id);

  const links = getLinksByProfileId(profile.id);

  return (
    <main className="min-h-screen w-full flex flex-col justify-center items-center">
      <div className="w-full max-w-lg min-h-screen flex flex-col">
        <ProfileView profile={profile} links={links} isPreview={false} />
      </div>
    </main>
  );
}
