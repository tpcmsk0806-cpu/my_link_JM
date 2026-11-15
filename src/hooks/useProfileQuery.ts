import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserProfile, saveUserProfile } from "@/lib/firestoreProfile";
import { UserProfileData } from "@/types";
import { useProfileStore } from "@/lib/store";

export const PROFILE_QUERY_KEY = "profile";

/**
 * Hook to fetch user profile with TanStack Query caching
 */
export function useProfileQuery(userId?: string) {
  return useQuery({
    queryKey: [PROFILE_QUERY_KEY, userId],
    queryFn: async () => {
      if (!userId || userId === "anonymous") return null;
      return await getUserProfile(userId);
    },
    enabled: Boolean(userId && userId !== "anonymous"),
  });
}

/**
 * Mutation hook for profile updates with Optimistic Updates & Rollback
 */
export function useUpdateProfileMutation(userId?: string) {
  const queryClient = useQueryClient();
  const store = useProfileStore();

  return useMutation({
    mutationFn: async (data: {
      username: string;
      displayName: string;
      bio: string;
      avatarUrl?: string;
    }) => {
      if (!userId) throw new Error("로그인이 필요합니다.");
      return await saveUserProfile(userId, data);
    },
    // ✨ [Optimistic Update]: 저장 직전 캐시 및 스토어 선반영
    onMutate: async (newProfileData) => {
      if (!userId) return;

      // 1. 진행 중인 쿼리 취소
      await queryClient.cancelQueries({ queryKey: [PROFILE_QUERY_KEY, userId] });

      // 2. 롤백용 이전 캐시 스냅샷 저장
      const previousProfile = queryClient.getQueryData<UserProfileData>([
        PROFILE_QUERY_KEY,
        userId,
      ]);

      const previousStore = {
        username: store.username,
        displayName: store.displayName,
        bio: store.bio,
      };

      // 3. TanStack Query 캐시 낙관적 업데이트
      queryClient.setQueryData<UserProfileData>([PROFILE_QUERY_KEY, userId], (old) => ({
        userId,
        username: newProfileData.username,
        displayName: newProfileData.displayName,
        bio: newProfileData.bio,
        avatarUrl: newProfileData.avatarUrl || old?.avatarUrl || store.avatarUrl,
        updatedAt: new Date().toISOString(),
      }));

      // 4. Zustand Store에도 즉시 동기화
      store.updateProfile({
        username: newProfileData.username,
        displayName: newProfileData.displayName,
        bio: newProfileData.bio,
      });

      return { previousProfile, previousStore };
    },
    // ❌ [Rollback]: 에러 발생 시 이전 상태로 복구
    onError: (err, _newProfileData, context) => {
      console.error("TanStack Query Mutation 에러, 롤백 실행:", err);
      if (context?.previousProfile && userId) {
        queryClient.setQueryData([PROFILE_QUERY_KEY, userId], context.previousProfile);
      }
      if (context?.previousStore) {
        store.updateProfile(context.previousStore);
      }
    },
    // 🔄 [Settled]: 완료 후 서버 최신 상태와 캐시 무결성 검증
    onSettled: () => {
      if (userId) {
        queryClient.invalidateQueries({ queryKey: [PROFILE_QUERY_KEY, userId] });
      }
    },
  });
}
