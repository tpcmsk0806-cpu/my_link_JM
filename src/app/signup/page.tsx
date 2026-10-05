"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Link2, ArrowRight, Lock, Mail, User, AlertCircle, CheckCircle2 } from "lucide-react";

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const qUsername = searchParams.get("username");
    if (qUsername) {
      setUsername(qUsername.toLowerCase().trim());
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "signup", email, password, username }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "회원가입에 실패했습니다.");
      }

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const isUsernameValid = /^[a-z0-9_-]{3,20}$/.test(username);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center px-4 relative overflow-hidden">
      {/* Ambient Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[320px] bg-blue-600/20 blur-[130px] pointer-events-none rounded-full" />

      <div className="w-full max-w-md relative z-10">
        <div className="flex flex-col items-center mb-8 text-center">
          <Link href="/" className="flex items-center gap-2 mb-4 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/25 group-hover:scale-105 transition-transform">
              <Link2 className="w-5 h-5 -rotate-45" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-white">
              마이링크
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-white tracking-tight">30초 만에 링크 만들기</h1>
          <p className="text-zinc-400 text-sm mt-1">나만의 고유 링크 주소를 선점하세요</p>
        </div>

        <div className="bg-zinc-900/90 border border-zinc-800/80 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-zinc-400">
                  고유 링크 주소 (핸들)
                </label>
                {username && (
                  <span className={`text-[11px] font-medium flex items-center gap-1 ${isUsernameValid ? "text-emerald-400" : "text-amber-400"}`}>
                    {isUsernameValid ? <CheckCircle2 className="w-3 h-3" /> : null}
                    {isUsernameValid ? "사용 가능한 형식" : "3~20자 영문소문자/숫자/_/-"}
                  </span>
                )}
              </div>
              <div className="relative flex items-center bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 focus-within:border-cyan-500 transition-colors">
                <span className="text-zinc-500 font-medium text-sm">mylink.io/</span>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().trim())}
                  placeholder="yourname"
                  className="w-full bg-transparent text-white font-medium text-sm focus:outline-none pl-1"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
                이메일 주소
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
                비밀번호
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="6자 이상 입력"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !isUsernameValid}
              className="mt-2 w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-sm flex items-center justify-center gap-1.5 shadow-lg shadow-cyan-500/20 active:scale-95 transition-all disabled:opacity-50"
            >
              <span>{loading ? "계정 생성 중..." : "마이링크 무료로 만들기"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-zinc-400">
            이미 계정이 있으신가요?{" "}
            <Link href="/login" className="text-cyan-400 hover:underline font-semibold ml-1">
              로그인
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black flex items-center justify-center text-zinc-400 text-sm">
          로딩 중...
        </div>
      }
    >
      <SignupForm />
    </Suspense>
  );
}
