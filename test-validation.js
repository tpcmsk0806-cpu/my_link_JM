const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

async function runValidationTest() {
  console.log("=== [1] 브라우저 실행 및 유효성 검사 테스트 시작 ===");
  const browser = await chromium.launch({
    executablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 430, height: 932 },
  });

  const page = await context.newPage();
  const outDir = path.join(__dirname, "test-screenshots");
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });

  // 1. 다이얼로그 열기
  const primaryAddBtn = page.getByRole("button", { name: "새 링크 추가하기" });
  await primaryAddBtn.click();
  const dialog = page.getByRole("dialog");
  await dialog.waitFor({ state: "visible" });
  console.log("✔ 다이얼로그 열림");

  const titleInput = dialog.locator('input[placeholder*="2026 다이어리"]');
  const urlInput = dialog.locator('input[placeholder*="example.com"]');
  const submitBtn = dialog.getByRole("button", { name: "링크 추가하기" });

  // 2. 초기 상태: 버튼 비활성화 확인
  const isSubmitDisabledInitially = await submitBtn.isDisabled();
  console.log(`✔ 초기 상태 버튼 비활성화: ${isSubmitDisabledInitially ? "성공" : "실패"}`);

  // 3. 잘못된 값 테스트 1: 제목이 1글자인 경우
  await titleInput.fill("a");
  await titleInput.blur();
  await page.waitForTimeout(300);

  const titleShortError = dialog.locator("text=제목은 최소 2자 이상 입력해주세요.");
  const isTitleShortErrorVisible = await titleShortError.isVisible();
  console.log(`✔ 제목 1자 에러 검증 ('제목은 최소 2자 이상'): ${isTitleShortErrorVisible ? "성공" : "실패"}`);

  // 4. 잘못된 값 테스트 2: 잘못된 URL (도메인 형식 아님, 공백 포함 등)
  await urlInput.fill("invalid-domain-without-dot");
  await urlInput.blur();
  await page.waitForTimeout(300);

  const urlInvalidError = dialog.locator("text=올바른 웹 도메인 주소(예: example.com)를 입력해주세요.");
  const isUrlInvalidErrorVisible = await urlInvalidError.isVisible();
  console.log(`✔ URL 도메인 미스 에러 검증: ${isUrlInvalidErrorVisible ? "성공" : "실패"}`);

  await page.screenshot({ path: path.join(outDir, "06_validation_errors.png") });
  console.log("✔ 유효성 에러 화면 - 06_validation_errors.png 저장");

  // 5. 공백 포함 URL 테스트
  await urlInput.fill("https://test .com");
  await page.waitForTimeout(300);
  const urlSpaceError = dialog.locator("text=URL에는 공백이 포함될 수 없습니다.");
  const isUrlSpaceErrorVisible = await urlSpaceError.isVisible();
  console.log(`✔ URL 공백 에러 검증: ${isUrlSpaceErrorVisible ? "성공" : "실패"}`);

  // 6. 정상 값 입력 테스트
  console.log("=== [2] 정상 값 입력 및 실시간 유효성 피드백 확인 ===");
  await titleInput.fill("🚀 개발자 기술 블로그 & 이력서");
  await urlInput.fill("velog.io/@developer");
  await urlInput.blur();
  await page.waitForTimeout(500);

  // https:// 자동 보정 뱃지 및 안내 확인
  const autoProtoBadge = dialog.locator("text=https:// 자동 적용됨");
  const isAutoProtoVisible = await autoProtoBadge.isVisible();
  console.log(`✔ 'https:// 자동 적용됨' 안내 뱃지 노출: ${isAutoProtoVisible ? "성공" : "실패"}`);

  // 버튼 활성화 확인
  const isSubmitEnabled = await submitBtn.isEnabled();
  console.log(`✔ 유효한 입력 시 버튼 활성화 여부: ${isSubmitEnabled ? "성공" : "실패"}`);

  await page.screenshot({ path: path.join(outDir, "07_validation_success.png") });
  console.log("✔ 유효성 통과 화면 - 07_validation_success.png 저장");

  // 7. 제출 및 목록 반영 확인
  await submitBtn.click();
  await page.waitForTimeout(800);

  const newLink = page.getByRole("link", { name: /개발자 기술 블로그 & 이력서/ });
  await newLink.waitFor({ state: "visible", timeout: 5000 });
  console.log("✔ 새 링크가 성공적으로 등록되고 화면에 렌더링됨!");

  await page.screenshot({ path: path.join(outDir, "08_after_valid_addition.png") });
  console.log("✔ 등록 완료 화면 - 08_after_valid_addition.png 저장");

  await browser.close();
  console.log("=== 유효성 검사 브라우저 테스트 완료! 🎉 ===");
}

runValidationTest().catch((err) => {
  console.error("테스트 오류:", err);
  process.exit(1);
});
