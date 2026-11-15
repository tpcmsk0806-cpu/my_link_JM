import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  where,
  limit,
  serverTimestamp,
} from "firebase/firestore";
import { User } from "firebase/auth";
import { db } from "./firebase";
import { UserProfileData } from "@/types";

/**
 * Clean and normalize username (lowercase, trimmed, URL-safe)
 */
export function normalizeUsername(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_-]/g, "");
}

/**
 * Validate username format: 2-30 characters, letters, numbers, underscore, hyphen
 */
export function validateUsernameFormat(username: string): { isValid: boolean; error?: string } {
  const normalized = normalizeUsername(username);
  if (!normalized || normalized.length < 2) {
    return { isValid: false, error: "사용자 이름은 최소 2글자 이상이어야 합니다." };
  }
  if (normalized.length > 30) {
    return { isValid: false, error: "사용자 이름은 최대 30자까지 가능합니다." };
  }
  if (!/^[a-z0-9][a-z0-9_-]*[a-z0-9]$/i.test(normalized) && normalized.length > 1) {
    return {
      isValid: false,
      error: "영문 소문자, 숫자, 밑줄(_), 하이픈(-)만 사용 가능하며 시작과 끝은 영문/숫자여야 합니다.",
    };
  }
  return { isValid: true };
}

/**
 * Check if username is available (not taken by another user)
 */
export async function checkUsernameAvailable(
  username: string,
  currentUserId: string
): Promise<{ available: boolean; reason?: string }> {
  const normalized = normalizeUsername(username);
  const formatCheck = validateUsernameFormat(normalized);
  if (!formatCheck.isValid) {
    return { available: false, reason: formatCheck.error };
  }

  try {
    const usernameDocRef = doc(db, "usernames", normalized);
    const snap = await getDoc(usernameDocRef);

    if (!snap.exists()) {
      return { available: true };
    }

    const data = snap.data();
    // If owned by current user, it is available to keep
    if (data?.userId === currentUserId) {
      return { available: true };
    }

    return { available: false, reason: "이미 다른 사용자가 사용 중인 사용자 이름입니다." };
  } catch (err: any) {
    console.error("중복 체크 오류:", err);
    // If error occurs, let it pass or warn
    return { available: true };
  }
}

/**
 * Fetch profile data for a specific user from Firestore users/{userId}/profile
 */
export async function getUserProfile(userId: string): Promise<UserProfileData | null> {
  if (!userId) return null;
  try {
    // 1. Try users/{userId}/profile/info
    const profileDocRef = doc(db, "users", userId, "profile", "info");
    const snap = await getDoc(profileDocRef);
    if (snap.exists()) {
      return snap.data() as UserProfileData;
    }

    // 2. Fallback: users/{userId}
    const userDocRef = doc(db, "users", userId);
    const userSnap = await getDoc(userDocRef);
    if (userSnap.exists()) {
      const data = userSnap.data();
      if (data?.username || data?.displayName) {
        return {
          userId,
          username: data.username || "",
          displayName: data.displayName || "",
          bio: data.bio || "",
          avatarUrl: data.avatarUrl || "",
          updatedAt: data.updatedAt || "",
        };
      }
    }

    return null;
  } catch (err) {
    console.warn("프로필 조회 실패:", err);
    return null;
  }
}

/**
 * Save user profile to Firestore `users/{userId}/profile` with username uniqueness check
 */
export async function saveUserProfile(
  userId: string,
  data: {
    username: string;
    displayName: string;
    bio: string;
    avatarUrl?: string;
  }
): Promise<UserProfileData> {
  if (!userId) throw new Error("로그인이 필요합니다.");

  const normalized = normalizeUsername(data.username);
  const formatCheck = validateUsernameFormat(normalized);
  if (!formatCheck.isValid) {
    throw new Error(formatCheck.error || "올바른 사용자 이름을 입력해주세요.");
  }

  // 1. 중복 체크
  const avail = await checkUsernameAvailable(normalized, userId);
  if (!avail.available) {
    throw new Error(avail.reason || "이미 사용 중인 사용자 이름입니다.");
  }

  // 2. 기존 프로필 조회하여 이전 username이 다른 경우 이전 usernames 문서 정리
  const existing = await getUserProfile(userId);
  const oldUsername = existing?.username ? normalizeUsername(existing.username) : null;

  // 3. usernames/{username} 예약 저장
  try {
    await setDoc(doc(db, "usernames", normalized), {
      userId,
      username: normalized,
      updatedAt: serverTimestamp(),
    });

    if (oldUsername && oldUsername !== normalized) {
      await deleteDoc(doc(db, "usernames", oldUsername)).catch(() => {});
    }
  } catch (err) {
    console.warn("usernames 매핑 저장 중 경고:", err);
  }

  // 4. users/{userId}/profile/info 에 저장
  const nowIso = new Date().toISOString();
  const profilePayload: UserProfileData = {
    userId,
    username: normalized,
    displayName: data.displayName.trim() || normalized,
    bio: data.bio.trim(),
    avatarUrl: data.avatarUrl || existing?.avatarUrl || "",
    updatedAt: nowIso,
  };

  const profileDocRef = doc(db, "users", userId, "profile", "info");
  await setDoc(profileDocRef, {
    ...profilePayload,
    savedAt: serverTimestamp(),
  }, { merge: true });

  // 100% 호환성을 위해 users/{userId} 루트 문서에도 함께 기록
  const userRootDocRef = doc(db, "users", userId);
  await setDoc(userRootDocRef, {
    ...profilePayload,
    savedAt: serverTimestamp(),
  }, { merge: true }).catch(() => {});

  return profilePayload;
}

/**
 * Automatically initialize default profile on login if user has no profile yet.
 * - username: email prefix (e.g. "jinmo")
 * - displayName: Google displayName or username
 */
export async function initUserProfileIfAbsent(user: User): Promise<UserProfileData> {
  const existing = await getUserProfile(user.uid);
  if (existing && existing.username) {
    return existing;
  }

  // Generate initial default username from email prefix
  let defaultUsername = "";
  if (user.email) {
    defaultUsername = normalizeUsername(user.email.split("@")[0]);
  }
  if (!defaultUsername || defaultUsername.length < 2) {
    defaultUsername = `user_${user.uid.slice(0, 6).toLowerCase()}`;
  }

  // Check username collision; if collided, append short random digits
  const avail = await checkUsernameAvailable(defaultUsername, user.uid);
  if (!avail.available) {
    defaultUsername = `${defaultUsername}_${Math.floor(100 + Math.random() * 900)}`;
  }

  const defaultDisplayName = user.displayName?.trim() || defaultUsername;
  const defaultBio = "새로운 기술을 탐구하고 유용한 정보를 공유합니다. 아래 링크에서 포트폴리오와 소셜 채널을 만나보세요!";

  return await saveUserProfile(user.uid, {
    username: defaultUsername,
    displayName: defaultDisplayName,
    bio: defaultBio,
    avatarUrl: user.photoURL || "",
  });
}

/**
 * Search user profile by displayName or username in Firestore
 * 1. Search users collection where displayName == searchTerm
 * 2. Search usernames collection where docId == normalized(searchTerm)
 * 3. Search users collection where username == normalized(searchTerm)
 */
export async function findUserByDisplayNameOrUsername(
  searchTerm: string
): Promise<UserProfileData | null> {
  if (!searchTerm) return null;
  const decoded = decodeURIComponent(searchTerm).trim();
  if (!decoded) return null;

  try {
    const usersCol = collection(db, "users");

    // 1. Search by displayName (정확히 일치하는 표시 이름)
    const qDisplayName = query(
      usersCol,
      where("displayName", "==", decoded),
      limit(1)
    );
    const snapDisplayName = await getDocs(qDisplayName);
    if (!snapDisplayName.empty) {
      const docData = snapDisplayName.docs[0].data();
      return {
        userId: docData.userId || snapDisplayName.docs[0].id,
        username: docData.username || "",
        displayName: docData.displayName || decoded,
        bio: docData.bio || "",
        avatarUrl: docData.avatarUrl || "",
        updatedAt: docData.updatedAt || "",
      };
    }

    // 2. Search by usernames/{username} mapping
    const normalized = normalizeUsername(decoded);
    if (normalized) {
      const usernameDocRef = doc(db, "usernames", normalized);
      const snapUsername = await getDoc(usernameDocRef);
      if (snapUsername.exists()) {
        const uData = snapUsername.data();
        if (uData?.userId) {
          const profile = await getUserProfile(uData.userId);
          if (profile) return profile;
        }
      }

      // 3. Search users collection where username == normalized
      const qUsername = query(
        usersCol,
        where("username", "==", normalized),
        limit(1)
      );
      const snapUsers = await getDocs(qUsername);
      if (!snapUsers.empty) {
        const docData = snapUsers.docs[0].data();
        return {
          userId: docData.userId || snapUsers.docs[0].id,
          username: docData.username || normalized,
          displayName: docData.displayName || normalized,
          bio: docData.bio || "",
          avatarUrl: docData.avatarUrl || "",
          updatedAt: docData.updatedAt || "",
        };
      }
    }

    return null;
  } catch (err) {
    console.error("유저 검색 오류:", err);
    return null;
  }
}

