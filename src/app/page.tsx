export default function ProfilePage() {
  return (
    <main className="flex min-h-screen flex-1 flex-col items-center justify-center p-6 bg-zinc-50 dark:bg-zinc-950">
      <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-zinc-900 p-8 shadow-sm border border-zinc-200/80 dark:border-zinc-800 flex flex-col items-center text-center transition-all">
        {/* 프로필 아바타 */}
        <div className="relative mb-5">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-500 text-white flex items-center justify-center text-3xl font-bold shadow-md shadow-indigo-500/20">
            구
          </div>
          <span
            className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-zinc-900"
            title="온라인"
          />
        </div>

        {/* 이름 */}
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
          구진모
        </h1>

        {/* 뱃지 */}
        <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
          Junior Software Developer
        </div>

        {/* 소개글 */}
        <p className="mt-4 text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed break-keep">
          직관적인 사용자 경험과 지속 가능한 코드를 고민하는 개발자입니다. 새로운 기술을 탐구하고 문제를 해결하며 성장하는 과정을 즐깁니다.
        </p>

        {/* 하단 구분선 및 상태 정보 */}
        <div className="w-full mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-800/80 flex flex-col items-center gap-3">
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            아이디어를 코드로 실현해 나갑니다 🚀
          </p>
        </div>
      </div>
    </main>
  );
}
