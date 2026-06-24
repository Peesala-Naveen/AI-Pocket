import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.error('PAGE ERROR:', error.message));
  page.on('requestfailed', request => console.error('REQUEST FAILED:', request.url(), request.failure().errorText));

  try {
    console.log('Navigating to target URL...');
    await page.goto('https://ai-pocket-xi.vercel.app', { waitUntil: 'networkidle2' });

    console.log('Waiting 5 seconds...');
    await new Promise(resolve => setTimeout(resolve, 5000));

    console.log('Taking screenshot...');
    await page.screenshot({ path: path.join(__dirname, 'screenshot.png') });
    console.log('Screenshot saved to screenshot.png');

    console.log('Getting page HTML...');
    const html = await page.content();
    fs.writeFileSync(path.join(__dirname, 'page.html'), html);
    console.log('Page HTML saved to page.html');

  } catch (err) {
    console.error('Debug script failed:', err);
  } finally {
    await browser.close();
  }
})();
