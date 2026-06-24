import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();

  // Helper to log with timestamp
  const log = (msg) => console.log(`[${new Date().toISOString()}] ${msg}`);

  // Forward page console logs to the test runner process
  page.on('console', msg => {
    log(`[Page Console] ${msg.type().toUpperCase()}: ${msg.text()}`);
  });

  try {
    log('Navigating to target local URL: http://localhost:5173');
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle2' });
    
    // Set viewport to avoid cut-off elements
    await page.setViewport({ width: 1280, height: 800 });

    // ── Check Custom Cursor ──
    log('Checking for custom interactive cursor components...');
    await page.waitForSelector('.custom-cursor-container', { timeout: 5000 });
    await page.waitForSelector('.cursor-inner-dot', { timeout: 5000 });
    await page.waitForSelector('.cursor-outer-ring', { timeout: 5000 });
    log('Verified: Interactive custom cursor elements are active.');

    // ── Check AI Agent presence ──
    log('Checking for holographic AI Agent presence...');
    await page.waitForSelector('.ai-agent-core-container', { timeout: 5000 });
    await page.waitForSelector('.ai-avatar-wrapper', { timeout: 5000 });
    const agentMsg = await page.$eval('.ai-agent-text', el => el.textContent.trim());
    log(`AI Agent Message: "${agentMsg}"`);
    log('Verified: AI Agent is active and online.');

    // ── Check Initial Vault State (Closed) ──
    log('Checking for closed AI Vault 3D Cube...');
    await page.waitForSelector('.cube.closed', { timeout: 5000 });
    const headline = await page.$eval('.vault-headline', el => el.textContent.trim());
    log(`Vault Headline: "${headline}"`);
    if (headline !== 'VAULT SECURED') {
      throw new Error(`Expected vault headline to be "VAULT SECURED" when closed, but got "${headline}"`);
    }

    // Check that cards are NOT visible initially
    const cardsVisible = await page.evaluate(() => !!document.querySelector('.model-grid'));
    log(`Is Model Grid visible initially? ${cardsVisible}`);
    if (cardsVisible) {
      throw new Error('Expected Model Grid to be collapsed/hidden in closed state!');
    }
    log('Verified: Vault is closed and secure initially.');

    // ── Simulate Mouse Tracing ──
    log('Simulating mouse movements to trigger cursor tracking and reflection shifts...');
    await page.mouse.move(100, 100);
    await new Promise(r => setTimeout(r, 200));
    await page.mouse.move(500, 400);
    await new Promise(r => setTimeout(r, 200));
    await page.mouse.move(800, 600);

    const mouseX = await page.evaluate(() => document.documentElement.style.getPropertyValue('--mouse-x'));
    const mouseY = await page.evaluate(() => document.documentElement.style.getPropertyValue('--mouse-y'));
    log(`Global CSS Variables set: --mouse-x="${mouseX}", --mouse-y="${mouseY}"`);
    if (!mouseX || !mouseY) {
      throw new Error('Global CSS variables --mouse-x or --mouse-y were not set correctly on mousemove!');
    }
    log('Verified: Cursor position tracking and CSS binding is active.');

    // ── Click Vault to Open ──
    log('Clicking the AI Vault 3D Cube to decrypt and unpack model assets...');
    await page.click('.cube-wrapper');

    log('Waiting for vault to enter opening state (scanner laser)...');
    await page.waitForSelector('.cube.opening', { timeout: 2000 });
    log('Opening scan detected.');

    log('Waiting for vault to open and models to be released...');
    await page.waitForSelector('.cube.open', { timeout: 5000 });
    log('Vault state: OPEN.');

    // ── Verify released cards ──
    log('Waiting for model grid to mount and cards to settle...');
    await page.waitForSelector('.model-grid', { timeout: 5000 });
    await page.waitForSelector('.model-card', { timeout: 5000 });

    const openHeadline = await page.$eval('.vault-headline', el => el.textContent.trim());
    log(`Vault Headline after open: "${openHeadline}"`);
    if (openHeadline !== 'GRID DEPLOYED') {
      throw new Error(`Expected vault headline to be "GRID DEPLOYED" when open, but got "${openHeadline}"`);
    }

    const loadedModels = await page.$$eval('.model-card .model-name', elements => 
      elements.map(el => el.textContent.trim())
    );
    log(`Released models found in anti-gravity: ${loadedModels.length} models (${loadedModels.slice(0, 3).join(', ')}...)`);
    log('Verified: Model cards successfully exploded outward and settled.');

    // Check AI Agent message reaction
    const agentMsgOpen = await page.$eval('.ai-agent-text', el => el.textContent.trim());
    log(`AI Agent Message after open: "${agentMsgOpen}"`);

    // ── Click Vault to Close ──
    log('Clicking the AI Vault 3D Cube again to secure/recall models...');
    await page.click('.cube-wrapper');

    log('Waiting for vault to enter closing state (magnetic pull)...');
    await page.waitForSelector('.cube.closing', { timeout: 2000 });

    log('Waiting for cards to return into container and vault to secure...');
    await page.waitForSelector('.cube.closed', { timeout: 5000 });
    log('Vault state: CLOSED.');

    // Wait for the exit animations to finish and grid to fully unmount from DOM
    log('Waiting for model grid to fully unmount from DOM...');
    await page.waitForFunction(() => !document.querySelector('.model-grid'), { timeout: 5000 });
    log('Verified: All cards magnetically returned and environment reset successfully.');

    log('ALL CINEMATIC LANDING INTERACTION TESTS PASSED SUCCESSFULLY!');

  } catch (error) {
    console.error('CINEMATIC TEST FAILED:', error);
    try {
      const screenshotPath = 'c:\\Users\\siddh\\OneDrive\\Desktop\\AI Pocket\\scratch\\screenshot_cinematic_error.png';
      await page.screenshot({ path: screenshotPath, fullPage: true });
      log(`Saved error screenshot to: ${screenshotPath}`);
    } catch (ssErr) {
      log(`Failed to save screenshot: ${ssErr.message}`);
    }
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
