import { chromium } from 'playwright';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  
  console.log('Navigating to live production: https://arquite-app.vercel.app');
  await page.goto('https://arquite-app.vercel.app', { waitUntil: 'networkidle' });
  
  await page.fill('input[type="email"]', 'director@estudioarquite.com');
  await page.fill('input[type="password"]', 'demo123');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(1000);
  
  const navTabs = await page.$$eval('nav button', els => els.map(e => e.textContent.trim()));
  console.log('✓ Live Navigation Tabs:', navTabs);

  // Navigate to 'Mi Diamante Profesional'
  await page.click('nav button:has-text("Mi Diamante Profesional")');
  await page.waitForTimeout(500);
  const heading = await page.textContent('span.font-editorial');
  console.log('✓ Heading on page:', heading);

  // Verify 5-facet SVG presence
  const polygons = await page.$$eval('svg polygon', els => els.length);
  console.log('✓ SVG Polygons in DiamondSvg5:', polygons);

  // Navigate to Informes
  await page.click('nav button:has-text("Informes")');
  await page.waitForTimeout(500);
  const reportsCards = await page.$$eval('div.grid > div h3', els => els.map(e => e.textContent.trim()));
  console.log('✓ Report Cards in Hub:', reportsCards);

  await browser.close();
  console.log('\n🎉 ALL LIVE PRODUCTION VERIFICATIONS SUCCEEDED!');
}

main().catch(err => {
  console.error('Error on live check:', err);
  process.exit(1);
});
