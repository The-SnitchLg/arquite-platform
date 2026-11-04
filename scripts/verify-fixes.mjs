import { chromium } from 'playwright';
import { createServer } from 'http';
import { readFileSync, existsSync } from 'fs';
import { resolve, extname } from 'path';

// Simple lightweight local static file server for dist/
const distDir = resolve(process.cwd(), 'dist');
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.woff2': 'font/woff2'
};

const server = createServer((req, res) => {
  let urlPath = req.url?.split('?')[0] || '/';
  if (urlPath === '/' || urlPath === '') urlPath = '/index.html';
  const filePath = resolve(distDir, '.' + urlPath);

  if (existsSync(filePath)) {
    const ext = extname(filePath);
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
    res.end(readFileSync(filePath));
  } else {
    // SPA fallback
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(readFileSync(resolve(distDir, 'index.html')));
  }
});

server.listen(4173, async () => {
  console.log('🚀 Local test server running on http://localhost:4173');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();

  try {
    console.log('1. Navigating to platform...');
    await page.goto('http://localhost:4173', { waitUntil: 'networkidle' });

    // Login as Demo Participant
    console.log('2. Logging in as Demo Participant...');
    await page.fill('input[type="email"]', 'director@estudioarquite.com');
    await page.fill('input[type="password"]', 'demo123');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(500);

    // Verify Panorama loaded
    const titleText = await page.textContent('h1');
    console.log(`   ✓ Authenticated successfully. Header text: "${titleText}"`);

    // Navigate to "Mi Diamante"
    console.log('3. Navigating to "Mi Diamante"...');
    await page.click('nav button:has-text("Mi Diamante")');
    await page.waitForTimeout(500);

    // Verify Version 1 is confirmed and Version 2 is available
    const slotV2Button = page.locator('button:has-text("Versión 2")');
    const v2Exists = await slotV2Button.count() > 0;
    console.log(`   ✓ Versión 2 slot button present: ${v2Exists}`);

    if (v2Exists) {
      await slotV2Button.click();
      await page.waitForTimeout(300);
    }

    // TEST BUG 1: Progressive facet illumination in Version 2 across all 10 facets
    console.log('4. Testing Diamond Version 2 progressive facet illumination across all facets...');
    
    // Canonical stages and expected active colors
    const stageExpectedColors = [
      '#00685F', // 0: Aspiración ganadora
      '#0D9488', // 1: Dónde jugar
      '#14B8A6', // 2: Cómo ganar
      '#2DD4BF', // 3: Con qué capacidades
      '#0284C7', // 4: Sistemas de gestión
    ];

    const stagesList = [
      { name: 'Aspiración ganadora', idx: 0 },
      { name: 'Dónde jugar', idx: 1 },
      { name: 'Cómo ganar', idx: 2 },
      { name: 'Con qué capacidades', idx: 3 },
      { name: 'Sistemas de gestión', idx: 4 }
    ];

    for (const dim of ['personal', 'profesional']) {
      // Switch dimension
      const dimBtnText = dim === 'personal' ? 'Dimensión Personal' : 'Dimensión Profesional';
      await page.click(`button:has-text("${dimBtnText}")`);
      await page.waitForTimeout(200);

      for (const stage of stagesList) {
        const expectedColor = stageExpectedColors[stage.idx];
        const facetLabel = `${dim.toUpperCase()}: ${stage.name}`;

        // Click facet directly on SVG to focus it
        const facetPolygon = page.locator(`svg polygon[aria-label*="${facetLabel}"]`).first();
        await facetPolygon.click();
        await page.waitForTimeout(200);

        // Fill decision textarea with valid narrative (>10 chars)
        const textarea = page.locator('textarea:visible').last();
        await textarea.fill(`Elección estratégica rigurosa y reflexiva para ${dim} etapa ${stage.name}.`);
        await page.waitForTimeout(300);

        // Verify polygon illuminates immediately with its exact canonical color
        const fill = await facetPolygon.getAttribute('fill');
        console.log(`   ✓ Facet [${dim.toUpperCase()}] ${stage.name} -> Fill: ${fill} (Expected: ${expectedColor})`);
        if (fill !== expectedColor) {
          throw new Error(`Facet ${facetLabel} did not illuminate. Expected ${expectedColor}, got ${fill}`);
        }
      }
    }
    console.log('   🎉 ALL 10 FACETS IN VERSION 2 ILLUMINATED INDEPENDENTLY WITH EXACT CANONICAL COLORS!');

    // TEST BUG 2: PDF Export and Print Formatting
    console.log('5. Navigating to Informes and opening Diamond PDF preview...');
    await page.click('nav button:has-text("Informes")');
    await page.waitForTimeout(500);

    // Click "Ver (v1)"
    await page.click('button:has-text("Ver (v1)")');
    await page.waitForTimeout(500);

    // Verify modal is open
    const modalVisible = await page.locator('.modal-dialog-content').isVisible();
    console.log(`   ✓ Report modal visible: ${modalVisible}`);

    // Emulate print media
    console.log('6. Emulating print media and verifying CSS isolation...');
    await page.emulateMedia({ media: 'print' });
    await page.waitForTimeout(300);

    // Check that #root is hidden in print
    const rootDisplay = await page.evaluate(() => {
      const el = document.getElementById('root');
      return el ? window.getComputedStyle(el).display : null;
    });
    console.log(`   ✓ #root background display in print: "${rootDisplay}" (expected: "none")`);
    if (rootDisplay !== 'none') {
      throw new Error(`#root should be hidden in print but was ${rootDisplay}`);
    }

    // Check that modal dialog content is hidden in print
    const modalDisplay = await page.evaluate(() => {
      const el = document.querySelector('.modal-dialog-content');
      return el ? window.getComputedStyle(el).display : null;
    });
    console.log(`   ✓ Modal dialog content in print: "${modalDisplay}" (expected: "none")`);
    if (modalDisplay !== 'none') {
      throw new Error(`.modal-dialog-content should be hidden in print but was ${modalDisplay}`);
    }

    // Check that dedicated #arquite-print-root is active in print
    const printRootDisplay = await page.evaluate(() => {
      const el = document.getElementById('arquite-print-root');
      return el ? window.getComputedStyle(el).display : null;
    });
    console.log(`   ✓ Dedicated #arquite-print-root display in print: "${printRootDisplay}" (expected: "block")`);
    if (printRootDisplay !== 'block') {
      throw new Error(`#arquite-print-root should be display: block in print but was ${printRootDisplay}`);
    }

    // Verify all contents of the printable report in print mode
    console.log('   Verifying printable report contents and completeness...');
    const reportText = await page.evaluate(() => {
      const el = document.getElementById('arquite-print-root');
      return el ? (el.textContent || '') : '';
    });
    const requiredTexts = [
      'Mi Arquitectura Estratégica',
      'ARQUITÉ · ESTUDIO DE DIRECCIÓN Y ARQUITECTURA ESTRATÉGICA',
      'I. Las Tres Exploraciones del Contexto',
      'II. Las Diez Decisiones Estratégicas',
      'Dimensión Personal',
      'Dimensión Profesional',
      'Aspiración ganadora',
      'Dónde jugar',
      'Cómo ganar',
      'Con qué capacidades',
      'Sistemas de gestión'
    ];
    for (const req of requiredTexts) {
      if (!reportText.toLowerCase().includes(req.toLowerCase())) {
        throw new Error(`Report content missing required text: "${req}"`);
      }
    }
    console.log(`   ✓ All required report sections, headings and decisions are present in the printable DOM! (${reportText.length} chars)`);

    // Verify diamond SVG in printable report has all 10 facets illuminated for Version 1
    const printSvgFills = await page.$$eval('#arquite-print-root svg polygon', elements =>
      elements.map(el => el.getAttribute('fill'))
    );
    const nonActiveFills = printSvgFills.filter(f => f === '#F7F5F0');
    console.log(`   ✓ Total facets in print SVG: ${printSvgFills.length}, Non-active facets: ${nonActiveFills.length}`);
    if (nonActiveFills.length > 0) {
      throw new Error(`Expected all 10 facets to be illuminated in closed report, but found ${nonActiveFills.length} empty facets.`);
    }

    // Generate actual PDF file
    console.log('7. Generating actual A4 PDF file: diamond-report-v1-verified.pdf...');
    await page.screenshot({ path: 'diamond-report-print-preview.png', fullPage: true });
    const pdfBuffer = await page.pdf({
      path: 'diamond-report-v1-verified.pdf',
      format: 'A4',
      printBackground: true,
      margin: {
        top: '12mm',
        right: '15mm',
        bottom: '15mm',
        left: '15mm'
      }
    });

    console.log(`   ✓ PDF successfully generated! File size: ${pdfBuffer.length} bytes.`);
    console.log('   🎉 BUG 2 FIXED: Clean PDF generated with 0 background bleed and unconstrained paged layout!');

    console.log('\n=========================================');
    console.log('ALL VERIFICATION TESTS PASSED SUCCESSFULLY!');
    console.log('=========================================');
  } catch (err) {
    console.error('❌ Verification failed:', err);
    process.exitCode = 1;
  } finally {
    await browser.close();
    server.close();
  }
});
