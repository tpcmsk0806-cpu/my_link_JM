import { NextRequest, NextResponse } from "next/server";
import { getUserByEmail, createUser, getProfileByUserId, getProfileByUsername } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, email, password, username } = body;

    if (action === "demo") {
      // Return demo profile (Alex)
      const profile = getProfileByUsername("alex");
      if (!profile) {
        return NextResponse.json({ error: "Demo profile not found" }, { status: 404 });
      }
      const response = NextResponse.json({ success: true, profile });
      response.cookies.set("mylink_session", profile.id, {
        path: "/",
        httpOnly: false,
        maxAge: 60 * 60 * 24 * 7,
      });
      return response;
    }

    if (action === "signup") {
      if (!email || !password || !username) {
        return NextResponse.json({ error: "이메일, 비밀번호, 사용자 이름을 모두 입력해주세요." }, { status: 400 });
      }

      const cleanUsername = username.toLowerCase().trim();
      const reserved = ["admin", "api", "login", "signup", "dashboard", "settings", "terms", "privacy", "demo"];
      if (reserved.includes(cleanUsername)) {
        return NextResponse.json({ error: "사용할 수 없는 예약된 핸들 이름입니다." }, { status: 400 });
      }

      if (!/^[a-z0-9_-]{3,20}$/.test(cleanUsername)) {
        return NextResponse.json({ error: "사용자 이름은 3~20자의 영문 소문자, 숫자, _, - 만 가능합니다." }, { status: 400 });
      }

      if (getUserByEmail(email)) {
        return NextResponse.json({ error: "이미 가입된 이메일 주소입니다." }, { status: 409 });
      }

      if (getProfileByUsername(cleanUsername)) {
        return NextResponse.json({ error: "이미 사용 중인 사용자 이름입니다." }, { status: 409 });
      }

      const { user, profile } = createUser(email, password, cleanUsername);
      const response = NextResponse.json({ success: true, profile, user });
      response.cookies.set("mylink_session", profile.id, {
        path: "/",
        httpOnly: false,
        maxAge: 60 * 60 * 24 * 7,
      });
      return response;
    }

    if (action === "login") {
      if (!email || !password) {
        return NextResponse.json({ error: "이메일과 비밀번호를 입력해주세요." }, { status: 400 });
      }

      const user = getUserByEmail(email);
      if (!user || user.password !== password) {
        return NextResponse.json({ error: "이메일 또는 비밀번호가 올바르지 않습니다." }, { status: 401 });
      }

      const profile = getProfileByUserId(user.id);
      if (!profile) {
        return NextResponse.json({ error: "프로필을 찾을 수 없습니다." }, { status: 404 });
      }

      const response = NextResponse.json({ success: true, profile, user });
      response.cookies.set("mylink_session", profile.id, {
        path: "/",
        httpOnly: false,
        maxAge: 60 * 60 * 24 * 7,
      });
      return response;
    }

    if (action === "logout") {
      const response = NextResponse.json({ success: true });
      response.cookies.delete("mylink_session");
      return response;
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Auth API error:", error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
