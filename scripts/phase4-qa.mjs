import { chromium } from "playwright";

const PORT = process.env.QA_PORT ?? "4300";
const BASE_URL = `http://localhost:${PORT}/`;
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
let anyFailure = false;

const check = (label, ok, detail = "") => {
  if (!ok) anyFailure = true;
  console.log(`${ok ? "PASS" : "FAIL"} ${label}${detail ? " — " + detail : ""}`);
};

// 1. Ritual card -> matching ritual state (no double-selection needed).
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const mediaRequests = [];
  page.on("request", (r) => { if (/\.(mp3|wav|ogg|m4a)(\?|$)/.test(r.url())) mediaRequests.push(r.url()); });
  await page.goto(BASE_URL, { waitUntil: "networkidle" });
  await page.locator("#sanctuary-highlights").scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: /Ring the bell/ }).click();

  const dialog = page.getByRole("dialog");
  await dialog.waitFor({ state: "visible", timeout: 2000 });
  const headline = await dialog.getByText("Ring the bell.").isVisible();
  check("Ritual card (Bell) opens Temple Mode preselected to Bell", headline);
  check("No autoplay media request on open", mediaRequests.length === 0, `${mediaRequests.length} requests`);

  // 2. Escape closes + focus restoration to exact trigger.
  await page.keyboard.press("Escape");
  await dialog.waitFor({ state: "hidden", timeout: 2000 });
  const restored = await page.evaluate(() => document.activeElement?.textContent?.includes("Ring the bell."));
  check("Escape closes + focus restored to exact trigger", restored === true);

  // 3. Body scroll restored after close.
  const overflow = await page.evaluate(() => getComputedStyle(document.body).overflow);
  check("Body scroll restored after close", overflow !== "hidden", overflow);

  await page.close();
}

// 2. Generic Gateway CTA -> default state; Close button; repeated open/close; no duplicate overlay.
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(BASE_URL, { waitUntil: "networkidle" });

  const enterTemple = page.getByRole("button", { name: "Enter Temple" }).first();
  await enterTemple.click();
  const dialog = page.getByRole("dialog");
  await dialog.waitFor({ state: "visible", timeout: 2000 });
  const defaultVisible = await dialog.getByText("Nothing to achieve.").isVisible();
  check("Gateway Enter Temple CTA opens default Temple state", defaultVisible);

  await page.getByRole("button", { name: "Close Temple Mode" }).click();
  await dialog.waitFor({ state: "hidden", timeout: 2000 });

  // repeated open/close cycles
  for (let i = 0; i < 3; i++) {
    await enterTemple.click();
    await dialog.waitFor({ state: "visible", timeout: 2000 });
    await page.keyboard.press("Escape");
    await dialog.waitFor({ state: "hidden", timeout: 2000 });
  }
  const dialogCount = await page.locator('[role="dialog"]').count();
  check("No duplicate Temple overlay after repeated open/close", dialogCount <= 1, `count=${dialogCount}`);

  await page.close();
}

// 3. Temple Preview CTA -> default state.
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(BASE_URL, { waitUntil: "networkidle" });
  await page.locator("#temple-preview").scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: "Enter Temple Mode" }).click();
  const dialog = page.getByRole("dialog");
  await dialog.waitFor({ state: "visible", timeout: 2000 });
  check("Temple Preview CTA opens default Temple state", await dialog.getByText("Nothing to achieve.").isVisible());
  await page.close();
}

// 4. Focus containment: Tab wraps forward, Shift+Tab wraps backward.
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(BASE_URL, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Enter Temple" }).first().click();
  await page.getByRole("dialog").waitFor({ state: "visible", timeout: 2000 });

  const focusableCount = await page.locator('[role="dialog"] button, [role="dialog"] [href]').count();
  // Tab through every focusable element + one more; focus should wrap to the first, staying inside the dialog.
  for (let i = 0; i < focusableCount; i++) await page.keyboard.press("Tab");
  const afterWrapForward = await page.evaluate(() => {
    const dialog = document.querySelector('[role="dialog"]');
    return dialog?.contains(document.activeElement);
  });
  check("Tab containment: focus stays inside dialog through a full cycle", afterWrapForward === true);

  await page.keyboard.press("Shift+Tab");
  const afterShiftTab = await page.evaluate(() => {
    const dialog = document.querySelector('[role="dialog"]');
    return dialog?.contains(document.activeElement);
  });
  check("Shift+Tab containment: focus stays inside dialog", afterShiftTab === true);

  // Background must not be keyboard-interactive: nav's "Meditate" link should not be reachable.
  const bgFocused = await page.evaluate(() => document.activeElement?.textContent?.trim());
  check("Background not reachable via Tab while open", bgFocused !== "Meditate");

  await page.close();
}

// 5. 7 breakpoints + overflow + Buddha-unobstructed (dialog open) + console/hydration.
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
  await page.getByRole("button", { name: "Enter Temple" }).first().click();
  await page.getByRole("dialog").waitFor({ state: "visible", timeout: 2000 });
  await page.waitForTimeout(150);

  const hasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
  const dockVisible = await page.locator('[role="dialog"] button:has-text("Candle")').isVisible();
  const closeVisible = await page.getByRole("button", { name: "Close Temple Mode" }).isVisible();

  const ok = !hasOverflow && dockVisible && closeVisible && consoleErrors.length === 0 && pageErrors.length === 0;
  check(`[${bp.name}px] Temple Mode open: no overflow, dock + close visible, clean console`, ok, `overflow=${hasOverflow} dock=${dockVisible} close=${closeVisible} consoleErrors=${consoleErrors.length} pageErrors=${pageErrors.length}`);

  await page.close();
}

// 6. Reduced motion open/close + ritual swap.
{
  const page = await browser.newPage({ viewport: { width: 1024, height: 800 }, reducedMotion: "reduce" });
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto(BASE_URL, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Enter Temple" }).first().click();
  const dialog = page.getByRole("dialog");
  await dialog.waitFor({ state: "visible", timeout: 2000 });
  await page.getByRole("button", { name: "Lotus", exact: true }).click();
  const swapped = await dialog.getByText("Offer a lotus.").isVisible();
  await page.keyboard.press("Escape");
  await dialog.waitFor({ state: "hidden", timeout: 2000 });
  check("Reduced motion: open, ritual swap, close all work", swapped && errors.length === 0, `pageErrors=${errors.length}`);
  await page.close();
}

// 7. Real touch interaction on dock (mobile).
{
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  await page.goto(BASE_URL, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Enter Temple" }).first().tap();
  const dialog = page.getByRole("dialog");
  await dialog.waitFor({ state: "visible", timeout: 2000 });
  const incense = page.getByRole("button", { name: "Incense", exact: true });
  const box = await incense.boundingBox();
  await incense.tap();
  const swapped = await dialog
    .getByText("Offer incense.")
    .waitFor({ state: "visible", timeout: 2000 })
    .then(() => true)
    .catch(() => false);
  check("Touch: dock button >=44px + ritual swap works", (box?.height ?? 0) >= 44 && swapped, `height=${box?.height}`);
  await page.close();
}

await browser.close();
process.exit(anyFailure ? 1 : 0);
