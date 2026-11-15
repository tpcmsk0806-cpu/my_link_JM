import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getLinksFromFirestore,
  addLinkToFirestore,
  updateLinkInFirestore,
  deleteLinkFromFirestore,
} from "@/lib/firestoreLinks";
import { LinkItem } from "@/types";
import { useProfileStore } from "@/lib/store";

export const LINKS_QUERY_KEY = "links";

/**
 * Hook to fetch link items with TanStack Query caching
 */
export function useLinksQuery(userId?: string) {
  const store = useProfileStore();

  return useQuery({
    queryKey: [LINKS_QUERY_KEY, userId || "anonymous"],
    queryFn: async () => {
      const links = await getLinksFromFirestore(userId);
      if (links && links.length > 0) {
        store.setLinks(links);
      }
      return links;
    },
    enabled: true,
  });
}
