import { chromium } from "playwright";

const PORT = process.env.QA_PORT ?? "4300";
const BASE_URL = `http://localhost:${PORT}/`;
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
let anyFailure = false;

const check = (label, ok, detail = "") => {
  if (!ok) anyFailure = true;
  console.log(`${ok ? "PASS" : "FAIL"} ${label}${detail ? " — " + detail : ""}`);
};

// 1. Guide Me duration handoff (Restless -> 7 min preselected).
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(BASE_URL, { waitUntil: "networkidle" });
  await page.locator("#guide-me").scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: "Restless" }).click();
  await page.getByRole("button", { name: "Begin Practice" }).click();
  const dialog = page.getByRole("dialog");
  await dialog.waitFor({ state: "visible", timeout: 2000 });
  const pressed = await dialog.getByRole("button", { name: "7 min" }).getAttribute("aria-pressed");
  check("Guide Me handoff preselects recommended duration (7 min)", pressed === "true");
  await page.keyboard.press("Escape");
  await dialog.waitFor({ state: "hidden", timeout: 2000 });
  await page.close();
}

// 2. Generic entry has no preselection.
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(BASE_URL, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Begin Meditation" }).first().click();
  const dialog = page.getByRole("dialog");
  await dialog.waitFor({ state: "visible", timeout: 2000 });
  const anyPressed = await dialog.locator('button[aria-pressed="true"]').count();
  const beginDisabled = await dialog.getByRole("button", { name: "Begin Meditation" }).isDisabled();
  check("Generic entry: no duration preselected + Begin disabled", anyPressed === 0 && beginDisabled, `pressedCount=${anyPressed} beginDisabled=${beginDisabled}`);
  await page.close();
}

// 3. Full session: start -> pause -> resume -> reset; timer accuracy after simulated visibility gap.
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const mediaRequests = [];
  page.on("request", (r) => { if (/\.(mp3|wav|ogg|m4a)(\?|$)/.test(r.url())) mediaRequests.push(r.url()); });
  await page.goto(BASE_URL, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Begin Meditation" }).first().click();
  const dialog = page.getByRole("dialog");
  await dialog.waitFor({ state: "visible", timeout: 2000 });

  await dialog.getByRole("button", { name: "3 min" }).click();
  await dialog.getByRole("button", { name: "Begin Meditation" }).click();
  const running = await dialog.getByRole("button", { name: "Pause" }).isVisible();
  check("Session starts: Pause control appears", running);

  // Simulate a visibility gap by jumping the clock forward via Date override,
  // then forcing a visibilitychange — timer must reflect elapsed time, not drift.
  await page.evaluate(() => {
    const realNow = Date.now;
    const offset = 10_000; // 10s "elapsed while backgrounded"
    Date.now = () => realNow() + offset;
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await page.waitForTimeout(200);
  const timerText = await dialog.locator("text=/^\\d{2}:\\d{2}$/").first().textContent();
  const [mm, ss] = timerText.split(":").map(Number);
  const remaining = mm * 60 + ss;
  check("Timer reflects simulated 10s gap (no drift)", remaining <= 3 * 60 - 9 && remaining >= 3 * 60 - 11, `remaining=${remaining}s`);

  await dialog.getByRole("button", { name: "Pause" }).click();
  const resumeVisible = await dialog.getByRole("button", { name: "Resume" }).isVisible();
  check("Pause works: Resume control appears", resumeVisible);

  await dialog.getByRole("button", { name: "Resume" }).click();
  const pauseVisible = await dialog.getByRole("button", { name: "Pause" }).isVisible();
  check("Resume works: Pause control appears again", pauseVisible);

  await dialog.getByRole("button", { name: "Reset" }).click();
  const idleAgain = await dialog.getByRole("button", { name: "Begin Meditation" }).isVisible();
  const durationStillSelected = await dialog.getByRole("button", { name: "3 min" }).getAttribute("aria-pressed");
  check("Reset returns to pre-session idle, duration still selected", idleAgain && durationStillSelected === "true");

  check("No audio/media requests during session", mediaRequests.length === 0, `${mediaRequests.length} requests`);

  await page.close();
}

// 4. Natural completion.
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(BASE_URL, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Begin Meditation" }).first().click();
  const dialog = page.getByRole("dialog");
  await dialog.waitFor({ state: "visible", timeout: 2000 });
  await dialog.getByRole("button", { name: "3 min" }).click();
  await dialog.getByRole("button", { name: "Begin Meditation" }).click();

  // Jump the clock past the full duration and let the 1s tick observe it.
  await page.evaluate(() => {
    const realNow = Date.now;
    Date.now = () => realNow() + 3 * 60_000 + 1000;
  });
  await page.waitForTimeout(1300);
  const completed = await dialog.getByRole("heading", { name: "Meditation complete." }).isVisible();
  check("Natural completion reached", completed);
  await page.close();
}

// 5. Close while running cleans timer; repeated open/close; reopen without handoff starts clean.
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(BASE_URL, { waitUntil: "networkidle" });
  const enterMeditation = page.getByRole("button", { name: "Begin Meditation" }).first();
  await enterMeditation.click();
  let dialog = page.getByRole("dialog");
  await dialog.waitFor({ state: "visible", timeout: 2000 });
  await dialog.getByRole("button", { name: "7 min" }).click();
  await dialog.getByRole("button", { name: "Begin Meditation" }).click();
  await dialog.getByRole("button", { name: "Close Meditation Hall" }).click();
  await dialog.waitFor({ state: "hidden", timeout: 2000 });

  for (let i = 0; i < 3; i++) {
    await enterMeditation.click();
    dialog = page.getByRole("dialog");
    await dialog.waitFor({ state: "visible", timeout: 2000 });
    await page.keyboard.press("Escape");
    await dialog.waitFor({ state: "hidden", timeout: 2000 });
  }
  const dialogCount = await page.locator('[role="dialog"]').count();
  check("No duplicate overlay after repeated open/close", dialogCount === 0, `count=${dialogCount}`);

  await enterMeditation.click();
  dialog = page.getByRole("dialog");
  await dialog.waitFor({ state: "visible", timeout: 2000 });
  const cleanReopen = await dialog.getByRole("button", { name: "Begin Meditation" }).isVisible();
  const nothingPressed = await dialog.locator('button[aria-pressed="true"]').count();
  check("Reopen without handoff starts clean (idle, no selection, no leftover timer)", cleanReopen && nothingPressed === 0);

  // Focus restoration.
  await page.keyboard.press("Escape");
  await dialog.waitFor({ state: "hidden", timeout: 2000 });
  const restored = await page.evaluate(() => document.activeElement?.textContent?.trim());
  check("Escape restores focus to exact trigger", restored === "Begin Meditation");

  await page.close();
}

// 6. Focus trap containment.
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(BASE_URL, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Begin Meditation" }).first().click();
  const dialog = page.getByRole("dialog");
  await dialog.waitFor({ state: "visible", timeout: 2000 });
  const focusableCount = await dialog.locator("button, [href]").count();
  for (let i = 0; i < focusableCount + 1; i++) await page.keyboard.press("Tab");
  const contained = await page.evaluate(() => {
    const d = document.querySelector('[role="dialog"]');
    return d?.contains(document.activeElement);
  });
  check("Tab containment holds through a full cycle", contained === true);
  await page.close();
}

// 7. Reduced motion: open, select duration, start, phase text present without scale animation, close.
{
  const page = await browser.newPage({ viewport: { width: 1024, height: 800 }, reducedMotion: "reduce" });
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto(BASE_URL, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Begin Meditation" }).first().click();
  const dialog = page.getByRole("dialog");
  await dialog.waitFor({ state: "visible", timeout: 2000 });
  await dialog.getByRole("button", { name: "3 min" }).click();
  await dialog.getByRole("button", { name: "Begin Meditation" }).click();
  const phaseVisible = await dialog.getByText(/INHALE|HOLD|EXHALE/).isVisible();
  await page.keyboard.press("Escape");
  await dialog.waitFor({ state: "hidden", timeout: 2000 });
  check("Reduced motion: session runs, phase understandable via text, no errors", phaseVisible && errors.length === 0, `pageErrors=${errors.length}`);
  await page.close();
}

// 8. 7 breakpoints + overflow + console/hydration with Meditation Hall open.
const breakpoints = [
  { name: "390", width: 390, height: 844 },
  { name: "430", width: 430, height: 932 },
  { name: "768", width: 768, height: 1024 },
  { name: "1024", width: 1024, height: 768 },
  { name: "1280", width: 1280, height: 800 },
  { name: "1440", width: 1440, height: 900 },
  { name: "1728", width: 1728, height: 1000 },
];
for (const bp of breakpoints) {
  const page = await browser.newPage({ viewport: { width: bp.width, height: bp.height } });
  const consoleErrors = [];
  const pageErrors = [];
  page.on("console", (m) => { if (m.type() === "error") consoleErrors.push(m.text()); });
  page.on("pageerror", (e) => pageErrors.push(String(e)));
  await page.goto(BASE_URL, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Begin Meditation" }).first().click();
  const dialog = page.getByRole("dialog");
  await dialog.waitFor({ state: "visible", timeout: 2000 });
  await dialog.getByRole("button", { name: "3 min" }).click();
  await dialog.getByRole("button", { name: "Begin Meditation" }).click();
  await page.waitForTimeout(150);

  const hasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
  const controlsReachable = await dialog.getByRole("button", { name: "Pause" }).isVisible();
  const ok = !hasOverflow && controlsReachable && consoleErrors.length === 0 && pageErrors.length === 0;
  check(`[${bp.name}px] Meditation Hall running: no overflow, controls reachable, clean console`, ok, `overflow=${hasOverflow} controls=${controlsReachable} consoleErrors=${consoleErrors.length} pageErrors=${pageErrors.length}`);

  await page.close();
}

await browser.close();
process.exit(anyFailure ? 1 : 0);
