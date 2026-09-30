import Image from "next/image";
import {
  Mail,
  ArrowUpRight,
  Code2,
  Sparkles,
  Layers,
  MapPin,
  Terminal,
  Cpu,
  Flame,
} from "lucide-react";

function GithubIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default function ProfilePage() {
  const techStack = [
    { name: "Next.js", bg: "bg-black text-white" },
    { name: "React", bg: "bg-[#67E8F9] text-black" },
    { name: "TypeScript", bg: "bg-[#93C5FD] text-black" },
    { name: "Tailwind CSS", bg: "bg-[#A7F3D0] text-black" },
    { name: "Node.js", bg: "bg-[#86EFAC] text-black" },
    { name: "Git", bg: "bg-[#FCA5A5] text-black" },
  ];

  const highlights = [
    {
      icon: <Code2 className="w-5 h-5 text-black" />,
      title: "Clean Code",
      desc: "유지보수와 확장을 고려한 탄탄한 구조",
      bg: "bg-[#FEF08A]", // pastel yellow
    },
    {
      icon: <Sparkles className="w-5 h-5 text-black" />,
      title: "UI / UX",
      desc: "직관적이고 매끄러운 유저 인터랙션",
      bg: "bg-[#BAE6FD]", // pastel blue
    },
    {
      icon: <Layers className="w-5 h-5 text-black" />,
      title: "Problem Solver",
      desc: "기술을 통한 실질적 가치 창출과 해결",
      bg: "bg-[#BBF7D0]", // pastel green
    },
  ];

  const links = [
    {
      title: "GitHub Profile",
      desc: "프로젝트 소스코드 및 커밋 활동",
      href: "https://github.com/tpcmsk0806-cpu",
      icon: <GithubIcon className="w-6 h-6 text-black" />,
      badge: "CODE",
      badgeColor: "bg-[#FFE600]",
      hoverBg: "hover:bg-[#FFF59D]",
    },
    {
      title: "Email Contact",
      desc: "협업 문의 및 커피챗 제안",
      href: "mailto:contact@example.com",
      icon: <Mail className="w-6 h-6 text-black" />,
      badge: "HELLO",
      badgeColor: "bg-[#A3E635]",
      hoverBg: "hover:bg-[#D9F99D]",
    },
  ];

  return (
    <main className="min-h-screen w-full bg-[#FFFDF0] dark:bg-[#121214] text-black dark:text-zinc-100 flex flex-col items-center justify-center p-3 sm:p-6 md:p-10 relative overflow-x-hidden">
      
      {/* 네오브루탈리즘 레트로 도트 배경 패턴 */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-30 dark:opacity-20 bg-[radial-gradient(#000000_1.5px,transparent_1.5px)] dark:bg-[radial-gradient(#ffffff_1.5px,transparent_1.5px)] [background-size:20px_20px]" 
        aria-hidden="true" 
      />

      {/* 상단 롤링 마키 뱃지 티커 */}
      <div className="w-full max-w-2xl mb-4 z-10">
        <div className="bg-[#FFE600] border-2 sm:border-[3px] border-black px-4 py-2 rounded-xl shadow-[4px_4px_0px_0px_#000] flex items-center justify-between gap-2 overflow-hidden text-xs sm:text-sm font-black tracking-wider uppercase">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-500 border border-black animate-pulse" />
            <span>PORTFOLIO // JINMO KU</span>
          </div>
          <span className="hidden sm:inline-block bg-black text-white px-2.5 py-0.5 rounded text-[11px] font-bold">
            2026 EDITION
          </span>
          <div className="flex items-center gap-1.5 text-xs font-bold">
            <Flame className="w-4 h-4 text-orange-600 fill-orange-500" />
            <span>OPEN TO WORK</span>
          </div>
        </div>
      </div>

      {/* 메인 프로필 카드 컨테이너 */}
      <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 border-[3px] border-black dark:border-black rounded-3xl shadow-[8px_8px_0px_0px_#000] dark:shadow-[8px_8px_0px_0px_#27272a] overflow-hidden z-10 transition-all">
        
        {/* 상단 배너 섹션 */}
        <div className="relative w-full h-40 sm:h-48 md:h-52 border-b-[3px] border-black overflow-hidden bg-[#7C3AED]">
          <Image
            src="/images/banner.jpg"
            alt="커버 배너"
            fill
            priority
            className="object-cover object-center"
          />
          {/* 배너 위 스티커들 */}
          <div className="absolute top-3 left-3 bg-[#00F0FF] text-black border-2 border-black px-3 py-1 rounded-lg text-xs font-black shadow-[3px_3px_0px_0px_#000] rotate-[-2deg]">
            🚀 NEXT.JS DEV
          </div>
          <div className="absolute top-3 right-3 bg-[#FF5D8F] text-white border-2 border-black px-3 py-1 rounded-lg text-xs font-black shadow-[3px_3px_0px_0px_#000] rotate-[3deg]">
            ★ VIBE CODER
          </div>
        </div>

        {/* 프로필 본문 영역 */}
        <div className="p-5 sm:p-8">

          {/* 아바타 & 기본 신상 헤더 */}
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 -mt-16 sm:-mt-20 mb-6">
            {/* 아바타 이미지 (네오브루탈리즘 프레임) */}
            <div className="relative group shrink-0">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-[3px] border-black bg-white shadow-[6px_6px_0px_0px_#000] rotate-[-1deg] group-hover:rotate-0 transition-transform">
                <Image
                  src="/images/avatar.jpg"
                  alt="구진모 개발자 아바타"
                  fill
                  priority
                  className="object-cover"
                />
              </div>
              {/* 온라인 상태 인디케이터 스티커 */}
              <div 
                className="absolute -bottom-1 -right-1 bg-[#A3E635] text-black text-[10px] font-black px-2 py-0.5 rounded-full border-2 border-black shadow-[2px_2px_0px_0px_#000] flex items-center gap-1"
                title="상시 온라인"
              >
                <span className="w-2 h-2 rounded-full bg-black animate-ping" />
                <span>ONLINE</span>
              </div>
            </div>

            {/* 이름 및 직무 뱃지 */}
            <div className="text-center sm:text-left flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-black dark:text-white">
                  구진모
                </h1>
                <span className="bg-[#FFE600] text-black border-2 border-black px-2.5 py-0.5 rounded-md text-xs font-black shadow-[2px_2px_0px_0px_#000]">
                  PRO DEV
                </span>
              </div>

              {/* 뱃지 태그 바 */}
              <div className="mt-2.5 flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs font-bold">
                <span className="inline-flex items-center gap-1 bg-[#E0E7FF] dark:bg-indigo-950 text-indigo-950 dark:text-indigo-200 border-2 border-black px-2.5 py-1 rounded-lg shadow-[2px_2px_0px_0px_#000]">
                  <Cpu className="w-3.5 h-3.5" />
                  Junior Software Developer
                </span>
                <span className="inline-flex items-center gap-1 bg-white dark:bg-zinc-800 text-black dark:text-zinc-200 border-2 border-black px-2.5 py-1 rounded-lg shadow-[2px_2px_0px_0px_#000]">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  Seoul, Korea
                </span>
              </div>
            </div>
          </div>

          {/* 소개글 노란색 메모 노트 블록 */}
          <div className="relative bg-[#FEF08A] text-black border-[3px] border-black rounded-2xl p-4 sm:p-5 shadow-[5px_5px_0px_0px_#000] rotate-[-0.5deg] mb-7">
            <div className="absolute -top-3 left-4 bg-black text-[#FEF08A] text-[10px] font-black px-2.5 py-0.5 rounded uppercase tracking-wider">
              📌 About Me
            </div>
            <p className="mt-1 text-sm sm:text-base font-bold leading-relaxed break-keep">
              직관적인 사용자 경험과 지속 가능한 코드를 고민하는 개발자입니다. 새로운 기술을 탐구하고 문제를 해결하며 성장하는 과정을 즐깁니다.
            </p>
          </div>

          {/* 핵심 강점 3단 그리드 (컬러풀 카드) */}
          <div className="mb-7">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-black text-white text-xs font-black px-2.5 py-1 rounded-md">
                ⚡ FOCUS AREAS
              </span>
              <div className="h-0.5 flex-1 bg-black/10 dark:bg-white/10" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {highlights.map((item, idx) => (
                <div
                  key={idx}
                  className={`${item.bg} text-black border-2 border-black rounded-2xl p-4 shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] transition-all`}
                >
                  <div className="w-8 h-8 rounded-lg bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000] flex items-center justify-center mb-2.5">
                    {item.icon}
                  </div>
                  <h3 className="font-black text-sm mb-1">{item.title}</h3>
                  <p className="text-xs font-semibold leading-snug text-zinc-800">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 기술 스택 칩스 */}
          <div className="mb-7">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-black text-white text-xs font-black px-2.5 py-1 rounded-md">
                🛠 TECH STACK
              </span>
              <div className="h-0.5 flex-1 bg-black/10 dark:bg-white/10" />
            </div>

            <div className="flex flex-wrap gap-2">
              {techStack.map((tech) => (
                <div
                  key={tech.name}
                  className={`${tech.bg} border-2 border-black font-black text-xs px-3.5 py-1.5 rounded-xl shadow-[3px_3px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_#000] transition-all cursor-default select-none`}
                >
                  {tech.name}
                </div>
              ))}
            </div>
          </div>

          {/* 소셜 및 액션 링크 버튼들 */}
          <div className="mb-7 space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-black text-white text-xs font-black px-2.5 py-1 rounded-md">
                🔗 CONNECT & LINKS
              </span>
              <div className="h-0.5 flex-1 bg-black/10 dark:bg-white/10" />
            </div>

            {links.map((link, idx) => (
              <a
                key={idx}
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className={`group flex items-center justify-between p-4 bg-white dark:bg-zinc-800 text-black dark:text-white border-[3px] border-black rounded-2xl shadow-[5px_5px_0px_0px_#000] ${link.hoverBg} hover:text-black hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000] flex items-center justify-center group-hover:scale-105 transition-transform">
                    {link.icon}
                  </div>
                  <div className="text-left">
                    <div className="font-black text-sm sm:text-base flex items-center gap-2">
                      {link.title}
                      <span className={`${link.badgeColor} text-black text-[10px] font-black px-2 py-0.5 rounded border border-black shadow-[1px_1px_0px_0px_#000]`}>
                        {link.badge}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-zinc-600 dark:text-zinc-400 group-hover:text-black">
                      {link.desc}
                    </p>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-lg bg-black text-white group-hover:bg-white group-hover:text-black border-2 border-black flex items-center justify-center transition-colors">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </a>
            ))}
          </div>

          {/* 레트로 터미널 상태 바 */}
          <div className="bg-[#18181B] text-[#4ADE80] border-[2px] border-black rounded-xl p-3 font-mono text-xs shadow-[4px_4px_0px_0px_#000] flex items-center gap-2">
            <Terminal className="w-4 h-4 text-[#4ADE80] shrink-0" />
            <span className="text-zinc-400">$</span>
            <span className="font-bold truncate">
              git commit -m &quot;아이디어를 코드로 실현해 나갑니다 🚀&quot;
            </span>
          </div>

        </div>

        {/* 하단 푸터 바 */}
        <div className="border-t-[3px] border-black bg-[#F4F4F5] dark:bg-zinc-800 p-3.5 text-center text-xs font-black tracking-tight text-zinc-700 dark:text-zinc-300">
          <span>⚡ CRAFTED WITH NEOBRUTALISM & VIBE CODING ✦ © 2026 JINMO KU</span>
        </div>

      </div>

    </main>
  );
}
