const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

async function runTest() {
  console.log("=== [1] 브라우저 실행 시작 (Microsoft Edge) ===");
  const browser = await chromium.launch({
    executablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 430, height: 932 }, // iPhone 14 Pro Max 모바일 뷰포트
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1",
  });

  const page = await context.newPage();

  const outDir = path.join(__dirname, "test-screenshots");
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  console.log("=== [2] http://localhost:3000 접속 ===");
  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });

  // 1. 초기 화면 스크린샷
  await page.screenshot({ path: path.join(outDir, "01_initial_page.png"), fullPage: false });
  console.log("✔ 초기 페이지 로드 완료 - 01_initial_page.png 저장");

  // 2. 상단 Primary 새 링크 추가 버튼 확인
  const primaryAddBtn = page.getByRole("button", { name: "새 링크 추가하기" });
  await primaryAddBtn.waitFor({ state: "visible" });
  console.log("✔ 상단 Primary '새 링크 추가하기' 버튼 확인 완료");

  // 3. 버튼 클릭하여 다이얼로그 열기
  console.log("=== [3] 다이얼로그 열기 ===");
  await primaryAddBtn.click();
  await page.waitForTimeout(500);

  // 다이얼로그 노출 확인
  const dialog = page.getByRole("dialog");
  await dialog.waitFor({ state: "visible" });
  console.log("✔ 다이얼로그 모달 팝업 확인 완료");
  await page.screenshot({ path: path.join(outDir, "02_dialog_opened.png") });

  // 4. 이모지 클릭 & 제목/URL 입력
  console.log("=== [4] 링크 제목 및 URL 입력 ===");
  // '🛍️' 추천 이모지 클릭
  const emojiBtn = dialog.getByRole("button", { name: "🛍️" });
  if (await emojiBtn.isVisible()) {
    await emojiBtn.click();
    console.log("✔ 추천 이모지 🛍️ 선택 완료");
  }

  const titleInput = dialog.locator('input[placeholder*="2026 다이어리"]');
  await titleInput.fill("🛍️ 봄맞이 한정판 굿즈 마켓");

  const urlInput = dialog.locator('input[placeholder*="smartstore"]');
  await urlInput.fill("smartstore.naver.com/mylink-goods");

  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(outDir, "03_dialog_filled.png") });
  console.log("✔ 다이얼로그 폼 입력 및 실시간 프리뷰 확인 - 03_dialog_filled.png 저장");

  // 5. '링크 추가하기' 서브밋 버튼 클릭
  console.log("=== [5] 링크 추가 서브밋 ===");
  const submitBtn = dialog.getByRole("button", { name: "링크 추가하기" });
  await submitBtn.click();
  await page.waitForTimeout(800);

  // 6. 목록에 추가된 새 링크 카드 확인
  const newLinkCard = page.getByRole("link", { name: /봄맞이 한정판 굿즈 마켓/ });
  await newLinkCard.waitFor({ state: "visible", timeout: 5000 });
  console.log("✔ 새 링크 카드가 화면에 렌더링됨!");

  await page.screenshot({ path: path.join(outDir, "04_link_added.png") });
  console.log("✔ 추가 완료 화면 - 04_link_added.png 저장");

  // 7. 새로고침 후 localStorage 영속성 검증
  console.log("=== [6] 페이지 새로고침 후 localStorage 유지 검증 ===");
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(500);

  const reloadedCard = page.getByRole("link", { name: /봄맞이 한정판 굿즈 마켓/ });
  const isPersisted = await reloadedCard.isVisible();
  console.log(`✔ 새로고침 후 데이터 유지 여부: ${isPersisted ? "성공 (Persisted)" : "실패"}`);

  await page.screenshot({ path: path.join(outDir, "05_after_reload_persisted.png") });
  console.log("✔ 새로고침 후 화면 - 05_after_reload_persisted.png 저장");

  await browser.close();
  console.log("=== 모든 브라우저 테스트 완료! 🎉 ===");
}

runTest().catch((err) => {
  console.error("테스트 실패:", err);
  process.exit(1);
});
