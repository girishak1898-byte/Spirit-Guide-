import { chromium } from "playwright";

// v1.1 — session history + real My Sanctuary. Focused checks only; full
// phase2-7 coverage is unaffected by this change and re-run separately.
const PORT = process.env.QA_PORT ?? "4300";
const BASE_URL = `http://localhost:${PORT}/`;
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
let anyFailure = false;

const check = (label, ok, detail = "") => {
  if (!ok) anyFailure = true;
  console.log(`${ok ? "PASS" : "FAIL"} ${label}${detail ? " — " + detail : ""}`);
};

const readHistory = (page) => page.evaluate(() => JSON.parse(window.localStorage.getItem("sg.sessions.v1") || "null"));

// Jump the clock past the full duration and let the real 1s tick observe it
// — same technique phase5-qa.mjs already uses for natural completion.
const fastForwardPastDuration = (page, minutes) =>
  page.evaluate((ms) => {
    const realNow = Date.now;
    Date.now = () => realNow() + ms;
  }, minutes * 60_000 + 1000);

// 1. Generic entry -> complete a short session -> exactly one record, network/console clean.
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const requests = [];
  const consoleErrors = [];
  page.on("request", (r) => requests.push(r.url() + (r.postData() || "")));
  page.on("console", (m) => { if (m.type() === "error") consoleErrors.push(m.text()); });
  await page.goto(BASE_URL, { waitUntil: "networkidle" });
  await page.evaluate(() => window.localStorage.removeItem("sg.sessions.v1"));

  await page.getByRole("button", { name: "Begin Meditation" }).first().click();
  const dialog = page.getByRole("dialog");
  await dialog.waitFor({ state: "visible", timeout: 2000 });
  await dialog.getByRole("button", { name: "3 min" }).click();
  await dialog.getByRole("button", { name: "Begin Meditation" }).click();
  await fastForwardPastDuration(page, 3);
  await page.waitForTimeout(1300);
  await dialog.getByRole("heading", { name: "Meditation complete." }).waitFor({ state: "visible", timeout: 2000 });

  const history = await readHistory(page);
  check("Generic entry: completed session recorded exactly once", history?.totalCompleted === 1 && history?.records.length === 1, JSON.stringify(history));
  check("Recorded duration matches the selected 3 min", history?.records[0]?.durationMinutes === 3);

  const leaked = requests.some((r) => /sessions|durationMinutes|completedAt/i.test(r));
  check("No session data appears in any network request", !leaked);
  check("Zero console errors during session completion", consoleErrors.length === 0, `${consoleErrors.length} errors`);
  await page.close();
}

// 2. Guide Me handoff -> completed session -> exactly one record (independent of entry path).
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(BASE_URL, { waitUntil: "networkidle" });
  await page.evaluate(() => window.localStorage.removeItem("sg.sessions.v1"));

  await page.locator("#guide-me").scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: "Restless" }).click();
  await page.getByRole("button", { name: "Begin Practice" }).click();
  const dialog = page.getByRole("dialog");
  await dialog.waitFor({ state: "visible", timeout: 2000 });
  await dialog.getByRole("button", { name: "Begin Meditation" }).click();
  await fastForwardPastDuration(page, 7); // Guide Me's recommended duration for Restless.
  await page.waitForTimeout(1300);
  await dialog.getByRole("heading", { name: "Meditation complete." }).waitFor({ state: "visible", timeout: 2000 });

  const history = await readHistory(page);
  check("Guide Me handoff: completed session recorded exactly once", history?.totalCompleted === 1 && history?.records.length === 1, JSON.stringify(history));
  await page.close();
}

// 3. Incomplete session (close mid-session) creates no history.
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(BASE_URL, { waitUntil: "networkidle" });
  await page.evaluate(() => window.localStorage.removeItem("sg.sessions.v1"));

  await page.getByRole("button", { name: "Begin Meditation" }).first().click();
  const dialog = page.getByRole("dialog");
  await dialog.waitFor({ state: "visible", timeout: 2000 });
  await dialog.getByRole("button", { name: "3 min" }).click();
  await dialog.getByRole("button", { name: "Begin Meditation" }).click();
  await page.waitForTimeout(500);
  await page.keyboard.press("Escape");
  await dialog.waitFor({ state: "hidden", timeout: 2000 });

  const history = await readHistory(page);
  check("Closing mid-session records nothing", history === null || history.totalCompleted === 0, JSON.stringify(history));
  await page.close();
}

// 4. Repeated open/close/rerender around a completed session does not duplicate.
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(BASE_URL, { waitUntil: "networkidle" });
  await page.evaluate(() => window.localStorage.removeItem("sg.sessions.v1"));

  await page.getByRole("button", { name: "Begin Meditation" }).first().click();
  let dialog = page.getByRole("dialog");
  await dialog.waitFor({ state: "visible", timeout: 2000 });
  await dialog.getByRole("button", { name: "3 min" }).click();
  await dialog.getByRole("button", { name: "Begin Meditation" }).click();
  await fastForwardPastDuration(page, 3);
  await page.waitForTimeout(1300);
  await dialog.getByRole("heading", { name: "Meditation complete." }).waitFor({ state: "visible", timeout: 2000 });

  // Reopen/close a few times after the fact — the finished session must not re-record.
  await page.keyboard.press("Escape");
  await dialog.waitFor({ state: "hidden", timeout: 2000 });
  await page.getByRole("button", { name: "Begin Meditation" }).first().click();
  dialog = page.getByRole("dialog");
  await dialog.waitFor({ state: "visible", timeout: 2000 });
  await page.keyboard.press("Escape");
  await dialog.waitFor({ state: "hidden", timeout: 2000 });

  const history = await readHistory(page);
  check("Repeated open/close after completion does not duplicate the record", history?.totalCompleted === 1, JSON.stringify(history));
  await page.close();
}

// 5. Reload persistence + My Sanctuary reflects real activity.
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(BASE_URL, { waitUntil: "networkidle" });
  await page.evaluate(() => window.localStorage.removeItem("sg.sessions.v1"));

  await page.getByRole("button", { name: "Begin Meditation" }).first().click();
  const dialog = page.getByRole("dialog");
  await dialog.waitFor({ state: "visible", timeout: 2000 });
  await dialog.getByRole("button", { name: "3 min" }).click();
  await dialog.getByRole("button", { name: "Begin Meditation" }).click();
  await fastForwardPastDuration(page, 3);
  await page.waitForTimeout(1300);
  await dialog.getByRole("heading", { name: "Meditation complete." }).waitFor({ state: "visible", timeout: 2000 });
  await page.keyboard.press("Escape");
  await dialog.waitFor({ state: "hidden", timeout: 2000 });

  // Same page load, no reload — My Sanctuary was already mounted before the
  // session completed; it must pick up the new data live, not just next visit.
  await page.locator("#sanctuary").scrollIntoViewIfNeeded();
  const sameLoadBody = await page.locator("#sanctuary").getByText(/1 session completed/).isVisible();
  check("My Sanctuary updates within the same page load, no reload required", sameLoadBody);

  await page.reload({ waitUntil: "networkidle" });
  const historyAfterReload = await readHistory(page);
  check("Session history persists across reload", historyAfterReload?.totalCompleted === 1);

  await page.locator("#sanctuary").scrollIntoViewIfNeeded();
  const practiceBody = await page.locator("#sanctuary").getByText(/sessions? completed/).isVisible();
  check("My Sanctuary displays real practice activity", practiceBody);
  const noOverflow = !(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth));
  check("No overflow in My Sanctuary with real data", noOverflow);
  await page.close();
}

// 6. Cap + honest total count beyond the cap (seeded directly — no need for 60 real sessions).
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(BASE_URL, { waitUntil: "networkidle" });
  await page.evaluate(() => {
    const records = Array.from({ length: 55 }, (_, i) => ({
      id: `seed-${i}`,
      durationMinutes: 3,
      completedAt: new Date(Date.now() - i * 60_000).toISOString(),
    }));
    window.localStorage.setItem("sg.sessions.v1", JSON.stringify({ totalCompleted: 55, records }));
  });
  await page.reload({ waitUntil: "networkidle" });
  const seeded = await readHistory(page);
  check("Records capped at 50 on read", seeded?.records.length === 50, `records=${seeded?.records.length}`);
  check("totalCompleted stays accurate beyond the cap", seeded?.totalCompleted === 55);

  await page.locator("#sanctuary").scrollIntoViewIfNeeded();
  const body = await page.locator("#sanctuary").getByText(/sessions? completed/).textContent();
  check("My Sanctuary count uses totalCompleted, not records.length", body?.includes("55 sessions"), body ?? "");
  await page.close();
}

// 7. Corrupted storage recovers safely — My Sanctuary and Meditation Hall both stay usable.
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const pageErrors = [];
  page.on("pageerror", (e) => pageErrors.push(e.message));
  await page.goto(BASE_URL, { waitUntil: "networkidle" });
  await page.evaluate(() => window.localStorage.setItem("sg.sessions.v1", "{not valid json"));
  await page.reload({ waitUntil: "networkidle" });

  await page.locator("#sanctuary").scrollIntoViewIfNeeded();
  const emptyState = await page.locator("#sanctuary").getByText("No practice recorded yet.").isVisible();
  check("Corrupted session storage recovers to honest empty state", emptyState);

  await page.getByRole("button", { name: "Begin Meditation" }).first().click();
  const dialog = page.getByRole("dialog");
  await dialog.waitFor({ state: "visible", timeout: 2000 });
  check("Meditation Hall still opens normally with corrupted session storage", await dialog.isVisible());
  check("No page errors from corrupted session storage", pageErrors.length === 0, `${pageErrors.length} errors`);
  await page.close();
}

// 8. Reduced motion unaffected.
{
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
  const pageErrors = [];
  page.on("pageerror", (e) => pageErrors.push(e.message));
  await page.goto(BASE_URL, { waitUntil: "networkidle" });
  await page.evaluate(() => window.localStorage.removeItem("sg.sessions.v1"));
  await page.locator("#sanctuary").scrollIntoViewIfNeeded();
  const visible = await page.locator("#sanctuary").getByText("No practice recorded yet.").isVisible();
  check("Reduced motion: My Sanctuary renders correctly, no errors", visible && pageErrors.length === 0);
  await page.close();
}

await browser.close();
if (anyFailure) {
  console.error("V1.1 QA: FAIL");
  process.exit(1);
} else {
  console.log("V1.1 QA: PASS");
}
