import { chromium } from "playwright";

const PORT = process.env.QA_PORT ?? "4300";
const BASE_URL = `http://localhost:${PORT}/`;
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
let anyFailure = false;

const breakpoints = [
  { name: "390", width: 390, height: 844 },
  { name: "430", width: 430, height: 932 },
  { name: "768", width: 768, height: 1024 },
  { name: "1024", width: 1024, height: 768 },
  { name: "1280", width: 1280, height: 800 },
  { name: "1440", width: 1440, height: 900 },
  { name: "1728", width: 1728, height: 1000 },
];

// 1. Responsive + console/hydration + overflow across breakpoints, scrolled past Phase 3 sections.
for (const bp of breakpoints) {
  const page = await browser.newPage({ viewport: { width: bp.width, height: bp.height } });
  const consoleErrors = [];
  const pageErrors = [];
  page.on("console", (msg) => { if (msg.type() === "error") consoleErrors.push(msg.text()); });
  page.on("pageerror", (err) => pageErrors.push(String(err)));
  await page.goto(BASE_URL, { waitUntil: "networkidle" });

  await page.locator("#guide-me").scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);
  await page.locator("#temple-preview").scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);

  const hasOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
  );
  const sectionsPresent = await page.evaluate(() => ({
    highlights: !!document.getElementById("sanctuary-highlights"),
    guideMe: !!document.getElementById("guide-me"),
    templePreview: !!document.getElementById("temple-preview"),
  }));

  const failed = hasOverflow || consoleErrors.length || pageErrors.length || !sectionsPresent.highlights || !sectionsPresent.guideMe || !sectionsPresent.templePreview;
  if (failed) anyFailure = true;
  console.log(`[${bp.name}px] overflow=${hasOverflow} sections=${JSON.stringify(sectionsPresent)} consoleErrors=${consoleErrors.length} pageErrors=${pageErrors.length}`);
  if (consoleErrors.length) console.log("  console:", consoleErrors);
  if (pageErrors.length) console.log("  page:", pageErrors);

  await page.close();
}

// 2. Keyboard/focus through mood buttons + selected-state conveyed.
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(BASE_URL, { waitUntil: "networkidle" });
  await page.locator("#guide-me").scrollIntoViewIfNeeded();

  const restless = page.getByRole("button", { name: "Restless" });
  await restless.focus();
  const focusedLabel = await page.evaluate(() => document.activeElement?.textContent?.trim());
  await page.keyboard.press("Enter");
  const pressedAfterEnter = await restless.getAttribute("aria-pressed");
  const guidanceVisible = await page
    .getByText("7-Minute Longer Exhale")
    .waitFor({ state: "visible", timeout: 2000 })
    .then(() => true)
    .catch(() => false);

  const ok = focusedLabel === "Restless" && pressedAfterEnter === "true" && guidanceVisible;
  if (!ok) anyFailure = true;
  console.log(`Keyboard mood select: focused=${focusedLabel} ariaPressed=${pressedAfterEnter} guidanceVisible=${guidanceVisible} => ${ok ? "PASS" : "FAIL"}`);

  await page.close();
}

// 3. Real touch interaction on mood buttons (mobile viewport, hasTouch).
{
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  await page.goto(BASE_URL, { waitUntil: "networkidle" });
  await page.locator("#guide-me").scrollIntoViewIfNeeded();

  const anxious = page.getByRole("button", { name: "Anxious" });
  const box = await anxious.boundingBox();
  const touchTargetOk = box ? box.height >= 44 : false;
  await anxious.tap();
  const pressed = await anxious.getAttribute("aria-pressed");
  const guidanceVisible = await page
    .getByText("12-Minute Steady Breath")
    .waitFor({ state: "visible", timeout: 2000 })
    .then(() => true)
    .catch(() => false);

  const ok = touchTargetOk && pressed === "true" && guidanceVisible;
  if (!ok) anyFailure = true;
  console.log(`Touch mood select: touchTargetHeight=${box?.height} ariaPressed=${pressed} guidanceVisible=${guidanceVisible} => ${ok ? "PASS" : "FAIL"}`);

  await page.close();
}

// 4. Reduced motion — sections present, no crash, guidance still swaps without JS-driven scrub.
{
  const page = await browser.newPage({ viewport: { width: 1024, height: 800 }, reducedMotion: "reduce" });
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto(BASE_URL, { waitUntil: "networkidle" });
  await page.locator("#guide-me").scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: "Heavy" }).click();
  await page.waitForTimeout(100);
  const guidanceVisible = await page.getByText("20-Minute Grounding Practice").isVisible();
  console.log(`Reduced motion Guide Me: guidanceVisible=${guidanceVisible} pageErrors=${errors.length}`);
  if (!guidanceVisible || errors.length) anyFailure = true;
  await page.close();
}

// 5. Guide Me -> Meditation handoff state + CLS around GuidanceResult.
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const consoleLogs = [];
  page.on("console", (msg) => { if (msg.type() === "info") consoleLogs.push(msg.text()); });
  await page.goto(BASE_URL, { waitUntil: "networkidle" });
  await page.locator("#guide-me").scrollIntoViewIfNeeded();

  const cls = await page.evaluate(() => new Promise((resolve) => {
    let value = 0;
    try {
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) if (!entry.hadRecentInput) value += entry.value;
      }).observe({ type: "layout-shift", buffered: true });
    } catch {}
    setTimeout(() => resolve(value), 1200);
  }));

  await page.getByRole("button", { name: "Scattered" }).click();
  await page.waitForTimeout(150);
  await page.getByRole("button", { name: "Begin Practice" }).click();
  await page.waitForTimeout(100);
  const readyLabel = await page.getByText("Practice Ready").isVisible();

  const clsAfter = await page.evaluate(() => new Promise((resolve) => {
    let value = 0;
    try {
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) if (!entry.hadRecentInput) value += entry.value;
      }).observe({ type: "layout-shift", buffered: true });
    } catch {}
    setTimeout(() => resolve(value), 300);
  }));

  const handoffLogged = consoleLogs.some((l) => l.includes("meditation handoff prepared"));
  const ok = readyLabel && handoffLogged && clsAfter < 0.05;
  if (!ok) anyFailure = true;
  console.log(`Guide Me handoff: readyLabel=${readyLabel} handoffLogged=${handoffLogged} clsBeforeSelect=${cls.toFixed(4)} clsAfterSelectAndBegin=${clsAfter.toFixed(4)} => ${ok ? "PASS" : "FAIL"}`);

  await page.close();
}

await browser.close();
process.exit(anyFailure ? 1 : 0);
