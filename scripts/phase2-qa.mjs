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

// 1. Responsive + console/hydration + scroll-progress check at every breakpoint.
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

  const gatewayHeight = await page.evaluate(() => {
    const el = document.getElementById("temple-gateway");
    return el ? el.getBoundingClientRect().height : 0;
  });

  // Scroll to ~92% through the gateway's own scroll distance (matching
  // ScrollTrigger's own "top top" / "bottom bottom" progress formula:
  // progress = (scrollY - elementTop) / (outerHeight - viewportHeight)) and
  // check the stillness statement + nav opacity have responded.
  const scrollInfo = await page.evaluate(() => {
    const main = document.getElementById("temple-gateway");
    if (!main) return null;
    const gateway = main.firstElementChild;
    if (!gateway) return null;
    const rect = gateway.getBoundingClientRect();
    const elementTop = window.scrollY + rect.top;
    const outerHeight = rect.height;
    const scrollRange = outerHeight - window.innerHeight;
    const target = elementTop + scrollRange * 0.92;
    window.scrollTo(0, Math.max(0, target));
    return { outerHeight };
  });

  // Longer than GSAP's scrub:1 smoothing (1s) so the read reflects the
  // settled state, not a mid-interpolation snapshot.
  await page.waitForTimeout(1300);

  const stillnessOpacity = await page.evaluate(() => {
    const headline = Array.from(document.querySelectorAll("h2")).find((el) =>
      el.textContent?.includes("Nothing to achieve"),
    );
    if (!headline) return null;
    return getComputedStyle(headline.parentElement).opacity;
  });

  const navOpacity = await page.evaluate(() => {
    const nav = document.querySelector("[data-gateway-nav]");
    return nav ? getComputedStyle(nav).opacity : null;
  });

  const failed = hasHorizontalOverflow || consoleErrors.length || pageErrors.length || !scrollInfo;
  if (failed) anyFailure = true;

  console.log(
    `[${bp.name}px] overflow=${hasHorizontalOverflow} gatewayOuterHeight=${scrollInfo?.outerHeight?.toFixed(0)} stillnessOpacity=${stillnessOpacity} navOpacity=${navOpacity} consoleErrors=${consoleErrors.length} pageErrors=${pageErrors.length}`,
  );
  if (consoleErrors.length) console.log("  console errors:", consoleErrors);
  if (pageErrors.length) console.log("  page errors:", pageErrors);

  await page.close();
}

// 2. Keyboard nav still reaches CTAs.
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(BASE_URL, { waitUntil: "networkidle" });

  const focused = [];
  for (let i = 0; i < 12; i++) {
    await page.keyboard.press("Tab");
    const text = await page.evaluate(() => document.activeElement?.textContent?.trim().slice(0, 20));
    focused.push(text);
  }
  console.log("Keyboard tab sequence:", focused.join(" -> "));
  const reachedEnterTemple = focused.includes("Enter Temple");
  const reachedBeginMeditation = focused.includes("Begin Meditation");
  if (!reachedEnterTemple || !reachedBeginMeditation) {
    anyFailure = true;
    console.log(`  FAIL: reachedEnterTemple=${reachedEnterTemple} reachedBeginMeditation=${reachedBeginMeditation}`);
  }
  await page.close();
}

// 3. Reduced motion — static hero renders, no GSAP/ScrollTrigger errors, Temple statement present in normal flow.
{
  const page = await browser.newPage({ viewport: { width: 1024, height: 800 }, reducedMotion: "reduce" });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.stack || String(e)));
  await page.goto(BASE_URL, { waitUntil: "networkidle" });

  const gatewayOuterHeight = await page.evaluate(() => {
    const main = document.getElementById("temple-gateway");
    const gateway = main?.firstElementChild;
    return gateway ? gateway.getBoundingClientRect().height : null;
  });
  const viewportHeight = 800;
  const isNotTall = gatewayOuterHeight !== null && gatewayOuterHeight < viewportHeight * 1.5;

  const statementVisible = await page
    .locator("#temple-mode-statement")
    .isVisible()
    .catch(() => false);

  console.log(
    `Reduced motion: gatewayOuterHeight=${gatewayOuterHeight} isNotTall(no long pin)=${isNotTall} statementInDom=${statementVisible} pageErrors=${errors.length}`,
  );
  if (!isNotTall || !statementVisible || errors.length) {
    anyFailure = true;
    if (errors.length) console.log("  errors:", errors);
  }
  await page.close();
}

// 4. Resize behavior — no GSAP crash when crossing a matchMedia breakpoint.
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.stack || String(e)));
  await page.goto(BASE_URL, { waitUntil: "networkidle" });
  await page.setViewportSize({ width: 500, height: 900 });
  await page.waitForTimeout(300);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.waitForTimeout(300);
  console.log(`Resize across breakpoints: pageErrors=${errors.length}`);
  if (errors.length) {
    anyFailure = true;
    console.log("  errors:", errors);
  }
  await page.close();
}

await browser.close();
process.exit(anyFailure ? 1 : 0);
