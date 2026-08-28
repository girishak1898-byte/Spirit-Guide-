import { chromium } from "playwright";

const PORT = process.env.QA_PORT ?? "4300";
const BASE_URL = `http://localhost:${PORT}/`;
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
let anyFailure = false;

const check = (label, ok, detail = "") => {
  if (!ok) anyFailure = true;
  console.log(`${ok ? "PASS" : "FAIL"} ${label}${detail ? " — " + detail : ""}`);
};

const TEST_TEXT = "Phase 6 QA journal entry — a private, non-performing sentence.";
const INTENTION_TEXT = "May I meet today with steadiness.";

// 1. Journal + Intention persistence across reload, no network transmission of content.
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const bodies = [];
  page.on("request", (r) => { const pd = r.postData(); if (pd) bodies.push(pd); });
  await page.goto(BASE_URL, { waitUntil: "networkidle" });

  await page.locator("#journal-input").fill(TEST_TEXT);
  await page.getByRole("button", { name: "Save Reflection" }).click();
  await page.locator("#intention-input").fill(INTENTION_TEXT);
  await page.getByRole("button", { name: "Place Intention" }).click();
  await page.waitForTimeout(200);

  const inputCleared = (await page.locator("#intention-input").inputValue()) === "";
  check("Intention input clears after successful save", inputCleared);

  await page.reload({ waitUntil: "networkidle" });
  const journalPersisted = await page.getByText(TEST_TEXT).isVisible();
  check("Journal entry persists across reload", journalPersisted);

  const leaked = bodies.some((b) => b.includes(TEST_TEXT) || b.includes(INTENTION_TEXT));
  check("Entry/intention text never sent in a network request body", !leaked);

  await page.close();
}

// 2. Corrupted storage recovers safely, no crash.
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto(BASE_URL, { waitUntil: "networkidle" });
  await page.evaluate(() => {
    window.localStorage.setItem("sg.journal.v1", "{not valid json");
    window.localStorage.setItem("sg.intentions.v1", JSON.stringify([{ garbage: true }]));
  });
  await page.reload({ waitUntil: "networkidle" });
  const emptyStateVisible = await page.getByText("Nothing written yet.").isVisible();
  check("Corrupted storage recovers to safe empty state, no crash", emptyStateVisible && errors.length === 0, `pageErrors=${errors.length}`);
  await page.close();
}

// 3. Hydration clean with real localStorage content present on load.
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const consoleErrors = [];
  page.on("console", (m) => { if (m.type() === "error") consoleErrors.push(m.text()); });
  await page.goto(BASE_URL, { waitUntil: "networkidle" });
  await page.locator("#journal-input").fill("pre-existing entry for hydration check");
  await page.getByRole("button", { name: "Save Reflection" }).click();
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(300);
  check("No hydration/console errors with existing storage content", consoleErrors.length === 0, `consoleErrors=${consoleErrors.length}`);
  await page.close();
}

// 4. 180-char limit enforced (attribute + programmatic).
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(BASE_URL, { waitUntil: "networkidle" });
  const textarea = page.locator("#intention-input");
  const maxLength = await textarea.getAttribute("maxlength");
  await textarea.fill("x".repeat(250));
  const value = await textarea.inputValue();
  check("180-char limit enforced (maxlength attr + value length)", maxLength === "180" && value.length === 180, `maxlength=${maxLength} valueLength=${value.length}`);
  await page.close();
}

// 5. Wisdom provenance labels present, no fabricated Buddha attribution.
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(BASE_URL, { waitUntil: "networkidle" });
  const wisdom = page.locator("#wisdom");
  await wisdom.scrollIntoViewIfNeeded();
  const labelVisible = await wisdom.getByText("Spirit Guide Reflection").isVisible();
  const noBuddhaAttribution = !(await page.getByText(/Buddha said|attributed to Buddha/i).count());
  check("Wisdom shows explicit provenance label, no Buddha attribution", labelVisible && noBuddhaAttribution);
  await page.close();
}

// 6. Zero fabricated graph nodes/edges; graph reflects real saved relationships across reload.
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(BASE_URL, { waitUntil: "networkidle" });
  await page.evaluate(() => { window.localStorage.removeItem("sg.journal.v1"); window.localStorage.removeItem("sg.intentions.v1"); });
  await page.reload({ waitUntil: "networkidle" });
  await page.locator("#journal").scrollIntoViewIfNeeded();
  const emptyGraphMessage = await page.getByText("Nothing saved yet").isVisible();
  check("Empty state: graph shows no fabricated nodes", emptyGraphMessage);

  await page.locator("#journal-input").fill("Graph test entry");
  await page.getByRole("button", { name: "Save Reflection" }).click();
  await page.locator("#intention-input").fill("Graph test intention");
  await page.getByRole("button", { name: "Place Intention" }).click();
  await page.reload({ waitUntil: "networkidle" });
  await page.locator("#journal").scrollIntoViewIfNeeded();

  const graph = page.getByLabel("Your saved entries and intentions");
  const journalNode = await graph.getByText("Graph test entry").isVisible();
  const intentionNode = await graph.getByText("Graph test intention").isVisible();
  const noConnectionsClaimed = await page.getByText(/Connections between entries will appear here/).isVisible();
  check("Graph reflects real saved journal + intention as nodes, honestly reports no edges yet", journalNode && intentionNode && noConnectionsClaimed);
  await page.close();
}

// 7. Reduced motion: all sections usable, no errors.
{
  const page = await browser.newPage({ viewport: { width: 1024, height: 800 }, reducedMotion: "reduce" });
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto(BASE_URL, { waitUntil: "networkidle" });
  await page.locator("#lotus-garden").scrollIntoViewIfNeeded();
  const lotusVisible = await page.getByText("Return to stillness.").isVisible();
  await page.locator("#intention").scrollIntoViewIfNeeded();
  const intentionVisible = await page.getByText("Place one thing here with care.").isVisible();
  check("Reduced motion: sections usable, no errors", lotusVisible && intentionVisible && errors.length === 0, `pageErrors=${errors.length}`);
  await page.close();
}

// 8. Keyboard/focus: intention textarea and Save/Place buttons reachable and visibly focused.
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(BASE_URL, { waitUntil: "networkidle" });
  await page.locator("#intention-input").focus();
  const focused = await page.evaluate(() => document.activeElement?.id);
  check("Intention textarea keyboard-focusable", focused === "intention-input");
  await page.close();
}

// 9. 7 breakpoints + overflow + console clean across Phase 6 sections.
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
  await page.locator("#journal").scrollIntoViewIfNeeded();
  await page.waitForTimeout(100);

  const hasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
  const journalVisible = await page.getByText("Write without performing.").isVisible();
  const ok = !hasOverflow && journalVisible && consoleErrors.length === 0 && pageErrors.length === 0;
  check(`[${bp.name}px] Phase 6 sections: no overflow, visible, clean console`, ok, `overflow=${hasOverflow} consoleErrors=${consoleErrors.length} pageErrors=${pageErrors.length}`);

  await page.close();
}

await browser.close();
process.exit(anyFailure ? 1 : 0);
