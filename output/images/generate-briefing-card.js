const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  console.log('Starting browser...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();

    // Set viewport to exact size needed
    await page.setViewport({
      width: 1200,
      height: 630,
      deviceScaleFactor: 2 // For high-quality rendering
    });

    const htmlPath = path.join(__dirname, 'briefing-card-template.html');
    console.log('Loading HTML from:', htmlPath);

    await page.goto(`file://${htmlPath}`, {
      waitUntil: 'networkidle0'
    });

    // Wait a bit for fonts to load
    await new Promise(resolve => setTimeout(resolve, 1000));

    const outputPath = path.join(__dirname, 'briefing-card-2025-12-05.png');
    console.log('Generating image...');

    await page.screenshot({
      path: outputPath,
      type: 'png',
      fullPage: false
    });

    console.log('Image saved to:', outputPath);
  } catch (error) {
    console.error('Error generating image:', error);
  } finally {
    await browser.close();
    console.log('Done!');
  }
})();
