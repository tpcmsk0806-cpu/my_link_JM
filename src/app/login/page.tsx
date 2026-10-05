"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Link2, ArrowRight, Lock, Mail, Sparkles, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "로그인에 실패했습니다.");
      }

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "demo" }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "데모 로그인 실패");
      }
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "데모 로그인 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center px-4 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-cyan-600/20 blur-[120px] pointer-events-none rounded-full" />

      <div className="w-full max-w-md relative z-10">
        {/* Brand Logo */}
        <div className="flex flex-col items-center mb-8 text-center">
          <Link href="/" className="flex items-center gap-2 mb-4 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/25 group-hover:scale-105 transition-transform">
              <Link2 className="w-5 h-5 -rotate-45" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-white">
              마이링크
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-white tracking-tight">다시 오신 것을 환영해요</h1>
          <p className="text-zinc-400 text-sm mt-1">대시보드에 로그인하여 링크를 관리하세요</p>
        </div>

        {/* Demo Fast Login Button */}
        <div className="mb-6">
          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={loading}
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-cyan-950/80 to-blue-950/80 border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/10 hover:scale-[1.01] active:scale-[0.99] transition-all"
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>원클릭 데모 계정(@alex)으로 둘러보기</span>
          </button>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-[1px] bg-zinc-800" />
          <span className="text-xs text-zinc-500 font-medium">또는 이메일로 로그인</span>
          <div className="flex-1 h-[1px] bg-zinc-800" />
        </div>

        {/* Form Card */}
        <div className="bg-zinc-900/90 border border-zinc-800/80 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-sm flex items-center justify-center gap-1.5 shadow-lg shadow-cyan-500/20 active:scale-95 transition-all disabled:opacity-50"
            >
              <span>{loading ? "로그인 중..." : "로그인"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-zinc-400">
            아직 계정이 없으신가요?{" "}
            <Link href="/signup" className="text-cyan-400 hover:underline font-semibold ml-1">
              무료 회원가입
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
