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

  // Set up dialog listener to accept confirm dialogs automatically
  page.on('dialog', async (dialog) => {
    log(`[Dialog] ${dialog.type()}: "${dialog.message()}"`);
    await dialog.accept();
  });

  try {
    log('Navigating to target local URL: http://localhost:5173');
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle2' });
    
    // Set viewport to avoid cut-off elements
    await page.setViewport({ width: 1280, height: 800 });

    log('Waiting for model cards to load...');
    await page.waitForSelector('.model-card', { timeout: 15000 });
    
    // Log the current list of models on screen
    const initialModels = await page.$$eval('.model-card .model-name', elements => 
      elements.map(el => el.textContent.trim())
    );
    log(`Initial models found: ${initialModels.join(', ')}`);

    log('Clicking "Add Model" button...');
    await page.waitForSelector('.navbar-actions button.btn-primary', { timeout: 5000 });
    await page.click('.navbar-actions button.btn-primary');

    log('Waiting for Add New Model modal to open...');
    await page.waitForSelector('.modal-content', { timeout: 5000 });
    
    log('Filling in the form elements...');
    await page.waitForSelector('#model-name', { timeout: 5000 });
    await page.type('#model-name', 'QA Local CRUD Test Model');
    
    await page.waitForSelector('#model-link', { timeout: 5000 });
    await page.type('#model-link', 'https://local-test.com');
    
    await page.waitForSelector('#model-description', { timeout: 5000 });
    await page.type('#model-description', 'Local testing of Edit and Delete UI functions');
    
    await page.waitForSelector('#model-category', { timeout: 5000 });
    await page.select('#model-category', 'Other');

    log('Form filled. Submitting the form...');
    await page.click('form button[type="submit"]');

    log('Waiting for modal to close...');
    await page.waitForFunction(() => !document.querySelector('.modal-content'), { timeout: 15000 });

    log('Verifying that the new card is rendered in the list...');
    await page.waitForFunction(
      () => Array.from(document.querySelectorAll('.model-card .model-name')).some(el => el.textContent.trim() === 'QA Local CRUD Test Model'),
      { timeout: 15000 }
    );
    log('Card successfully found in current session!');

    // Wait for the "Added successfully" toast to disappear (takes 3 seconds)
    log('Waiting 4 seconds for success toast to clear...');
    await new Promise(r => setTimeout(r, 4000));

    // Hover over card to reveal actions and click edit
    log('Hovering over card to locate edit button...');
    const cardHandle = await page.evaluateHandle(() => {
      const cards = Array.from(document.querySelectorAll('.model-card'));
      return cards.find(card => {
        const nameEl = card.querySelector('.model-name');
        return nameEl && nameEl.textContent.trim() === 'QA Local CRUD Test Model';
      });
    });

    if (!cardHandle) {
      throw new Error('Created model card handle could not be found!');
    }

    const cardInner = await cardHandle.$('.model-card-inner');
    if (!cardInner) {
      throw new Error('Could not find .model-card-inner within card handle!');
    }

    await cardInner.hover();
    
    const editBtn = await cardInner.$('.edit-btn') || await cardInner.$('.model-card-action-btn:first-child');
    if (!editBtn) {
      throw new Error('Edit button not found!');
    }
    
    log('Clicking the Edit button...');
    await editBtn.click();

    log('Waiting for Edit Model modal to open...');
    await page.waitForSelector('.modal-content', { timeout: 5000 });
    
    // Verify modal title
    const modalTitle = await page.$eval('.modal-header h2', el => el.textContent.trim());
    log(`Modal title found: "${modalTitle}"`);
    if (modalTitle !== 'Edit Model') {
      throw new Error(`Expected modal title to be "Edit Model", but got "${modalTitle}"`);
    }

    // Verify fields are pre-filled
    const nameVal = await page.$eval('#model-name', el => el.value);
    const linkVal = await page.$eval('#model-link', el => el.value);
    const descVal = await page.$eval('#model-description', el => el.value);
    const catVal = await page.$eval('#model-category', el => el.value);

    log(`Pre-filled fields: name="${nameVal}", link="${linkVal}", desc="${descVal}", category="${catVal}"`);
    if (nameVal !== 'QA Local CRUD Test Model' ||
        linkVal !== 'https://local-test.com' ||
        descVal !== 'Local testing of Edit and Delete UI functions' ||
        catVal !== 'Other') {
      throw new Error('Pre-filled form values did not match the expected model properties!');
    }
    log('Verified: Pre-filled values are correct.');

    // Edit name field
    log('Modifying the name field...');
    const nameInput = await page.$('#model-name');
    await nameInput.click({ clickCount: 3 });
    await page.keyboard.press('Backspace');
    await new Promise(r => setTimeout(r, 200));
    await nameInput.type('QA Local CRUD Test Model (Updated)');
    
    const nameValueAfter = await page.$eval('#model-name', el => el.value);
    log(`Name field value after typing: "${nameValueAfter}"`);

    // Save changes
    log('Clicking "Save Changes" and confirming...');
    // We click using DOM click to bypass any overlay or scrolling issues
    await page.$eval('form button[type="submit"]', el => el.click());

    log('Waiting for modal to close...');
    await page.waitForFunction(() => !document.querySelector('.modal-content'), { timeout: 15000 });
    log('Modal closed.');

    log('Verifying updated card is rendered in the list...');
    await page.waitForFunction(
      () => Array.from(document.querySelectorAll('.model-card .model-name')).some(el => el.textContent.trim() === 'QA Local CRUD Test Model (Updated)'),
      { timeout: 15000 }
    );
    log('Updated card successfully verified on screen!');

    // Reload page to verify persistence
    log('Reloading page to verify persistence in Supabase...');
    await page.reload({ waitUntil: 'networkidle2' });
    await page.waitForSelector('.model-card', { timeout: 15000 });

    const persists = await page.evaluate(() => {
      const names = Array.from(document.querySelectorAll('.model-card .model-name')).map(el => el.textContent.trim());
      return names.includes('QA Local CRUD Test Model (Updated)');
    });

    if (!persists) {
      throw new Error('Updated card did not persist after reloading.');
    }
    log('Success: Updated model card persisted after page reload!');

    // Locate and click Delete button
    log('Hovering over updated card to locate delete button...');
    const updatedCardHandle = await page.evaluateHandle(() => {
      const cards = Array.from(document.querySelectorAll('.model-card'));
      return cards.find(card => {
        const nameEl = card.querySelector('.model-name');
        return nameEl && nameEl.textContent.trim() === 'QA Local CRUD Test Model (Updated)';
      });
    });

    if (!updatedCardHandle) {
      throw new Error('Updated model card handle not found!');
    }

    const updatedCardInner = await updatedCardHandle.$('.model-card-inner');
    await updatedCardInner.hover();

    const deleteBtn = await updatedCardInner.$('.delete-btn') || 
                      await updatedCardInner.$('.model-card-action-btn.btn-delete') || 
                      await updatedCardInner.$('.model-card-action-btn:nth-child(2)');

    if (!deleteBtn) {
      throw new Error('Delete button not found!');
    }

    log('Clicking Delete button and confirming...');
    await deleteBtn.click();

    log('Waiting for card to disappear from frontend...');
    await page.waitForFunction(
      () => !Array.from(document.querySelectorAll('.model-card .model-name')).some(el => el.textContent.trim() === 'QA Local CRUD Test Model (Updated)'),
      { timeout: 15000 }
    );
    log('Card disappeared from frontend.');

    // Reload page to verify final permanent deletion
    log('Reloading page to verify permanent deletion in Supabase...');
    await page.reload({ waitUntil: 'networkidle2' });
    await page.waitForSelector('.navbar', { timeout: 5000 });

    const isDeleted = await page.evaluate(() => {
      const names = Array.from(document.querySelectorAll('.model-card .model-name')).map(el => el.textContent.trim());
      return !names.includes('QA Local CRUD Test Model (Updated)');
    });

    if (!isDeleted) {
      throw new Error('Updated card still exists after deletion and page reload!');
    }
    log('Verified: Card was permanently removed.');
    log('ALL TESTS PASSED SUCCESSFULLY!');

  } catch (error) {
    console.error('TEST FAILED:', error);
    try {
      const screenshotPath = 'c:\\Users\\siddh\\OneDrive\\Desktop\\AI Pocket\\scratch\\screenshot_error.png';
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
