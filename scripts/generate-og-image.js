#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Create SVG with Peru design - octagon with flag and text layout
const width = 1200;
const height = 630;

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <!-- Red background (Peru color #CF142B) -->
  <rect width="${width}" height="${height}" fill="#CF142B"/>

  <!-- Cream/beige left section background -->
  <rect x="0" y="0" width="700" height="${height}" fill="#F5F1ED"/>

  <!-- Left section content -->
  <!-- "ELECCIONES 2026" label -->
  <text x="70" y="80" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="#CF142B" letter-spacing="3">
    ELECCIONES 2026
  </text>

  <!-- Main title "OCTÓGONOS" -->
  <text x="70" y="180" font-family="Arial, sans-serif" font-size="82" font-weight="900" fill="#000000">
    OCTÓGONOS
  </text>

  <!-- Subtitle "DE CANDIDATOS" -->
  <text x="70" y="260" font-family="Arial, sans-serif" font-size="78" font-weight="900" fill="#888888">
    DE CANDIDATOS
  </text>

  <!-- "+ IA" -->
  <text x="70" y="330" font-family="Arial, sans-serif" font-size="76" font-weight="bold" fill="#CF142B">
    + IA
  </text>

  <!-- Red horizontal line -->
  <rect x="70" y="350" width="100" height="4" fill="#CF142B"/>

  <!-- Description text -->
  <text x="70" y="400" font-family="Arial, sans-serif" font-size="16" font-weight="normal" fill="#666666">
    Toda la info de cada candidato
  </text>
  <text x="70" y="425" font-family="Arial, sans-serif" font-size="16" font-weight="normal" fill="#666666">
    presidencial en un solo lugar.
  </text>
  <text x="70" y="450" font-family="Arial, sans-serif" font-size="16" font-weight="normal" fill="#666666">
    Educación, historial legal y plan
  </text>
  <text x="70" y="475" font-family="Arial, sans-serif" font-size="16" font-weight="normal" fill="#666666">
    de gobierno — con fuentes oficiales.
  </text>

  <!-- Badge: "IA + fuentes públicas oficiales" -->
  <circle cx="85" cy="545" r="7" fill="#CF142B"/>
  <text x="105" y="550" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#333333">
    IA + fuentes públicas oficiales
  </text>

  <!-- Right section - Octagon with Peru flag (rounded corners) -->
  <!-- Black octagon background with rounded corners -->
  <g id="octagon">
    <path d="M 920,140 L 1020,100 Q 1080,100 1110,140 L 1150,240 Q 1160,280 1130,310 L 1030,350 Q 970,370 920,350 L 820,310 Q 790,280 800,240 Z" fill="#000000"/>
  </g>

  <!-- Peru flag inside octagon (vertical stripes: red-white-red) -->
  <rect x="895" y="195" width="45" height="140" fill="#CF142B" rx="8"/>
  <rect x="945" y="195" width="60" height="140" fill="white"/>
  <rect x="1010" y="195" width="45" height="140" fill="#CF142B" rx="8"/>

  <!-- Red button "EXPLORAR CANDIDATOS" at bottom right -->
  <rect x="700" y="530" width="450" height="65" fill="#CF142B" rx="12"/>
  <text x="925" y="575" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="white" text-anchor="middle">
    EXPLORAR CANDIDATOS
  </text>

  <!-- Demo text at bottom left -->
  <text x="70" y="600" font-family="Arial, sans-serif" font-size="14" font-weight="normal" fill="#999999">
    Demo: octogonos.vercel.app
  </text>
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
