/**
 * Replicable Corporate Recognition Poster Generator
 * Zero Packages, Zero Installations, Zero Backend
 * 100% Client-Side Vanilla JavaScript & HTML5 Canvas
 */

// Configuration Constants
const CANVAS_SIZE = 1080;
const PRIMARY_GREEN = '#008461';
const WHITE = '#FFFFFF';

// Template Coordinates (relative to 1080x1080)
const COORDS = {
  // Portrait Frame: Left 6%, Top 14%, Width 39%, Bottom 78% (Height 64%)
  frame: {
    x: CANVAS_SIZE * 0.06,      // 64.8 px
    y: CANVAS_SIZE * 0.14,      // 151.2 px
    w: CANVAS_SIZE * 0.39,      // 421.2 px
    h: CANVAS_SIZE * 0.64,      // 691.2 px (bottom = 842.4 px = 78%)
    topLeftRadius: 92,          // heavily rounded top-left corner
  },
  // Right-Side Text Column (starts at X: ~50.5% = 545px, right margin: 94% = 1015px, width = 470px)
  textColumn: {
    x: CANVAS_SIZE * 0.505,     // 545.4 px (left aligned right column)
    maxWidth: CANVAS_SIZE * 0.435, // 470 px (safe margin before right border)
  },
  // Header: "Congratulating!"
  header: {
    x: CANVAS_SIZE * 0.505,     // 545.4 px
    y: CANVAS_SIZE * 0.215,     // 232 px
  },
  // Recipient Name
  name: {
    x: CANVAS_SIZE * 0.505,     // 545.4 px
    y: CANVAS_SIZE * 0.335,     // 362 px
  },
  // Location Line
  location: {
    x: CANVAS_SIZE * 0.505,     // 545.4 px
    y: CANVAS_SIZE * 0.380,     // 410 px
  },
  // Generated Headline Copies (Copy 1 & Copy 2)
  copyBlock: {
    x: CANVAS_SIZE * 0.505,     // 545.4 px
    y: CANVAS_SIZE * 0.485,     // 524 px
    lineGap: 54,
  },
  // Bottom Box: Left 6%, Right 94%, Top 82%, Bottom 92%
  bottomBox: {
    x: CANVAS_SIZE * 0.06,      // 64.8 px
    y: CANVAS_SIZE * 0.82,      // 885.6 px
    w: CANVAS_SIZE * 0.88,      // 950.4 px (94% - 6%)
    h: CANVAS_SIZE * 0.10,      // 108 px (92% - 82%)
    radius: 24,
    text: "Let’s Replicate This Success!"
  }
};

// Application State
const state = {
  name: "Sarah Jenkins",
  location: "Chicago Office",
  reason: "Sold 200 policies in 2 days",
  copy1: "Sold 200 Policies in 2 Days",
  copy2: "Delivered Exceptional Sales Momentum",
  image: null,
  imageSrc: null,
  imageScale: 1.0,
  imagePanX: 0,
  imagePanY: 0,
  isDragging: false,
  dragStartX: 0,
  dragStartY: 0,
  initialPanX: 0,
  initialPanY: 0,
  customCopyEdited: false,
  confettiSeed: 42
};

// Pre-computed Confetti Vector Elements around the outer border
// Ensures rich, dense outer perimeter border without encroaching on content area
const CONFETTI_ITEMS = generateConfettiElements();

function generateConfettiElements() {
  const items = [];
  const rng = (function(s) {
    return function() {
      s = Math.sin(s) * 10000;
      return s - Math.floor(s);
    };
  })(12345);

  const zones = [
    // Top border zone (x: 0..1080, y: 15..95)
    { xMin: 20, xMax: 1060, yMin: 15, yMax: 95, count: 50 },
    // Bottom border zone (x: 0..1080, y: 1000..1065)
    { xMin: 20, xMax: 1060, yMin: 1000, yMax: 1065, count: 40 },
    // Left border zone (x: 10..55, y: 100..990)
    { xMin: 10, xMax: 54, yMin: 100, yMax: 990, count: 35 },
    // Right border zone (x: 1030..1070, y: 100..990)
    { xMin: 1030, xMax: 1070, yMin: 100, yMax: 990, count: 35 },
    // Top-Left corner cluster
    { xMin: 15, xMax: 120, yMin: 15, yMax: 120, count: 20 },
    // Top-Right corner cluster
    { xMin: 980, xMax: 1065, yMin: 15, yMax: 95, count: 18 },
    // Bottom-Left corner cluster
    { xMin: 15, xMax: 120, yMin: 950, yMax: 1065, count: 18 },
    // Bottom-Right corner cluster
    { xMin: 980, xMax: 1065, yMin: 960, yMax: 1065, count: 18 },
  ];

  zones.forEach((zone) => {
    for (let i = 0; i < zone.count; i++) {
      const x = zone.xMin + rng() * (zone.xMax - zone.xMin);
      const y = zone.yMin + rng() * (zone.yMax - zone.yMin);
      const typeRoll = rng();
      
      if (typeRoll < 0.35) {
        // 5-point star
        items.push({
          type: 'star',
          x, y,
          size: 4 + rng() * 10,
          rotation: rng() * Math.PI * 2
        });
      } else if (typeRoll < 0.65) {
        // Dot (circle)
        items.push({
          type: 'dot',
          x, y,
          radius: 1.8 + rng() * 4.5
        });
      } else if (typeRoll < 0.85) {
        // Irregular diamond / sparkle
        items.push({
          type: 'sparkle',
          x, y,
          size: 3 + rng() * 6,
          rotation: rng() * Math.PI
        });
      } else {
        // Curled/cursive streamer ribbon
        items.push({
          type: 'streamer',
          x, y,
          len: 12 + rng() * 24,
          curve: (rng() - 0.5) * 40,
          angle: rng() * Math.PI * 2,
          width: 1.2 + rng() * 1.5
        });
      }
    }
  });

  return items;
}

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  setupDomReferences();
  setupEventListeners();
  loadSample(0);

  // Re-render when external Google Fonts are loaded
  if (document.fonts) {
    document.fonts.ready.then(() => {
      render();
    });
  }
});

let dom = {};

function setupDomReferences() {
  dom = {
    canvas: document.getElementById('posterCanvas'),
    inputName: document.getElementById('inputName'),
    inputLocation: document.getElementById('inputLocation'),
    inputReason: document.getElementById('inputReason'),
    inputCopy1: document.getElementById('inputCopy1'),
    inputCopy2: document.getElementById('inputCopy2'),
    fileInput: document.getElementById('fileInput'),
    dropZone: document.getElementById('dropZone'),
    scaleSlider: document.getElementById('scaleSlider'),
    scaleValue: document.getElementById('scaleValue'),
    panXSlider: document.getElementById('panXSlider'),
    panYSlider: document.getElementById('panYSlider'),
    btnResetPos: document.getElementById('btnResetPos'),
    btnDownload: document.getElementById('btnDownload'),
    btnCopyImage: document.getElementById('btnCopyImage'),
    btnPrint: document.getElementById('btnPrint'),
    sample1Btn: document.getElementById('sample1Btn'),
    sample2Btn: document.getElementById('sample2Btn'),
    suggestionsContainer: document.getElementById('suggestionsContainer'),
    toast: document.getElementById('toast')
  };
}

function setupEventListeners() {
  // Input fields synchronization
  dom.inputName.addEventListener('input', (e) => {
    state.name = e.target.value;
    render();
  });

  dom.inputLocation.addEventListener('input', (e) => {
    state.location = e.target.value;
    render();
  });

  dom.inputReason.addEventListener('input', (e) => {
    state.reason = e.target.value;
    if (!state.customCopyEdited) {
      generateHeadlines(state.reason);
    } else {
      updateSuggestionChips(state.reason);
    }
    render();
  });

  dom.inputCopy1.addEventListener('input', (e) => {
    state.copy1 = e.target.value;
    state.customCopyEdited = true;
    render();
  });

  dom.inputCopy2.addEventListener('input', (e) => {
    state.copy2 = e.target.value;
    state.customCopyEdited = true;
    render();
  });

  // Image upload handling
  dom.dropZone.addEventListener('click', () => dom.fileInput.click());
  dom.fileInput.addEventListener('change', handleFileSelect);

  dom.dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dom.dropZone.classList.add('drag-over');
  });

  dom.dropZone.addEventListener('dragleave', () => {
    dom.dropZone.classList.remove('drag-over');
  });

  dom.dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dom.dropZone.classList.remove('drag-over');
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImageFile(e.dataTransfer.files[0]);
    }
  });

  // Sliders
  dom.scaleSlider.addEventListener('input', (e) => {
    state.imageScale = parseFloat(e.target.value);
    dom.scaleValue.textContent = `${Math.round(state.imageScale * 100)}%`;
    render();
  });

  dom.panXSlider.addEventListener('input', (e) => {
    state.imagePanX = parseInt(e.target.value, 10);
    render();
  });

  dom.panYSlider.addEventListener('input', (e) => {
    state.imagePanY = parseInt(e.target.value, 10);
    render();
  });

  dom.btnResetPos.addEventListener('click', () => {
    state.imageScale = 1.0;
    state.imagePanX = 0;
    state.imagePanY = 0;
    dom.scaleSlider.value = 1.0;
    dom.scaleValue.textContent = '100%';
    dom.panXSlider.value = 0;
    dom.panYSlider.value = 0;
    render();
  });

  // Sample Presets
  dom.sample1Btn.addEventListener('click', () => loadSample(0));
  dom.sample2Btn.addEventListener('click', () => loadSample(1));

  // Export Buttons
  dom.btnDownload.addEventListener('click', downloadPoster);
  dom.btnCopyImage.addEventListener('click', copyImageToClipboard);
  dom.btnPrint.addEventListener('click', printPoster);

  // Direct Canvas Drag to Pan
  setupCanvasDrag();
}

function setupCanvasDrag() {
  const canvas = dom.canvas;

  canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const scale = CANVAS_SIZE / rect.width;
    const clickX = (e.clientX - rect.left) * scale;
    const clickY = (e.clientY - rect.top) * scale;

    // Check if clicked inside portrait frame
    const f = COORDS.frame;
    if (clickX >= f.x && clickX <= f.x + f.w && clickY >= f.y && clickY <= f.y + f.h) {
      state.isDragging = true;
      state.dragStartX = e.clientX;
      state.dragStartY = e.clientY;
      state.initialPanX = state.imagePanX;
      state.initialPanY = state.imagePanY;
      canvas.style.cursor = 'grabbing';
    }
  });

  window.addEventListener('mousemove', (e) => {
    if (!state.isDragging) return;
    const rect = dom.canvas.getBoundingClientRect();
    const scale = CANVAS_SIZE / rect.width;
    const deltaX = (e.clientX - state.dragStartX) * scale;
    const deltaY = (e.clientY - state.dragStartY) * scale;

    state.imagePanX = Math.round(state.initialPanX + deltaX);
    state.imagePanY = Math.round(state.initialPanY + deltaY);

    dom.panXSlider.value = state.imagePanX;
    dom.panYSlider.value = state.imagePanY;
    render();
  });

  window.addEventListener('mouseup', () => {
    if (state.isDragging) {
      state.isDragging = false;
      dom.canvas.style.cursor = 'crosshair';
    }
  });

  // Mouse wheel zoom over frame
  canvas.addEventListener('wheel', (e) => {
    const rect = canvas.getBoundingClientRect();
    const scale = CANVAS_SIZE / rect.width;
    const cursorX = (e.clientX - rect.left) * scale;
    const cursorY = (e.clientY - rect.top) * scale;
    const f = COORDS.frame;

    if (cursorX >= f.x && cursorX <= f.x + f.w && cursorY >= f.y && cursorY <= f.y + f.h) {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 0.05 : -0.05;
      let newScale = Math.min(Math.max(state.imageScale + zoomFactor, 0.4), 3.0);
      newScale = Math.round(newScale * 100) / 100;
      state.imageScale = newScale;
      dom.scaleSlider.value = newScale;
      dom.scaleValue.textContent = `${Math.round(newScale * 100)}%`;
      render();
    }
  }, { passive: false });
}

function handleFileSelect(e) {
  if (e.target.files && e.target.files[0]) {
    processImageFile(e.target.files[0]);
  }
}

function processImageFile(file) {
  if (!file.type.startsWith('image/')) {
    showToast('Please upload a valid image file (PNG, JPG, WebP, SVG).');
    return;
  }

  const reader = new FileReader();
  reader.onload = (event) => {
    loadImage(event.target.result);
  };
  reader.readAsDataURL(file);
}

function loadImage(src) {
  const img = new Image();
  img.onload = () => {
    state.image = img;
    state.imageSrc = src;
    state.imagePanX = 0;
    state.imagePanY = 0;
    state.imageScale = 1.0;
    dom.scaleSlider.value = 1.0;
    dom.scaleValue.textContent = '100%';
    dom.panXSlider.value = 0;
    dom.panYSlider.value = 0;
    render();
    showToast('Portrait image loaded successfully!');
  };
  img.onerror = () => {
    showToast('Could not load the image. Please try another file.');
  };
  img.src = src;
}

function loadSample(index) {
  if (!SAMPLE_PORTRAITS || !SAMPLE_PORTRAITS[index]) return;
  const sample = SAMPLE_PORTRAITS[index];

  state.name = sample.name;
  state.location = sample.location;
  state.reason = sample.reason;
  state.copy1 = sample.copy1;
  state.copy2 = sample.copy2;
  state.customCopyEdited = false;

  dom.inputName.value = state.name;
  dom.inputLocation.value = state.location;
  dom.inputReason.value = state.reason;
  dom.inputCopy1.value = state.copy1;
  dom.inputCopy2.value = state.copy2;

  updateSuggestionChips(state.reason);
  loadImage(sample.svg);
}

/**
 * Intelligent Offline Headline Generator
 * Analyzes the user's "Reason for success" and produces:
 * Copy 1: Concise achievement-focused headline (<= 10 words)
 * Copy 2: Concise impact/outcome-focused headline (<= 10 words)
 */
function generateHeadlines(rawReason) {
  if (!rawReason || rawReason.trim().length === 0) {
    state.copy1 = "Outstanding Achievement";
    state.copy2 = "Delivered Exceptional Business Impact";
    dom.inputCopy1.value = state.copy1;
    dom.inputCopy2.value = state.copy2;
    return;
  }

  const variations = createHeadlineVariations(rawReason);
  const best = variations[0];

  state.copy1 = best.copy1;
  state.copy2 = best.copy2;
  dom.inputCopy1.value = state.copy1;
  dom.inputCopy2.value = state.copy2;

  renderSuggestionChips(variations);
}

function updateSuggestionChips(rawReason) {
  const variations = createHeadlineVariations(rawReason);
  renderSuggestionChips(variations);
}

function renderSuggestionChips(variations) {
  dom.suggestionsContainer.innerHTML = '';
  variations.forEach((v, idx) => {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'suggestion-chip';
    chip.innerHTML = `
      <div class="chip-title">${escapeHtml(v.copy1)}</div>
      <div class="chip-sub">${escapeHtml(v.copy2)}</div>
    `;
    chip.addEventListener('click', () => {
      state.copy1 = v.copy1;
      state.copy2 = v.copy2;
      state.customCopyEdited = true;
      dom.inputCopy1.value = v.copy1;
      dom.inputCopy2.value = v.copy2;
      render();
      showToast('Selected headline variation applied!');
    });
    dom.suggestionsContainer.appendChild(chip);
  });
}

function createHeadlineVariations(reasonText) {
  const cleaned = reasonText.trim().replace(/^["']|["']$/g, '');
  const words = cleaned.split(/\s+/);
  
  // Extract key metrics or numbers if present (e.g. 200, $1.5M, 100%, Q3, 2 days)
  const numbersMatch = cleaned.match(/\b(?:\$\d+[\d.,]*[kKmMbB]?|\d+[\d.,]*%?|\d+\+?)\b/g);
  const timeMatch = cleaned.match(/\b(?:in \d+ \w+|within \d+ \w+|in Q[1-4]|Q[1-4]|\d+ days?|\d+ weeks?|\d+ months?|record time)\b/i);

  // Title Case helper
  const toTitleCase = (str) => {
    return str.replace(/\w\S*/g, (txt) => {
      const lower = txt.toLowerCase();
      if (['in', 'on', 'at', 'to', 'for', 'with', 'by', 'of', 'and', 'a', 'an', 'the'].includes(lower)) {
        return lower;
      }
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }).replace(/^[a-z]/, (c) => c.toUpperCase());
  };

  // Limit to max 10 words
  const trimTo10 = (text) => {
    const w = text.trim().split(/\s+/);
    if (w.length <= 10) return text;
    return w.slice(0, 10).join(' ');
  };

  const variations = [];

  // Variation 1: Direct Polish + Strong Impact
  let v1_c1 = trimTo10(toTitleCase(cleaned));
  let v1_c2 = "Delivered Exceptional Business Impact";

  if (/sale|sold|revenue|deal|contract|pipeline/i.test(cleaned)) {
    v1_c2 = "Delivered Exceptional Sales Momentum";
  } else if (/client|customer|account|onboard/i.test(cleaned)) {
    v1_c2 = "Expanded Strategic Client Partnerships";
  } else if (/code|build|migrat|launch|system|deploy|architect|feature/i.test(cleaned)) {
    v1_c2 = "Accelerated Technical Excellence & Innovation";
  } else if (/team|lead|mentor|manag|recruit|train/i.test(cleaned)) {
    v1_c2 = "Exemplified Outstanding Leadership & Collaboration";
  } else if (/award|win|rank|top|champion/i.test(cleaned)) {
    v1_c2 = "Set New Benchmark for Excellence";
  }

  variations.push({
    copy1: v1_c1,
    copy2: v1_c2
  });

  // Variation 2: Action-Oriented Milestone
  let v2_c1 = v1_c1;
  let v2_c2 = "Driving High-Impact Organizational Value";

  if (numbersMatch && numbersMatch.length > 0) {
    v2_c2 = `Surpassed Performance Benchmarks`;
  }
  if (timeMatch) {
    v2_c2 = `Executed with Unmatched Speed & Quality`;
  }

  variations.push({
    copy1: `Achieved ${v1_c1}`.split(/\s+/).slice(0, 10).join(' '),
    copy2: v2_c2
  });

  // Variation 3: Executive Focus
  variations.push({
    copy1: v1_c1,
    copy2: "Elevating Team Performance and Success"
  });

  // Variation 4: Momentum & Growth
  variations.push({
    copy1: v1_c1,
    copy2: "Demonstrating Relentless Drive and Precision"
  });

  return variations;
}

/**
 * Main Canvas Render Loop
 * Paints all elements in exact compliance with Master Prompt
 */
function render() {
  const canvas = dom.canvas;
  const ctx = canvas.getContext('2d');

  // Set physical canvas dimensions
  canvas.width = CANVAS_SIZE;
  canvas.height = CANVAS_SIZE;

  // 1. Pure White Background
  ctx.fillStyle = WHITE;
  ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

  // 2. Confetti Border (Outer perimeter only, #008461)
  drawConfettiBorder(ctx);

  // 3. Left Portrait Frame with Asymmetrical Corner
  drawPortraitFrame(ctx);

  // 4. Header Text: "Congratulating!"
  drawHeaderText(ctx);

  // 5. Success Recipient Name & Location Line
  drawRecipientDetails(ctx);

  // 6. Primary Success Message (Copy 1 & Copy 2)
  drawHeadlineCopies(ctx);

  // 7. Fixed Bottom Success Statement Box
  drawBottomBox(ctx);
}

/**
 * 2. Draw Confetti Border
 * Only around the outer perimeter edges in strict #008461
 */
function drawConfettiBorder(ctx) {
  ctx.save();
  ctx.fillStyle = PRIMARY_GREEN;
  ctx.strokeStyle = PRIMARY_GREEN;

  CONFETTI_ITEMS.forEach((item) => {
    if (item.type === 'star') {
      drawStar(ctx, item.x, item.y, 5, item.size, item.size * 0.45, item.rotation);
    } else if (item.type === 'dot') {
      ctx.beginPath();
      ctx.arc(item.x, item.y, item.radius, 0, Math.PI * 2);
      ctx.fill();
    } else if (item.type === 'sparkle') {
      drawSparkle(ctx, item.x, item.y, item.size, item.rotation);
    } else if (item.type === 'streamer') {
      drawStreamer(ctx, item.x, item.y, item.len, item.curve, item.angle, item.width);
    }
  });

  ctx.restore();
}

function drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius, rotation) {
  let rot = (Math.PI / 2) * 3 + rotation;
  let x = cx;
  let y = cy;
  const step = Math.PI / spikes;

  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);
  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius;
    y = cy + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y);
    rot += step;

    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }
  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
  ctx.fill();
}

function drawSparkle(ctx, x, y, size, rotation) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.beginPath();
  ctx.moveTo(0, -size);
  ctx.quadraticCurveTo(0, 0, size, 0);
  ctx.quadraticCurveTo(0, 0, 0, size);
  ctx.quadraticCurveTo(0, 0, -size, 0);
  ctx.quadraticCurveTo(0, 0, 0, -size);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawStreamer(ctx, x, y, len, curve, angle, lineWidth) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.lineWidth = lineWidth;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(len * 0.3, curve, len * 0.7, -curve, len, curve * 0.5);
  ctx.stroke();
  ctx.restore();
}

/**
 * 3. Draw Left Portrait Frame & Image
 * Geometry: Asymmetrical corner (Top-Left heavily rounded, other 3 corners sharp 90°)
 * Frame Fill: #008461 solid flat
 */
function drawPortraitFrame(ctx) {
  const f = COORDS.frame;

  ctx.save();

  // Create Asymmetrical Path
  createAsymmetricalFramePath(ctx, f.x, f.y, f.w, f.h, f.topLeftRadius);

  // Fill frame background with solid flat #008461
  ctx.fillStyle = PRIMARY_GREEN;
  ctx.fill();

  // Clip content strictly inside this asymmetrical frame
  ctx.clip();

  // Draw user image if available
  if (state.image) {
    const img = state.image;
    // Calculate aspect cover fitting inside frame
    const imgAspect = img.width / img.height;
    const frameAspect = f.w / f.h;
    
    let drawW, drawH;
    if (imgAspect > frameAspect) {
      drawH = f.h;
      drawW = f.h * imgAspect;
    } else {
      drawW = f.w;
      drawH = f.w / imgAspect;
    }

    drawW *= state.imageScale;
    drawH *= state.imageScale;

    // Centered base position + user pan offsets
    const drawX = f.x + (f.w - drawW) / 2 + state.imagePanX;
    const drawY = f.y + (f.h - drawH) / 2 + state.imagePanY;

    ctx.drawImage(img, drawX, drawY, drawW, drawH);
  }

  ctx.restore();
}

function createAsymmetricalFramePath(ctx, x, y, w, h, r) {
  ctx.beginPath();
  // Start after the top-left rounded arc
  ctx.moveTo(x + r, y);
  // Top-Right corner (sharp 90°)
  ctx.lineTo(x + w, y);
  // Bottom-Right corner (sharp 90°)
  ctx.lineTo(x + w, y + h);
  // Bottom-Left corner (sharp 90°)
  ctx.lineTo(x, y + h);
  // Line up to start of top-left curve
  ctx.lineTo(x, y + r);
  // Top-Left convex arc
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

/**
 * 4. Header: "Congratulating!"
 * Large cursive / script font in #008461
 */
function drawHeaderText(ctx) {
  const h = COORDS.header;
  const maxWidth = COORDS.textColumn.maxWidth;

  ctx.save();
  ctx.fillStyle = PRIMARY_GREEN;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';

  // Elegant cursive corporate script
  let fontSize = 74;
  ctx.font = `600 ${fontSize}px "Great Vibes", "Playball", "Alex Brush", "Brush Script MT", cursive`;

  while (ctx.measureText("Congratulating!").width > maxWidth && fontSize > 46) {
    fontSize -= 1;
    ctx.font = `600 ${fontSize}px "Great Vibes", "Playball", "Alex Brush", "Brush Script MT", cursive`;
  }

  ctx.fillText("Congratulating!", h.x, h.y);
  ctx.restore();
}

/**
 * 5. Recipient Name & Location Line
 * Recipient Name: Large Bold Sans-Serif (#008461)
 * Location: "From [LOCATION]" - "From" in Italic, [LOCATION] in Bold Sans-Serif
 */
function drawRecipientDetails(ctx) {
  const n = COORDS.name;
  const l = COORDS.location;
  const maxWidth = COORDS.textColumn.maxWidth;

  ctx.save();
  ctx.fillStyle = PRIMARY_GREEN;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';

  // Recipient Name with dynamic auto-fit
  const recipientName = state.name ? state.name.trim() : "Recipient Name";
  let nameFontSize = 36;
  ctx.font = `700 ${nameFontSize}px "Montserrat", "Helvetica Neue", Arial, sans-serif`;

  while (ctx.measureText(recipientName).width > maxWidth && nameFontSize > 22) {
    nameFontSize -= 1;
    ctx.font = `700 ${nameFontSize}px "Montserrat", "Helvetica Neue", Arial, sans-serif`;
  }
  ctx.fillText(recipientName, n.x, n.y);

  // Location Line: "From [LOCATION]"
  const locText = state.location ? state.location.trim() : "Location";
  let locFontSize = 22;
  const prefix = "From ";

  ctx.font = `italic 400 ${locFontSize}px "Montserrat", "Helvetica Neue", Arial, sans-serif`;
  let prefixWidth = ctx.measureText(prefix).width;
  ctx.font = `700 ${locFontSize}px "Montserrat", "Helvetica Neue", Arial, sans-serif`;
  let totalWidth = prefixWidth + ctx.measureText(locText).width;

  while (totalWidth > maxWidth && locFontSize > 15) {
    locFontSize -= 1;
    ctx.font = `italic 400 ${locFontSize}px "Montserrat", "Helvetica Neue", Arial, sans-serif`;
    prefixWidth = ctx.measureText(prefix).width;
    ctx.font = `700 ${locFontSize}px "Montserrat", "Helvetica Neue", Arial, sans-serif`;
    totalWidth = prefixWidth + ctx.measureText(locText).width;
  }

  // Render "From " in italic
  ctx.font = `italic 400 ${locFontSize}px "Montserrat", "Helvetica Neue", Arial, sans-serif`;
  ctx.fillText(prefix, l.x, l.y);

  // Render location in bold
  ctx.font = `700 ${locFontSize}px "Montserrat", "Helvetica Neue", Arial, sans-serif`;
  ctx.fillText(locText, l.x + prefixWidth, l.y);

  ctx.restore();
}

/**
 * 6. Primary Success Message (AI Generated Copy 1 & Copy 2)
 * Placement: Left aligned with right column
 * Large bold sans-serif, #008461, two separate lines with auto-fit / wrap
 */
function drawHeadlineCopies(ctx) {
  const c = COORDS.copyBlock;
  const maxWidth = COORDS.textColumn.maxWidth;

  ctx.save();
  ctx.fillStyle = PRIMARY_GREEN;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';

  const copy1 = state.copy1 ? state.copy1.trim() : "";
  const copy2 = state.copy2 ? state.copy2.trim() : "";

  let currentY = c.y;

  // Render Copy 1 (Achievement Headline)
  if (copy1) {
    const res1 = drawFittedHeadline(ctx, copy1, c.x, currentY, maxWidth);
    currentY = res1.nextY;
  }

  // Render Copy 2 (Impact Headline)
  if (copy2) {
    drawFittedHeadline(ctx, copy2, c.x, currentY, maxWidth);
  }

  ctx.restore();
}

/**
 * Renders a headline cleanly without overflow
 * Scales font down smoothly, or wraps into 2 lines if needed
 */
function drawFittedHeadline(ctx, text, x, y, maxWidth) {
  let fontSize = 38;
  const minSingleLineSize = 27;

  ctx.font = `700 ${fontSize}px "Montserrat", "Helvetica Neue", Arial, sans-serif`;
  let measured = ctx.measureText(text).width;

  // 1. Try scaling down font size smoothly
  while (measured > maxWidth && fontSize > minSingleLineSize) {
    fontSize -= 1;
    ctx.font = `700 ${fontSize}px "Montserrat", "Helvetica Neue", Arial, sans-serif`;
    measured = ctx.measureText(text).width;
  }

  // If it fits on one line
  if (measured <= maxWidth) {
    ctx.fillText(text, x, y);
    return { linesCount: 1, nextY: y + 54 };
  }

  // 2. Otherwise, wrap into 2 lines cleanly
  const words = text.split(/\s+/);
  let line1 = '';
  let line2 = '';
  let wrapFontSize = 32;

  ctx.font = `700 ${wrapFontSize}px "Montserrat", "Helvetica Neue", Arial, sans-serif`;

  for (let i = 0; i < words.length; i++) {
    const testLine = line1 ? `${line1} ${words[i]}` : words[i];
    if (ctx.measureText(testLine).width <= maxWidth || !line1) {
      line1 = testLine;
    } else {
      line2 = words.slice(i).join(' ');
      break;
    }
  }

  // Scale line2 if needed
  let l2Size = wrapFontSize;
  ctx.font = `700 ${l2Size}px "Montserrat", "Helvetica Neue", Arial, sans-serif`;
  while (ctx.measureText(line2).width > maxWidth && l2Size > 20) {
    l2Size -= 1;
    ctx.font = `700 ${l2Size}px "Montserrat", "Helvetica Neue", Arial, sans-serif`;
  }

  ctx.font = `700 ${wrapFontSize}px "Montserrat", "Helvetica Neue", Arial, sans-serif`;
  ctx.fillText(line1, x, y);

  const nextLineY = y + wrapFontSize * 1.25;
  ctx.font = `700 ${l2Size}px "Montserrat", "Helvetica Neue", Arial, sans-serif`;
  ctx.fillText(line2, x, nextLineY);

  return { linesCount: 2, nextY: nextLineY + 50 };
}

/**
 * 7. Fixed Bottom Success Statement Box
 * Wide rounded rectangle in solid #008461 with White Bold Italic text
 */
function drawBottomBox(ctx) {
  const b = COORDS.bottomBox;

  ctx.save();

  // Draw Rounded Box
  ctx.fillStyle = PRIMARY_GREEN;
  drawRoundedRect(ctx, b.x, b.y, b.w, b.h, b.radius);
  ctx.fill();

  // Draw Fixed Text: "Let’s Replicate This Success!"
  ctx.fillStyle = WHITE;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = 'italic 700 46px "Montserrat", "Helvetica Neue", Arial, sans-serif';

  const centerX = b.x + b.w / 2;
  const centerY = b.y + b.h / 2 + 1; // minor vertical optical centering

  ctx.fillText(b.text, centerX, centerY);

  ctx.restore();
}

function drawRoundedRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

/**
 * Utility: High-Resolution Poster Download
 */
function downloadPoster() {
  const canvas = dom.canvas;
  const link = document.createElement('a');
  const safeName = (state.name || 'Recipient').replace(/[^a-zA-Z0-9_-]/g, '_');
  link.download = `Recognition_Poster_${safeName}.png`;
  link.href = canvas.toDataURL('image/png', 1.0);
  link.click();
  showToast('High-resolution (1080x1080) poster downloaded!');
}

/**
 * Utility: Copy Canvas Image to Clipboard
 */
async function copyImageToClipboard() {
  try {
    const canvas = dom.canvas;
    canvas.toBlob(async (blob) => {
      if (!blob) {
        showToast('Could not generate image blob.');
        return;
      }
      try {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        showToast('Poster copied to clipboard! Paste directly into Slack/Teams/Email.');
      } catch (err) {
        showToast('Clipboard copy not supported by browser. Please use Download.');
      }
    }, 'image/png', 1.0);
  } catch (err) {
    showToast('Failed to copy to clipboard.');
  }
}

/**
 * Utility: Print Poster
 */
function printPoster() {
  const dataUrl = dom.canvas.toDataURL('image/png', 1.0);
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    showToast('Pop-up blocked. Please allow pop-ups to print.');
    return;
  }
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Print Recognition Poster</title>
        <style>
          @page { size: 1080px 1080px; margin: 0; }
          body { margin: 0; display: flex; align-items: center; justify-content: center; height: 100vh; background: #fff; }
          img { max-width: 100%; max-height: 100%; object-fit: contain; }
        </style>
      </head>
      <body>
        <img src="${dataUrl}" onload="window.print();window.close();" />
      </body>
    </html>
  `);
  printWindow.document.close();
}

/**
 * Toast Notification Helper
 */
function showToast(message) {
  const toast = dom.toast;
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
