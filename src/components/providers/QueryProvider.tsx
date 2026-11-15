"use client";

import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

interface QueryProviderProps {
  children: React.ReactNode;
}

export default function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5분 동안 캐시 신선도 유지 (불필요한 Firestore 재조회 방지)
            gcTime: 1000 * 60 * 30, // 30분 동안 가비지 컬렉션 대기
            retry: 1, // 실패 시 1회 재시도
            refetchOnWindowFocus: false, // 탭 전환 시 자동 재조회 끄기 (Firestore 비용 절감)
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
