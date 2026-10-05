import { NextRequest, NextResponse } from "next/server";
import { recordLinkClick } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { linkId } = body;

    if (!linkId) {
      return NextResponse.json({ error: "linkId is required" }, { status: 400 });
    }

    recordLinkClick(linkId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("LinkClick record error:", error);
    return NextResponse.json({ error: "Failed to record click" }, { status: 500 });
  }
}
