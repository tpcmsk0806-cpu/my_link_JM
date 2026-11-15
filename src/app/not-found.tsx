import Link from "next/link";
import { Link2, ArrowLeft, AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-between bg-gradient-to-b from-slate-950 via-zinc-900 to-black text-white px-4 py-8">
      {/* Top Header */}
      <header className="w-full max-w-7xl mx-auto flex items-center justify-between border-b border-white/10 pb-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
            <Link2 className="w-4 h-4 -rotate-45" />
          </div>
          <span className="font-extrabold text-base tracking-tight text-white">
            MyLink
          </span>
        </Link>
      </header>

      {/* Main 404 Content */}
      <main className="flex flex-col items-center text-center max-w-md my-auto px-4">
        <div className="w-16 h-16 rounded-3xl bg-rose-500/10 text-rose-400 flex items-center justify-center mb-5 ring-1 ring-rose-500/20">
          <AlertCircle className="w-8 h-8" />
        </div>

        <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-widest mb-1">
          404 Not Found
        </span>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3">
          페이지를 찾을 수 없습니다
        </h1>

        <p className="text-sm text-zinc-400 leading-relaxed mb-8">
          요청하신 사용자 프로필이 존재하지 않거나, 주소가 잘못 입력되었습니다.
          아이디나 닉네임을 다시 한번 확인해 주세요.
        </p>

        <Link
          href="/"
          className="px-6 py-3 rounded-2xl bg-white hover:bg-slate-100 text-slate-950 font-bold text-sm shadow-xl flex items-center gap-2 active:scale-95 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>마이링크 홈으로 돌아가기</span>
        </Link>
      </main>

      {/* Footer */}
      <footer className="w-full text-center py-4 text-xs text-zinc-600 border-t border-white/5">
        MyLink · 모바일 최적화 링크인바이오
      </footer>
    </div>
  );
}
