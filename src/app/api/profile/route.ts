import { NextRequest, NextResponse } from "next/server";
import { getProfileById, getProfileByUsername, updateProfile, getAnalyticsSummary } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username");
    const id = searchParams.get("id");

    const sessionCookie = req.cookies.get("mylink_session")?.value;
    const targetId = id || sessionCookie || "profile-alex-1";

    let profile = null;
    if (username) {
      profile = getProfileByUsername(username);
    } else {
      profile = getProfileById(targetId);
    }

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const analytics = getAnalyticsSummary(profile.id);

    return NextResponse.json({ success: true, profile, analytics });
  } catch (error) {
    console.error("Profile GET error:", error);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, updates } = body;

    const sessionCookie = req.cookies.get("mylink_session")?.value;
    const profileId = id || sessionCookie || "profile-alex-1";

    const updated = updateProfile(profileId, updates);
    if (!updated) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, profile: updated });
  } catch (error) {
    console.error("Profile PUT error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
