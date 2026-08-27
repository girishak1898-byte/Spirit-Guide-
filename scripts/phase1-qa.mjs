import { chromium } from "playwright";

const PORT = process.env.QA_PORT ?? "4300";
const BASE_URL = `http://localhost:${PORT}/`;

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const breakpoints = [
  { name: "390", width: 390, height: 844 },
  { name: "430", width: 430, height: 932 },
  { name: "768", width: 768, height: 1024 },
  { name: "1024", width: 1024, height: 768 },
  { name: "1280", width: 1280, height: 800 },
  { name: "1440", width: 1440, height: 900 },
  { name: "1728", width: 1728, height: 1000 },
];

let anyFailure = false;

for (const bp of breakpoints) {
  const page = await browser.newPage({ viewport: { width: bp.width, height: bp.height } });
  const consoleErrors = [];
  const pageErrors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });
  page.on("pageerror", (err) => pageErrors.push(String(err)));

  await page.goto(BASE_URL, { waitUntil: "networkidle" });

  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
  );

  const navVisible = await page.locator("header").isVisible();

  let mobileMenuOk = true;
  if (bp.width < 1024) {
    const trigger = page.getByRole("button", { name: "Open navigation" });
    await trigger.click();
    await page.waitForTimeout(500);
    const dialogVisible = await page.getByRole("dialog", { name: "Spirit Guide navigation" }).isVisible();
    mobileMenuOk = dialogVisible;
    if (dialogVisible) {
      await page.keyboard.press("Escape");
      await page.waitForTimeout(500);
      const stillVisible = await page
        .getByRole("dialog", { name: "Spirit Guide navigation" })
        .isVisible()
        .catch(() => false);
      mobileMenuOk = mobileMenuOk && !stillVisible;
    }
  }

  const failed = hasHorizontalOverflow || !navVisible || !mobileMenuOk || consoleErrors.length || pageErrors.length;
  if (failed) anyFailure = true;

  console.log(
    `[${bp.name}px] overflow=${hasHorizontalOverflow} navVisible=${navVisible} mobileMenuOk=${mobileMenuOk} consoleErrors=${consoleErrors.length} pageErrors=${pageErrors.length}`,
  );
  if (consoleErrors.length) console.log("  console errors:", consoleErrors);
  if (pageErrors.length) console.log("  page errors:", pageErrors);

  await page.close();
}

await browser.close();
process.exit(anyFailure ? 1 : 0);
