// Simple script to create placeholder PWA icons
// These are SVG-based placeholders that will work until real assets are added
const fs = require('fs');
const path = require('path');

const iconsDir = path.join(__dirname, '../public/icons');

// Create icons directory
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

const sizes = [72, 96, 128, 144, 152, 180, 192, 384, 512];

// Generate SVG placeholders for each size
sizes.forEach(size => {
  const svg = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#f2eac5"/>
  <circle cx="${size/2}" cy="${size/2}" r="${size/3}" fill="#e1cf7a" stroke="#38310f" stroke-width="2"/>
  <text x="50%" y="50%" text-anchor="middle" dy=".3em" font-family="Arial, sans-serif" font-size="${size/4}" font-weight="bold" fill="#38310f">K</text>
</svg>`;

  const filename = size === 180
    ? path.join(iconsDir, `apple-icon-${size}.png`)
    : path.join(iconsDir, `icon-${size}.png`);

  // For now, just save as SVG with .png extension (will be converted in production)
  fs.writeFileSync(filename.replace('.png', '.svg'), svg);
});

console.log('✓ Placeholder icons generated in /public/icons/');
console.log('Note: These are SVG placeholders. Convert to PNG for production or replace with Figma assets.');
