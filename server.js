const express = require('express');
const puppeteer = require('puppeteer-core');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Χρήσιμο για Render
const executablePath = '/opt/render/project/chrome/chrome';

app.get('/json', async (req, res) => {
  console.log('🧠 Λήψη JSON μέσω Puppeteer...');

  try {
    const browser = await puppeteer.launch({
      executablePath,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: 'new',
    });

    const page = await browser.newPage();

    const EMAIL = 'christos.georgopoulos@gmail.com';
    const PASSWORD = 'kyngIq-7qanqy-dumpab';

    const JSON_URL = 'https://portal.booking-manager.com/wbm2/page.html?...'; // Βάλε εδώ το full URL σου

    await page.goto('https://portal.booking-manager.com/wbm2/app/login_register/', { waitUntil: 'networkidle2' });
    await page.type('input[placeholder="E-mail"]', EMAIL);
    await page.type('input[placeholder="Password"]', PASSWORD);
    await Promise.all([
      page.click('input[type="submit"]'),
      page.waitForNavigation({ waitUntil: 'networkidle2' })
    ]);

    await page.goto('https://portal.booking-manager.com/wbm2/app/yachts/bookingsheet.jsp', { waitUntil: 'networkidle2' });

    const response = await page.goto(JSON_URL, { waitUntil: 'networkidle2' });
    const jsonData = await response.json();

    await browser.close();

    res.status(200).json(jsonData);
  } catch (err) {
    console.error('❌ Σφάλμα:', err.message);
    res.status(500).json({ error: 'Puppeteer failed', details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}/json`);
});
