import { NextRequest, NextResponse } from "next/server";
import { recordPageView, getProfileByUsername } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, profileId } = body;

    let targetProfileId = profileId;
    if (!targetProfileId && username) {
      const profile = getProfileByUsername(username);
      if (profile) targetProfileId = profile.id;
    }

    if (targetProfileId) {
      recordPageView(targetProfileId);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PageView record error:", error);
    return NextResponse.json({ error: "Failed to record view" }, { status: 500 });
  }
}
