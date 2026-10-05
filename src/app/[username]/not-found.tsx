import Link from "next/link";
import { Link2, ArrowLeft } from "lucide-react";

export default function ProfileNotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 mb-6 shadow-xl">
        <Link2 className="w-8 h-8 -rotate-45" />
      </div>

      <h1 className="text-3xl font-extrabold text-white mb-2">
        존재하지 않는 프로필입니다
      </h1>

      <p className="text-sm text-zinc-400 max-w-sm mb-8">
        입력하신 주소의 마이링크 페이지를 찾을 수 없습니다. 주소를 다시 확인하거나 지금 나만의 링크를 만들어보세요!
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/"
          className="px-6 py-3 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-sm font-semibold text-zinc-300 flex items-center justify-center gap-2 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>홈으로 돌아가기</span>
        </Link>
        <Link
          href="/signup"
          className="px-6 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition-all"
        >
          이 주소로 마이링크 만들기
        </Link>
      </div>
    </div>
  );
}
