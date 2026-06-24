import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();

  // Helper to log with timestamp
  const log = (msg) => console.log(`[${new Date().toISOString()}] ${msg}`);

  try {
    log('Navigating to target URL: https://ai-pocket-xi.vercel.app');
    await page.goto('https://ai-pocket-xi.vercel.app', { waitUntil: 'networkidle2' });

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
    await page.type('#model-name', 'QA UI Test Model');
    
    await page.waitForSelector('#model-link', { timeout: 5000 });
    await page.type('#model-link', 'https://example.com/qa-ui-test');
    
    await page.waitForSelector('#model-description', { timeout: 5000 });
    await page.type('#model-description', 'This model was added automatically by the QA browser automation test suite using the web UI.');
    
    await page.waitForSelector('#model-category', { timeout: 5000 });
    await page.select('#model-category', 'Other');

    log('Form filled. Submitting the form...');
    await page.click('form button[type="submit"]');

    log('Waiting for modal to close...');
    await page.waitForFunction(() => !document.querySelector('.modal-content'), { timeout: 15000 });

    log('Verifying that the new card is rendered in the list...');
    await page.waitForFunction(
      () => Array.from(document.querySelectorAll('.model-card .model-name')).some(el => el.textContent.trim() === 'QA UI Test Model'),
      { timeout: 15000 }
    );
    log('Card successfully found in current session!');

    log('Reloading page to verify persistence...');
    await page.reload({ waitUntil: 'networkidle2' });

    log('Waiting for page reload to complete and model card to be visible...');
    await page.waitForSelector('.model-card', { timeout: 15000 });

    const persists = await page.evaluate(() => {
      const names = Array.from(document.querySelectorAll('.model-card .model-name')).map(el => el.textContent.trim());
      return names.includes('QA UI Test Model');
    });

    if (!persists) {
      throw new Error('QA UI Test Model did not persist after reloading the page.');
    }
    log('Success: QA UI Test Model persisted after page reload!');

    // Fetch the list from Render backend API to find the model ID
    log('Querying Render backend API to find the model ID...');
    const response = await fetch('https://ai-pocket-backend.onrender.com/api/models');
    if (!response.ok) {
      throw new Error(`Failed to fetch models from Render API: ${response.status} ${response.statusText}`);
    }
    const models = await response.json();
    const createdModel = models.find(m => m.name === 'QA UI Test Model');

    if (!createdModel) {
      throw new Error('QA UI Test Model was not found in the Render API response.');
    }
    const modelId = createdModel.id || createdModel._id;
    log(`Model found in DB. ID: ${modelId}`);

    // Clean up: Send a DELETE request to backend
    log(`Cleaning up: Sending DELETE request to https://ai-pocket-backend.onrender.com/api/models/${modelId}`);
    const deleteResponse = await fetch(`https://ai-pocket-backend.onrender.com/api/models/${modelId}`, {
      method: 'DELETE'
    });

    if (!deleteResponse.ok) {
      throw new Error(`DELETE request failed: ${deleteResponse.status} ${deleteResponse.statusText}`);
    }
    log('Cleanup successful! Model deleted from the database.');

    // Final verification: reload and verify it's gone
    log('Performing final reload to verify card is removed...');
    await page.reload({ waitUntil: 'networkidle2' });
    
    // Wait briefly for elements to render
    await page.waitForSelector('.navbar', { timeout: 5000 });
    
    const isDeleted = await page.evaluate(() => {
      const names = Array.from(document.querySelectorAll('.model-card .model-name')).map(el => el.textContent.trim());
      return !names.includes('QA UI Test Model');
    });

    if (!isDeleted) {
      throw new Error('QA UI Test Model was still visible after deletion!');
    }
    log('Verified: Model has been completely removed from frontend after deletion.');
    log('TEST COMPLETED SUCCESSFULLY!');
    
  } catch (error) {
    console.error('TEST FAILED:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
