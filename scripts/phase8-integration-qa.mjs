import { chromium } from "playwright";

// One continuous session exercising the full visitor journey end-to-end —
// complements phase2-7-qa.mjs (which verify each chapter in isolation) by
// catching state that leaks *between* subsystems in a single real session
// (Temple Mode -> Meditation Hall -> Journal -> nav, all on one page load).
const PORT = process.env.QA_PORT ?? "4300";
const BASE_URL = `http://localhost:${PORT}/`;
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
let anyFailure = false;

const check = (label, ok, detail = "") => {
  if (!ok) anyFailure = true;
  console.log(`${ok ? "PASS" : "FAIL"} ${label}${detail ? " — " + detail : ""}`);
};

// 1. Full session, motion enabled, 1440px.
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const consoleErrors = [];
  const pageErrors = [];
  page.on("console", (m) => { if (m.type() === "error") consoleErrors.push(m.text()); });
  page.on("pageerror", (e) => pageErrors.push(e.message));

  await page.goto(BASE_URL, { waitUntil: "networkidle" });

  // Full scroll top -> footer.
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(500);
  const footerVisible = await page.locator("footer").isVisible();
  check("Full scroll reaches footer, no errors so far", footerVisible && consoleErrors.length === 0 && pageErrors.length === 0);
  await page.evaluate(() => window.scrollTo(0, 0));

  // Temple Mode: nav entry -> close -> ritual card entry -> close -> reopen via Closing CTA.
  await page.getByLabel("Primary").getByRole("button", { name: "Temple", exact: true }).click();
  let dialog = page.getByRole("dialog");
  await dialog.waitFor({ state: "visible", timeout: 2000 });
  check("Temple Mode opens from nav", await dialog.isVisible());
  await page.keyboard.press("Escape");
  await dialog.waitFor({ state: "hidden", timeout: 2000 });

  await page.locator("#sanctuary-highlights").scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: /Ring the bell/ }).click();
  await dialog.waitFor({ state: "visible", timeout: 2000 });
  check("Temple Mode reopens from ritual card, preselected", await dialog.getByText("Ring the bell.").isVisible());
  await page.locator('button[aria-label="Close Temple Mode"]').click();
  await dialog.waitFor({ state: "hidden", timeout: 2000 });

  await page.locator("#closing").scrollIntoViewIfNeeded();
  await page.locator("#closing").getByRole("button", { name: /enter temple/i }).click();
  await dialog.waitFor({ state: "visible", timeout: 2000 });
  check("Temple Mode reopens cleanly from Closing CTA (no residual state)", await dialog.isVisible());
  await page.keyboard.press("Escape");
  await dialog.waitFor({ state: "hidden", timeout: 2000 });
  await page.evaluate(() => window.scrollTo(0, 0));

  // Meditation Hall: generic entry (no preselect) -> start -> pause -> resume -> close.
  await page.getByLabel("Primary").getByRole("button", { name: "Meditate", exact: true }).click();
  let hallDialog = page.getByRole("dialog");
  await hallDialog.waitFor({ state: "visible", timeout: 2000 });
  const beginDisabled = await hallDialog.getByRole("button", { name: /^begin/i }).isDisabled();
  check("Meditation Hall generic entry: Begin disabled until duration chosen", beginDisabled);
  await hallDialog.getByRole("button", { name: "3 min" }).click();
  await hallDialog.getByRole("button", { name: "Begin Meditation" }).click();
  await hallDialog.getByRole("button", { name: /pause/i }).waitFor({ state: "visible", timeout: 2000 });
  check("Session started, Pause control visible", true);
  await hallDialog.getByRole("button", { name: /pause/i }).click();
  await hallDialog.getByRole("button", { name: /resume/i }).waitFor({ state: "visible", timeout: 2000 });
  await hallDialog.getByRole("button", { name: /resume/i }).click();
  await hallDialog.getByRole("button", { name: /pause/i }).waitFor({ state: "visible", timeout: 2000 });
  check("Pause/resume cycle works mid-session", true);
  await page.keyboard.press("Escape");
  await hallDialog.waitFor({ state: "hidden", timeout: 2000 });

  // Guide Me handoff -> Meditation Hall with duration preselected.
  await page.locator("#guide-me").scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: "Restless" }).click();
  await page.getByRole("button", { name: "Begin Practice" }).click();
  hallDialog = page.getByRole("dialog");
  await hallDialog.waitFor({ state: "visible", timeout: 2000 });
  const preselected = await page.locator('[aria-pressed="true"]').count();
  check("Guide Me handoff preselects a duration in Meditation Hall", preselected > 0);
  await page.keyboard.press("Escape");
  await hallDialog.waitFor({ state: "hidden", timeout: 2000 });

  // Journal + Intention persistence, then nav anchor sanity.
  await page.locator("#journal").scrollIntoViewIfNeeded();
  const journalText = `Integration QA ${Date.now()}`;
  await page.locator("#journal-input").fill(journalText);
  await page.getByRole("button", { name: "Save Reflection" }).click();
  await page.waitForTimeout(300);
  await page.reload({ waitUntil: "networkidle" });
  await page.locator("#journal").scrollIntoViewIfNeeded();
  const persisted = await page.getByText(journalText).first().isVisible().catch(() => false);
  check("Journal entry persists across reload", persisted);

  for (const href of ["#temple", "#meditate", "#wisdom", "#sanctuary-highlights", "#journal", "#sanctuary"]) {
    const target = href === "#temple" || href === "#meditate" ? null : page.locator(href);
    if (target) check(`Nav anchor ${href} resolves to a real element`, (await target.count()) > 0);
  }

  const finalOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  check("No horizontal overflow after full session", !finalOverflow);
  check("Zero console/page errors across full session", consoleErrors.length === 0 && pageErrors.length === 0, `console=${consoleErrors.length} page=${pageErrors.length}`);

  await page.close();
}

// 2. Reduced motion: same core journey, abbreviated.
{
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(BASE_URL, { waitUntil: "networkidle" });
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(300);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  check("Reduced motion: full scroll, no overflow, no errors", !overflow && errors.length === 0);
  await page.close();
}

await browser.close();
if (anyFailure) {
  console.error("PHASE 8 INTEGRATION QA: FAIL");
  process.exit(1);
} else {
  console.log("PHASE 8 INTEGRATION QA: PASS");
}
