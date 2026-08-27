import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const PORT = process.env.QA_PORT ?? "4300";
const BASE_URL = `http://localhost:${PORT}/`;
const OUT_DIR = process.env.OUT_DIR ?? "/tmp/phase2-screens";
mkdirSync(OUT_DIR, { recursive: true });

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

async function scrollToProgress(page, progress) {
  await page.evaluate((p) => {
    const main = document.getElementById("temple-gateway");
    const gateway = main.firstElementChild;
    const rect = gateway.getBoundingClientRect();
    const elementTop = window.scrollY + rect.top;
    const scrollRange = rect.height - window.innerHeight;
    window.scrollTo(0, Math.max(0, elementTop + scrollRange * p));
  }, progress);
  await page.waitForTimeout(1300);
}

for (const bp of breakpoints) {
  const page = await browser.newPage({ viewport: { width: bp.width, height: bp.height } });
  await page.goto(BASE_URL, { waitUntil: "networkidle" });
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${OUT_DIR}/${bp.name}-rest.png` });

  await scrollToProgress(page, 0.7);
  await page.screenshot({ path: `${OUT_DIR}/${bp.name}-pure-sanctuary.png` });

  await scrollToProgress(page, 1.0);
  await page.screenshot({ path: `${OUT_DIR}/${bp.name}-handoff.png` });

  await page.close();
  console.log(`captured ${bp.name}`);
}

await browser.close();
