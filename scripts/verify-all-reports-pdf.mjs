import { chromium } from 'playwright';
import { createServer } from 'http';
import { readFileSync, existsSync, writeFileSync } from 'fs';
import { resolve, extname } from 'path';

// Lightweight local static server for dist/
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

server.listen(4174, async () => {
  console.log('🚀 Local verification server running on http://localhost:4174');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();

  try {
    console.log('\n======================================================');
    console.log('ARQUITÉ — COMPREHENSIVE PDF & REPORT TEST SUITE');
    console.log('======================================================');

    // 1. Navigation & Authentication
    console.log('1. Navigating to platform and authenticating...');
    await page.goto('http://localhost:4174', { waitUntil: 'networkidle' });
    // Reset test storage to ensure fresh seed with all 3 module closures
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'networkidle' });

    await page.fill('input[type="email"]', 'director@estudioarquite.com');
    await page.fill('input[type="password"]', 'demo123');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(500);

    const titleText = await page.textContent('h1');
    console.log(`   ✓ Authenticated successfully. Heading: "${titleText}"`);

    // 2. Navigate to "Informes" tab
    console.log('2. Navigating to "Informes" tab...');
    await page.click('nav button:has-text("Informes")');
    await page.waitForTimeout(500);

    const reportsHeading = await page.textContent('h1');
    console.log(`   ✓ Reports view active: "${reportsHeading}"`);

    // =========================================================================
    // TEST REPORT 1: DIAMOND REPORT (Mi Arquitectura Estratégica)
    // =========================================================================
    console.log('\n--- TESTING REPORT 1: DIAMOND REPORT (v1) ---');
    
    // Click "Ver (v1)"
    await page.click('button:has-text("Ver (v1)")');
    await page.waitForTimeout(400);

    // Verify modal opened
    const modalTitle = await page.textContent('[role="dialog"] h2');
    console.log(`   ✓ Preview modal open: "${modalTitle}"`);

    // Emulate print media
    await page.emulateMedia({ media: 'print' });

    // Verify #root is completely hidden
    const rootDisplay = await page.$eval('#root', el => window.getComputedStyle(el).display);
    console.log(`   ✓ Screen root (#root) in print mode: "${rootDisplay}" (expected: "none")`);
    if (rootDisplay !== 'none') {
      throw new Error(`#root should be hidden in print mode, but was: "${rootDisplay}"`);
    }

    // Verify modal overlay or content is hidden in print mode if present
    const modalContentDisplay = await page.$eval('.modal-dialog-content', el => window.getComputedStyle(el).display).catch(() => 'none');
    console.log(`   ✓ Modal dialog content in print mode: "${modalContentDisplay}" (expected: "none")`);
    if (modalContentDisplay !== 'none') {
      throw new Error(`.modal-dialog-content should be hidden in print mode, but was: "${modalContentDisplay}"`);
    }

    // Verify dedicated #arquite-print-root is active and properly structured
    const printRootDisplay = await page.$eval('#arquite-print-root', el => window.getComputedStyle(el).display);
    console.log(`   ✓ Dedicated print root (#arquite-print-root) display: "${printRootDisplay}" (expected: "block")`);
    if (printRootDisplay !== 'block') {
      throw new Error(`#arquite-print-root should be display: block in print, but was: "${printRootDisplay}"`);
    }

    // Verify content completeness in print root using textContent
    const diamondPrintText = await page.$eval('#arquite-print-root', el => el.textContent || '');
    const requiredDiamondTexts = [
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
      'Sistemas de gestión',
      'Página 1 de 2',
      'Página 2 de 2'
    ];
    for (const req of requiredDiamondTexts) {
      if (!diamondPrintText.includes(req)) {
        throw new Error(`Diamond report missing expected text: "${req}"`);
      }
    }
    console.log(`   ✓ All required sections and titles present in Diamond report! (${diamondPrintText.length} chars)`);

    // Verify SVG Diamond facets in print root
    const svgFills = await page.$$eval('#arquite-print-root svg polygon', els => els.map(e => e.getAttribute('fill')));
    const nonActiveFills = svgFills.filter(f => f === '#F7F5F0');
    console.log(`   ✓ Diamond SVG in print: ${svgFills.length} total polygons, ${svgFills.length - nonActiveFills.length} active colored facets`);
    if (nonActiveFills.length > 0) {
      throw new Error(`Expected all facets to be illuminated in closed report, found ${nonActiveFills.length} unlit.`);
    }

    // Verify bounding box of headers to ensure ZERO horizontal clipping
    const h1Box = await page.$eval('#arquite-print-root h1', el => {
      const rect = el.getBoundingClientRect();
      return { x: rect.x, width: rect.width, left: rect.left };
    });
    console.log(`   ✓ Main heading left position: ${h1Box.x}px (Must be >= 0, no negative offset clipping)`);
    if (h1Box.x < 0) {
      throw new Error(`Horizontal clipping detected! Heading left coordinate is negative: ${h1Box.x}`);
    }

    // Generate real PDF for Diamond Report v1
    const diamondPdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true
    });
    const diamondPdfFilename = 'ARQUITE_Diamante_Estrategico_v1_2026-11-03.pdf';
    writeFileSync(diamondPdfFilename, diamondPdfBuffer);
    console.log(`   🎉 Generated PDF: ${diamondPdfFilename} (${(diamondPdfBuffer.length / 1024).toFixed(1)} KB)`);

    // Close preview modal
    await page.emulateMedia({ media: 'screen' });
    await page.click('button:has-text("Cerrar")');
    await page.waitForTimeout(400);

    // =========================================================================
    // TEST REPORT 2: SEVEN THRESHOLDS REPORT (Mapa de Evolución de Liderazgo)
    // =========================================================================
    console.log('\n--- TESTING REPORT 2: SEVEN THRESHOLDS REPORT ---');
    
    // Click "Ver informe" for Thresholds
    const verUmbralesBtn = page.locator('div:has-text("Mapa de Evolución") >> button:has-text("Ver informe")');
    await verUmbralesBtn.click();
    await page.waitForTimeout(400);

    await page.emulateMedia({ media: 'print' });

    const thresholdsPrintText = await page.$eval('#arquite-print-root', el => el.textContent || '');
    const requiredThresholdsTexts = [
      'Mapa de Evolución de Liderazgo',
      'Registro longitudinal de los siete umbrales',
      '1. Dimensión Funcional',
      '2. Dimensión Identitaria',
      '3. Dimensión Trascendente',
      'De la competencia a la consciencia',
      'Del hacer al pensar arquitectónicamente',
      'Del control a la influencia',
      'De la identidad profesional a la estratégica',
      'De la validación externa a la autoridad interna',
      'De la gestión del presente a la creación de futuro',
      'Del logro individual al legado sistémico',
      'Reflexión Documentada:',
      'Página 1 de 2',
      'Página 2 de 2'
    ];
    for (const req of requiredThresholdsTexts) {
      if (!thresholdsPrintText.includes(req)) {
        throw new Error(`Thresholds report missing expected text: "${req}"`);
      }
    }
    console.log(`   ✓ All 7 canonical thresholds across 3 dimensions verified! (${thresholdsPrintText.length} chars)`);

    // Generate real PDF for Thresholds Report
    const thresholdsPdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true
    });
    const thresholdsPdfFilename = 'ARQUITE_Siete_Umbrales_2026-11-03.pdf';
    writeFileSync(thresholdsPdfFilename, thresholdsPdfBuffer);
    console.log(`   🎉 Generated PDF: ${thresholdsPdfFilename} (${(thresholdsPdfBuffer.length / 1024).toFixed(1)} KB)`);

    await page.emulateMedia({ media: 'screen' });
    await page.click('button:has-text("Cerrar")');
    await page.waitForTimeout(400);

    // =========================================================================
    // TEST REPORT 3: FUTURE LETTERS REPORT (Cartas a mi Yo Futuro)
    // =========================================================================
    console.log('\n--- TESTING REPORT 3: FUTURE LETTERS REPORT ---');
    
    // Click "Ver cartas (2/2)"
    const verCartasBtn = page.locator('div:has-text("Cartas a mi Yo Futuro") >> button:has-text("Ver cartas")');
    await verCartasBtn.click();
    await page.waitForTimeout(400);

    await page.emulateMedia({ media: 'print' });

    const lettersPrintText = await page.$eval('#arquite-print-root', el => el.textContent || '');
    const requiredLettersTexts = [
      'Cartas a mi Yo Futuro',
      'Compromisos epistolares y pacto de dirección estratégica',
      'I. Carta a mi Ser Personal',
      'II. Carta a mi Líder Profesional',
      'Página 1 de 2',
      'Página 2 de 2'
    ];
    for (const req of requiredLettersTexts) {
      if (!lettersPrintText.includes(req)) {
        throw new Error(`Letters report missing expected text: "${req}"`);
      }
    }
    console.log(`   ✓ Both personal and professional letters fully verified! (${lettersPrintText.length} chars)`);

    // Verify letters have full body text and are not blank
    const personalLetterBody = await page.$eval('#arquite-print-root', el => {
      const cards = el.querySelectorAll('.font-editorial.text-base, .font-editorial.text-lg');
      return Array.from(cards).map(c => c.textContent?.trim()).filter(Boolean);
    });
    console.log(`   ✓ Found ${personalLetterBody.length} letter body sections. Body sample: "${personalLetterBody[0]?.substring(0, 50)}..."`);
    if (personalLetterBody.length < 2 || !personalLetterBody[0] || personalLetterBody[0].length < 20) {
      throw new Error(`Letters body is unexpectedly short or empty: ${JSON.stringify(personalLetterBody)}`);
    }

    // Generate real PDF for Letters Report
    const lettersPdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true
    });
    const lettersPdfFilename = 'ARQUITE_Cartas_al_Futuro_2026-11-03.pdf';
    writeFileSync(lettersPdfFilename, lettersPdfBuffer);
    console.log(`   🎉 Generated PDF: ${lettersPdfFilename} (${(lettersPdfBuffer.length / 1024).toFixed(1)} KB)`);

    console.log('\n======================================================');
    console.log('✅ ALL 3 MODULE REPORTS PASSED FULL VERIFICATION!');
    console.log('  1. ' + diamondPdfFilename + ' (Generated & verified)');
    console.log('  2. ' + thresholdsPdfFilename + ' (Generated & verified)');
    console.log('  3. ' + lettersPdfFilename + ' (Generated & verified)');
    console.log('======================================================\n');

  } catch (err) {
    console.error('❌ PDF Test failed:', err);
    process.exitCode = 1;
  } finally {
    await browser.close();
    server.close();
  }
});
