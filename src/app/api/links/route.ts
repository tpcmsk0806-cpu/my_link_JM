import { NextRequest, NextResponse } from "next/server";
import { getLinksByProfileId, addLink, updateLink, deleteLink, reorderLinks } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const profileId = searchParams.get("profileId") || req.cookies.get("mylink_session")?.value || "profile-alex-1";

    const links = getLinksByProfileId(profileId);
    return NextResponse.json({ success: true, links });
  } catch (error) {
    console.error("Links GET error:", error);
    return NextResponse.json({ error: "Failed to fetch links" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { profileId, title, url } = body;

    const targetProfileId = profileId || req.cookies.get("mylink_session")?.value || "profile-alex-1";

    if (!title || !url) {
      return NextResponse.json({ error: "제목과 링크 URL을 모두 입력해주세요." }, { status: 400 });
    }

    let formattedUrl = url.trim();
    if (!/^https?:\/\//i.test(formattedUrl) && !formattedUrl.startsWith("mailto:")) {
      formattedUrl = "https://" + formattedUrl;
    }

    const newLink = addLink(targetProfileId, title, formattedUrl);
    return NextResponse.json({ success: true, link: newLink });
  } catch (error) {
    console.error("Links POST error:", error);
    return NextResponse.json({ error: "Failed to create link" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, updates } = body;

    if (!id) {
      return NextResponse.json({ error: "Link ID is required" }, { status: 400 });
    }

    if (updates.url) {
      let formattedUrl = updates.url.trim();
      if (!/^https?:\/\//i.test(formattedUrl) && !formattedUrl.startsWith("mailto:")) {
        updates.url = "https://" + formattedUrl;
      }
    }

    const updated = updateLink(id, updates);
    if (!updated) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, link: updated });
  } catch (error) {
    console.error("Links PUT error:", error);
    return NextResponse.json({ error: "Failed to update link" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Link ID is required" }, { status: 400 });
    }

    const deleted = deleteLink(id);
    if (!deleted) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Links DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete link" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { profileId, linkIds } = body;

    const targetProfileId = profileId || req.cookies.get("mylink_session")?.value || "profile-alex-1";

    if (!Array.isArray(linkIds)) {
      return NextResponse.json({ error: "linkIds must be an array" }, { status: 400 });
    }

    const reordered = reorderLinks(targetProfileId, linkIds);
    return NextResponse.json({ success: true, links: reordered });
  } catch (error) {
    console.error("Links PATCH error:", error);
    return NextResponse.json({ error: "Failed to reorder links" }, { status: 500 });
  }
}
