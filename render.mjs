// Draws poster.html into entry.png (1024 x 1024) with a headless Chromium-family browser.
// Run on a desktop machine: node render.mjs   (set BROWSER=/path/to/chrome to pick one)
import { execFileSync } from 'node:child_process';
import { existsSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const candidates = [
  process.env.BROWSER,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].filter(Boolean);
const browser = candidates.find((p) => existsSync(p));
if (!browser) throw new Error('no Chrome, Brave or Chromium found: set BROWSER');

const out = join(here, 'entry.png');
execFileSync(browser, [
  '--headless=new',
  '--disable-gpu',
  '--hide-scrollbars',
  '--force-device-scale-factor=1',
  '--window-size=1024,1024',
  '--virtual-time-budget=3000',
  `--screenshot=${out}`,
  pathToFileURL(join(here, 'poster.html')).href,
], { stdio: 'inherit' });

const bytes = statSync(out).size;
console.log(`entry.png: ${bytes} bytes${bytes > 1048576 ? ' (over the 1 MiB cap!)' : ''}`);
