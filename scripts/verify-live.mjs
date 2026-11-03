import { chromium } from 'playwright';

async function main() {
  const targetUrl = process.argv[2] || 'https://instant-comet-wxhgzvy.tmp.now';
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

  console.log(`Testing live on Vercel: ${targetUrl}`);
  await page.goto(targetUrl, { waitUntil: 'networkidle' });

  // Login
  await page.fill('input[type="email"]', 'director@estudioarquite.com');
  await page.fill('input[type="password"]', 'demo123');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(600);

  // Navigate to Mi Diamante
  await page.click('nav button:has-text("Mi Diamante")');
  await page.waitForTimeout(600);

  // Switch to Version 2
  await page.click('button:has-text("Versión 2")');
  await page.waitForTimeout(400);

  // Click Stage 2 facet (Cómo ganar)
  const targetPolygon = page.locator('svg polygon[aria-label*="PROFESIONAL: Cómo ganar"]').first();
  await targetPolygon.click();
  await page.waitForTimeout(400);

  // Fill decision textarea
  const textarea = page.locator('textarea:visible').last();
  await textarea.fill('Arquitectura de impacto y consultoría estratégica de alta dirección directiva.');
  await page.waitForTimeout(600);

  // Verify fill
  const facetFill = await targetPolygon.getAttribute('fill');
  console.log(`✓ Vercel Live: Facet fill color in SVG: ${facetFill}`);
  if (facetFill !== '#14B8A6') throw new Error(`Live test failed: fill was ${facetFill}`);

  // Navigate to Informes
  await page.click('nav button:has-text("Informes")');
  await page.waitForTimeout(600);

  // Click report button
  const reportBtn = page.locator('button:has-text("Ver y descargar informe")').first();
  await reportBtn.click();
  await page.waitForTimeout(600);

  // Emulate print
  await page.emulateMedia({ media: 'print' });
  const rootDisplay = await page.evaluate(() => {
    const el = document.getElementById('root');
    return el ? window.getComputedStyle(el).display : null;
  });
  console.log(`✓ Vercel Live: #root in print is: "${rootDisplay}"`);
  if (rootDisplay !== 'none') throw new Error(`Live test failed: rootDisplay was ${rootDisplay}`);

  console.log('🎉 ALL VERCEL LIVE TESTS PASSED ON PRODUCTION HTTPS URL!');
  await browser.close();
}

main().catch(err => {
  console.error('❌ Live test error:', err);
  process.exit(1);
});
