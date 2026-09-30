import Image from "next/image";
import {
  Mail,
  ExternalLink,
  Code2,
  Sparkles,
  Layers,
  MapPin,
  Laptop,
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
    "Next.js",
    "React",
    "TypeScript",
    "Tailwind CSS",
    "Node.js",
    "Git",
  ];

  const highlights = [
    {
      icon: <Code2 className="w-4 h-4 text-blue-500" />,
      title: "Clean Code",
      desc: "유지보수하기 쉬운 구조 지향",
    },
    {
      icon: <Sparkles className="w-4 h-4 text-amber-500" />,
      title: "UI / UX",
      desc: "직관적이고 매끄러운 사용자 경험",
    },
    {
      icon: <Layers className="w-4 h-4 text-emerald-500" />,
      title: "Problem Solver",
      desc: "기술을 통한 실질적 가치 창출",
    },
  ];

  const links = [
    {
      title: "GitHub",
      desc: "github.com/tpcmsk0806-cpu",
      href: "https://github.com/tpcmsk0806-cpu",
      icon: <GithubIcon className="w-5 h-5 text-zinc-800 dark:text-zinc-200" />,
      badge: "Projects",
    },
    {
      title: "Email",
      desc: "문의 및 협업 제안",
      href: "mailto:contact@example.com",
      icon: <Mail className="w-5 h-5 text-zinc-800 dark:text-zinc-200" />,
      badge: "Contact",
    },
  ];

  return (
    <main className="flex min-h-screen flex-1 flex-col items-center justify-center p-4 sm:p-6 md:p-10 bg-gradient-to-b from-zinc-50 via-zinc-100 to-zinc-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
      {/* 반응형 카드 컨테이너 */}
      <div className="w-full max-w-md sm:max-w-xl md:max-w-2xl bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md rounded-3xl shadow-xl shadow-zinc-900/5 border border-zinc-200/80 dark:border-zinc-800 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/5">
        
        {/* 상단 배너 이미지 */}
        <div className="relative w-full h-36 sm:h-44 md:h-48 overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
          <Image
            src="/images/banner.jpg"
            alt="프로필 배경 배너"
            fill
            priority
            className="object-cover object-center opacity-90 transition-transform duration-700 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        </div>

        {/* 프로필 본문 */}
        <div className="px-6 pb-8 sm:px-8 sm:pb-10 -mt-16 sm:-mt-20 flex flex-col items-center text-center">
          
          {/* 아바타 이미지 & 온라인 뱃지 */}
          <div className="relative group">
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white dark:border-zinc-900 shadow-xl shadow-black/10 ring-1 ring-zinc-200/50 dark:ring-zinc-800 bg-white">
              <Image
                src="/images/avatar.jpg"
                alt="구진모 프로필 사진"
                fill
                priority
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <span
              className="absolute bottom-2 right-2 w-5 h-5 rounded-full bg-emerald-500 border-3 border-white dark:border-zinc-900 shadow-sm"
              title="온라인"
            />
          </div>

          {/* 이름 & 소속 */}
          <div className="mt-4 flex flex-col items-center">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight flex items-center gap-2">
              구진모
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-800/50">
                PRO
              </span>
            </h1>

            {/* 역할 및 부가 정보 태그 */}
            <div className="mt-2.5 flex flex-wrap items-center justify-center gap-2 text-xs font-medium text-zinc-600 dark:text-zinc-400">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800/80 text-zinc-800 dark:text-zinc-200 border border-zinc-200/60 dark:border-zinc-700/60">
                <Laptop className="w-3.5 h-3.5 text-indigo-500" />
                Junior Software Developer
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400">
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                Seoul, Korea
              </span>
            </div>
          </div>

          {/* 소개글 */}
          <p className="mt-5 text-sm sm:text-base text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-lg break-keep font-normal">
            직관적인 사용자 경험과 지속 가능한 코드를 고민하는 개발자입니다. 새로운 기술을 탐구하고 문제를 해결하며 성장하는 과정을 즐깁니다.
          </p>

          {/* 핵심 강점 / 하이라이트 그리드 */}
          <div className="w-full mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
            {highlights.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-zinc-50/80 dark:bg-zinc-800/50 border border-zinc-200/70 dark:border-zinc-800 transition-all hover:border-indigo-300 dark:hover:border-indigo-700/50 hover:bg-white dark:hover:bg-zinc-800"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="p-1 rounded-md bg-white dark:bg-zinc-900 shadow-xs border border-zinc-200/60 dark:border-zinc-700/60">
                    {item.icon}
                  </div>
                  <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                    {item.title}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-snug">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* 기술 스택 뱃지 목록 */}
          <div className="w-full mt-6 flex flex-col items-center">
            <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2.5">
              Tech Stack
            </span>
            <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 max-w-md">
              {techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium bg-zinc-100/90 dark:bg-zinc-800/70 text-zinc-700 dark:text-zinc-300 border border-zinc-200/60 dark:border-zinc-700/60 transition-colors hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-300 dark:hover:border-indigo-600"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* 링크 & 소셜 섹션 */}
          <div className="w-full mt-6 space-y-2.5">
            {links.map((link, idx) => (
              <a
                key={idx}
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="group flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-zinc-50/90 dark:bg-zinc-800/60 hover:bg-zinc-100/90 dark:hover:bg-zinc-800 border border-zinc-200/70 dark:border-zinc-700/60 transition-all hover:scale-[1.01] active:scale-[0.99] hover:border-zinc-300 dark:hover:border-zinc-600 shadow-xs"
              >
                <div className="flex items-center gap-3.5">
                  <div className="p-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 shadow-xs group-hover:scale-105 transition-transform">
                    {link.icon}
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                      {link.title}
                      {link.badge && (
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-800/50">
                          {link.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      {link.desc}
                    </p>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-200 transition-colors" />
              </a>
            ))}
          </div>

          {/* 하단 구분선 및 상태 문구 */}
          <div className="w-full mt-7 pt-5 border-t border-zinc-100 dark:border-zinc-800/80 flex flex-col items-center gap-2">
            <p className="text-xs sm:text-sm font-medium text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
              <span>아이디어를 코드로 실현해 나갑니다 🚀</span>
            </p>
            <p className="text-[11px] text-zinc-400 dark:text-zinc-600">
              © 2026 Jinmo Ku. All rights reserved.
            </p>
          </div>

        </div>
      </div>
    </main>
  );
}
