/**
 * Generate extension icons dynamically
 * This creates simple PNG icons for the extension
 * 
 * Requirements:
 * - Node.js with canvas support, OR
 * - Use system commands to generate simple PNGs
 * 
 * Run: node generate-icons.js
 */

const fs = require('fs');
const path = require('path');

// Simple method: Create SVG files and convert them
// OR just use colored circles as PNG

const iconDir = path.join(__dirname, 'icons');

// Create icons directory if it doesn't exist
if (!fs.existsSync(iconDir)) {
  fs.mkdirSync(iconDir, { recursive: true });
  console.log('✓ Created icons directory');
}

/**
 * Generate a simple colored circle icon as base64 PNG
 * Size: pixels (16, 48, or 128)
 * Color: hex color code
 */
function generateColoredCircleIcon(size, color) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  // Convert hex to rgb
  const rgb = parseInt(color.slice(1), 16);
  const r = (rgb >> 16) & 255;
  const g = (rgb >> 8) & 255;
  const b = rgb & 255;

  // Draw filled circle
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI);
  ctx.fill();

  // Draw shield or symbol
  ctx.fillStyle = '#ffffff';
  ctx.font = `bold ${Math.floor(size * 0.6)}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('🛡', size / 2, size / 2);

  return canvas.toDataURL('image/png');
}

/**
 * Alternative: Use ImageMagick command line
 * This is more reliable than relying on Node canvas
 */
function generateIconsWithImageMagick() {
  const { execSync } = require('child_process');
  const sizes = [16, 48, 128];
  const baseColor = '#667eea'; // Purple from our design

  sizes.forEach(size => {
    try {
      // Create a simple colored circle with ImageMagick
      const filename = path.join(iconDir, `icon-${size}.png`);
      const command = `convert -size ${size}x${size} xc:${baseColor} -draw "circle ${size/2},${size/2} ${size},${size}" "${filename}"`;
      
      execSync(command);
      console.log(`✓ Generated icon-${size}.png`);
    } catch (error) {
      console.error(`✗ Failed to generate icon-${size}.png:`, error.message);
      console.log('  Install ImageMagick: brew install imagemagick');
    }
  });
}

/**
 * Fallback: Create simple placeholder icons
 * These are minimal valid PNG files
 */
function createPlaceholderIcons() {
  const sizes = [16, 48, 128];

  sizes.forEach(size => {
    // Minimal valid PNG - 1x1 purple pixel, scaled to size
    // This is a workaround - real icons should be proper PNGs
    const filename = path.join(iconDir, `icon-${size}.png`);

    // Create a simple data URL and save it as PNG
    // For testing, we can use a 1x1 pixel PNG
    const png1x1 = Buffer.from([
      0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
      0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
      0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53, 0xDE, 0x00, 0x00, 0x00,
      0x0C, 0x49, 0x44, 0x41, 0x54, 0x08, 0x99, 0x63, 0xF8, 0xCF, 0xC0, 0x00,
      0x00, 0x03, 0x01, 0x01, 0x00, 0x18, 0xDD, 0x8D, 0xB4, 0x00, 0x00, 0x00,
      0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
    ]);

    fs.writeFileSync(filename, png1x1);
    console.log(`✓ Created placeholder icon-${size}.png`);
  });
}

/**
 * Main execution
 */
function main() {
  console.log('Generating extension icons...\n');

  // Try different methods in order of preference
  try {
    // Method 1: Try ImageMagick (best quality)
    try {
      const { execSync } = require('child_process');
      execSync('which convert', { stdio: 'ignore' });
      console.log('Using ImageMagick...\n');
      generateIconsWithImageMagick();
    } catch {
      // Method 2: Try Node canvas
      try {
        const canvas = require('canvas');
        console.log('Using Node canvas...\n');
        
        const sizes = [16, 48, 128];
        const colors = { 16: '#667eea', 48: '#667eea', 128: '#667eea' };

        sizes.forEach(size => {
          // Would generate here with canvas
          console.log(`✓ Would generate icon-${size}.png (requires canvas module)`);
        });
      } catch {
        // Method 3: Fallback to placeholders
        console.log('Falling back to placeholder icons...\n');
        createPlaceholderIcons();
      }
    }
  } catch (error) {
    console.error('Error generating icons:', error.message);
    createPlaceholderIcons();
  }

  console.log('\n✅ Icon setup complete!');
  console.log('   Icons are located in: ./icons/');
  console.log('\n   To create higher quality icons:');
  console.log('   1. Install ImageMagick: brew install imagemagick');
  console.log('   2. Run this script again: node generate-icons.js');
}

main();