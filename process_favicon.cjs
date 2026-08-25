const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function processImage() {
  const url = 'https://res.cloudinary.com/ywmg6avw/image/upload/v1787361287/round_photo_f09vjk.png';
  const res = await fetch(url);
  const buffer = Buffer.from(await res.arrayBuffer());

  const image = sharp(buffer);
  const meta = await image.metadata();
  console.log('Original metadata:', meta);

  // Ensure public directory exists
  const publicDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // 1. Trim outer whitespace/borders
  // If the outer border is white (threshold ~10), trim it
  const trimmed = await sharp(buffer)
    .trim({ threshold: 15 })
    .toBuffer();
  
  const trimmedMeta = await sharp(trimmed).metadata();
  console.log('Trimmed metadata:', trimmedMeta);

  // We want the portrait to fill the entire square canvas (full bleed) without white corners.
  // The face and shoulders should fill the square so that when a circle mask is applied (by Google or tabs),
  // it doesn't show double borders or empty whitespace.
  // Let's crop slightly into the content (e.g. 85-90% zoom from center-top to center the face) or extract the inner circle region.
  
  const width = trimmedMeta.width;
  const height = trimmedMeta.height;
  const size = Math.min(width, height);

  // Maximum square fully inscribed inside the circular portrait is size / sqrt(2) ≈ 0.707 * size.
  // Using 0.65 to ensure safe margin inside the circle with ZERO corner transparency or border lines.
  const cropSize = Math.round(size * 0.65);
  const left = Math.round((width - cropSize) / 2);
  // Center closely on the face and upper shoulders
  const top = Math.round((height - cropSize) * 0.20);

  const fullSquare512 = await sharp(trimmed)
    .extract({ left, top, width: cropSize, height: cropSize })
    .resize(512, 512, { fit: 'cover' })
    .png({ quality: 100 })
    .toBuffer();

  fs.writeFileSync(path.join(publicDir, 'favicon.png'), fullSquare512);
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), fullSquare512);
  fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), await sharp(fullSquare512).resize(180, 180).toBuffer());
  fs.writeFileSync(path.join(publicDir, 'favicon-32x32.png'), await sharp(fullSquare512).resize(32, 32).toBuffer());
  fs.writeFileSync(path.join(publicDir, 'favicon-16x16.png'), await sharp(fullSquare512).resize(16, 16).toBuffer());
  fs.writeFileSync(path.join(publicDir, 'profile-square.png'), fullSquare512);

  // Also create a root copy
  fs.writeFileSync(path.join(process.cwd(), 'favicon.png'), fullSquare512);
  fs.writeFileSync(path.join(process.cwd(), 'apple-touch-icon.png'), await sharp(fullSquare512).resize(180, 180).toBuffer());

  console.log('Successfully generated full-bleed favicons and profile-square.png!');
}

processImage().catch(console.error);
