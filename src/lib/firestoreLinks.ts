import {
  collection,
  doc,
  setDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  increment,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db, auth } from "./firebase";
import { LinkItem } from "@/types";

export const FIRESTORE_LINKS_PATH = "users/anonymous/links";

/**
 * Resolves active user ID (passed userId, auth.currentUser?.uid, or "anonymous")
 */
export const resolveUid = (userId?: string): string => {
  return userId || auth.currentUser?.uid || "anonymous";
};

/**
 * Returns Firestore collection reference for users/{uid}/links
 */
export const getUserLinksCol = (userId?: string) => {
  const uid = resolveUid(userId);
  return collection(db, "users", uid, "links");
};

/**
 * Legacy support for users/anonymous/links
 */
export const getAnonymousLinksCol = () => {
  return getUserLinksCol("anonymous");
};

/**
 * Add a new link to Firestore at `users/{uid}/links`
 */
export async function addLinkToFirestore(
  title: string,
  url: string,
  options?: {
    id?: string;
    profileId?: string;
    orderIndex?: number;
    isActive?: boolean;
    clickCount?: number;
    userId?: string;
  }
): Promise<LinkItem> {
  const uid = resolveUid(options?.userId);
  const colRef = getUserLinksCol(uid);

  let formattedUrl = url.trim();
  if (
    formattedUrl &&
    !/^https?:\/\//i.test(formattedUrl) &&
    !formattedUrl.startsWith("mailto:")
  ) {
    formattedUrl = `https://${formattedUrl}`;
  }

  // Generate document ref (custom ID or auto-generated ID)
  const docRef = options?.id ? doc(colRef, options.id) : doc(colRef);
  const createdAtIso = new Date().toISOString();

  const linkItem: LinkItem = {
    id: docRef.id,
    profileId: options?.profileId || uid,
    title: title.trim(),
    url: formattedUrl,
    orderIndex: options?.orderIndex ?? 0,
    isActive: options?.isActive ?? true,
    clickCount: options?.clickCount ?? 0,
    createdAt: createdAtIso,
    updatedAt: createdAtIso,
  };

  // Save to Firestore users/{uid}/links/{docId}
  await setDoc(docRef, {
    ...linkItem,
    savedAt: serverTimestamp(),
  });

  return linkItem;
}

/**
 * Fetch all links from Firestore `users/{uid}/links`
 */
export async function getLinksFromFirestore(userId?: string): Promise<LinkItem[]> {
  const uid = resolveUid(userId);
  const colRef = getUserLinksCol(uid);
  const q = query(colRef, orderBy("orderIndex", "asc"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      profileId: data.profileId || uid,
      title: data.title || "",
      url: data.url || "",
      orderIndex: data.orderIndex ?? 0,
      isActive: data.isActive !== undefined ? data.isActive : true,
      clickCount: data.clickCount ?? 0,
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: data.updatedAt || undefined,
    } as LinkItem;
  });
}

/**
 * Update a link in Firestore `users/{uid}/links`
 */
export async function updateLinkInFirestore(
  id: string,
  updates: Partial<LinkItem>,
  userId?: string
): Promise<void> {
  const uid = resolveUid(userId);
  const docRef = doc(db, "users", uid, "links", id);
  const nowIso = new Date().toISOString();
  const formattedUpdates: Record<string, any> = {
    ...updates,
    updatedAt: updates.updatedAt || nowIso,
  };
  if (formattedUpdates.url) {
    let u = formattedUpdates.url.trim();
    if (u && !/^https?:\/\//i.test(u) && !u.startsWith("mailto:")) {
      u = `https://${u}`;
    }
    formattedUpdates.url = u;
  }
  try {
    await updateDoc(docRef, formattedUpdates);
  } catch (err: any) {
    // 문서가 아직 Firestore에 생성되지 않은 경우 setDoc으로 안전하게 merge 생성
    if (
      err?.code === "not-found" ||
      err?.message?.includes("No document to update") ||
      err?.message?.includes("NOT_FOUND")
    ) {
      await setDoc(docRef, formattedUpdates, { merge: true });
    } else {
      throw err;
    }
  }
}

/**
 * Delete a link from Firestore `users/{uid}/links`
 */
export async function deleteLinkFromFirestore(id: string, userId?: string): Promise<void> {
  const uid = resolveUid(userId);
  const docRef = doc(db, "users", uid, "links", id);
  await deleteDoc(docRef);
}

/**
 * Increment clickCount for a specific link in Firestore `users/{uid}/links/{linkId}`
 */
export async function recordLinkClickInFirestore(
  linkId: string,
  userId?: string
): Promise<void> {
  const uid = resolveUid(userId);
  const docRef = doc(db, "users", uid, "links", linkId);
  try {
    await updateDoc(docRef, {
      clickCount: increment(1),
    });
  } catch (err: any) {
    console.warn("Click count update warning:", err?.message || err);
  }
}
