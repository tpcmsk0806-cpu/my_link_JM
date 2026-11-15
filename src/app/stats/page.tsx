"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { getLinksFromFirestore } from "@/lib/firestoreLinks";
import { getUserProfile } from "@/lib/firestoreProfile";
import { LinkItem, UserProfileData } from "@/types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart";
import {
  ArrowLeft,
  MousePointerClick,
  TrendingUp,
  Link2,
  Award,
  ExternalLink,
  Sparkles,
  BarChart3,
  PieChart as PieChartIcon,
  RefreshCw,
  Share2,
} from "lucide-react";

// Google Favicon 서비스 기반 파비콘 추출
const getFaviconUrl = (urlStr: string) => {
  try {
    const trimmed = urlStr?.trim();
    if (!trimmed) return null;
    const candidate =
      trimmed.startsWith("http://") || trimmed.startsWith("https://")
        ? trimmed
        : `https://${trimmed}`;
    const parsed = new URL(candidate);
    if (!parsed.hostname || !parsed.hostname.includes(".")) return null;
    return `https://www.google.com/s2/favicons?domain=${parsed.hostname}&sz=64`;
  } catch {
    return null;
  }
};

const CHART_COLORS = [
  "#0070d1", // Primary Blue
  "#06b6d4", // Cyan
  "#8b5cf6", // Purple
  "#ec4899", // Pink
  "#f59e0b", // Amber
  "#10b981", // Emerald
  "#6366f1", // Indigo
  "#f43f5e", // Rose
];

export default function StatsPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);
  const [isDataLoading, setIsDataLoading] = useState(true);

  // 1. 로그인 인증 상태 감시 (비로그인 시 홈으로 리다이렉트)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        // 비로그인 사용자: 메인 홈으로 리다이렉트
        router.replace("/");
        return;
      }
      setCurrentUser(user);
      setIsAuthLoading(false);

      // Firestore에서 사용자의 링크 목록 및 프로필 로드
      try {
        setIsDataLoading(true);
        const [userLinks, profile] = await Promise.all([
          getLinksFromFirestore(user.uid),
          getUserProfile(user.uid),
        ]);
        setLinks(userLinks);
        setUserProfile(profile);
      } catch (err) {
        console.error("통계 데이터 로딩 실패:", err);
      } finally {
        setIsDataLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  // 2. 통계 지표 계산
  const { totalClicks, activeLinkCount, topLink, avgClicks, chartData, pieData } =
    useMemo(() => {
      const total = links.reduce((acc, l) => acc + (l.clickCount || 0), 0);
      const activeCount = links.filter((l) => l.isActive).length;

      // 정렬된 링크 (클릭수 내림차순)
      const sorted = [...links].sort((a, b) => (b.clickCount || 0) - (a.clickCount || 0));
      const top = sorted.length > 0 && (sorted[0].clickCount || 0) > 0 ? sorted[0] : null;
      const avg = links.length > 0 ? (total / links.length).toFixed(1) : "0";

      // 바 차트용 데이터 (최대 상위 8개)
      const barData = sorted.slice(0, 8).map((link, idx) => ({
        name: link.title.length > 12 ? `${link.title.slice(0, 10)}…` : link.title,
        fullName: link.title,
        clicks: link.clickCount || 0,
        fill: CHART_COLORS[idx % CHART_COLORS.length],
      }));

      // 파이 차트용 데이터
      const pie = sorted.slice(0, 5).map((link, idx) => ({
        name: link.title,
        value: link.clickCount || 0,
        fill: CHART_COLORS[idx % CHART_COLORS.length],
      }));

      return {
        totalClicks: total,
        activeLinkCount: activeCount,
        topLink: top,
        avgClicks: avg,
        chartData: barData,
        pieData: pie.filter((p) => p.value > 0),
      };
    }, [links]);

  const chartConfig = {
    clicks: {
      label: "클릭 수",
      color: "#0070d1",
    },
  } satisfies ChartConfig;

  // 로딩 화면
  if (isAuthLoading || isDataLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-4 border-cyan-400 border-t-transparent animate-spin" />
          <p className="text-xs font-semibold text-zinc-400">통계 대시보드 로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col items-center py-6 px-4 sm:px-8">
      {/* ================= Top Navigation Bar ================= */}
      <header className="w-full max-w-6xl flex items-center justify-between pb-6 mb-6 border-b border-zinc-800/80">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-xs font-semibold text-zinc-300 hover:text-white transition-all border border-zinc-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>내 프로필로 돌아가기</span>
        </Link>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-white">
              {userProfile?.displayName || currentUser?.displayName || "사용자"}
            </p>
            <p className="text-[11px] font-mono text-cyan-400">
              @{userProfile?.username || currentUser?.email?.split("@")[0] || "user"}
            </p>
          </div>
          {currentUser?.photoURL ? (
            <img
              src={currentUser.photoURL}
              alt=""
              className="w-9 h-9 rounded-full ring-2 ring-cyan-500/30 object-cover"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-cyan-600/30 text-cyan-400 flex items-center justify-center font-bold text-sm">
              {(userProfile?.displayName || currentUser?.displayName || "U")[0]}
            </div>
          )}
        </div>
      </header>

      {/* ================= Title & Subtitle ================= */}
      <div className="w-full max-w-6xl mb-8">
        <div className="flex items-center gap-2.5 mb-1.5">
          <div className="w-8 h-8 rounded-xl bg-[#0070d1]/20 text-[#0070d1] flex items-center justify-center">
            <BarChart3 className="w-4 h-4 stroke-[2.5]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            링크 통계 대시보드
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-zinc-400">
          방문자들이 내 프로필 링크를 클릭한 실시간 통계와 반응을 확인하세요.
        </p>
      </div>

      {/* ================= 4 KPI Summary Cards ================= */}
      <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* KPI 1: 총 클릭 수 (필수) */}
        <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800/80 shadow-lg relative overflow-hidden group hover:border-cyan-500/50 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-zinc-400">총 클릭수</span>
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <MousePointerClick className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {totalClicks.toLocaleString()}
            </span>
            <span className="text-xs text-cyan-400 font-semibold">회</span>
          </div>
          <p className="text-[11px] text-zinc-500 mt-2">모든 링크의 누적 클릭 합산</p>
          <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-cyan-500/5 rounded-full blur-xl group-hover:bg-cyan-500/10 transition-colors" />
        </div>

        {/* KPI 2: 등록된 활성 링크 수 */}
        <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800/80 shadow-lg relative overflow-hidden group hover:border-[#0070d1]/50 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-zinc-400">공개 링크</span>
            <div className="w-8 h-8 rounded-xl bg-[#0070d1]/10 text-[#0070d1] flex items-center justify-center">
              <Link2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {activeLinkCount}
            </span>
            <span className="text-xs text-zinc-400 font-semibold">/ {links.length}개</span>
          </div>
          <p className="text-[11px] text-zinc-500 mt-2">현재 방문자에게 노출 중인 링크</p>
          <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-[#0070d1]/5 rounded-full blur-xl group-hover:bg-[#0070d1]/10 transition-colors" />
        </div>

        {/* KPI 3: 인기 TOP 1 링크 */}
        <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800/80 shadow-lg relative overflow-hidden group hover:border-amber-500/50 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-zinc-400">인기 TOP 링크</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="min-h-[40px] flex flex-col justify-center">
            {topLink ? (
              <>
                <p className="text-base sm:text-lg font-bold text-white truncate">
                  {topLink.title}
                </p>
                <p className="text-xs text-amber-400 font-semibold mt-0.5">
                  {topLink.clickCount}회 클릭 ({totalClicks > 0 ? Math.round(((topLink.clickCount || 0) / totalClicks) * 100) : 0}%)
                </p>
              </>
            ) : (
              <p className="text-xs text-zinc-500">아직 클릭 기록 없음</p>
            )}
          </div>
          <p className="text-[11px] text-zinc-500 mt-2">가장 높은 반응을 얻은 링크</p>
          <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-amber-500/5 rounded-full blur-xl group-hover:bg-amber-500/10 transition-colors" />
        </div>

        {/* KPI 4: 링크당 평균 클릭 수 */}
        <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800/80 shadow-lg relative overflow-hidden group hover:border-purple-500/50 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-zinc-400">평균 클릭수</span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {avgClicks}
            </span>
            <span className="text-xs text-purple-400 font-semibold">회 / 링크</span>
          </div>
          <p className="text-[11px] text-zinc-500 mt-2">등록 링크 1개당 평균 전환수</p>
          <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-purple-500/5 rounded-full blur-xl group-hover:bg-purple-500/10 transition-colors" />
        </div>
      </div>

      {/* ================= Charts Section (shadcn ChartContainer) ================= */}
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Main Bar Chart: 링크별 클릭수 비교 */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-zinc-900/90 border border-zinc-800/80 shadow-xl flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-cyan-400" />
                <span>링크별 클릭수 비교</span>
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">상위 링크들의 클릭 성과</p>
            </div>
            <span className="text-xs font-mono text-zinc-500 bg-zinc-800/60 px-2.5 py-1 rounded-full">
              총 {links.length}개 링크
            </span>
          </div>

          {chartData.length === 0 || totalClicks === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 border border-dashed border-zinc-800 rounded-2xl">
              <MousePointerClick className="w-8 h-8 text-zinc-600 mb-2" />
              <p className="text-sm font-semibold text-zinc-400">아직 클릭 데이터가 없습니다.</p>
              <p className="text-xs text-zinc-500 mt-1">
                프로필 링크를 공유하여 첫 클릭을 기록해보세요!
              </p>
            </div>
          ) : (
            <div className="w-full pt-4">
              <ChartContainer config={chartConfig} className="h-72 w-full">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "#a1a1aa", fontSize: 11 }}
                    interval={0}
                    angle={-15}
                    textAnchor="end"
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "#71717a", fontSize: 11 }}
                    allowDecimals={false}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(val, name, item) => (
                          <div className="flex items-center justify-between gap-4 w-full text-xs">
                            <span className="font-medium text-zinc-300">
                              {(item.payload as any).fullName}
                            </span>
                            <span className="font-bold text-white font-mono">{val}회</span>
                          </div>
                        )}
                      />
                    }
                  />
                  <Bar dataKey="clicks" radius={[8, 8, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            </div>
          )}
        </div>

        {/* Donut / Pie Chart: 상위 링크 클릭 점유율 */}
        <div className="p-6 rounded-3xl bg-zinc-900/90 border border-zinc-800/80 shadow-xl flex flex-col">
          <div className="mb-4">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <PieChartIcon className="w-4 h-4 text-purple-400" />
              <span>클릭 점유율 (Share)</span>
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">상위 5개 링크의 비중</p>
          </div>

          {pieData.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 border border-dashed border-zinc-800 rounded-2xl">
              <p className="text-xs text-zinc-500">집계 가능한 점유율 데이터가 없습니다.</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center flex-1">
              <div className="w-full h-48 flex items-center justify-center">
                <ChartContainer config={chartConfig} className="h-48 w-48">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={75}
                      paddingAngle={4}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`pie-cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ChartContainer>
              </div>

              {/* Legend List */}
              <div className="w-full flex flex-col gap-1.5 mt-3 pt-3 border-t border-zinc-800/60">
                {pieData.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: item.fill }}
                      />
                      <span className="text-zinc-300 truncate max-w-[140px]">
                        {item.name}
                      </span>
                    </div>
                    <span className="font-mono text-zinc-400 font-semibold shrink-0">
                      {totalClicks > 0 ? Math.round((item.value / totalClicks) * 100) : 0}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ================= Detailed Links Ranking Table ================= */}
      <div className="w-full max-w-6xl p-6 rounded-3xl bg-zinc-900/90 border border-zinc-800/80 shadow-xl mb-10">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>전체 링크별 클릭 순위표</span>
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              각 링크의 누적 클릭수와 점유율을 확인하세요.
            </p>
          </div>
        </div>

        {links.length === 0 ? (
          <div className="py-12 text-center text-xs text-zinc-500">
            등록된 링크가 없습니다.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-400 font-semibold">
                  <th className="py-3 px-3 w-16 text-center">순위</th>
                  <th className="py-3 px-3">링크 제목 및 주소</th>
                  <th className="py-3 px-3 text-right w-28">클릭수</th>
                  <th className="py-3 px-3 w-40">점유율</th>
                  <th className="py-3 px-3 w-20 text-center">이동</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 font-medium">
                {[...links]
                  .sort((a, b) => (b.clickCount || 0) - (a.clickCount || 0))
                  .map((link, idx) => {
                    const favicon = getFaviconUrl(link.url);
                    const clicks = link.clickCount || 0;
                    const percent = totalClicks > 0 ? Math.round((clicks / totalClicks) * 100) : 0;

                    return (
                      <tr key={link.id} className="hover:bg-zinc-800/40 transition-colors">
                        {/* Rank */}
                        <td className="py-3.5 px-3 text-center font-bold">
                          {idx === 0 ? (
                            <span className="text-base">🥇</span>
                          ) : idx === 1 ? (
                            <span className="text-base">🥈</span>
                          ) : idx === 2 ? (
                            <span className="text-base">🥉</span>
                          ) : (
                            <span className="text-zinc-500 font-mono text-xs">{idx + 1}</span>
                          )}
                        </td>

                        {/* Link info */}
                        <td className="py-3.5 px-3 min-w-[200px]">
                          <div className="flex items-center gap-2.5">
                            {favicon ? (
                              <img
                                src={favicon}
                                alt=""
                                className="w-4 h-4 rounded-xs object-contain shrink-0"
                                onError={(e) => {
                                  (e.currentTarget as HTMLImageElement).style.display = "none";
                                }}
                              />
                            ) : (
                              <Link2 className="w-4 h-4 text-zinc-500 shrink-0" />
                            )}
                            <div className="min-w-0">
                              <p className="font-semibold text-white truncate max-w-xs sm:max-w-md">
                                {link.title}
                              </p>
                              <p className="text-[11px] text-zinc-500 font-mono truncate max-w-xs sm:max-w-md">
                                {link.url}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Clicks */}
                        <td className="py-3.5 px-3 text-right">
                          <span className="font-mono font-bold text-white text-sm">
                            {clicks.toLocaleString()}
                          </span>
                          <span className="text-zinc-500 text-[11px] ml-1">회</span>
                        </td>

                        {/* Progress Bar Share */}
                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 rounded-full bg-zinc-800 overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-cyan-500 to-[#0070d1] rounded-full transition-all duration-500"
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                            <span className="font-mono text-[11px] text-zinc-400 w-8 text-right">
                              {percent}%
                            </span>
                          </div>
                        </td>

                        {/* Link visit */}
                        <td className="py-3.5 px-3 text-center">
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors inline-block"
                            title="링크 열기"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Footer Branding */}
      <footer className="w-full max-w-6xl py-4 flex items-center justify-between text-xs text-zinc-600 border-t border-zinc-900 mt-auto">
        <p>© MyLink Statistics</p>
        <p className="text-[11px]">실시간 Firestore 연동 데이터</p>
      </footer>
    </div>
  );
}
