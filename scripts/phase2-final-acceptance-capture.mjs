import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const PORT = process.env.QA_PORT ?? "4300";
const BASE_URL = `http://localhost:${PORT}/`;
const OUT_DIR = process.env.OUT_DIR ?? "/tmp/phase2-final";
mkdirSync(OUT_DIR, { recursive: true });

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });

const STAGES = [
  { key: "a-arrival", progress: 0.0 },
  { key: "b-established", progress: 0.12 },
  { key: "c-ui-receding", progress: 0.3 },
  { key: "d-copy-exit", progress: 0.45 },
  { key: "e-camera-advance", progress: 0.58 },
  { key: "f-pure-sanctuary", progress: 0.7 },
  { key: "g-temple-mode", progress: 0.83 },
  { key: "h-nothing-to-achieve", progress: 0.92 },
  { key: "i-ritual-handoff", progress: 1.0 },
];

const MOBILE_STAGE_KEYS = new Set(["a-arrival", "d-copy-exit", "f-pure-sanctuary", "g-temple-mode", "i-ritual-handoff"]);
const TABLET_STAGE_KEYS = new Set(["a-arrival", "d-copy-exit", "i-ritual-handoff"]);

const scrollToProgress = async (page, progress) => {
  const info = await page.evaluate((p) => {
    const main = document.getElementById("temple-gateway");
    const gateway = main?.firstElementChild;
    if (!gateway) return null;
    const rect = gateway.getBoundingClientRect();
    const elementTop = window.scrollY + rect.top;
    const outerHeight = rect.height;
    const scrollRange = outerHeight - window.innerHeight;
    const target = elementTop + scrollRange * p;
    window.scrollTo(0, Math.max(0, target));
    return { outerHeight, scrollRange, elementTop };
  }, progress);
  await page.waitForTimeout(1300);
  return info;
};

const readDiagnostics = (page) =>
  page.evaluate(() => {
    const readEl = (sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      const s = getComputedStyle(el);
      return {
        opacity: parseFloat(s.opacity),
        transform: s.transform,
        rect: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) },
      };
    };
    const overflow = document.documentElement.scrollWidth > document.documentElement.clientWidth + 1;
    return {
      overflow,
      nav: readEl("[data-gateway-nav]"),
      artwork: readEl("[data-gateway-artwork]"),
      vignette: readEl("[data-gateway-vignette]"),
      illumination: readEl("[data-gateway-illumination]"),
      eyebrow: (() => {
        const el = Array.from(document.querySelectorAll("span")).find((e) => e.textContent?.includes("WELCOME HOME"));
        return el ? { opacity: parseFloat(getComputedStyle(el).opacity) } : null;
      })(),
      headline: (() => {
        const el = document.querySelector("h1");
        return el ? { opacity: parseFloat(getComputedStyle(el).opacity) } : null;
      })(),
      supporting: (() => {
        const el = Array.from(document.querySelectorAll("p")).find((e) => e.textContent?.includes("Ancient wisdom"));
        return el ? { opacity: parseFloat(getComputedStyle(el).opacity) } : null;
      })(),
      spiritualNote: (() => {
        const el = Array.from(document.querySelectorAll("div")).find((e) =>
          e.textContent?.trim() === "May all beings be happy and at peace.",
        );
        if (!el) return null;
        const r = el.getBoundingClientRect();
        const s = getComputedStyle(el);
        return { opacity: parseFloat(s.opacity), display: s.display, rect: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) } };
      })(),
      templeEyebrow: (() => {
        const el = Array.from(document.querySelectorAll("span")).find((e) => e.textContent?.includes("TEMPLE MODE"));
        return el ? { opacity: parseFloat(getComputedStyle(el).opacity) } : null;
      })(),
      stillness: (() => {
        const el = Array.from(document.querySelectorAll("h2")).find((e) => e.textContent?.includes("Nothing to achieve"));
        return el ? { opacity: parseFloat(getComputedStyle(el.parentElement).opacity) } : null;
      })(),
      ritualDock: (() => {
        const el = document.querySelector(".gateway-ritual-shell");
        return el ? { opacity: parseFloat(getComputedStyle(el).opacity) } : null;
      })(),
      primaryCta: (() => {
        const btn = Array.from(document.querySelectorAll("button")).find((b) => b.textContent?.trim() === "Enter Temple" && b.closest("main"));
        return btn ? { opacity: parseFloat(getComputedStyle(btn.parentElement).opacity) } : null;
      })(),
    };
  });

const results = [];

const captureSet = async (label, viewport, stageKeys, reducedMotion = false) => {
  const page = await browser.newPage({ viewport, reducedMotion: reducedMotion ? "reduce" : "no-preference" });
  const consoleErrors = [];
  const pageErrors = [];
  page.on("console", (msg) => { if (msg.type() === "error") consoleErrors.push(msg.text()); });
  page.on("pageerror", (e) => pageErrors.push(String(e)));
  await page.goto(BASE_URL, { waitUntil: "networkidle" });

  for (const stage of STAGES) {
    if (!stageKeys.has(stage.key)) continue;
    if (!reducedMotion) {
      await scrollToProgress(page, stage.progress);
    } else {
      const target = stage.progress * 2000;
      await page.evaluate((t) => window.scrollTo(0, t), target);
      await page.waitForTimeout(400);
    }
    const diag = await readDiagnostics(page);
    const filename = `${label}__${stage.key}.png`;
    await page.screenshot({ path: `${OUT_DIR}/${filename}` });
    results.push({ label, stage: stage.key, progress: stage.progress, viewport, reducedMotion, diag, file: filename });
    console.log(`captured ${filename}`);
  }

  console.log(`[${label}] consoleErrors=${consoleErrors.length} pageErrors=${pageErrors.length}`);
  if (consoleErrors.length) console.log("  console:", consoleErrors);
  if (pageErrors.length) console.log("  page:", pageErrors);

  await page.close();
};

await captureSet("desktop-1440", { width: 1440, height: 900 }, new Set(STAGES.map((s) => s.key)));
await captureSet("mobile-390", { width: 390, height: 844 }, MOBILE_STAGE_KEYS);
await captureSet("mobile-430", { width: 430, height: 932 }, MOBILE_STAGE_KEYS);
await captureSet("tablet-768", { width: 768, height: 1024 }, TABLET_STAGE_KEYS);
await captureSet("laptop-1024", { width: 1024, height: 768 }, TABLET_STAGE_KEYS);
await captureSet("desktop-1280", { width: 1280, height: 800 }, new Set(["a-arrival"]));
await captureSet("desktop-1728", { width: 1728, height: 1000 }, new Set(["a-arrival"]));
await captureSet("reduced-desktop-1440", { width: 1440, height: 900 }, new Set(["a-arrival", "i-ritual-handoff"]), true);
await captureSet("reduced-mobile-390", { width: 390, height: 844 }, new Set(["a-arrival", "i-ritual-handoff"]), true);

await browser.close();

import { writeFileSync } from "node:fs";
writeFileSync(`${OUT_DIR}/diagnostics.json`, JSON.stringify(results, null, 2));
console.log(`\nWrote ${results.length} captures + diagnostics.json to ${OUT_DIR}`);
