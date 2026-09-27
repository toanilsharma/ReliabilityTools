/**
 * 1200x630 Share Card Generator
 * Renders high-resolution social share cards for tool result states
 * compatible with Open Graph (og:image) and Twitter Card formats (1200x630px, 1.91:1 ratio).
 */

export interface ShareCardOptions {
  toolName: string;
  results: Record<string, string | number>;
  inputs?: Record<string, string | number>;
  url?: string;
  category?: string;
  timestamp?: string;
}

/**
 * Draws the vector shield logo with inner checkmark/pulse
 */
function drawLogo(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  ctx.save();
  ctx.translate(x, y);

  // Outer glowing shield rounded box
  ctx.beginPath();
  const radius = size * 0.22;
  const w = size;
  const h = size;

  // Background rounded rectangle for shield icon
  ctx.roundRect(0, 0, w, h, radius);
  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, '#06b6d4'); // cyan-500
  grad.addColorStop(1, '#0284c7'); // sky-600
  ctx.fillStyle = grad;
  ctx.fill();

  // Shield path inside
  ctx.beginPath();
  const pad = size * 0.2;
  const sx = pad;
  const sy = pad;
  const sw = w - pad * 2;
  const sh = h - pad * 2;

  ctx.moveTo(sx + sw * 0.5, sy);
  ctx.lineTo(sx + sw, sy + sh * 0.25);
  ctx.quadraticCurveTo(sx + sw, sy + sh * 0.75, sx + sw * 0.5, sy + sh);
  ctx.quadraticCurveTo(sx, sy + sh * 0.75, sx, sy + sh * 0.25);
  ctx.closePath();
  ctx.fillStyle = '#0f172a'; // dark slate
  ctx.fill();

  // Checkmark inside shield
  ctx.beginPath();
  ctx.moveTo(sx + sw * 0.28, sy + sh * 0.52);
  ctx.lineTo(sx + sw * 0.45, sy + sh * 0.7);
  ctx.lineTo(sx + sw * 0.75, sy + sh * 0.35);
  ctx.strokeStyle = '#22d3ee'; // bright cyan
  ctx.lineWidth = size * 0.09;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.stroke();

  ctx.restore();
}

/**
 * Renders the 1200x630 share card on an HTML5 canvas element
 */
export async function renderShareCard(options: ShareCardOptions): Promise<HTMLCanvasElement> {
  const {
    toolName,
    results,
    inputs = {},
    url = 'reliabilitytools.co.in',
    category = 'INDUSTRIAL RELIABILITY CALCULATOR',
    timestamp = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  } = options;

  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 630;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Canvas 2D context is not available');
  }

  // 1. Deep Obsidian / Dark Slate Background Gradient
  const bgGrad = ctx.createLinearGradient(0, 0, 1200, 630);
  bgGrad.addColorStop(0, '#090d16');
  bgGrad.addColorStop(0.5, '#0f172a');
  bgGrad.addColorStop(1, '#131d33');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1200, 630);

  // 2. Technical Radial Glows (Cyan & Emerald)
  const cyanGlow = ctx.createRadialGradient(1050, 120, 10, 1050, 120, 500);
  cyanGlow.addColorStop(0, 'rgba(6, 182, 212, 0.22)');
  cyanGlow.addColorStop(1, 'rgba(6, 182, 212, 0)');
  ctx.fillStyle = cyanGlow;
  ctx.fillRect(0, 0, 1200, 630);

  const emeraldGlow = ctx.createRadialGradient(120, 520, 10, 120, 520, 450);
  emeraldGlow.addColorStop(0, 'rgba(16, 185, 129, 0.15)');
  emeraldGlow.addColorStop(1, 'rgba(16, 185, 129, 0)');
  ctx.fillStyle = emeraldGlow;
  ctx.fillRect(0, 0, 1200, 630);

  // 3. Subtle Engineering Grid Pattern
  ctx.strokeStyle = 'rgba(6, 182, 212, 0.04)';
  ctx.lineWidth = 1;
  const gridSize = 45;
  for (let x = 0; x < 1200; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 630);
    ctx.stroke();
  }
  for (let y = 0; y < 630; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(1200, y);
    ctx.stroke();
  }

  // 4. Exterior Accent Border & Tech Corner Bracket
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.15)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(32, 32, 1200 - 64, 630 - 64);

  // Corner brackets
  const drawCorner = (cx: number, cy: number, dx: number, dy: number) => {
    ctx.beginPath();
    ctx.moveTo(cx + dx * 24, cy);
    ctx.lineTo(cx, cy);
    ctx.lineTo(cx, cy + dy * 24);
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 3;
    ctx.stroke();
  };
  drawCorner(32, 32, 1, 1);
  drawCorner(1200 - 32, 32, -1, 1);
  drawCorner(32, 630 - 32, 1, -1);
  drawCorner(1200 - 32, 630 - 32, -1, -1);

  // 5. Header Brand Bar
  const logoX = 64;
  const logoY = 64;
  drawLogo(ctx, logoX, logoY, 52);

  // Brand Text: "Reliability" (white) + "Tools" (cyan) + ".co.in" (slate)
  ctx.font = 'bold 32px "Inter", "Segoe UI", system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('Reliability', logoX + 66, logoY + 36);

  const brandWidth = ctx.measureText('Reliability').width;
  ctx.fillStyle = '#06b6d4';
  ctx.fillText('Tools', logoX + 66 + brandWidth, logoY + 36);

  const toolsWidth = ctx.measureText('Tools').width;
  ctx.font = 'normal 22px "Inter", "Segoe UI", system-ui, sans-serif';
  ctx.fillStyle = '#64748b';
  ctx.fillText('.co.in', logoX + 66 + brandWidth + toolsWidth, logoY + 34);

  // Top Right Tag / Category Pill
  ctx.font = 'bold 12px "Inter", "Segoe UI", system-ui, sans-serif';
  const categoryText = category.toUpperCase();
  const catMetrics = ctx.measureText(categoryText);
  const pillW = catMetrics.width + 36;
  const pillH = 32;
  const pillX = 1200 - 64 - pillW;
  const pillY = 68;

  ctx.fillStyle = 'rgba(6, 182, 212, 0.1)';
  ctx.beginPath();
  ctx.roundRect(pillX, pillY, pillW, pillH, 16);
  ctx.fill();
  ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Green active pulse dot inside pill
  ctx.beginPath();
  ctx.arc(pillX + 16, pillY + 16, 4, 0, Math.PI * 2);
  ctx.fillStyle = '#10b981';
  ctx.fill();

  ctx.fillStyle = '#22d3ee';
  ctx.fillText(categoryText, pillX + 26, pillY + 20);

  // 6. Tool Title
  ctx.textAlign = 'left';
  ctx.font = 'bold 44px "Inter", "Segoe UI", system-ui, sans-serif';
  ctx.fillStyle = '#f8fafc';
  
  // Truncate title if extremely long
  let displayTitle = toolName;
  if (ctx.measureText(displayTitle).width > 1050) {
    while (ctx.measureText(displayTitle + '...').width > 1050 && displayTitle.length > 10) {
      displayTitle = displayTitle.slice(0, -1);
    }
    displayTitle += '...';
  }
  ctx.fillText(displayTitle, 64, 172);

  // Subtitle / divider
  ctx.font = 'normal 15px "Inter", "Segoe UI", system-ui, sans-serif';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('Official Calculation & Engineering Performance Analysis', 64, 198);

  ctx.beginPath();
  ctx.moveTo(64, 216);
  ctx.lineTo(240, 216);
  ctx.strokeStyle = '#06b6d4';
  ctx.lineWidth = 3;
  ctx.stroke();

  // 7. Results Tiles Grid
  // Pick up to 4 key result values
  const resultEntries = Object.entries(results).slice(0, 4);
  const numCards = Math.max(1, Math.min(resultEntries.length, 4));

  const totalResultsWidth = 1200 - 128; // 1072
  const gap = 16;
  const cardWidth = (totalResultsWidth - (numCards - 1) * gap) / numCards;
  const cardHeight = 190;
  const cardsY = 236;

  resultEntries.forEach(([key, value], idx) => {
    const cardX = 64 + idx * (cardWidth + gap);

    // Card background with glass effect
    const cardGrad = ctx.createLinearGradient(cardX, cardsY, cardX, cardsY + cardHeight);
    cardGrad.addColorStop(0, 'rgba(30, 41, 59, 0.85)');
    cardGrad.addColorStop(1, 'rgba(15, 23, 42, 0.95)');
    ctx.fillStyle = cardGrad;
    ctx.beginPath();
    ctx.roundRect(cardX, cardsY, cardWidth, cardHeight, 16);
    ctx.fill();

    // Card border
    ctx.strokeStyle = idx === 0 ? 'rgba(6, 182, 212, 0.4)' : 'rgba(148, 163, 184, 0.15)';
    ctx.lineWidth = idx === 0 ? 1.5 : 1;
    ctx.stroke();

    // Top subtle highlight line for primary card
    if (idx === 0) {
      ctx.beginPath();
      ctx.moveTo(cardX + 20, cardsY);
      ctx.lineTo(cardX + cardWidth - 20, cardsY);
      ctx.strokeStyle = '#22d3ee';
      ctx.lineWidth = 3;
      ctx.stroke();
    }

    // Metric Label
    ctx.font = 'bold 13px "Inter", "Segoe UI", system-ui, sans-serif';
    ctx.fillStyle = idx === 0 ? '#38bdf8' : '#94a3b8';
    
    // Truncate label if too wide
    let label = key.toUpperCase();
    if (ctx.measureText(label).width > cardWidth - 32) {
      while (ctx.measureText(label + '..').width > cardWidth - 32 && label.length > 5) {
        label = label.slice(0, -1);
      }
      label += '..';
    }
    ctx.fillText(label, cardX + 18, cardsY + 38);

    // Metric Value (Large font)
    const strVal = String(value);
    ctx.font = 'bold 36px "Inter", "Segoe UI", system-ui, sans-serif';
    if (ctx.measureText(strVal).width > cardWidth - 32) {
      ctx.font = 'bold 28px "Inter", "Segoe UI", system-ui, sans-serif';
    }
    if (ctx.measureText(strVal).width > cardWidth - 32) {
      ctx.font = 'bold 22px "Inter", "Segoe UI", system-ui, sans-serif';
    }

    ctx.fillStyle = idx === 0 ? '#22d3ee' : '#ffffff';
    ctx.fillText(strVal, cardX + 18, cardsY + 98);

    // Indicator pill / secondary status inside card
    ctx.font = 'normal 12px "Inter", "Segoe UI", system-ui, sans-serif';
    ctx.fillStyle = '#64748b';
    const subNote = idx === 0 ? '✓ Primary Result' : 'Verified Metric';
    ctx.fillText(subNote, cardX + 18, cardsY + 145);
  });

  // 8. Inputs Summary Pill (if inputs are provided)
  const inputEntries = Object.entries(inputs);
  if (inputEntries.length > 0) {
    const inputSummary = inputEntries
      .slice(0, 3)
      .map(([k, v]) => `${k}: ${v}`)
      .join('   |   ');

    ctx.font = '12px "Inter", "Segoe UI", monospace, sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.fillText(`Inputs: ${inputSummary}`, 64, 460);
  }

  // 9. Footer Bar
  const footerY = 560;

  // Clean horizontal divider
  ctx.beginPath();
  ctx.moveTo(64, footerY - 26);
  ctx.lineTo(1200 - 64, footerY - 26);
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.15)';
  ctx.lineWidth = 1;
  ctx.stroke();

  // URL on Left
  const cleanUrl = url.replace(/^https?:\/\//, '').replace(/\/$/, '');
  ctx.font = 'bold 18px "Inter", "Segoe UI", system-ui, sans-serif';
  ctx.fillStyle = '#38bdf8'; // sky-400
  ctx.fillText(`🌐 ${cleanUrl}`, 64, footerY);

  // Quality Tag / Standard Reference in Center
  ctx.font = 'normal 14px "Inter", "Segoe UI", system-ui, sans-serif';
  ctx.fillStyle = '#94a3b8';
  ctx.textAlign = 'center';
  ctx.fillText('Standard Industrial Engineering Models • IEEE / ISO Compliant', 600, footerY);

  // Timestamp on Right
  ctx.textAlign = 'right';
  ctx.font = 'normal 14px "Inter", "Segoe UI", system-ui, sans-serif';
  ctx.fillStyle = '#64748b';
  ctx.fillText(`Verified: ${timestamp}`, 1200 - 64, footerY);

  return canvas;
}

/**
 * Returns a data URL (PNG) of the 1200x630 share card
 */
export async function generateShareCardDataUrl(options: ShareCardOptions): Promise<string> {
  const canvas = await renderShareCard(options);
  return canvas.toDataURL('image/png', 0.95);
}

/**
 * Returns a Blob of the 1200x630 share card
 */
export async function generateShareCardBlob(options: ShareCardOptions): Promise<Blob> {
  const canvas = await renderShareCard(options);
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error('Failed to generate image blob'));
      }
    }, 'image/png', 0.95);
  });
}

/**
 * Triggers a direct download of the 1200x630 share card as a PNG file
 */
export async function downloadShareCard(options: ShareCardOptions, filename?: string): Promise<void> {
  const dataUrl = await generateShareCardDataUrl(options);
  const cleanName = (options.toolName || 'Reliability-Tool').replace(/[^a-zA-Z0-9_-]/g, '-');
  const safeFilename = filename || `${cleanName}-ShareCard-1200x630.png`;

  const link = document.createElement('a');
  link.download = safeFilename;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
