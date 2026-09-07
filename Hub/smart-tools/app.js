const tools = {
  crop: { title: 'Image cropper', description: 'Frame the perfect composition in seconds.', eyebrow: 'IMAGE TOOL / 01' },
  filters: { title: 'Image filters', description: 'Make every image feel a little more yours.', eyebrow: 'IMAGE TOOL / 02' },
  effects: { title: 'Advanced Effects Studio', description: 'Turn a photograph into a signal, sketch, glow or weathered frame.', eyebrow: 'IMAGE TOOL / 03' },
  templates: { title: 'Template Library', description: 'Place your photograph inside a frame made to share.', eyebrow: 'IMAGE TOOL / 04' },
  compress: { title: 'Image compressor', description: 'Smaller files, same visual quality.', eyebrow: 'IMAGE TOOL / 05' },
  qr: { title: 'QR generator', description: 'Turn a link or message into a scan-ready code.', eyebrow: 'UTILITY / 06' }
};
let currentTool = 'crop';
let sourceImage = null;
let sourceFile = null;
const cropState = { ratio: 'free', zoom: 100, frameWidthScale: 1, frameHeightScale: 1, rotation: 0, offsetX: 0, offsetY: 0, dragging: false, dragMode: null, resizeHandle: '', startX: 0, startY: 0, startOffsetX: 0, startOffsetY: 0, startFrameWidthScale: 1, startFrameHeightScale: 1, startRotation: 0 };
const filterPresets = {
  vintage: { label: 'Vintage', filter: 'sepia(32%) contrast(92%) saturate(78%) brightness(104%)', brightness: 100, contrast: 100, saturation: 100 },
  sepia: { label: 'Sepia', filter: 'sepia(100%) contrast(96%)', brightness: 100, contrast: 100, saturation: 82 },
  warm: { label: 'Warm', filter: 'sepia(18%) saturate(126%) hue-rotate(-8deg)', brightness: 104, contrast: 100, saturation: 112 },
  cool: { label: 'Cool', filter: 'saturate(88%) hue-rotate(18deg) brightness(103%)', brightness: 103, contrast: 100, saturation: 92 },
  noir: { label: 'Noir', filter: 'grayscale(100%) contrast(142%) brightness(88%)', brightness: 100, contrast: 114, saturation: 0 },
  brightness: { label: 'Brightness', filter: 'brightness(132%)', brightness: 100, contrast: 100, saturation: 100 },
  contrast: { label: 'Contrast', filter: 'contrast(142%)', brightness: 100, contrast: 100, saturation: 100 },
  blur: { label: 'Blur', filter: 'blur(2.4px)', brightness: 100, contrast: 100, saturation: 100 },
  sharpen: { label: 'Sharpen', filter: 'contrast(112%)', brightness: 100, contrast: 100, saturation: 100, sharpen: true },
  dramatic: { label: 'Dramatic', filter: 'contrast(136%) saturate(118%) brightness(88%)', brightness: 100, contrast: 108, saturation: 108 }
};
const filterState = { preset: 'vintage', brightness: 100, contrast: 100, saturation: 100, blur: 0, adjustmentsOpen: false };
const compressorState = { quality: 80 };
const qrState = { text: 'https://smarttools.example', size: 220 };
const effectPresets = {
  vhs: { label: 'VHS & Noise', effect: 'vhs' },
  glitch: { label: 'Glitch & RGB', effect: 'glitch' },
  glow: { label: 'Diffuse Glow', effect: 'glow' },
  crystal: { label: 'Crystallize', effect: 'crystal' },
  sketch: { label: 'Pencil Sketch', effect: 'sketch' },
  weather: { label: 'Weather Drip on Blur', effect: 'weather' },
  purple: { label: 'Purple Filter Netting', effect: 'purple' },
  watercolor: { label: 'Watercolor Paint', effect: 'watercolor' }
};
const effectsState = { preset: 'vhs', intensity: 65, grain: 35, adjustmentsOpen: false };
const templatePresets = Object.fromEntries(Array.from({ length: 10 }, (_, index) => {
  const id = `frame-${String(index + 1).padStart(2, '0')}`;
  return [id, { id, label: `Template ${String(index + 1).padStart(2, '0')}`, src: `templates/${id}.png`, image: null }];
}));
const templateState = { preset: 'frame-01', centerX: .5, centerY: .5, scale: .84, rotation: 0, dragging: false, dragMode: '', resizeHandle: '', startX: 0, startY: 0, startCenterX: .5, startCenterY: .5, startScale: .84, startRotation: 0 };
const $ = (selector) => document.querySelector(selector);

lucide.createIcons();

const menuButton = $('#vv-menu-button');
const navLinks = $('#vv-nav-links');
menuButton?.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
});
navLinks?.addEventListener('click', (event) => {
  if (event.target.closest('a')) {
    navLinks.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
  }
});

function showView(tool) {
  const openingTool = tool !== 'dashboard' && !$('#tool-view').classList.contains('active-view');
  if (openingTool || (tool !== 'dashboard' && tool !== currentTool)) {
    showToolPreloader('Loading tool...');
  }
  currentTool = tool;
  setCropGuideVisibility(tool === 'crop');
  const isDashboard = tool === 'dashboard';
  $('#dashboard-view').classList.toggle('active-view', isDashboard);
  $('#tool-view').classList.toggle('active-view', !isDashboard);
  $('#breadcrumb-title').textContent = isDashboard ? 'All tools' : tools[tool].title;
  document.querySelector('.workspace-bar')?.classList.toggle('is-hidden', !isDashboard);
  document.querySelectorAll('.nav-item').forEach((item) => item.classList.toggle('active', item.dataset.tool === tool));
  if (!isDashboard) {
    $('#tool-title').textContent = tools[tool].title;
    $('#tool-description').textContent = tools[tool].description;
    $('#tool-eyebrow').textContent = tools[tool].eyebrow;
    renderControls();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function showToolPreloader(message, callback) {
  const preloader = $('#tool-preloader');
  const label = preloader?.querySelector('.tool-preloader-label');
  if (label) label.textContent = message;
  preloader?.classList.add('is-visible');
  window.setTimeout(() => { preloader?.classList.remove('is-visible'); callback?.(); }, 430);
}

function clearToolSession() {
  sourceImage = null;
  sourceFile = null;
  cropState.ratio = 'free'; cropState.zoom = 100; cropState.frameWidthScale = 1; cropState.frameHeightScale = 1; cropState.rotation = 0; cropState.offsetX = 0; cropState.offsetY = 0; cropState.dragging = false;
  filterState.preset = 'vintage'; filterState.brightness = 100; filterState.contrast = 100; filterState.saturation = 100; filterState.blur = 0; filterState.adjustmentsOpen = false;
  effectsState.preset = 'vhs'; effectsState.intensity = 65; effectsState.grain = 35; effectsState.adjustmentsOpen = false;
  compressorState.quality = 80;
  qrState.text = 'https://smarttools.example'; qrState.size = 220;
  templateState.preset = 'frame-01'; templateState.centerX = .5; templateState.centerY = .5; templateState.scale = .84; templateState.rotation = 0; templateState.dragging = false;
  const input = $('#image-input'); if (input) input.value = '';
  const imageCanvas = $('#image-canvas'); const frameCanvas = $('#frame-canvas');
  imageCanvas?.getContext('2d')?.clearRect(0, 0, imageCanvas.width, imageCanvas.height);
  frameCanvas?.getContext('2d')?.clearRect(0, 0, frameCanvas.width, frameCanvas.height);
  $('#dropzone').style.display = 'flex';
  $('#preview-wrap').style.display = 'none';
  $('#image-meta').textContent = 'READY';
  $('#download-button').disabled = true;
  $('#template-guides')?.classList.remove('is-visible');
}

function exitCurrentTool() {
  const modal = $('#exit-tool-modal');
  if (!modal) return;
  modal.classList.add('is-visible');
  modal.setAttribute('aria-hidden', 'false');
  $('#cancel-exit-tool')?.focus();
}

function confirmExitTool() {
  $('#exit-tool-modal')?.classList.remove('is-visible');
  $('#exit-tool-modal')?.setAttribute('aria-hidden', 'true');
  showToolPreloader('Exiting tool...', () => { clearToolSession(); currentTool = 'dashboard'; showView('dashboard'); });
}

document.addEventListener('click', (event) => {
  const trigger = event.target.closest('[data-tool]');
  if (trigger) showView(trigger.dataset.tool);
});
$('#back-button')?.addEventListener('click', exitCurrentTool);
$('#cancel-exit-tool')?.addEventListener('click', () => { $('#exit-tool-modal')?.classList.remove('is-visible'); $('#exit-tool-modal')?.setAttribute('aria-hidden', 'true'); });
$('#confirm-exit-tool')?.addEventListener('click', confirmExitTool);
$('#exit-tool-modal')?.addEventListener('click', (event) => { if (event.target === $('#exit-tool-modal')) $('#cancel-exit-tool')?.click(); });
$('#browse-button')?.addEventListener('click', () => $('#image-input')?.click());
$('#change-image')?.addEventListener('click', () => $('#image-input')?.click());
$('#image-input')?.addEventListener('change', (event) => handleFile(event.target.files[0]));
$('#dropzone')?.addEventListener('dragover', (event) => { event.preventDefault(); $('#dropzone').classList.add('dragging'); });
$('#dropzone')?.addEventListener('dragleave', () => $('#dropzone')?.classList.remove('dragging'));
$('#dropzone')?.addEventListener('drop', (event) => { event.preventDefault(); handleFile(event.dataTransfer.files[0]); });
$('#reset-button')?.addEventListener('click', resetTool);
$('#download-button')?.addEventListener('click', downloadResult);
document.addEventListener('click', (event) => {
  if (event.target.closest('#reset-composition')) resetTemplateComposition();
});
$('#canvas-frame')?.addEventListener('pointerdown', startCanvasGesture);
$('#canvas-frame')?.addEventListener('pointermove', moveCanvasGesture);
$('#canvas-frame')?.addEventListener('pointerup', endCanvasGesture);
$('#canvas-frame')?.addEventListener('pointercancel', endCanvasGesture);
$('#template-guides')?.addEventListener('pointerdown', startTemplateGesture);
$('#template-guides')?.addEventListener('pointermove', moveTemplateGesture);
$('#template-guides')?.addEventListener('pointerup', endTemplateGesture);
$('#template-guides')?.addEventListener('pointercancel', endTemplateGesture);
document.querySelectorAll('.template-handle').forEach((handle) => handle.addEventListener('pointerdown', startTemplateGesture));
window.addEventListener('resize', () => { if (sourceImage) renderCanvas(); });

function handleFile(file) {
  if (!file || !file.type.startsWith('image/')) return;
  sourceFile = file;
  const reader = new FileReader();
  reader.onload = () => {
    sourceImage = new Image();
    sourceImage.onload = () => {
      $('#dropzone').style.display = 'none';
      $('#preview-wrap').style.display = 'block';
      $('#image-meta').textContent = `${sourceImage.width} x ${sourceImage.height} / ${formatBytes(file.size)}`;
      $('#download-button').disabled = false;
      renderCanvas();
      renderControls();
    };
    sourceImage.src = reader.result;
  };
  reader.readAsDataURL(file);
}

function renderControls() {
  const target = $('#dynamic-controls');
  if (currentTool === 'qr') {
    target.innerHTML = `<div class="control-group"><label for="qr-text">Your content</label><textarea class="text-control" id="qr-text" rows="4" placeholder="https://smarttools.example">${qrState.text}</textarea></div><div class="control-group"><label for="qr-size">Code size <output id="qr-size-value">${qrState.size}px</output></label><input type="range" id="qr-size" min="140" max="320" value="${qrState.size}"></div><div class="qr-output" id="qr-output"></div>`;
    $('#download-button').disabled = false;
    const updateQr = () => { qrState.text = $('#qr-text').value; qrState.size = Number($('#qr-size').value); generateQr(); };
    $('#qr-text').addEventListener('input', updateQr); $('#qr-size').addEventListener('input', updateQr); generateQr();
    return;
  }
  if (currentTool === 'crop') {
    target.innerHTML = `<div class="control-group crop-settings"><label>Aspect ratio</label><div class="ratio-grid"><button type="button" class="ratio-button ${cropState.ratio === 'free' ? 'active' : ''}" data-ratio="free">Free</button><button type="button" class="ratio-button ${cropState.ratio === '1' ? 'active' : ''}" data-ratio="1">1:1</button><button type="button" class="ratio-button ${cropState.ratio === '1.777' ? 'active' : ''}" data-ratio="1.777">16:9</button><button type="button" class="ratio-button ${cropState.ratio === '0.667' ? 'active' : ''}" data-ratio="0.667">2:3</button></div><p class="control-note">Drag the corners for a freehand frame. Drag outside it to rotate.</p></div><div class="control-group"><label for="crop-zoom">Zoom <output id="crop-zoom-value">${cropState.zoom}%</output></label><input type="range" id="crop-zoom" min="100" max="240" value="${cropState.zoom}"></div><div class="control-group rotation-control"><label for="crop-rotation">Rotation <output id="crop-rotation-value">${cropState.rotation}°</output></label><input type="range" id="crop-rotation" min="-180" max="180" value="${cropState.rotation}"><button type="button" class="reset-rotation" id="reset-rotation"><i data-lucide="rotate-ccw"></i> Reset rotation</button></div>`;
    document.querySelectorAll('.ratio-button').forEach((button) => button.addEventListener('click', () => { cropState.ratio = button.dataset.ratio; document.querySelectorAll('.ratio-button').forEach((item) => item.classList.toggle('active', item === button)); renderCanvas(); }));
    $('#crop-zoom').addEventListener('input', (event) => { cropState.zoom = Number(event.target.value); $('#crop-zoom-value').textContent = `${cropState.zoom}%`; renderCanvas(); });
    $('#crop-rotation').addEventListener('input', (event) => { cropState.rotation = Number(event.target.value); $('#crop-rotation-value').textContent = `${cropState.rotation}°`; renderCanvas(); });
    $('#reset-rotation').addEventListener('click', () => { cropState.rotation = 0; $('#crop-rotation').value = 0; $('#crop-rotation-value').textContent = '0°'; renderCanvas(); });
    lucide.createIcons();
    updateCropGuides(); return;
  }
  if (currentTool === 'effects') {
    target.innerHTML = `<div class="filter-presets effects-presets"><div class="filter-presets-heading"><span>Effects</span><small>Pixel-based processing</small></div><div class="filter-preset-grid">${Object.entries(effectPresets).map(([key, preset]) => `<button type="button" class="filter-preset effect-preset ${effectsState.preset === key ? 'active' : ''}" data-effect-preset="${key}" aria-label="Apply ${preset.label} effect"><span class="filter-thumb"><canvas width="150" height="82" data-effect-canvas="${key}"></canvas></span><strong>${preset.label}</strong></button>`).join('')}</div></div><button type="button" class="adjustments-toggle ${effectsState.adjustmentsOpen ? 'active' : ''}" id="effects-adjustments-toggle" aria-expanded="${effectsState.adjustmentsOpen}"><i data-lucide="sliders-horizontal"></i><span>Adjustments</span><i class="adjustments-chevron" data-lucide="chevron-down"></i></button><div class="filter-adjustments ${effectsState.adjustmentsOpen ? 'open' : ''}" id="effects-adjustments"><div class="control-group"><label for="effect-intensity">Effect intensity <output id="effect-intensity-value">${effectsState.intensity}%</output></label><input type="range" id="effect-intensity" min="0" max="100" value="${effectsState.intensity}"></div><div class="control-group"><label for="effect-grain">Grain / detail <output id="effect-grain-value">${effectsState.grain}%</output></label><input type="range" id="effect-grain" min="0" max="100" value="${effectsState.grain}"></div></div>`;
    document.querySelectorAll('[data-effect-preset]').forEach((button) => button.addEventListener('click', () => selectEffectPreset(button.dataset.effectPreset)));
    $('#effects-adjustments-toggle').addEventListener('click', () => { effectsState.adjustmentsOpen = !effectsState.adjustmentsOpen; $('#effects-adjustments-toggle').classList.toggle('active', effectsState.adjustmentsOpen); $('#effects-adjustments-toggle').setAttribute('aria-expanded', effectsState.adjustmentsOpen); $('#effects-adjustments').classList.toggle('open', effectsState.adjustmentsOpen); });
    $('#effect-intensity').addEventListener('input', (event) => { effectsState.intensity = Number(event.target.value); $('#effect-intensity-value').textContent = `${effectsState.intensity}%`; renderCanvas(); });
    $('#effect-grain').addEventListener('input', (event) => { effectsState.grain = Number(event.target.value); $('#effect-grain-value').textContent = `${effectsState.grain}%`; renderCanvas(); });
    lucide.createIcons();
    renderEffectPreviews(); return;
  }
  if (currentTool === 'templates') {
    target.innerHTML = `<div class="filter-presets template-presets"><div class="filter-presets-heading"><span>Template Library</span><small>10 frame styles</small></div><div class="filter-preset-grid">${Object.entries(templatePresets).map(([key, preset]) => `<button type="button" class="filter-preset template-preset ${templateState.preset === key ? 'active' : ''}" data-template-preset="${key}" aria-label="Apply ${preset.label}, ID ${preset.id}"><span class="filter-thumb"><canvas width="150" height="92" data-template-canvas="${key}"></canvas></span><strong>${preset.label}</strong><small class="template-id">${preset.id}</small></button>`).join('')}</div></div><p class="template-note">Drag the frame to move it. Use a corner to resize and the top handle to rotate.</p><button type="button" class="secondary-button template-reset" id="reset-composition">Reset composition</button>`;
    document.querySelectorAll('[data-template-preset]').forEach((button) => button.addEventListener('click', () => selectTemplate(button.dataset.templatePreset)));
    loadTemplateFrames().then(() => { renderTemplatePreviews(); renderCanvas(); }); return;
  }
  if (currentTool === 'filters') {
    target.innerHTML = `<div class="filter-presets"><div class="filter-presets-heading"><span>Presets</span><small>Live photo previews</small></div><div class="filter-preset-grid">${Object.entries(filterPresets).map(([key, preset]) => `<button type="button" class="filter-preset ${filterState.preset === key ? 'active' : ''}" data-filter-preset="${key}" aria-label="Apply ${preset.label} filter"><span class="filter-thumb"><canvas width="150" height="82" data-filter-canvas="${key}"></canvas></span><strong>${preset.label}</strong></button>`).join('')}</div></div><button type="button" class="adjustments-toggle ${filterState.adjustmentsOpen ? 'active' : ''}" id="adjustments-toggle" aria-expanded="${filterState.adjustmentsOpen}"><i data-lucide="sliders-horizontal"></i><span>Adjustments</span><i class="adjustments-chevron" data-lucide="chevron-down"></i></button><div class="filter-adjustments ${filterState.adjustmentsOpen ? 'open' : ''}" id="filter-adjustments"><div class="control-group"><label for="brightness">Brightness <output id="brightness-value">${filterState.brightness}%</output></label><input type="range" id="brightness" min="50" max="150" value="${filterState.brightness}"></div><div class="control-group"><label for="contrast">Contrast <output id="contrast-value">${filterState.contrast}%</output></label><input type="range" id="contrast" min="50" max="150" value="${filterState.contrast}"></div><div class="control-group"><label for="saturation">Saturation <output id="saturation-value">${filterState.saturation}%</output></label><input type="range" id="saturation" min="0" max="180" value="${filterState.saturation}"></div><div class="control-group"><label for="blur">Blur <output id="blur-value">${filterState.blur}px</output></label><input type="range" id="blur" min="0" max="8" step=".5" value="${filterState.blur}"></div></div>`;
    document.querySelectorAll('[data-filter-preset]').forEach((button) => button.addEventListener('click', () => selectFilterPreset(button.dataset.filterPreset)));
    $('#adjustments-toggle').addEventListener('click', () => { filterState.adjustmentsOpen = !filterState.adjustmentsOpen; $('#adjustments-toggle').classList.toggle('active', filterState.adjustmentsOpen); $('#adjustments-toggle').setAttribute('aria-expanded', filterState.adjustmentsOpen); $('#filter-adjustments').classList.toggle('open', filterState.adjustmentsOpen); });
    ['brightness','contrast','saturation','blur'].forEach((id) => $('#' + id).addEventListener('input', () => { filterState[id] = Number($('#' + id).value); filterState.preset = 'custom'; $('#' + id + '-value').textContent = id === 'blur' ? `${$('#' + id).value}px` : `${$('#' + id).value}%`; renderCanvas(); }));
    lucide.createIcons();
    renderFilterPreviews(); return;
  }
  target.innerHTML = `<div class="control-group"><label for="quality">Compression quality <output id="quality-value">${compressorState.quality}%</output></label><input type="range" id="quality" min="10" max="100" value="${compressorState.quality}"></div><div class="size-readout" id="size-readout">Upload an image to see the estimated output size.</div>`;
  $('#quality').addEventListener('input', () => { compressorState.quality = Number($('#quality').value); $('#quality-value').textContent = $('#quality').value + '%'; updateSizeReadout(); });
}

function renderCanvas() {
  if (!sourceImage || currentTool === 'qr') return;
  const canvas = $('#image-canvas'); const ctx = canvas.getContext('2d');
  const isCrop = currentTool === 'crop';
  const zoom = isCrop ? cropState.zoom / 100 : 1;
  let width = sourceImage.width; let height = sourceImage.height;
  canvas.width = width; canvas.height = height;
  const filter = currentTool === 'filters' ? getActiveFilterString() : currentTool === 'effects' && effectsState.preset === 'glow' ? `blur(${Math.max(0.8, 7 - effectsState.intensity / 16)}px) saturate(126%)` : 'none';
  ctx.filter = filter;
  ctx.save();
  ctx.translate(width / 2 + (isCrop ? cropState.offsetX : 0), height / 2 + (isCrop ? cropState.offsetY : 0));
  if (isCrop) ctx.rotate(cropState.rotation * Math.PI / 180);
  const drawWidth = width * zoom; const drawHeight = height * zoom;
  ctx.drawImage(sourceImage, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
  ctx.restore();
  ctx.filter = 'none';
  if (currentTool === 'effects') applyEffectPixels(canvas, effectsState.preset, effectsState.intensity, effectsState.grain);
  renderFrameLayer(currentTool === 'templates' ? canvas.width : 0, currentTool === 'templates' ? canvas.height : 0);
  if (isCrop) updateCropGuides();
  if (currentTool === 'compress') updateSizeReadout();
}

function applyEffectPixels(canvas, presetKey, intensity, grain) {
  const ctx = canvas.getContext('2d');
  const image = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = image.data;
  const amount = intensity / 100;
  const noiseAmount = grain / 100;
  const width = canvas.width;
  const height = canvas.height;
  const original = new Uint8ClampedArray(data);
  const at = (x, y, channel) => original[(Math.max(0, Math.min(height - 1, y)) * width + Math.max(0, Math.min(width - 1, x))) * 4 + channel];
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const index = (y * width + x) * 4;
      let red = original[index]; let green = original[index + 1]; let blue = original[index + 2];
      if (presetKey === 'vhs') {
        const noise = (Math.random() - .5) * 70 * noiseAmount;
        red += noise + 14 * amount; green += noise; blue += noise - 10 * amount;
        if (y % Math.max(3, Math.round(7 - amount * 4)) === 0) { red *= .72; green *= .78; blue *= .86; }
      } else if (presetKey === 'glitch') {
        const shift = Math.round((Math.sin(y * .13) * 16 + 9) * amount);
        red = at(x + shift, y, 0); green = at(x, y, 1); blue = at(x - shift, y, 2);
        if (Math.floor(y / Math.max(3, 18 - amount * 12)) % 5 === 0) { red = Math.min(255, red + 28 * amount); blue *= .7; }
      } else if (presetKey === 'crystal') {
        const size = Math.max(3, Math.round(4 + amount * 22)); const blockX = Math.floor(x / size) * size; const blockY = Math.floor(y / size) * size;
        red = at(blockX, blockY, 0); green = at(blockX, blockY, 1); blue = at(blockX, blockY, 2);
      } else if (presetKey === 'sketch') {
        const lum = (red * .299 + green * .587 + blue * .114); const nextLum = (at(x + 2, y, 0) * .299 + at(x + 2, y, 1) * .587 + at(x + 2, y, 2) * .114); const edge = Math.abs(lum - nextLum) * 3 * amount;
        red = green = blue = Math.max(0, 245 - edge);
      } else if (presetKey === 'purple') {
        red += 36 * amount; blue += 62 * amount; green -= 14 * amount;
        if ((x + y) % Math.max(8, Math.round(14 - amount * 7)) < 2) { red += 22; blue += 28; }
      } else if (presetKey === 'weather') {
        const blurMix = (at(x - 4, y, 0) + at(x + 4, y, 0) + red) / 3; red = blurMix * .82; green = (at(x, y - 4, 1) + at(x, y + 4, 1) + green) / 3; blue = Math.min(255, blue + 45 * amount);
        if ((x * 13 + y * 7) % 83 < 3 + amount * 8) { red *= .42; green *= .62; blue = Math.min(255, blue + 68); }
        if ((x + y * 3) % Math.max(9, 24 - amount * 12) < 2) { red *= .7; green *= .8; }
      } else if (presetKey === 'glow') {
        red += 42 * amount; green += 32 * amount; blue += 24 * amount;
      } else if (presetKey === 'watercolor') {
        const size = Math.max(2, Math.round(2 + amount * 5)); const blockX = Math.floor(x / size) * size; const blockY = Math.floor(y / size) * size;
        const wash = (at(blockX, blockY, 0) + at(blockX + 1, blockY, 0) + at(blockX, blockY + 1, 0)) / 3;
        red = wash * 1.08; green = at(blockX, blockY, 1) * 1.03; blue = at(blockX, blockY, 2) * .98;
        const paper = ((x * 17 + y * 31) % 23) < 5 ? 16 * amount : 0;
        red += paper; green += paper; blue += paper;
      }
      data[index] = Math.max(0, Math.min(255, red)); data[index + 1] = Math.max(0, Math.min(255, green)); data[index + 2] = Math.max(0, Math.min(255, blue));
    }
  }
  ctx.putImageData(image, 0, 0);
}

function renderEffectPreviews() {
  document.querySelectorAll('[data-effect-canvas]').forEach((canvas) => {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!sourceImage) return;
    const scale = Math.max(canvas.width / sourceImage.width, canvas.height / sourceImage.height);
    const width = sourceImage.width * scale; const height = sourceImage.height * scale;
    ctx.drawImage(sourceImage, (canvas.width - width) / 2, (canvas.height - height) / 2, width, height);
    applyEffectPixels(canvas, canvas.dataset.effectCanvas, 68, 42);
  });
}

function selectEffectPreset(key) {
  if (!effectPresets[key]) return;
  effectsState.preset = key;
  effectsState.intensity = 68;
  effectsState.grain = 42;
  if ($('#effect-intensity')) { $('#effect-intensity').value = effectsState.intensity; $('#effect-intensity-value').textContent = '68%'; }
  if ($('#effect-grain')) { $('#effect-grain').value = effectsState.grain; $('#effect-grain-value').textContent = '42%'; }
  document.querySelectorAll('[data-effect-preset]').forEach((button) => button.classList.toggle('active', button.dataset.effectPreset === key));
  renderCanvas();
}

function renderTemplatePreviews() {
  document.querySelectorAll('[data-template-canvas]').forEach((canvas) => {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (sourceImage) { const scale = Math.max(canvas.width / sourceImage.width, canvas.height / sourceImage.height); const width = sourceImage.width * scale; const height = sourceImage.height * scale; ctx.drawImage(sourceImage, (canvas.width - width) / 2, (canvas.height - height) / 2, width, height); }
    const frame = templatePresets[canvas.dataset.templateCanvas].image;
    if (frame) ctx.drawImage(frame, 0, 0, canvas.width, canvas.height);
  });
}

function loadTemplateFrames() {
  return Promise.all(Object.values(templatePresets).map((preset) => {
    if (preset.image) return Promise.resolve(preset.image);
    return new Promise((resolve) => {
      const image = new Image();
      image.onload = () => { preset.image = image; preset.alphaBounds = getImageAlphaBounds(image); resolve(image); };
      image.onerror = () => resolve(null);
      image.src = preset.src;
    });
  }));
}

function getImageAlphaBounds(image) {
  const canvas = document.createElement('canvas');
  canvas.width = image.width; canvas.height = image.height;
  const context = canvas.getContext('2d', { willReadFrequently: true });
  context.drawImage(image, 0, 0);
  const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
  let minX = canvas.width; let minY = canvas.height; let maxX = -1; let maxY = -1;
  for (let index = 3; index < pixels.length; index += 4) {
    if (pixels[index] < 12) continue;
    const pixel = (index - 3) / 4;
    const x = pixel % canvas.width; const y = Math.floor(pixel / canvas.width);
    minX = Math.min(minX, x); minY = Math.min(minY, y); maxX = Math.max(maxX, x); maxY = Math.max(maxY, y);
  }
  if (maxX < 0) return { x: 0, y: 0, width: canvas.width, height: canvas.height, centerX: canvas.width / 2, centerY: canvas.height / 2 };
  return { x: minX, y: minY, width: maxX - minX + 1, height: maxY - minY + 1, centerX: (minX + maxX + 1) / 2, centerY: (minY + maxY + 1) / 2 };
}

function getTemplateBounds(canvas) {
  const frame = templatePresets[templateState.preset]?.image;
  if (!frame || !canvas.width || !canvas.height) return null;
  const alpha = templatePresets[templateState.preset].alphaBounds || { x: 0, y: 0, width: frame.width, height: frame.height, centerX: frame.width / 2, centerY: frame.height / 2 };
  const sourceWidth = canvas.width * templateState.scale;
  const sourceHeight = sourceWidth * (frame.height / frame.width);
  const width = sourceWidth * alpha.width / frame.width;
  const height = sourceHeight * alpha.height / frame.height;
  return { width, height, sourceWidth, sourceHeight, sourceOffsetX: sourceWidth * alpha.centerX / frame.width - width / 2, sourceOffsetY: sourceHeight * alpha.centerY / frame.height - height / 2, centerX: canvas.width * templateState.centerX, centerY: canvas.height * templateState.centerY };
}

function renderTemplateGuides() {
  const guides = $('#template-guides');
  const canvas = $('#image-canvas');
  const frame = $('#canvas-frame');
  const bounds = getTemplateBounds(canvas);
  if (!guides || !canvas || !frame || currentTool !== 'templates' || !bounds || !sourceImage) { guides?.classList.remove('is-visible'); return; }
  const canvasRect = canvas.getBoundingClientRect();
  const frameRect = frame.getBoundingClientRect();
  const scaleX = canvasRect.width / canvas.width;
  const scaleY = canvasRect.height / canvas.height;
  guides.classList.add('is-visible');
  guides.style.width = `${bounds.width * scaleX}px`;
  guides.style.height = `${bounds.height * scaleY}px`;
  guides.style.left = `${bounds.centerX * scaleX - bounds.width * scaleX / 2 + canvasRect.left - frameRect.left}px`;
  guides.style.top = `${bounds.centerY * scaleY - bounds.height * scaleY / 2 + canvasRect.top - frameRect.top}px`;
  guides.style.transform = `rotate(${templateState.rotation}deg)`;
}

function renderFrameLayer(width, height) {
  const frameCanvas = $('#frame-canvas');
  const photoCanvas = $('#image-canvas');
  if (!frameCanvas) return;
  frameCanvas.width = width;
  frameCanvas.height = height;
  frameCanvas.style.display = width ? 'block' : 'none';
  if (!width) return;
  if (photoCanvas) {
    const photoRect = photoCanvas.getBoundingClientRect();
    const frameRect = $('#canvas-frame').getBoundingClientRect();
    frameCanvas.style.width = `${photoRect.width}px`;
    frameCanvas.style.height = `${photoRect.height}px`;
    frameCanvas.style.left = `${photoRect.left - frameRect.left}px`;
    frameCanvas.style.top = `${photoRect.top - frameRect.top}px`;
    frameCanvas.style.right = 'auto';
    frameCanvas.style.bottom = 'auto';
  }
  const frame = templatePresets[templateState.preset]?.image;
  if (!frame) { loadTemplateFrames().then(() => renderCanvas()); return; }
  const context = frameCanvas.getContext('2d');
  const bounds = getTemplateBounds(frameCanvas);
  context.clearRect(0, 0, width, height);
  context.save();
  context.translate(bounds.centerX, bounds.centerY);
  context.rotate(templateState.rotation * Math.PI / 180);
  const alpha = templatePresets[templateState.preset].alphaBounds;
  context.drawImage(frame, -(bounds.sourceWidth * alpha.centerX / frame.width), -(bounds.sourceHeight * alpha.centerY / frame.height), bounds.sourceWidth, bounds.sourceHeight);
  context.restore();
  renderTemplateGuides();
}

function selectTemplate(key) {
  if (!templatePresets[key]) return;
  templateState.preset = key;
  document.querySelectorAll('[data-template-preset]').forEach((button) => button.classList.toggle('active', button.dataset.templatePreset === key));
  loadTemplateFrames().then(() => { renderCanvas(); renderTemplatePreviews(); });
}

function resetTemplateComposition() {
  templateState.preset = 'frame-01';
  templateState.centerX = .5; templateState.centerY = .5; templateState.scale = .84; templateState.rotation = 0;
  cropState.zoom = 100; cropState.rotation = 0; cropState.offsetX = 0; cropState.offsetY = 0;
  renderControls();
  renderCanvas();
}

function startCanvasGesture(event) {
  if (currentTool === 'templates') startTemplateGesture(event);
  else startCropGesture(event);
}

function moveCanvasGesture(event) {
  if (currentTool === 'templates') moveTemplateGesture(event);
  else moveCropGesture(event);
}

function endCanvasGesture() {
  if (currentTool === 'templates') endTemplateGesture();
  else endCropGesture();
}

function startTemplateGesture(event) {
  if (!sourceImage || currentTool !== 'templates') return;
  event.preventDefault();
  const guides = $('#template-guides');
  const guideRect = guides?.getBoundingClientRect();
  const pointerX = event.clientX; const pointerY = event.clientY;
  const corner = guideRect && [['nw', guideRect.left, guideRect.top], ['ne', guideRect.right, guideRect.top], ['se', guideRect.right, guideRect.bottom], ['sw', guideRect.left, guideRect.bottom]].find(([, x, y]) => Math.hypot(pointerX - x, pointerY - y) <= 22);
  const nearRotate = guideRect && Math.hypot(pointerX - (guideRect.left + guideRect.width / 2), pointerY - (guideRect.top - 32)) <= 18;
  const handle = event.target.closest('.template-handle') || event.currentTarget.closest?.('.template-handle');
  templateState.dragging = true;
  templateState.dragMode = handle?.classList.contains('template-rotate') || nearRotate ? 'rotate' : handle || corner ? 'resize' : 'move';
  templateState.resizeHandle = handle?.dataset.handle || corner?.[0] || '';
  templateState.startX = event.clientX; templateState.startY = event.clientY;
  templateState.startCenterX = templateState.centerX; templateState.startCenterY = templateState.centerY; templateState.startScale = templateState.scale; templateState.startRotation = templateState.rotation;
  event.currentTarget?.setPointerCapture?.(event.pointerId);
  guides?.classList.add('is-interacting');
}

function moveTemplateGesture(event) {
  if (!templateState.dragging) return;
  event.preventDefault();
  const canvas = $('#image-canvas');
  const rect = canvas.getBoundingClientRect();
  const dx = event.clientX - templateState.startX;
  const dy = event.clientY - templateState.startY;
  if (templateState.dragMode === 'move') {
    const bounds = getTemplateBounds(canvas);
    const angle = templateState.rotation * Math.PI / 180;
    const halfWidth = (Math.abs(bounds.width * Math.cos(angle)) + Math.abs(bounds.height * Math.sin(angle))) / 2;
    const halfHeight = (Math.abs(bounds.width * Math.sin(angle)) + Math.abs(bounds.height * Math.cos(angle))) / 2;
    const minX = halfWidth / canvas.width; const maxX = 1 - minX;
    const minY = halfHeight / canvas.height; const maxY = 1 - minY;
    templateState.centerX = Math.max(minX, Math.min(maxX, templateState.startCenterX + dx / rect.width));
    templateState.centerY = Math.max(minY, Math.min(maxY, templateState.startCenterY + dy / rect.height));
  } else if (templateState.dragMode === 'rotate') {
    const bounds = getTemplateBounds(canvas);
    const centerX = rect.left + bounds.centerX * rect.width / canvas.width;
    const centerY = rect.top + bounds.centerY * rect.height / canvas.height;
    const startAngle = Math.atan2(templateState.startY - centerY, templateState.startX - centerX);
    const currentAngle = Math.atan2(event.clientY - centerY, event.clientX - centerX);
    templateState.rotation = templateState.startRotation + (currentAngle - startAngle) * 180 / Math.PI;
  } else {
    const distance = Math.hypot(dx, dy);
    const direction = dx + dy;
    templateState.scale = Math.max(.24, Math.min(1.8, templateState.startScale + (direction >= 0 ? distance : -distance) / Math.max(rect.width, rect.height)));
  }
  renderCanvas();
}

function endTemplateGesture() {
  templateState.dragging = false;
  $('#template-guides')?.classList.remove('is-interacting');
}

function drawTemplateFrame(ctx, width, height, key) {
  const scale = Math.min(width, height) / 700;
  const inset = Math.min(width, height) * .09;
  ctx.save();
  ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  if (key === 'botanical') {
    ctx.strokeStyle = '#1d2421'; ctx.lineWidth = 10 * scale; ctx.strokeRect(inset, inset, width - inset * 2, height - inset * 2);
    drawLeafBranch(ctx, inset * .9, inset * .7, 1, scale, '#789b65'); drawLeafBranch(ctx, width - inset * .9, height - inset * .7, -1, scale, '#789b65');
  } else if (key === 'polaroid') {
    ctx.fillStyle = 'rgba(255,255,255,.92)'; ctx.fillRect(inset * .8, inset * .7, width - inset * 1.6, height - inset * .9); ctx.fillStyle = '#d7b35e'; ctx.fillRect(width * .44, 0, width * .12, inset * .5); ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.fillRect(width * .45, 0, width * .1, inset * .35);
  } else if (key === 'layered') {
    for (let i = 0; i < 3; i += 1) { ctx.strokeStyle = i === 1 ? '#bd8d39' : '#d4aa55'; ctx.lineWidth = 3 * scale; ctx.save(); ctx.translate(width / 2, height / 2); ctx.rotate((i - 1) * .035); ctx.strokeRect(-width / 2 + inset, -height / 2 + inset, width - inset * 2, height - inset * 2); ctx.restore(); } drawLeafBranch(ctx, inset, height * .7, 1, scale, '#86a89b');
  } else if (key === 'brush') {
    ctx.strokeStyle = '#1a1a1a'; ctx.lineWidth = 15 * scale; ctx.strokeRect(inset, inset, width - inset * 2, height - inset * 2); ctx.strokeStyle = 'rgba(0,0,0,.32)'; ctx.lineWidth = 4 * scale; ctx.strokeRect(inset * 1.2, inset * .8, width - inset * 2.4, height - inset * 1.6);
  } else if (key === 'heart') {
    ctx.strokeStyle = '#c6a04b'; ctx.lineWidth = 5 * scale; ctx.beginPath(); ctx.moveTo(width / 2, height - inset); ctx.bezierCurveTo(width * .1, height * .6, width * .18, inset, width / 2, height * .35); ctx.bezierCurveTo(width * .82, inset, width * .9, height * .6, width / 2, height - inset); ctx.stroke(); drawFlower(ctx, width * .76, height * .76, scale); drawFlower(ctx, width * .83, height * .68, scale);
  } else if (key === 'ornate') {
    ctx.strokeStyle = '#b98a45'; ctx.lineWidth = 4 * scale; ctx.strokeRect(inset, inset, width - inset * 2, height - inset * 2); [[inset, inset],[width-inset,inset],[inset,height-inset],[width-inset,height-inset]].forEach(([x,y]) => { ctx.beginPath(); ctx.arc(x, y, 28 * scale, 0, Math.PI * 2); ctx.stroke(); ctx.beginPath(); ctx.arc(x + (x < width/2 ? 18 : -18) * scale, y, 17 * scale, 0, Math.PI * 2); ctx.stroke(); });
  } else if (key === 'torn') {
    ctx.fillStyle = 'rgba(219,205,184,.95)'; ctx.fillRect(inset * .5, inset * .5, width - inset, height - inset); ctx.strokeStyle = '#fff'; ctx.lineWidth = 16 * scale; ctx.setLineDash([10 * scale, 5 * scale]); ctx.strokeRect(inset, inset, width - inset * 2, height - inset * 2); ctx.setLineDash([]);
  } else if (key === 'organic') {
    ctx.strokeStyle = '#187f80'; ctx.lineWidth = 7 * scale; ctx.beginPath(); ctx.moveTo(width * .2, height * .35); ctx.bezierCurveTo(width * .05, height * .05, width * .45, height * .08, width * .55, height * .22); ctx.bezierCurveTo(width * .95, height * .05, width * .95, height * .55, width * .75, height * .78); ctx.bezierCurveTo(width * .4, height * .98, width * .05, height * .8, width * .2, height * .35); ctx.stroke();
  } else if (key === 'film') {
    ctx.fillStyle = '#111'; ctx.fillRect(inset * .45, inset * .45, width - inset * .9, height - inset * .9); ctx.clearRect(inset * 1.4, inset * 1.1, width - inset * 2.8, height - inset * 2.2); ctx.fillStyle = '#fff'; for (let x = inset * .7; x < width - inset * .4; x += 34 * scale) { ctx.fillRect(x, inset * .6, 14 * scale, 8 * scale); ctx.fillRect(x, height - inset * .8, 14 * scale, 8 * scale); }
  } else if (key === 'wood') {
    ctx.strokeStyle = '#6e4225'; ctx.lineWidth = 30 * scale; ctx.strokeRect(inset * .6, inset * .6, width - inset * 1.2, height - inset * 1.2); ctx.strokeStyle = '#a9784d'; ctx.lineWidth = 5 * scale; ctx.strokeRect(inset * .65, inset * .65, width - inset * 1.3, height - inset * 1.3);
  }
  ctx.restore();
}
function drawLeafBranch(ctx, x, y, direction, scale, color) { ctx.strokeStyle = color; ctx.lineWidth = 3 * scale; ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + direction * 55 * scale, y - 45 * scale, x + direction * 80 * scale, y - 100 * scale); ctx.stroke(); for (let i = 0; i < 4; i += 1) { const lx = x + direction * (18 + i * 18) * scale; const ly = y - (18 + i * 20) * scale; ctx.fillStyle = color; ctx.beginPath(); ctx.ellipse(lx, ly, 12 * scale, 5 * scale, direction * -.6, 0, Math.PI * 2); ctx.fill(); } }
function drawFlower(ctx, x, y, scale) { ctx.fillStyle = '#e889a0'; for (let i = 0; i < 5; i += 1) { ctx.beginPath(); ctx.arc(x + Math.cos(i * 1.256) * 10 * scale, y + Math.sin(i * 1.256) * 10 * scale, 9 * scale, 0, Math.PI * 2); ctx.fill(); } ctx.fillStyle = '#e5c45a'; ctx.beginPath(); ctx.arc(x, y, 5 * scale, 0, Math.PI * 2); ctx.fill(); }

function getActiveFilterString() {
  const preset = filterPresets[filterState.preset];
  if (preset && filterState.preset !== 'custom') return preset.filter;
  return `brightness(${filterState.brightness}%) contrast(${filterState.contrast}%) saturate(${filterState.saturation}%) blur(${filterState.blur}px)`;
}

function renderFilterPreviews() {
  document.querySelectorAll('[data-filter-canvas]').forEach((canvas) => {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!sourceImage) return;
    const preset = filterPresets[canvas.dataset.filterCanvas];
    ctx.save();
    ctx.filter = preset.filter;
    const scale = Math.max(canvas.width / sourceImage.width, canvas.height / sourceImage.height);
    const width = sourceImage.width * scale;
    const height = sourceImage.height * scale;
    ctx.drawImage(sourceImage, (canvas.width - width) / 2, (canvas.height - height) / 2, width, height);
    if (preset.sharpen) {
      ctx.globalAlpha = .14;
      ctx.filter = 'none';
      ctx.drawImage(sourceImage, (canvas.width - width) / 2 - 1, (canvas.height - height) / 2, width, height);
    }
    ctx.restore();
  });
}

function selectFilterPreset(key) {
  const preset = filterPresets[key];
  if (!preset) return;
  filterState.preset = key;
  filterState.brightness = preset.brightness;
  filterState.contrast = preset.contrast;
  filterState.saturation = preset.saturation;
  filterState.blur = 0;
  ['brightness','contrast','saturation','blur'].forEach((id) => { if ($('#' + id)) { $('#' + id).value = filterState[id]; $('#' + id + '-value').textContent = id === 'blur' ? `${filterState[id]}px` : `${filterState[id]}%`; } });
  document.querySelectorAll('[data-filter-preset]').forEach((button) => button.classList.toggle('active', button.dataset.filterPreset === key));
  renderCanvas();
}

function updateCropGuides() {
  const guide = $('#crop-guides');
  const frame = $('#canvas-frame');
  const canvas = $('#image-canvas');
  if (!guide) return;
  if (!frame || !canvas || currentTool !== 'crop' || !sourceImage) {
    guide.classList.remove('is-visible');
    return;
  }
  guide.classList.add('is-visible');
  const canvasRect = canvas.getBoundingClientRect();
  const frameRect = frame.getBoundingClientRect();
  let width = canvasRect.width * .78 * cropState.frameWidthScale;
  let height = canvasRect.height * .78 * cropState.frameHeightScale;
  if (cropState.ratio !== 'free') {
    const ratio = Number(cropState.ratio);
    if (width / height > ratio) width = height * ratio; else height = width / ratio;
  }
  guide.style.width = `${width}px`;
  guide.style.height = `${height}px`;
  guide.style.left = `${canvasRect.left - frameRect.left + (canvasRect.width - width) / 2}px`;
  guide.style.top = `${canvasRect.top - frameRect.top + (canvasRect.height - height) / 2}px`;
  guide.style.transform = 'none';
}

function setCropGuideVisibility(isCropTool) {
  const guide = $('#crop-guides');
  if (!guide) return;
  guide.classList.toggle('is-visible', Boolean(isCropTool && sourceImage));
}

function startCropGesture(event) {
  if (!sourceImage || currentTool !== 'crop') return;
  const guide = $('#crop-guides').getBoundingClientRect();
  const inside = event.target.closest('.crop-guides');
  cropState.dragging = true;
  cropState.dragMode = inside ? 'move' : 'rotate';
  cropState.resizeHandle = '';
  cropState.startX = event.clientX; cropState.startY = event.clientY;
  cropState.startOffsetX = cropState.offsetX; cropState.startOffsetY = cropState.offsetY; cropState.startFrameWidthScale = cropState.frameWidthScale; cropState.startFrameHeightScale = cropState.frameHeightScale; cropState.startRotation = cropState.rotation;
  if (inside && event.target.classList.contains('crop-handle')) { cropState.dragMode = 'resize'; cropState.resizeHandle = [...event.target.classList].find((name) => name.startsWith('handle-')) || ''; }
  $('#canvas-frame').setPointerCapture?.(event.pointerId);
  $('#rotate-hint').classList.toggle('visible', cropState.dragMode === 'rotate');
  if (cropState.dragMode === 'rotate') $('#canvas-frame').dataset.guideLeft = guide.left;
}
function moveCropGesture(event) {
  if (!cropState.dragging) return;
  const dx = event.clientX - cropState.startX; const dy = event.clientY - cropState.startY;
  if (cropState.dragMode === 'rotate') cropState.rotation = Math.max(-180, Math.min(180, cropState.startRotation + dx * .55));
  else if (cropState.dragMode === 'move') { cropState.offsetX = cropState.startOffsetX + dx * (sourceImage.width / Math.max(1, $('#image-canvas').getBoundingClientRect().width)); cropState.offsetY = cropState.startOffsetY + dy * (sourceImage.height / Math.max(1, $('#image-canvas').getBoundingClientRect().height)); }
  else if (cropState.dragMode === 'resize') resizeCropFrame(dx, dy);
  syncCropControls(); renderCanvas();
}
function endCropGesture() { cropState.dragging = false; $('#rotate-hint')?.classList.remove('visible'); }
function syncCropControls() { if ($('#crop-zoom')) { $('#crop-zoom').value = cropState.zoom; $('#crop-zoom-value').textContent = `${Math.round(cropState.zoom)}%`; } if ($('#crop-rotation')) { $('#crop-rotation').value = cropState.rotation; $('#crop-rotation-value').textContent = `${Math.round(cropState.rotation)}°`; } }
function resizeCropFrame(dx, dy) {
  const handle = cropState.resizeHandle;
  const horizontal = handle.includes('-e') || handle.includes('-w') || handle === 'handle-e' || handle === 'handle-w';
  const vertical = handle.includes('-n') || handle.includes('-s') || handle === 'handle-n' || handle === 'handle-s';
  const widthChange = horizontal ? ((handle.includes('w') ? -dx : dx) / 420) : 0;
  const heightChange = vertical ? ((handle.includes('n') ? -dy : dy) / 420) : 0;
  if (cropState.ratio !== 'free') {
    const change = Math.abs(widthChange || heightChange);
    const direction = widthChange || heightChange;
    const next = Math.max(.4, Math.min(1.2, cropState.startFrameWidthScale + (direction >= 0 ? change : -change)));
    cropState.frameWidthScale = next;
    cropState.frameHeightScale = next;
    return;
  }
  cropState.frameWidthScale = Math.max(.4, Math.min(1.2, cropState.startFrameWidthScale + widthChange));
  cropState.frameHeightScale = Math.max(.4, Math.min(1.2, cropState.startFrameHeightScale + heightChange));
}

function generateQr() {
  const output = $('#qr-output'); if (!output) return; output.innerHTML = '';
  const size = qrState.size; $('#qr-size-value').textContent = `${size}px`;
  new QRCode(output, { text: qrState.text || ' ', width: size, height: size, colorDark: '#1d2421', colorLight: '#f7f5ef', correctLevel: QRCode.CorrectLevel.M });
}
function updateSizeReadout() { if (!sourceFile || !$('#size-readout')) return; const estimate = sourceFile.size * (0.16 + compressorState.quality / 120); $('#size-readout').textContent = `Original ${formatBytes(sourceFile.size)}  ->  Estimated ${formatBytes(estimate)}`; }
function resetTool() { clearToolSession(); renderControls(); }
function downloadResult() {
  if (currentTool === 'qr') { const canvas = $('#qr-output canvas'); if (canvas) saveCanvas(canvas, 'smarttools-qr.png'); return; }
  const canvas = $('#image-canvas'); if (!canvas || !sourceImage) return;
  const quality = currentTool === 'compress' ? compressorState.quality / 100 : .92;
  const exportCanvas = document.createElement('canvas');
  exportCanvas.width = canvas.width; exportCanvas.height = canvas.height;
  const exportContext = exportCanvas.getContext('2d');
  exportContext.drawImage(canvas, 0, 0);
  if (currentTool === 'templates') exportContext.drawImage($('#frame-canvas'), 0, 0);
  const link = document.createElement('a'); link.download = `smarttools-${currentTool}.${currentTool === 'compress' ? 'jpg' : 'png'}`; link.href = exportCanvas.toDataURL(currentTool === 'compress' ? 'image/jpeg' : 'image/png', quality); link.click();
}
function saveCanvas(canvas, filename) { const link = document.createElement('a'); link.download = filename; link.href = canvas.toDataURL('image/png'); link.click(); }
function formatBytes(bytes) { if (!bytes) return '0 B'; const units = ['B','KB','MB']; const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1); return `${(bytes / (1024 ** index)).toFixed(index ? 1 : 0)} ${units[index]}`; }
