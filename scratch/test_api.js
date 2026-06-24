(async () => {
  try {
    console.log('--- Testing Render backend without trailing slash ---');
    const res1 = await fetch('https://ai-pocket-backend.onrender.com/api/models');
    console.log('Status:', res1.status);

    console.log('\n--- Testing Render backend with trailing slash ---');
    const res2 = await fetch('https://ai-pocket-backend.onrender.com/api/models/');
    console.log('Status:', res2.status);
    console.log('Body snippet:', (await res2.text()).substring(0, 100));
  } catch (err) {
    console.error('Error fetching API:', err);
  }
})();
