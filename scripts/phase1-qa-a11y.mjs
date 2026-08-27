import { chromium } from "playwright";

const PORT = process.env.QA_PORT ?? "4300";
const BASE_URL = `http://localhost:${PORT}/`;

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });

// 1. Keyboard navigation + focus visibility at desktop width.
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(BASE_URL, { waitUntil: "networkidle" });

  const focusedTags = [];
  for (let i = 0; i < 8; i++) {
    await page.keyboard.press("Tab");
    const info = await page.evaluate(() => {
      const el = document.activeElement;
      return el
        ? { tag: el.tagName, text: el.textContent?.trim().slice(0, 24), hasVisibleFocus: getComputedStyle(el).boxShadow !== "none" }
        : null;
    });
    focusedTags.push(info);
  }
  console.log("Keyboard tab sequence (desktop):");
  console.log(focusedTags.map((f) => (f ? `${f.tag}"${f.text}"${f.hasVisibleFocus ? " [focus-ring]" : " [NO RING]"}` : "null")).join(" -> "));
  await page.close();
}

// 2. Reduced motion — mobile menu still opens/closes, no crash, near-instant transition.
{
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    reducedMotion: "reduce",
  });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.stack || String(e)));
  await page.goto(BASE_URL, { waitUntil: "networkidle" });

  await page.getByRole("button", { name: "Open navigation" }).click();
  const dialog = page.getByRole("dialog", { name: "Spirit Guide navigation" });
  const openedFast = await dialog.isVisible({ timeout: 200 }).catch(() => false);

  const links = await page.getByRole("dialog").getByRole("link").allTextContents();

  await page.keyboard.press("Escape");
  await page.waitForTimeout(100);
  const closedFast = await dialog
    .isVisible()
    .then((v) => !v)
    .catch(() => true);

  console.log(
    `Reduced motion: openedFast=${openedFast} links=[${links.join(", ")}] closedFast=${closedFast} pageErrors=${errors.length}`,
  );
  if (errors.length) console.log("  errors:", errors);
  await page.close();
}

await browser.close();
