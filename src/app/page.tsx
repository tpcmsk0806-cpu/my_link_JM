import Image from "next/image";
import {
  Mail,
  ArrowRight,
  ExternalLink,
  Code2,
  Sparkles,
  Layers,
  Cpu,
  Terminal,
  Compass,
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

// PlayStation Signature Shape Glyphs (△ ○ ✕ □)
function PlayStationShapes({ className = "h-4" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 opacity-80 ${className}`}>
      {/* Triangle */}
      <svg className="w-3.5 h-3.5 text-[#00F0FF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <polygon points="12 4 21 20 3 20" />
      </svg>
      {/* Circle */}
      <svg className="w-3.5 h-3.5 text-[#FF5D8F]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <circle cx="12" cy="12" r="8" />
      </svg>
      {/* Cross */}
      <svg className="w-3.5 h-3.5 text-[#7084FF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <line x1="6" y1="6" x2="18" y2="18" />
        <line x1="6" y1="18" x2="18" y2="6" />
      </svg>
      {/* Square */}
      <svg className="w-3.5 h-3.5 text-[#FFB800]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <rect x="5" y="5" width="14" height="14" rx="1" />
      </svg>
    </div>
  );
}

export default function ProfilePage() {
  const featuredProjects = [
    {
      title: "My Link — Portfolio Hub",
      category: "NEXT.JS 16 · TURBOPACK",
      desc: "PlayStation의 에디토리얼 마케팅 챕터 시스템을 웹 표준에 맞게 정밀 구현한 고성능 반응형 프로필 허브입니다.",
      badge: "LIVE",
      image: "/images/banner.jpg",
      link: "https://github.com/tpcmsk0806-cpu",
    },
    {
      title: "Clean Architecture Web App",
      category: "REACT 19 · TYPESCRIPT",
      desc: "확장성과 유지보수성을 극대화한 컴포넌트 계층 분리와 타입 안전성을 갖춘 프론트엔드 아키텍처입니다.",
      badge: "SHOWCASE",
      image: "/images/avatar.jpg",
      link: "https://github.com/tpcmsk0806-cpu",
    },
    {
      title: "Design System Implementation",
      category: "TAILWIND CSS · UI/UX",
      desc: "토큰 기반의 디자인 시스템 명세(DESIGN.md)를 충실히 따르는 재사용 가능한 UI 컴포넌트 킷입니다.",
      badge: "CORE",
      image: "/images/banner.jpg",
      link: "https://github.com/tpcmsk0806-cpu",
    },
  ];

  const techTiles = [
    { name: "Next.js 16", tag: "Framework", desc: "App Router & SSR", bg: "bg-[#181818]" },
    { name: "React 19", tag: "Library", desc: "Modern Hooks & Concurrent", bg: "bg-[#181818]" },
    { name: "TypeScript", tag: "Language", desc: "Strict Type Safety", bg: "bg-[#181818]" },
    { name: "Tailwind CSS", tag: "Styling", desc: "Design Token Engine", bg: "bg-[#181818]" },
    { name: "Node.js", tag: "Runtime", desc: "Backend API Integration", bg: "bg-[#181818]" },
    { name: "Git & GitHub", tag: "DevOps", desc: "CI/CD & Collaboration", bg: "bg-[#181818]" },
  ];

  return (
    <div className="min-h-screen bg-[#000000] text-white selection:bg-[#0070d1] selection:text-white">
      
      {/* ── TOP PRIMARY NAV (Dark Canvas #000000, 48px) ── */}
      <header className="sticky top-0 z-50 w-full h-14 bg-[#000000]/95 backdrop-blur-md border-b border-[rgba(229,229,229,0.1)] px-4 sm:px-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-[#0070d1] text-white font-bold text-sm flex items-center justify-center tracking-tighter">
              P
            </span>
            <span className="font-semibold text-sm tracking-wide text-white">
              JINMO KU
            </span>
          </div>
          <div className="hidden md:block">
            <PlayStationShapes />
          </div>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden lg:flex items-center gap-8 text-[14px] text-white/80 font-medium tracking-wide">
          <a href="#overview" className="hover:text-white transition-colors">Overview</a>
          <a href="#showcase" className="hover:text-white transition-colors">Showcase</a>
          <a href="#capabilities" className="hover:text-white transition-colors">Capabilities</a>
          <a href="#tech" className="hover:text-white transition-colors">Tech Rails</a>
          <a href="#contact" className="hover:text-white transition-colors">Contact</a>
        </nav>

        {/* Right CTA cluster */}
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#121314] text-white/80 border border-[rgba(229,229,229,0.15)]">
            <span className="w-2 h-2 rounded-full bg-[#0070d1] animate-pulse" />
            Active
          </span>
          <a
            href="https://github.com/tpcmsk0806-cpu"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-white/80 hover:text-white transition-colors"
            aria-label="GitHub"
          >
            <GithubIcon className="w-5 h-5" />
          </a>
          <a
            href="mailto:contact@example.com"
            className="h-9 px-4 rounded-full bg-[#0070d1] hover:bg-[#0064b7] active:bg-[#004d8d] text-white text-xs font-bold tracking-[0.324px] inline-flex items-center transition-colors"
          >
            Contact
          </a>
        </div>
      </header>

      <main>
        {/* ── CHAPTER 1: EDITORIAL DARK HERO BAND (Canvas Dark #000000, 96px rhythm) ── */}
        <section id="overview" className="w-full bg-[#000000] py-20 sm:py-24 px-6 sm:px-12 lg:px-16">
          <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Editorial Copy (Display XL / Weight 300) */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              
              {/* Info Badge */}
              <div className="mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0070d1] text-white text-xs font-semibold tracking-wide">
                <span>ON PLAYSTATION SYSTEM</span>
                <span className="opacity-60">·</span>
                <span>EDITION 2026</span>
              </div>

              {/* Display Headline (Weight 300 Light, Tight Ladder) */}
              <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-light leading-[1.25] tracking-[-0.1px] text-white">
                Crafting intuitive digital experiences with precision.
              </h1>

              {/* Sub-headline / Role */}
              <p className="mt-4 text-xl sm:text-2xl font-light text-white/90">
                구진모 <span className="text-[#0070d1] font-normal">/ Junior Software Developer</span>
              </p>

              {/* Body Prose (18px, 1.5 Line-height) */}
              <p className="mt-6 text-[18px] leading-[1.5] text-white/70 max-w-[540px] break-keep font-normal">
                사용자 중심의 경험과 지속 가능한 클린 코드를 고민하는 개발자입니다. 복잡한 문제를 직관적인 솔루션으로 풀어내고, 새로운 기술을 탐구하며 완성도 높은 가치를 구현합니다.
              </p>

              {/* PlayStation CTA Pill Group */}
              <div className="mt-10 flex flex-wrap items-center gap-4">
                {/* Universal Primary CTA: button-primary (PlayStation Blue #0070d1, rounded-full) */}
                <a
                  href="#showcase"
                  className="h-12 px-7 rounded-full bg-[#0070d1] hover:bg-[#0064b7] active:bg-[#004d8d] text-white text-[18px] font-bold tracking-[0.45px] inline-flex items-center justify-center transition-colors"
                >
                  Explore Works
                </a>

                {/* Commerce Orange CTA: button-commerce (#d53b00, rounded-full) */}
                <a
                  href="mailto:contact@example.com"
                  className="h-12 px-7 rounded-full bg-[#d53b00] hover:bg-[#aa2f00] text-white text-[18px] font-bold tracking-[0.45px] inline-flex items-center justify-center transition-colors"
                >
                  Get in Touch
                </a>

                {/* Outline Secondary CTA: button-secondary-dark */}
                <a
                  href="https://github.com/tpcmsk0806-cpu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-12 px-7 rounded-full bg-transparent border border-[rgba(229,229,229,0.3)] hover:border-white text-white text-[18px] font-bold tracking-[0.45px] inline-flex items-center justify-center gap-2 transition-colors"
                >
                  <GithubIcon className="w-5 h-5" />
                  <span>GitHub</span>
                </a>
              </div>

            </div>

            {/* Right Editorial Hardware / Visual Showcase */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md aspect-square sm:aspect-[4/3] lg:aspect-square bg-[#121314] rounded-[8px] overflow-hidden border border-[rgba(229,229,229,0.15)] flex flex-col items-center justify-center p-8 group">
                
                {/* Background Subtle Gradient Glow */}
                <div className="absolute inset-0 bg-gradient-to-tr from-[#0070d1]/20 via-transparent to-transparent opacity-80" />

                {/* Avatar Display (Crisp Editorial Frame) */}
                <div className="relative z-10 w-44 h-44 sm:w-52 sm:h-52 rounded-full overflow-hidden border-2 border-white/20 p-1 bg-[#181818]">
                  <Image
                    src="/images/avatar.jpg"
                    alt="구진모 개발자 프로필"
                    fill
                    priority
                    className="object-cover rounded-full"
                  />
                </div>

                {/* Status Callout below visual */}
                <div className="relative z-10 mt-6 text-center">
                  <div className="text-xs font-semibold uppercase tracking-widest text-[#0070d1] mb-1">
                    ENGINEERING PROFILE
                  </div>
                  <div className="text-lg font-light text-white">
                    Seoul, Republic of Korea
                  </div>
                </div>

              </div>
            </div>

          </div>
        </section>

        {/* ── CHAPTER 2: LIGHT SHOWCASE BAND (Canvas Light #ffffff, 96px rhythm) ── */}
        <section id="showcase" className="w-full bg-[#ffffff] text-black py-20 sm:py-24 px-6 sm:px-12 lg:px-16">
          <div className="max-w-[1280px] mx-auto">
            
            {/* Section Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <span className="text-xs font-bold tracking-widest uppercase text-[#0070d1]">
                  PORTFOLIO SHOWCASE
                </span>
                <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-light leading-[1.25] tracking-[0.1px] text-[#000000] mt-2">
                  Featured Projects & Architecture
                </h2>
                <p className="mt-3 text-[18px] leading-[1.5] text-black/60 max-w-xl">
                  현대적인 웹 생태계와 사용자 중심의 설계로 구현한 핵심 프로젝트들입니다.
                </p>
              </div>

              {/* Filter Pills (PlayStation Style) */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
                <span className="px-4 py-2 rounded-full bg-[#000000] text-white text-xs font-bold tracking-[0.324px] shrink-0 cursor-default">
                  All
                </span>
                <span className="px-4 py-2 rounded-full bg-[#f5f7fa] text-black hover:bg-[#e4e8ee] text-xs font-bold tracking-[0.324px] shrink-0 transition-colors cursor-pointer">
                  Frontend
                </span>
                <span className="px-4 py-2 rounded-full bg-[#f5f7fa] text-black hover:bg-[#e4e8ee] text-xs font-bold tracking-[0.324px] shrink-0 transition-colors cursor-pointer">
                  Architecture
                </span>
                <span className="px-4 py-2 rounded-full bg-[#f5f7fa] text-black hover:bg-[#e4e8ee] text-xs font-bold tracking-[0.324px] shrink-0 transition-colors cursor-pointer">
                  Open Source
                </span>
              </div>
            </div>

            {/* 3-Up Product Card Grid (rounded.md: 8px, surface-card: #f5f7fa, border: #f3f3f3) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProjects.map((project, idx) => (
                <div
                  key={idx}
                  className="bg-[#f5f7fa] border border-[#f3f3f3] rounded-[8px] overflow-hidden flex flex-col transition-all hover:bg-[#edf1f7] group"
                >
                  {/* 16:9 Image Thumbnail */}
                  <div className="relative w-full aspect-[16/9] bg-[#121314] overflow-hidden">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-[#0070d1] text-white text-[11px] font-bold tracking-wider uppercase">
                      {project.badge}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 flex flex-col flex-1">
                    <span className="text-xs font-bold tracking-wider text-[#0070d1] uppercase mb-1">
                      {project.category}
                    </span>
                    <h3 className="text-[22px] font-light text-[#000000] leading-[1.25] tracking-[0.1px] mb-2">
                      {project.title}
                    </h3>
                    <p className="text-[16px] leading-[1.5] text-black/60 flex-1 break-keep">
                      {project.desc}
                    </p>

                    {/* Card Action Link */}
                    <div className="mt-6 pt-4 border-t border-[#f3f3f3] flex items-center justify-between">
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[16px] font-bold text-[#0064b7] hover:text-[#004d8d] inline-flex items-center gap-1.5 transition-colors"
                      >
                        <span>Learn more</span>
                        <ArrowRight className="w-4 h-4" />
                      </a>
                      <ExternalLink className="w-4 h-4 text-black/40 group-hover:text-black transition-colors" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ── CHAPTER 3: PLAYSTATION PLUS TIER BANNER BAND (Dark Elevated #121314, Gold Gradient) ── */}
        <section id="capabilities" className="w-full bg-[#121314] text-white py-20 sm:py-24 px-6 sm:px-12 lg:px-16">
          <div className="max-w-[1280px] mx-auto">
            
            {/* The PS Plus Gold Gradient Banner Component */}
            <div className="relative w-full rounded-[8px] overflow-hidden bg-[#181818] border border-[rgba(229,229,229,0.1)]">
              
              {/* 3-Stop Horizontal Gold Accent Bar: #ffce21 -> #f5a623 -> #ee8e00 */}
              <div className="w-full h-2 bg-gradient-to-r from-[#ffce21] via-[#f5a623] to-[#ee8e00]" />

              <div className="p-8 sm:p-12 lg:p-14">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-10">
                  <div>
                    <span className="text-xs font-bold tracking-widest uppercase text-[#ffce21]">
                      CORE CAPABILITIES & PILLARS
                    </span>
                    <h2 className="text-2xl sm:text-3xl lg:text-[35px] font-light text-white leading-[1.25] mt-2">
                      Engineering Standards & Philosophy
                    </h2>
                    <p className="mt-3 text-[18px] leading-[1.5] text-white/70 max-w-xl">
                      PlayStation 시스템이 추구하는 정밀함과 감각을 개발 원칙에 동일하게 적용합니다.
                    </p>
                  </div>
                  
                  <a
                    href="mailto:contact@example.com"
                    className="h-12 px-7 rounded-full bg-[#0070d1] hover:bg-[#0064b7] text-white text-[16px] font-bold tracking-[0.45px] inline-flex items-center justify-center shrink-0 transition-colors"
                  >
                    Discuss Opportunities
                  </a>
                </div>

                {/* 3 Pillars Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Pillar 1 */}
                  <div className="bg-[#121314] p-6 rounded-[8px] border border-[rgba(229,229,229,0.08)]">
                    <div className="w-10 h-10 rounded-full bg-[#0070d1]/10 text-[#0070d1] flex items-center justify-center mb-4">
                      <Code2 className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-light text-white mb-2">
                      Clean Architecture
                    </h3>
                    <p className="text-[16px] text-white/70 leading-[1.5]">
                      단순한 동작을 넘어 변경과 확장에 유연한 모듈형 컴포넌트와 계층화된 아키텍처를 설계합니다.
                    </p>
                  </div>

                  {/* Pillar 2 */}
                  <div className="bg-[#121314] p-6 rounded-[8px] border border-[rgba(229,229,229,0.08)]">
                    <div className="w-10 h-10 rounded-full bg-[#ffce21]/10 text-[#ffce21] flex items-center justify-center mb-4">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-light text-white mb-2">
                      Fluid Interaction
                    </h3>
                    <p className="text-[16px] text-white/70 leading-[1.5]">
                      인터랙션 하나하나가 사용자의 흐름을 방해하지 않고 부드럽게 유도하는 UI를 완성합니다.
                    </p>
                  </div>

                  {/* Pillar 3 */}
                  <div className="bg-[#121314] p-6 rounded-[8px] border border-[rgba(229,229,229,0.08)]">
                    <div className="w-10 h-10 rounded-full bg-[#d53b00]/10 text-[#d53b00] flex items-center justify-center mb-4">
                      <Cpu className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-light text-white mb-2">
                      Performance & Web Vitals
                    </h3>
                    <p className="text-[16px] text-white/70 leading-[1.5]">
                      최적화된 렌더링 파이프라인과 정적 빌드를 통해 첫 로딩부터 쾌적한 반응 속도를 보장합니다.
                    </p>
                  </div>

                </div>
              </div>

            </div>

          </div>
        </section>

        {/* ── CHAPTER 4: "ON PLAYSTATION" EDITORIAL TECH RAILS (Gradient Dark #121314 -> #000000) ── */}
        <section id="tech" className="w-full bg-gradient-to-b from-[#121314] to-[#000000] text-white py-20 sm:py-24 px-6 sm:px-12 lg:px-16">
          <div className="max-w-[1280px] mx-auto">
            
            <div className="mb-10">
              <span className="text-xs font-bold tracking-widest uppercase text-[#0070d1]">
                PRODUCTION ECOSYSTEM
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-light leading-[1.25] tracking-[0.1px] text-white mt-2">
                Tech Rails & Development Arsenal
              </h2>
              <p className="mt-3 text-[18px] leading-[1.5] text-white/70 max-w-xl">
                실제 서비스와 엔터프라이즈 환경에서 검증된 현대적인 기술 스택을 다룹니다.
              </p>
            </div>

            {/* Game Tile Style Rail (rounded.md: 8px, 16:9 ratio visual) */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {techTiles.map((tech, idx) => (
                <div
                  key={idx}
                  className="bg-[#181818] border border-[rgba(229,229,229,0.1)] rounded-[8px] p-4 flex flex-col justify-between aspect-[4/5] hover:border-[#0070d1] transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold uppercase text-white/50 tracking-wider">
                      {tech.tag}
                    </span>
                    <span className="w-2 h-2 rounded-full bg-[#0070d1] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  <div>
                    <h3 className="text-lg font-light text-white leading-tight">
                      {tech.name}
                    </h3>
                    <p className="text-xs text-white/60 mt-1">
                      {tech.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ── CHAPTER 5: PLAYSTATION BLUE ACTION MOMENT (Hero Band Blue #0070d1) ── */}
        <section id="contact" className="w-full bg-[#0070d1] text-white py-20 sm:py-24 px-6 sm:px-12 lg:px-16">
          <div className="max-w-[960px] mx-auto text-center flex flex-col items-center">
            
            <div className="mb-4">
              <PlayStationShapes className="justify-center" />
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-light leading-[1.25] text-white tracking-tight">
              Ready to create something remarkable together?
            </h2>

            <p className="mt-4 text-lg sm:text-[20px] font-normal leading-[1.5] text-white/90 max-w-2xl break-keep">
              프로젝트 의뢰, 채용 제안, 또는 기술에 관한 편안한 대화까지 언제나 환영합니다.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <a
                href="mailto:contact@example.com"
                className="h-12 px-8 rounded-full bg-white hover:bg-white/90 active:bg-white/80 text-[#0070d1] text-[18px] font-bold tracking-[0.45px] inline-flex items-center justify-center transition-colors shadow-none"
              >
                Send an Email
              </a>
              <a
                href="https://github.com/tpcmsk0806-cpu"
                target="_blank"
                rel="noopener noreferrer"
                className="h-12 px-8 rounded-full bg-transparent border-2 border-white hover:bg-white/10 text-white text-[18px] font-bold tracking-[0.45px] inline-flex items-center justify-center gap-2 transition-colors"
              >
                <GithubIcon className="w-5 h-5" />
                <span>Visit GitHub</span>
              </a>
            </div>

          </div>
        </section>
      </main>

      {/* ── FOOTER SECTION (Canvas Dark #000000, 48px padding) ── */}
      <footer className="w-full bg-[#000000] border-t border-[rgba(229,229,229,0.15)] py-12 px-6 sm:px-12 lg:px-16 text-white/70">
        <div className="max-w-[1280px] mx-auto">
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-[rgba(229,229,229,0.1)]">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-[#0070d1] text-white font-bold text-sm flex items-center justify-center tracking-tighter">
                P
              </span>
              <span className="text-xl font-light tracking-wide text-white">
                JINMO KU <span className="text-white/40 text-sm font-normal">/ Software Developer</span>
              </span>
            </div>
            
            <div className="flex flex-wrap items-center gap-6 text-sm text-white/70">
              <a href="#overview" className="hover:text-white transition-colors">Overview</a>
              <a href="#showcase" className="hover:text-white transition-colors">Showcase</a>
              <a href="#capabilities" className="hover:text-white transition-colors">Capabilities</a>
              <a href="#tech" className="hover:text-white transition-colors">Tech Rails</a>
              <a href="https://github.com/tpcmsk0806-cpu" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50">
            <p>
              © 2026 Jinmo Ku. Built with Next.js 16 & PlayStation Marketing Design System.
            </p>
            <div className="flex items-center gap-4">
              <span>All rights reserved.</span>
              <span className="w-1 h-1 rounded-full bg-white/30" />
              <span>Designed with DESIGN.md</span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
