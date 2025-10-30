import sharp from 'sharp';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

const svgPath = join(rootDir, 'public', 'og-image.svg');
const pngPath = join(rootDir, 'public', 'og-image.png');

async function convertSvgToPng() {
  try {
    console.log('Converting SVG to PNG...');
    
    const svgBuffer = fs.readFileSync(svgPath);
    
    await sharp(svgBuffer)
      .resize(1200, 630)
      .png()
      .toFile(pngPath);
    
    console.log('✅ Successfully created og-image.png at:', pngPath);
  } catch (error) {
    console.error('❌ Error converting SVG to PNG:', error);
    process.exit(1);
  }
}

convertSvgToPng();
