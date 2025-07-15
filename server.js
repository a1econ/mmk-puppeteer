import express from 'express';
import puppeteer from 'puppeteer';

const app = express();
const PORT = process.env.PORT || 10000;

const EMAIL = 'christos.georgopoulos@gmail.com';
const PASSWORD = 'kyngIq-7qanqy-dumpab';

const JSON_URL = 'https://portal.booking-manager.com/wbm2/page.html?responseType=JSON&view=BookingSheetData&companyid=7690&from=1752267600000&to=1784321999059&timeZoneOffsetInMins=-180&fromFormatted=2025-07-12%2000:00&toFormatted=2026-07-17%2023:59&daily=false&filter_discounts=false&isOnHubSpot=false&resultsPage=1&filter_country=GR&filter_region=35&filter_region=10&filter_region=7&filter_service=2103&filter_base=13&filter_base=4945797760000100000&filter_base=216&filter_base=1935994390000100000&filterlocationdistance=5000&filter_year=2025&filter_month=6&filter_date=13&filter_duration=7&filter_flexibility=on_day&filter_service_type=all&filter_kind=Catamaran&filter_kind=Sail%20boat&filter_shipyard=5&filter_shipyard=8&filter_shipyard=277&filter_shipyard=11&filter_model=3947847730000100000&filter_model=1399966290000100000&filter_model=800608360000100000&filter_model=1305064610000100000&filter_model=780746060000100000&filter_length_ft=0-2000&filter_cabins=0-2000&filter_berths=0-2000&filter_heads=0-2000&filter_price=0-10001000&filter_yachtage=0-7&filter_year_from=2018&filter_availability_status=-1';

app.get('/json', async (req, res) => {
  console.log('🧠 Λήψη JSON μέσω Puppeteer...');

  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.goto('https://portal.booking-manager.com/wbm2/app/login_register/', {
      waitUntil: 'domcontentloaded',
    });

    await page.type('input[placeholder="E-mail"]', EMAIL);
    await page.type('input[placeholder="Password"]', PASSWORD);

    await Promise.all([
      page.click('input[type="submit"][value="Login"]'),
      page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
    ]);

    await page.goto(JSON_URL, { waitUntil: 'networkidle2' });

    const body = await page.evaluate(() => document.body.innerText);
    const jsonData = JSON.parse(body);

    await browser.close();
    res.json(jsonData);
  } catch (error) {
    console.error('❌ Σφάλμα:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}/json`);
});
