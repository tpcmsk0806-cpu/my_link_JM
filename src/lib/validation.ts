/**
 * Validation utilities for Links
 */

export function validateTitle(rawTitle: string): { isValid: boolean; error?: string } {
  const trimmed = rawTitle.trim();
  if (!trimmed) {
    return { isValid: false, error: "버튼 제목을 입력해주세요." };
  }
  if (trimmed.length < 2) {
    return { isValid: false, error: "제목은 최소 2자 이상 입력해주세요." };
  }
  if (trimmed.length > 40) {
    return { isValid: false, error: "제목은 최대 40자까지 입력 가능합니다." };
  }
  return { isValid: true };
}

export function validateUrl(rawUrl: string): {
  isValid: boolean;
  formattedUrl: string;
  error?: string;
  isCorrected?: boolean;
} {
  const trimmed = rawUrl.trim();
  if (!trimmed) {
    return { isValid: false, formattedUrl: "", error: "연결할 URL 주소를 입력해주세요." };
  }

  if (/\s/.test(trimmed)) {
    return { isValid: false, formattedUrl: "", error: "URL에는 공백이 포함될 수 없습니다." };
  }

  // mailto check
  if (trimmed.startsWith("mailto:")) {
    const email = trimmed.replace("mailto:", "");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        isValid: false,
        formattedUrl: "",
        error: "올바른 이메일 주소(예: mailto:name@domain.com)를 입력해주세요.",
      };
    }
    return { isValid: true, formattedUrl: trimmed, isCorrected: false };
  }

  // Auto-prepend https:// if missing
  let withProto = trimmed;
  let isCorrected = false;
  if (!/^https?:\/\//i.test(trimmed)) {
    withProto = `https://${trimmed}`;
    isCorrected = true;
  }

  try {
    const parsed = new URL(withProto);
    const hostname = parsed.hostname;
    // Hostname must contain at least one dot or be localhost
    const domainRegex = /^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;

    if (!domainRegex.test(hostname) && hostname !== "localhost") {
      return {
        isValid: false,
        formattedUrl: "",
        error: "올바른 웹 도메인 주소(예: example.com)를 입력해주세요.",
      };
    }

    return { isValid: true, formattedUrl: withProto, isCorrected };
  } catch {
    return { isValid: false, formattedUrl: "", error: "올바른 웹 주소 형식이 아닙니다." };
  }
}
