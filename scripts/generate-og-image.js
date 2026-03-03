#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Create SVG with Peru colors (red and white)
// Peru national colors: red (#CF142B) and white
const width = 1200;
const height = 630;

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <!-- Red background (Peru color) -->
  <rect width="${width}" height="${height}" fill="#CF142B"/>

  <!-- White decorative left stripe -->
  <rect x="0" y="0" width="120" height="${height}" fill="white" opacity="0.15"/>

  <!-- Main title -->
  <text x="${width / 2}" y="240" font-family="Arial, sans-serif" font-size="64" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">
    Octógonos de candidatos
  </text>

  <!-- Subtitle -->
  <text x="${width / 2}" y="340" font-family="Arial, sans-serif" font-size="56" font-weight="normal" fill="white" text-anchor="middle" dominant-baseline="middle">
    Educación, historial legal y plan de gobierno
  </text>

  <!-- Small accent line -->
  <rect x="${width / 2 - 100}" y="380" width="200" height="3" fill="white" opacity="0.6"/>
</svg>`;

// Convert SVG to PNG using a simple approach
// We'll write the SVG to a file and then use a tool to convert it

const svgPath = path.join(__dirname, '..', 'public', 'og-image.svg');
const pngPath = path.join(__dirname, '..', 'public', 'og-image.png');

// For now, let's try using sharp if available, otherwise we'll use a different approach
try {
  const sharp = require('sharp');

  console.log('Generating og:image using sharp...');

  // Create PNG directly from SVG buffer
  sharp(Buffer.from(svg))
    .png()
    .toFile(pngPath)
    .then(info => {
      console.log('✓ og:image.png generated successfully');
      console.log(`  Dimensions: ${info.width}x${info.height}`);
      console.log(`  Size: ${(info.size / 1024).toFixed(2)} KB`);
    })
    .catch(err => {
      console.error('Error generating image with sharp:', err.message);
      // Fallback: write SVG
      console.log('Falling back to SVG generation...');
      fs.writeFileSync(svgPath, svg);
      console.log('✓ og-image.svg created (manual conversion to PNG needed)');
    });
} catch (err) {
  // sharp not available, try canvas
  console.log('sharp not available, trying canvas approach...');

  try {
    const { createCanvas } = require('canvas');

    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Red background
    ctx.fillStyle = '#CF142B';
    ctx.fillRect(0, 0, width, height);

    // White decorative stripe
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.fillRect(0, 0, 120, height);

    // Main title
    ctx.fillStyle = 'white';
    ctx.font = 'bold 64px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Octógonos de candidatos', width / 2, 240);

    // Subtitle
    ctx.font = 'normal 56px Arial, sans-serif';
    ctx.fillText('Educación, historial legal y plan de gobierno', width / 2, 340);

    // Accent line
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.fillRect(width / 2 - 100, 380, 200, 3);

    // Save PNG
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(pngPath, buffer);

    console.log('✓ og:image.png generated successfully using canvas');
    console.log(`  Dimensions: ${width}x${height}`);
    console.log(`  Size: ${(buffer.length / 1024).toFixed(2)} KB`);
  } catch (canvasErr) {
    // Fallback: write SVG and instructions
    fs.writeFileSync(svgPath, svg);
    console.log('✓ og-image.svg created');
    console.log('Note: No PNG library available. Please convert og-image.svg to PNG manually or install sharp/canvas.');
  }
}
