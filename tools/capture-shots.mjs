// Captures the real a11y-loop demo page in each rendering pass the audit runs, for the film's browser shots.
// Run: A11Y_LOOP_DIR=../a11y-loop node tools/capture-shots.mjs
// Uses the Playwright bundled with an a11y-loop checkout (default: a sibling folder named a11y-loop).
import { createRequire } from 'node:module';
import path from 'node:path';
import { pathToFileURL, fileURLToPath } from "node:url";
const repo = path.resolve(process.env.A11Y_LOOP_DIR || fileURLToPath(new URL('../../a11y-loop', import.meta.url)));
const require = createRequire(path.join(repo, 'package.json'));
const { chromium } = require('playwright');
const demo = (v) => pathToFileURL(path.join(repo, 'demo', v, 'index.html')).href;
const out = new URL('../assets/shots/', import.meta.url);
const shots = [
  ['before-default', 'before', {}],
  ['before-dark', 'before', { colorScheme: 'dark' }],
  ['before-forced', 'before', { forcedColors: 'active' }],
  ['before-motion', 'before', { reducedMotion: 'reduce' }],
  ['before-reflow', 'before', { viewport: { width: 320, height: 1140 } }],
  ['before-modal', 'before', {}, async (p) => { await p.evaluate(() => window.openRegister && window.openRegister()); }],
  ['after-default', 'after', {}],
  ['before-full', 'before', {}, null, true],
  ['after-dark', 'after', { colorScheme: 'dark' }],
];
const browser = await chromium.launch();
for (const [name, v, opts, act, full] of shots) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 1140 }, deviceScaleFactor: 1.5, ...opts });
  const page = await ctx.newPage();
  await page.goto(demo(v));
  await page.waitForTimeout(400);
  if (act) { await act(page); await page.waitForTimeout(400); }
  await page.screenshot({ path: fileURLToPath(new URL(`${name}.png`, out)), animations: 'disabled', fullPage: !!full });
  await ctx.close();
  console.log('shot', name);
}
await browser.close();
