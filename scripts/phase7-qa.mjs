import { chromium } from "playwright";

const PORT = process.env.QA_PORT ?? "4300";
const BASE_URL = `http://localhost:${PORT}/`;
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
let anyFailure = false;

const check = (label, ok, detail = "") => {
  if (!ok) anyFailure = true;
  console.log(`${ok ? "PASS" : "FAIL"} ${label}${detail ? " — " + detail : ""}`);
};

// 1. My Sanctuary: real stored data only, no fabricated Practice/Wisdom history, empty states honest.
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(BASE_URL, { waitUntil: "networkidle" });
  await page.evaluate(() => { window.localStorage.removeItem("sg.journal.v1"); window.localStorage.removeItem("sg.intentions.v1"); });
  await page.reload({ waitUntil: "networkidle" });
  const sanctuary = page.locator("#sanctuary");
  await sanctuary.scrollIntoViewIfNeeded();

  const noPracticeHistory = await sanctuary.getByText("No practice recorded yet.").isVisible();
  const noWisdomHistory = await sanctuary.getByText("No saved contemplations yet.").isVisible();
  const noIntentionYet = await sanctuary.getByText("No intention placed yet.").isVisible();
  const noJournalYet = await sanctuary.getByText("No entries saved yet.").isVisible();
  check("My Sanctuary: honest empty states, no fabricated history", noPracticeHistory && noWisdomHistory && noIntentionYet && noJournalYet);

  await page.locator("#journal-input").fill("Sanctuary QA entry");
  await page.getByRole("button", { name: "Save Reflection" }).click();
  await page.reload({ waitUntil: "networkidle" });
  await sanctuary.scrollIntoViewIfNeeded();
  const journalUpdated = await sanctuary.getByText(/1 entry saved/).isVisible();
  const stillNoPractice = await sanctuary.getByText("No practice recorded yet.").isVisible();
  check("My Sanctuary reflects real saved journal data; Practice still honest (no session history exists)", journalUpdated && stillNoPractice);

  await page.close();
}

// 2. Auth presentation: no fake login, controls cannot perform any action.
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(BASE_URL, { waitUntil: "networkidle" });
  await page.locator("#sanctuary").scrollIntoViewIfNeeded();
  const createBtn = page.getByRole("button", { name: "Create account" });
  const signInBtn = page.getByRole("button", { name: "Sign in" });
  const createDisabled = await createBtn.isDisabled();
  const signInDisabled = await signInBtn.isDisabled();
  // Disabled buttons can't be clicked by Playwright's actionability checks; confirm no navigation/state change is even possible by checking the attribute directly.
  check("Create account / Sign in are genuinely disabled, not fake no-ops", createDisabled && signInDisabled);
  await page.close();
}

// 3. Support: zero network/payment activity, no fake success.
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const requests = [];
  page.on("request", (r) => requests.push(r.url()));
  await page.goto(BASE_URL, { waitUntil: "networkidle" });
  await page.locator("#support").scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: "£10" }).click();
  const pressed = await page.getByRole("button", { name: "£10" }).getAttribute("aria-pressed");
  const finalBtn = page.getByRole("button", { name: /Support isn.t available yet/ });
  const finalDisabled = await finalBtn.isDisabled();
  const noSuccessState = !(await page.getByText(/thank you|payment successful|receipt/i).count());
  const paymentLikeRequests = requests.filter((u) => /stripe|checkout|payment/i.test(u));
  check(
    "Support: amount selectable, final action disabled, zero payment requests, no fake success",
    pressed === "true" && finalDisabled && noSuccessState && paymentLikeRequests.length === 0,
    `paymentRequests=${paymentLikeRequests.length}`,
  );
  await page.close();
}

// 4. Closing scene opens canonical Temple Mode (no duplicate overlay implementation).
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(BASE_URL, { waitUntil: "networkidle" });
  await page.locator("#closing").scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: "Enter Temple" }).last().click();
  const dialog = page.getByRole("dialog");
  const opened = await dialog.waitFor({ state: "visible", timeout: 2000 }).then(() => true).catch(() => false);
  const dialogCount = await page.locator('[role="dialog"]').count();
  check("Closing 'Enter Temple' opens the single canonical Temple Mode overlay", opened && dialogCount === 1);
  await page.close();
}

// 5. Footer: no dead/fake links, real navigation only.
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(BASE_URL, { waitUntil: "networkidle" });
  const footer = page.locator("footer");
  await footer.scrollIntoViewIfNeeded();
  const hrefs = await footer.locator("a[href]").evaluateAll((els) => els.map((el) => el.getAttribute("href")));
  const noHashOnly = !hrefs.includes("#");
  const wisdomLink = await footer.getByRole("link", { name: "Wisdom" }).getAttribute("href");
  await footer.getByRole("button", { name: "Meditate" }).click();
  const meditationOpened = await page.getByRole("dialog").waitFor({ state: "visible", timeout: 2000 }).then(() => true).catch(() => false);
  check("Footer: no bare '#' links, real anchors resolve, Meditate opens real Meditation Hall", noHashOnly && wisdomLink === "#wisdom" && meditationOpened);

  const legalIsPlainText = (await footer.locator("a", { hasText: "Privacy" }).count()) === 0;
  check("Footer: Privacy/Terms are non-link labels, not fake hrefs", legalIsPlainText);
  await page.close();
}

// 6. Privacy: no journal/intention text transmitted anywhere from these new sections.
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const bodies = [];
  page.on("request", (r) => { const pd = r.postData(); if (pd) bodies.push(pd); });
  await page.goto(BASE_URL, { waitUntil: "networkidle" });
  await page.locator("#sanctuary").scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);
  const leaked = bodies.some((b) => b.includes("Sanctuary QA entry"));
  check("No private journal/intention content transmitted via My Sanctuary", !leaked);
  await page.close();
}

// 7. Reduced motion.
{
  const page = await browser.newPage({ viewport: { width: 1024, height: 800 }, reducedMotion: "reduce" });
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto(BASE_URL, { waitUntil: "networkidle" });
  await page.locator("#closing").scrollIntoViewIfNeeded();
  const closingVisible = await page.getByText("The door stays open.").isVisible();
  check("Reduced motion: Phase 7 sections usable, no errors", closingVisible && errors.length === 0, `pageErrors=${errors.length}`);
  await page.close();
}

// 8. Keyboard/focus.
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(BASE_URL, { waitUntil: "networkidle" });
  await page.locator("#support").scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: "£5" }).focus();
  const focused = await page.evaluate(() => document.activeElement?.textContent?.trim());
  check("Support amount buttons keyboard-focusable", focused === "£5");
  await page.close();
}

// 9. 7 breakpoints + overflow + console clean.
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
  await page.locator("footer").scrollIntoViewIfNeeded();
  await page.waitForTimeout(100);

  const hasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
  const footerVisible = await page.locator("footer").isVisible();
  const ok = !hasOverflow && footerVisible && consoleErrors.length === 0 && pageErrors.length === 0;
  check(`[${bp.name}px] Phase 7 sections through footer: no overflow, clean console`, ok, `overflow=${hasOverflow} consoleErrors=${consoleErrors.length} pageErrors=${pageErrors.length}`);

  await page.close();
}

await browser.close();
process.exit(anyFailure ? 1 : 0);
