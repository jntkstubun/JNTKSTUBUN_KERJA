/* ==========================================================================
   J&T Ks_Tubun - Portal Foto & Link Uploader
   Core Client-Side JavaScript Application (Vanilla ES6+)
   ========================================================================== */

// --------------------------------------------------------------------------
// 1. GLOBAL STATE & CONFIGURATION
// --------------------------------------------------------------------------
let globalConfig = {
  format: 'jpg',         // 'jpg' or 'png'
  jpgQuality: 0.9,       // 0.5 to 1.0
  maxResolution: 1920,   // 1200, 1920, 3840
  aspectRatio: 'auto',   // 'auto', '1:1', '4:3', '16:9', '9:16'
  gap: 12,               // 0 to 40 px
  margin: 16,            // 0 to 50 px
  radius: 8,             // 0 to 30 px
  bgColor: '#ffffff',    // Hex color string or 'transparent'
  enableWatermark: true,
  enableTimestamp: true,
  timezone: 'WIB',       // 'WIB', 'WITA', 'WIT'
  imgbbApiKey: ''        // Custom ImgBB API Key (Optional)
};

// Multi-Slide State Array
let slidesState = [];

// Upload History State Array
let uploadHistory = [];

// Lightbox Active Canvas Data Holder
let currentActiveSlideId = null;

// --------------------------------------------------------------------------
// 2. INITIALIZATION & ROUTING
// --------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  loadPreferences();
  loadUploadHistory();
  initDefaultSlides();
  setupEventListeners();
  updateGlobalConfigUI();
});

function initDefaultSlides() {
  // Create 1 initial empty slide
  slidesState = [
    {
      id: 'slide-' + Date.now() + '-1',
      title: 'Slide 1 (Paket Resi)',
      layout: 'horizontal',
      photos: []
    }
  ];
  renderSlidesListUI();
}

function switchView(viewName) {
  // Update view sections
  const views = ['dashboard', 'merge', 'upload'];
  views.forEach(v => {
    const sec = document.getElementById(`${v}-view`);
    const btn = document.getElementById(`nav-${v}`);
    const mobBtn = document.getElementById(`mobile-nav-${v}`);
    if (sec) sec.classList.toggle('active', v === viewName);
    if (btn) btn.classList.toggle('active', v === viewName);
    if (mobBtn) mobBtn.classList.toggle('active', v === viewName);
  });

  // Re-render canvases if switching to merge view
  if (viewName === 'merge') {
    slidesState.forEach(slide => renderSlideCanvas(slide.id));
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --------------------------------------------------------------------------
// 3. PREFERENCE MANAGER (LOCAL STORAGE)
// --------------------------------------------------------------------------
function loadPreferences() {
  const saved = localStorage.getItem('jt_global_config');
  if (saved) {
    try {
      globalConfig = { ...globalConfig, ...JSON.parse(saved) };
    } catch (e) {
      console.error('Gagal membaca preference:', e);
    }
  }
}

function savePreferences() {
  localStorage.setItem('jt_global_config', JSON.stringify(globalConfig));
  showToast('Preference pengaturan berhasil disimpan ke browser!', 'success');
}

function resetPreferences() {
  localStorage.removeItem('jt_global_config');
  globalConfig = {
    format: 'jpg',
    jpgQuality: 0.9,
    maxResolution: 1920,
    aspectRatio: 'auto',
    gap: 12,
    margin: 16,
    radius: 8,
    bgColor: '#ffffff',
    enableWatermark: true,
    enableTimestamp: true,
    timezone: 'WIB'
  };
  updateGlobalConfigUI();
  slidesState.forEach(slide => renderSlideCanvas(slide.id));
  showToast('Pengaturan telah di-reset ke standar default J&T.', 'info');
}

function updateGlobalConfigUI() {
  // Sync Side Control Panel Inputs with globalConfig
  document.getElementById('jpg-quality').value = Math.round(globalConfig.jpgQuality * 100);
  document.getElementById('jpg-quality-val').textContent = Math.round(globalConfig.jpgQuality * 100) + '%';
  document.getElementById('canvas-resolution').value = globalConfig.maxResolution;
  document.getElementById('aspect-ratio').value = globalConfig.aspectRatio;
  document.getElementById('gap-size').value = globalConfig.gap;
  document.getElementById('gap-size-val').textContent = globalConfig.gap + 'px';
  document.getElementById('border-margin').value = globalConfig.margin;
  document.getElementById('border-margin-val').textContent = globalConfig.margin + 'px';
  document.getElementById('border-radius').value = globalConfig.radius;
  document.getElementById('border-radius-val').textContent = globalConfig.radius + 'px';
  document.getElementById('enable-watermark').checked = globalConfig.enableWatermark;
  document.getElementById('enable-timestamp').checked = globalConfig.enableTimestamp;
  document.getElementById('timezone-select').value = globalConfig.timezone;
  const keyInput = document.getElementById('imgbb-api-key');
  if (keyInput) keyInput.value = globalConfig.imgbbApiKey || '';

  // Toggle buttons
  document.getElementById('fmt-jpg').classList.toggle('active', globalConfig.format === 'jpg');
  document.getElementById('fmt-png').classList.toggle('active', globalConfig.format === 'png');
  document.getElementById('quality-slider-group').style.display = (globalConfig.format === 'jpg') ? 'block' : 'none';

  // Bg Color Presets Highlight
  const colorBtns = document.querySelectorAll('.color-preset-btn');
  colorBtns.forEach(btn => btn.classList.remove('active'));
}

function updateGlobalConfig() {
  globalConfig.jpgQuality = parseInt(document.getElementById('jpg-quality').value) / 100;
  document.getElementById('jpg-quality-val').textContent = Math.round(globalConfig.jpgQuality * 100) + '%';
  globalConfig.maxResolution = parseInt(document.getElementById('canvas-resolution').value);
  globalConfig.aspectRatio = document.getElementById('aspect-ratio').value;
  globalConfig.gap = parseInt(document.getElementById('gap-size').value);
  document.getElementById('gap-size-val').textContent = globalConfig.gap + 'px';
  globalConfig.margin = parseInt(document.getElementById('border-margin').value);
  document.getElementById('border-margin-val').textContent = globalConfig.margin + 'px';
  globalConfig.radius = parseInt(document.getElementById('border-radius').value);
  document.getElementById('border-radius-val').textContent = globalConfig.radius + 'px';
  globalConfig.enableWatermark = document.getElementById('enable-watermark').checked;
  globalConfig.enableTimestamp = document.getElementById('enable-timestamp').checked;
  globalConfig.timezone = document.getElementById('timezone-select').value;
  const keyInput = document.getElementById('imgbb-api-key');
  if (keyInput) globalConfig.imgbbApiKey = keyInput.value;

  // Re-render all slides live
  slidesState.forEach(slide => renderSlideCanvas(slide.id));
}

function setExportFormat(fmt) {
  globalConfig.format = fmt;
  updateGlobalConfigUI();
  slidesState.forEach(slide => renderSlideCanvas(slide.id));
}

function setBackgroundColor(colorStr, btnEl) {
  globalConfig.bgColor = colorStr;
  const colorBtns = document.querySelectorAll('.color-preset-btn');
  colorBtns.forEach(btn => btn.classList.remove('active'));
  if (btnEl) btnEl.classList.add('active');
  slidesState.forEach(slide => renderSlideCanvas(slide.id));
}

function setCustomBgColor(hexColor) {
  globalConfig.bgColor = hexColor;
  const colorBtns = document.querySelectorAll('.color-preset-btn');
  colorBtns.forEach(btn => btn.classList.remove('active'));
  slidesState.forEach(slide => renderSlideCanvas(slide.id));
}

// --------------------------------------------------------------------------
// 4. MULTI-SLIDE & PHOTO MANAGEMENT (STRICT MAX 5 LIMIT)
// --------------------------------------------------------------------------
function addNewSlide() {
  const slideNum = slidesState.length + 1;
  const newSlide = {
    id: 'slide-' + Date.now(),
    title: `Slide ${slideNum} (Paket Resi)`,
    layout: 'horizontal',
    photos: []
  };
  slidesState.push(newSlide);
  renderSlidesListUI();
  showToast(`Slide ${slideNum} berhasil ditambahkan!`, 'success');
}

function removeSlide(slideId) {
  if (slidesState.length <= 1) {
    showToast('Minimal 1 slide harus ada di halaman.', 'warning');
    return;
  }
  slidesState = slidesState.filter(s => s.id !== slideId);
  renderSlidesListUI();
  showToast('Slide berhasil dihapus.', 'info');
}

function updateSlideTitle(slideId, title) {
  const slide = slidesState.find(s => s.id === slideId);
  if (slide) {
    slide.title = title || 'Slide Tanpa Judul';
  }
}

function updateSlideLayout(slideId, layout) {
  const slide = slidesState.find(s => s.id === slideId);
  if (slide) {
    slide.layout = layout;
    renderSlideCanvas(slideId);
  }
}

function handlePhotoUploadInput(event, slideId) {
  const files = Array.from(event.target.files);
  if (!files || files.length === 0) return;
  addPhotosToSlide(slideId, files);
  event.target.value = ''; // reset file input
}

function addPhotosToSlide(slideId, files) {
  const slide = slidesState.find(s => s.id === slideId);
  if (!slide) return;

  const currentCount = slide.photos.length;
  const availableSlots = 5 - currentCount;

  if (availableSlots <= 0) {
    showToast('🔒 Proteksi Batas: Maksimal 5 FOTO PER SLIDE!', 'error');
    return;
  }

  let filesToProcess = files;
  if (files.length > availableSlots) {
    filesToProcess = files.slice(0, availableSlots);
    showToast(`Hanya ${availableSlots} foto pertama yang ditambahkan (Batas 5 foto per slide).`, 'warning');
  }

  let loadedCount = 0;
  filesToProcess.forEach(file => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        slide.photos.push({
          id: 'photo-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
          url: e.target.result,
          imgObj: img,
          name: file.name,
          width: img.width,
          height: img.height,
          aspectRatio: img.width / img.height
        });
        loadedCount++;
        if (loadedCount === filesToProcess.length) {
          renderSlideCardPhotosUI(slideId);
          renderSlideCanvas(slideId);
        }
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

function removePhotoFromSlide(slideId, photoId) {
  const slide = slidesState.find(s => s.id === slideId);
  if (slide) {
    slide.photos = slide.photos.filter(p => p.id !== photoId);
    renderSlideCardPhotosUI(slideId);
    renderSlideCanvas(slideId);
  }
}

// --------------------------------------------------------------------------
// 5. SLIDE UI RENDERER
// --------------------------------------------------------------------------
function renderSlidesListUI() {
  const container = document.getElementById('slides-list');
  container.innerHTML = '';

  slidesState.forEach((slide, index) => {
    const slideCard = document.createElement('div');
    slideCard.className = 'slide-card glass-panel';
    slideCard.id = `card-${slide.id}`;

    slideCard.innerHTML = `
      <div class="slide-card-header">
        <div class="slide-title-input-wrap">
          <span class="slide-number-badge">Slide ${index + 1}</span>
          <input type="text" class="slide-title-input" value="${escapeHtml(slide.title)}"
                 placeholder="Nama Slide / Paket Resi..."
                 onchange="updateSlideTitle('${slide.id}', this.value)">
        </div>

        <div class="slide-controls-right">
          <span id="badge-count-${slide.id}" class="photo-count-indicator ${slide.photos.length >= 5 ? 'count-max' : 'count-normal'}">
            <i class="fa-solid fa-camera"></i> ${slide.photos.length}/5 Foto
          </span>

          <select class="form-select" style="width: auto; padding: 6px 12px;" onchange="updateSlideLayout('${slide.id}', this.value)">
            <option value="horizontal" ${slide.layout === 'horizontal' ? 'selected' : ''}>Horizontal (Menyamping)</option>
            <option value="vertical" ${slide.layout === 'vertical' ? 'selected' : ''}>Vertikal (Ditumpuk)</option>
            <option value="grid" ${slide.layout === 'grid' ? 'selected' : ''}>Grid 2x2 / Auto Grid</option>
            <option value="featured" ${slide.layout === 'featured' ? 'selected' : ''}>Utama / Featured</option>
          </select>

          <button class="btn btn-sm btn-outline-danger" title="Hapus Slide" onclick="removeSlide('${slide.id}')">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </div>

      <div id="photos-strip-${slide.id}" class="slide-photos-strip">
        <!-- Rendered by renderSlideCardPhotosUI -->
      </div>

      <div class="slide-preview-box">
        <canvas id="canvas-${slide.id}" class="canvas-element"></canvas>
        <img id="preview-img-${slide.id}" class="preview-img-result hidden" alt="Canvas Preview">
        <div id="preview-placeholder-${slide.id}" class="preview-placeholder">
          <i class="fa-solid fa-cloud-arrow-up"></i>
          <p>Tambahkan foto di atas untuk menampilkan pratinjau canvas.</p>
        </div>

        <div class="slide-actions-toolbar">
          <button class="btn btn-sm btn-secondary" onclick="openLightbox('${slide.id}')">
            <i class="fa-solid fa-expand"></i> Perbesar
          </button>
          <button class="btn btn-sm btn-primary-blue" onclick="createSlideShortlink('${slide.id}')">
            <i class="fa-solid fa-link"></i> Buat Link
          </button>
          <button class="btn btn-sm btn-whatsapp" onclick="shareSlideToWhatsApp('${slide.id}')">
            <i class="fa-brands fa-whatsapp"></i> Share WhatsApp
          </button>
          <button class="btn btn-sm btn-primary-red" onclick="downloadSingleSlide('${slide.id}')">
            <i class="fa-solid fa-download"></i> Unduh Slide
          </button>
        </div>
      </div>
    `;

    container.appendChild(slideCard);
    renderSlideCardPhotosUI(slide.id);
    renderSlideCanvas(slide.id);
  });
}

function renderSlideCardPhotosUI(slideId) {
  const slide = slidesState.find(s => s.id === slideId);
  if (!slide) return;

  const strip = document.getElementById(`photos-strip-${slideId}`);
  const countBadge = document.getElementById(`badge-count-${slideId}`);
  if (!strip) return;

  // Update photo counter badge
  if (countBadge) {
    countBadge.className = `photo-count-indicator ${slide.photos.length >= 5 ? 'count-max' : 'count-normal'}`;
    countBadge.innerHTML = `<i class="fa-solid fa-camera"></i> ${slide.photos.length}/5 Foto`;
  }

  strip.innerHTML = '';

  // Render Thumbnails
  slide.photos.forEach(photo => {
    const thumb = document.createElement('div');
    thumb.className = 'photo-thumb-item';
    thumb.innerHTML = `
      <img src="${photo.url}" alt="${escapeHtml(photo.name)}">
      <button class="photo-thumb-remove" title="Hapus foto" onclick="removePhotoFromSlide('${slideId}', '${photo.id}')">
        <i class="fa-solid fa-xmark"></i>
      </button>
    `;
    strip.appendChild(thumb);
  });

  // Render Add Button (if < 5 photos)
  const isFull = slide.photos.length >= 5;
  const addBtn = document.createElement('label');
  addBtn.className = `add-photo-btn ${isFull ? 'disabled' : ''}`;
  addBtn.innerHTML = `
    <input type="file" accept="image/*" multiple style="display:none;" ${isFull ? 'disabled' : ''} onchange="handlePhotoUploadInput(event, '${slideId}')">
    <i class="fa-solid fa-plus"></i>
    <span>${isFull ? 'Maks 5' : 'Tambah'}</span>
  `;
  strip.appendChild(addBtn);
}

// --------------------------------------------------------------------------
// 6. CANVAS RENDERING ENGINE (HORIZONTAL, VERTICAL, GRID, FEATURED)
// --------------------------------------------------------------------------
function renderSlideCanvas(slideId) {
  const slide = slidesState.find(s => s.id === slideId);
  if (!slide) return;

  const canvas = document.getElementById(`canvas-${slideId}`);
  const imgResult = document.getElementById(`preview-img-${slideId}`);
  const placeholder = document.getElementById(`preview-placeholder-${slideId}`);
  if (!canvas || !imgResult || !placeholder) return;

  if (slide.photos.length === 0) {
    imgResult.classList.add('hidden');
    placeholder.classList.remove('hidden');
    return;
  }

  placeholder.classList.add('hidden');
  imgResult.classList.remove('hidden');

  const ctx = canvas.getContext('2d');
  const photos = slide.photos;
  const count = photos.length;

  const targetWidth = globalConfig.maxResolution;
  const gap = globalConfig.gap;
  const margin = globalConfig.margin;
  const radius = globalConfig.radius;

  let canvasW = targetWidth;
  let canvasH = targetWidth;

  // Calculate layout coordinates for photos
  let layoutBoxes = []; // Array of { x, y, w, h, photo }

  if (slide.layout === 'horizontal') {
    // Equal height calculation
    const contentW = canvasW - (margin * 2) - (gap * (count - 1));
    const totalAspect = photos.reduce((acc, p) => acc + p.aspectRatio, 0);
    const contentH = contentW / totalAspect;
    canvasH = Math.round(contentH + (margin * 2));

    let currentX = margin;
    photos.forEach(p => {
      const boxW = contentH * p.aspectRatio;
      layoutBoxes.push({ x: currentX, y: margin, w: boxW, h: contentH, photo: p });
      currentX += boxW + gap;
    });
  }
  else if (slide.layout === 'vertical') {
    // Equal width stacked
    const contentW = canvasW - (margin * 2);
    let totalHeight = 0;
    const heights = photos.map(p => contentW / p.aspectRatio);
    totalHeight = heights.reduce((acc, h) => acc + h, 0) + (gap * (count - 1));
    canvasH = Math.round(totalHeight + (margin * 2));

    let currentY = margin;
    photos.forEach((p, idx) => {
      const boxH = heights[idx];
      layoutBoxes.push({ x: margin, y: currentY, w: contentW, h: boxH, photo: p });
      currentY += boxH + gap;
    });
  }
  else if (slide.layout === 'grid') {
    // Balanced Grid (1, 2, 3, 4, 5 photos)
    const contentW = canvasW - (margin * 2);
    if (count === 1) {
      const contentH = contentW / photos[0].aspectRatio;
      canvasH = Math.round(contentH + (margin * 2));
      layoutBoxes.push({ x: margin, y: margin, w: contentW, h: contentH, photo: photos[0] });
    }
    else if (count === 2) {
      const colW = (contentW - gap) / 2;
      const contentH = colW / ((photos[0].aspectRatio + photos[1].aspectRatio) / 2);
      canvasH = Math.round(contentH + (margin * 2));
      layoutBoxes.push({ x: margin, y: margin, w: colW, h: contentH, photo: photos[0] });
      layoutBoxes.push({ x: margin + colW + gap, y: margin, w: colW, h: contentH, photo: photos[1] });
    }
    else if (count === 3) {
      const colW = (contentW - gap) / 2;
      const rowH = colW / 1.33;
      canvasH = Math.round((rowH * 2) + gap + (margin * 2));
      layoutBoxes.push({ x: margin, y: margin, w: colW, h: rowH, photo: photos[0] });
      layoutBoxes.push({ x: margin + colW + gap, y: margin, w: colW, h: rowH, photo: photos[1] });
      layoutBoxes.push({ x: margin, y: margin + rowH + gap, w: contentW, h: rowH, photo: photos[2] });
    }
    else if (count === 4) {
      const colW = (contentW - gap) / 2;
      const rowH = colW / 1.33;
      canvasH = Math.round((rowH * 2) + gap + (margin * 2));
      layoutBoxes.push({ x: margin, y: margin, w: colW, h: rowH, photo: photos[0] });
      layoutBoxes.push({ x: margin + colW + gap, y: margin, w: colW, h: rowH, photo: photos[1] });
      layoutBoxes.push({ x: margin, y: margin + rowH + gap, w: colW, h: rowH, photo: photos[2] });
      layoutBoxes.push({ x: margin + colW + gap, y: margin + rowH + gap, w: colW, h: rowH, photo: photos[3] });
    }
    else if (count === 5) {
      const colW2 = (contentW - gap) / 2;
      const colW3 = (contentW - (gap * 2)) / 3;
      const rowH = colW2 / 1.33;
      canvasH = Math.round((rowH * 2) + gap + (margin * 2));
      // Top 2 photos
      layoutBoxes.push({ x: margin, y: margin, w: colW2, h: rowH, photo: photos[0] });
      layoutBoxes.push({ x: margin + colW2 + gap, y: margin, w: colW2, h: rowH, photo: photos[1] });
      // Bottom 3 photos
      layoutBoxes.push({ x: margin, y: margin + rowH + gap, w: colW3, h: rowH, photo: photos[2] });
      layoutBoxes.push({ x: margin + colW3 + gap, y: margin + rowH + gap, w: colW3, h: rowH, photo: photos[3] });
      layoutBoxes.push({ x: margin + (colW3 * 2) + (gap * 2), y: margin + rowH + gap, w: colW3, h: rowH, photo: photos[4] });
    }
  }
  else if (slide.layout === 'featured') {
    // 1 Main Hero Photo + Supporting Grid
    const contentW = canvasW - (margin * 2);
    if (count === 1) {
      const contentH = contentW / photos[0].aspectRatio;
      canvasH = Math.round(contentH + (margin * 2));
      layoutBoxes.push({ x: margin, y: margin, w: contentW, h: contentH, photo: photos[0] });
    } else {
      const heroW = contentW * 0.6;
      const sideW = contentW * 0.4 - gap;
      const sideCount = count - 1;
      const heroH = heroW / photos[0].aspectRatio;
      canvasH = Math.round(heroH + (margin * 2));
      const sideH = (heroH - (gap * (sideCount - 1))) / sideCount;

      layoutBoxes.push({ x: margin, y: margin, w: heroW, h: heroH, photo: photos[0] });

      let currentY = margin;
      for (let i = 1; i < count; i++) {
        layoutBoxes.push({ x: margin + heroW + gap, y: currentY, w: sideW, h: sideH, photo: photos[i] });
        currentY += sideH + gap;
      }
    }
  }

  // Adjust Aspect Ratio Override if selected
  if (globalConfig.aspectRatio !== 'auto') {
    const ratioParts = globalConfig.aspectRatio.split(':').map(Number);
    const targetRatio = ratioParts[0] / ratioParts[1];
    canvasH = Math.round(canvasW / targetRatio);
  }

  canvas.width = canvasW;
  canvas.height = canvasH;

  // 1. Draw Background Fill
  if (globalConfig.bgColor === 'transparent') {
    ctx.clearRect(0, 0, canvasW, canvasH);
  } else {
    ctx.fillStyle = globalConfig.bgColor;
    ctx.fillRect(0, 0, canvasW, canvasH);
  }

  // 2. Draw Photos with Rounded Radius & Clipping
  layoutBoxes.forEach(box => {
    ctx.save();
    ctx.beginPath();
    drawRoundedRect(ctx, box.x, box.y, box.w, box.h, radius);
    ctx.clip();

    // Cover fit photo inside box
    const img = box.photo.imgObj;
    const imgAspect = box.photo.aspectRatio;
    const boxAspect = box.w / box.h;
    let renderW, renderH, renderX, renderY;

    if (imgAspect > boxAspect) {
      renderH = box.h;
      renderW = box.h * imgAspect;
      renderX = box.x - (renderW - box.w) / 2;
      renderY = box.y;
    } else {
      renderW = box.w;
      renderH = box.w / imgAspect;
      renderX = box.x;
      renderY = box.y - (renderH - box.h) / 2;
    }

    ctx.drawImage(img, renderX, renderY, renderW, renderH);
    ctx.restore();

    // Subtle photo inner border
    ctx.save();
    ctx.beginPath();
    drawRoundedRect(ctx, box.x, box.y, box.w, box.h, radius);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  });

  // 3. Draw Watermark "J&T Ks_Tubun" (Bottom Right)
  if (globalConfig.enableWatermark) {
    ctx.save();
    const wmText = "J&T Ks_Tubun";
    const fontSize = Math.max(16, Math.round(canvasW * 0.022));
    ctx.font = `800 ${fontSize}px "Outfit", sans-serif`;
    const textWidth = ctx.measureText(wmText).width;

    const padX = fontSize * 0.8;
    const padY = fontSize * 0.4;
    const pillW = textWidth + (padX * 2);
    const pillH = fontSize + (padY * 2);

    const pillX = canvasW - margin - pillW - 10;
    const pillY = canvasH - margin - pillH - 10;

    // Draw Glass Pill Background
    ctx.fillStyle = 'rgba(230, 0, 18, 0.9)'; // J&T Red Brand
    ctx.beginPath();
    drawRoundedRect(ctx, pillX, pillY, pillW, pillH, 8);
    ctx.fill();

    // Draw Border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw Text
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 4;
    ctx.fillText(wmText, pillX + padX, pillY + pillH - padY - 2);
    ctx.restore();
  }

  // 4. Draw Timestamp Stamp (Bottom Left)
  if (globalConfig.enableTimestamp) {
    ctx.save();
    const timeStr = getFormattedTimestamp(globalConfig.timezone);
    const fontSize = Math.max(14, Math.round(canvasW * 0.018));
    ctx.font = `600 ${fontSize}px "Plus Jakarta Sans", monospace`;
    const textWidth = ctx.measureText(timeStr).width;

    const padX = fontSize * 0.7;
    const padY = fontSize * 0.35;
    const pillW = textWidth + (padX * 2);
    const pillH = fontSize + (padY * 2);

    const pillX = margin + 10;
    const pillY = canvasH - margin - pillH - 10;

    // Dark Glass Pill
    ctx.fillStyle = 'rgba(13, 15, 23, 0.85)';
    ctx.beginPath();
    drawRoundedRect(ctx, pillX, pillY, pillW, pillH, 8);
    ctx.fill();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#f8fafc';
    ctx.fillText(timeStr, pillX + padX, pillY + pillH - padY - 2);
    ctx.restore();
  }

  // Render to Data URL Image
  const dataUrl = canvas.toDataURL(
    globalConfig.format === 'jpg' ? 'image/jpeg' : 'image/png',
    globalConfig.jpgQuality
  );
  imgResult.src = dataUrl;
}

function drawRoundedRect(ctx, x, y, width, height, radius) {
  if (radius <= 0) {
    ctx.rect(x, y, width, height);
    return;
  }
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
}

function getFormattedTimestamp(tzStr) {
  const now = new Date();
  let utcOffset = 7; // WIB
  if (tzStr === 'WITA') utcOffset = 8;
  if (tzStr === 'WIT') utcOffset = 9;

  const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
  const targetTime = new Date(utcTime + (3600000 * utcOffset));

  const dd = String(targetTime.getDate()).padStart(2, '0');
  const mm = String(targetTime.getMonth() + 1).padStart(2, '0');
  const yyyy = targetTime.getFullYear();
  const hh = String(targetTime.getHours()).padStart(2, '0');
  const min = String(targetTime.getMinutes()).padStart(2, '0');
  const ss = String(targetTime.getSeconds()).padStart(2, '0');

  return `🗓️ ${dd}/${mm}/${yyyy} ${hh}:${min}:${ss} ${tzStr}`;
}

// --------------------------------------------------------------------------
// 7. DOWNLOAD & BATCH ZIP EXPORTER
// --------------------------------------------------------------------------
function downloadSingleSlide(slideId) {
  const slide = slidesState.find(s => s.id === slideId);
  if (!slide || slide.photos.length === 0) {
    showToast('Tambahkan foto terlebih dahulu ke slide ini.', 'warning');
    return;
  }

  const canvas = document.getElementById(`canvas-${slideId}`);
  if (!canvas) return;

  const ext = globalConfig.format === 'jpg' ? 'jpg' : 'png';
  const cleanTitle = (slide.title || 'Slide').replace(/[^a-zA-Z0-9_-]/g, '_');
  const fileName = `J&T_Ks_Tubun_${cleanTitle}.${ext}`;

  canvas.toBlob((blob) => {
    saveAs(blob, fileName);
    showToast(`Slide "${slide.title}" berhasil diunduh!`, 'success');
  }, globalConfig.format === 'jpg' ? 'image/jpeg' : 'image/png', globalConfig.jpgQuality);
}

function downloadAllSlidesZip() {
  const activeSlides = slidesState.filter(s => s.photos.length > 0);
  if (activeSlides.length === 0) {
    showToast('Belum ada foto di slide mana pun untuk di-unduh.', 'warning');
    return;
  }

  showToast('Memproses file ZIP untuk seluruh slide...', 'info');

  const zip = new JSZip();
  const folder = zip.folder("Foto_Gabungan_JT_Ks_Tubun");
  const ext = globalConfig.format === 'jpg' ? 'jpg' : 'png';

  let processedCount = 0;
  activeSlides.forEach((slide, idx) => {
    const canvas = document.getElementById(`canvas-${slide.id}`);
    if (canvas) {
      canvas.toBlob((blob) => {
        const cleanTitle = (slide.title || `Slide_${idx + 1}`).replace(/[^a-zA-Z0-9_-]/g, '_');
        const fileName = `${idx + 1}_${cleanTitle}.${ext}`;
        folder.file(fileName, blob);

        processedCount++;
        if (processedCount === activeSlides.length) {
          zip.generateAsync({ type: "blob" }).then((content) => {
            saveAs(content, "Foto_Gabungan_JT_Ks_Tubun.zip");
            showToast("📦 Batch ZIP berhasil dibuat & diunduh!", "success");
          });
        }
      }, globalConfig.format === 'jpg' ? 'image/jpeg' : 'image/png', globalConfig.jpgQuality);
    }
  });
}

function createSlideShortlink(slideId) {
  const slide = slidesState.find(s => s.id === slideId);
  if (!slide || slide.photos.length === 0) {
    showToast('Tambahkan foto terlebih dahulu untuk membuat link.', 'warning');
    return;
  }

  const canvas = document.getElementById(`canvas-${slideId}`);
  if (!canvas) return;

  const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
  processImageUploadToShortlink(dataUrl, `${slide.title}.jpg`);
  switchView('upload');
}

// --------------------------------------------------------------------------
// 8. FITUR 2: UPLOAD FOTO JADI LINK (prnt.sc STYLE & CLIPBOARD PASTE)
// --------------------------------------------------------------------------
function setupEventListeners() {
  const dropzone = document.getElementById('upload-dropzone');

  // Drag & Drop
  if (dropzone) {
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      dropzone.addEventListener(eventName, preventDefaults, false);
    });

    ['dragenter', 'dragover'].forEach(eventName => {
      dropzone.addEventListener(eventName, () => dropzone.classList.add('drag-over'), false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
      dropzone.addEventListener(eventName, () => dropzone.classList.remove('drag-over'), false);
    });

    dropzone.addEventListener('drop', handleDrop, false);
  }

  // Universal Clipboard Paste Listener (Ctrl + V)
  window.addEventListener('paste', handleGlobalPaste);
}

function preventDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
}

function handleDrop(e) {
  const dt = e.dataTransfer;
  const files = dt.files;
  if (files && files.length > 0) {
    handleImageFiles(files);
  }
}

function handleFileSelect(e) {
  const files = e.target.files;
  if (files && files.length > 0) {
    handleImageFiles(files);
  }
}

function handleGlobalPaste(e) {
  const items = (e.clipboardData || e.originalEvent.clipboardData).items;
  let imageFound = false;

  for (let i = 0; i < items.length; i++) {
    if (items[i].type.indexOf('image') !== -1) {
      const file = items[i].getAsFile();
      imageFound = true;
      showToast('📋 Screenshot Clipboard terdeteksi! Memproses unggah...', 'info');
      handleImageFiles([file]);
      break;
    }
  }

  if (imageFound) {
    switchView('upload');
  }
}

function handleImageFiles(files) {
  Array.from(files).forEach(file => {
    if (!file.type.startsWith('image/')) {
      showToast('File harus berupa gambar (JPG, PNG, WEBP).', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      processImageUploadToShortlink(e.target.result, file.name);
    };
    reader.readAsDataURL(file);
  });
}

async function uploadToCloudStorage(dataUrl) {
  // Convert base64 dataUrl to Blob for upload
  let blob = null;
  try {
    const parts = dataUrl.split(';');
    const mime = parts[0].split(':')[1];
    const base64Data = atob(parts[1].split(',')[1]);
    const arrayBuffer = new ArrayBuffer(base64Data.length);
    const uint8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < base64Data.length; i++) {
      uint8Array[i] = base64Data.charCodeAt(i);
    }
    blob = new Blob([arrayBuffer], { type: mime });
  } catch (e) {
    console.error('Error converting dataUrl to blob:', e);
  }

  // Provider 1: tmpfiles.org API (100% CORS-Friendly for local file:// & web)
  if (blob) {
    try {
      const formData = new FormData();
      formData.append('file', blob, 'foto_paket_jnt.jpg');

      const res = await fetch('https://tmpfiles.org/api/v1/upload', {
        method: 'POST',
        body: formData
      });
      const json = await res.json();
      if (json && json.status === 'success' && json.data && json.data.url) {
        // Convert to direct image link
        const directUrl = json.data.url.replace('tmpfiles.org/', 'tmpfiles.org/dl/');
        return {
          url: directUrl,
          viewerUrl: directUrl
        };
      }
    } catch (err) {
      console.warn('Provider 1 (tmpfiles) error:', err);
    }
  }

  // Provider 2: ImgBB API
  const base64Clean = dataUrl.split(',')[1];
  if (base64Clean) {
    try {
      const apiKey = globalConfig.imgbbApiKey.trim() || '6d207e64198ece564b36c1020114b254';
      const formData = new FormData();
      formData.append('image', base64Clean);

      const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data && data.success && data.data && data.data.url) {
        return {
          url: data.data.url,
          viewerUrl: data.data.url_viewer || data.data.url
        };
      }
    } catch (err) {
      console.warn('Provider 2 (ImgBB) error:', err);
    }

    // Provider 3: FreeImageHost API
    try {
      const formData = new FormData();
      formData.append('key', '6d207e64198ece564b36c1020114b254');
      formData.append('action', 'upload');
      formData.append('source', base64Clean);
      formData.append('format', 'json');

      const res = await fetch('https://freeimage.host/api/1/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data && data.image && data.image.url) {
        return {
          url: data.image.url,
          viewerUrl: data.image.url_viewer || data.image.url
        };
      }
    } catch (err) {
      console.warn('Provider 3 (FreeImageHost) error:', err);
    }
  }

  return null;
}

async function processImageUploadToShortlink(dataUrl, fileName) {
  showToast('☁️ Mengunggah foto ke Cloud Server...', 'info', 4000);

  const card = document.getElementById('upload-result-card');
  const thumb = document.getElementById('result-thumb');
  const nameEl = document.getElementById('result-filename');
  const metaEl = document.getElementById('result-filemeta');
  const urlInput = document.getElementById('shortlink-url-input');
  const openBtn = document.getElementById('btn-open-tab');
  const timeStampEl = document.getElementById('result-timestamp');

  const cloudResult = await uploadToCloudStorage(dataUrl);

  let publicUrl = null;
  let shortlink = null;

  if (cloudResult) {
    publicUrl = cloudResult.url;
    shortlink = cloudResult.viewerUrl;
    showToast('🎉 Foto Berhasil Online! Link siap dibagikan ke siapa saja.', 'success', 5000);
  } else {
    // Fallback if completely offline
    publicUrl = dataUrl;
    shortlink = '[MODE OFFLINE - Sambungkan internet untuk dapat link online]';
    showToast('⚠️ Tidak dapat terhubung ke Cloud. Sambungkan internet Anda.', 'error', 5000);
  }

  const timestampStr = getFormattedTimestamp('WIB');

  if (card && thumb && nameEl && urlInput) {
    thumb.src = dataUrl;
    nameEl.textContent = fileName || 'screenshot_paket.png';

    const approxKb = Math.round((dataUrl.length * 0.75) / 1024);
    metaEl.textContent = `Gambar Terunggah • ~${approxKb} KB`;
    urlInput.value = shortlink;
    timeStampEl.textContent = timestampStr;

    if (cloudResult) {
      openBtn.href = publicUrl;
      openBtn.target = '_blank';
      openBtn.onclick = null;
    } else {
      openBtn.href = '#';
      openBtn.target = '_self';
      openBtn.onclick = (e) => {
        e.preventDefault();
        showToast('Mode offline: Foto hanya tersimpan di perangkat ini.', 'warning');
      };
    }

    card.classList.remove('hidden');
    card.scrollIntoView({ behavior: 'smooth' });
  }

  // Save to History
  const historyItem = {
    id: Date.now(),
    fileName: fileName || 'screenshot_paket.png',
    shortlink: shortlink,
    publicUrl: publicUrl,
    dataUrl: dataUrl,
    timestamp: timestampStr
  };

  uploadHistory.unshift(historyItem);
  if (uploadHistory.length > 10) uploadHistory.pop();
  saveUploadHistory();
  renderUploadHistoryUI();
}

function copyShortlinkFromInput() {
  const input = document.getElementById('shortlink-url-input');
  if (input) {
    navigator.clipboard.writeText(input.value).then(() => {
      showToast('📋 Link online berhasil disalin ke clipboard!', 'success');
    }).catch(() => {
      input.select();
      document.execCommand('copy');
      showToast('📋 Link online disalin!', 'success');
    });
  }
}

function copyCustomText(text) {
  navigator.clipboard.writeText(text).then(() => {
    showToast('📋 Link berhasil disalin!', 'success');
  });
}

function loadUploadHistory() {
  const saved = localStorage.getItem('jt_upload_history');
  if (saved) {
    try {
      uploadHistory = JSON.parse(saved);
    } catch (e) {
      uploadHistory = [];
    }
  }
  renderUploadHistoryUI();
}

function saveUploadHistory() {
  localStorage.setItem('jt_upload_history', JSON.stringify(uploadHistory));
}

function clearUploadHistory() {
  uploadHistory = [];
  localStorage.removeItem('jt_upload_history');
  renderUploadHistoryUI();
  showToast('Riwayat unggah telah dibersihkan.', 'info');
}

function renderUploadHistoryUI() {
  const list = document.getElementById('history-list');
  if (!list) return;

  if (uploadHistory.length === 0) {
    list.innerHTML = `
      <div class="empty-history">
        <i class="fa-solid fa-folder-open"></i>
        <p>Belum ada riwayat unggahan foto. Unggah foto atau gunakan Ctrl+V untuk memulai.</p>
      </div>
    `;
    return;
  }

  list.innerHTML = '';
  uploadHistory.forEach(item => {
    const row = document.createElement('div');
    row.className = 'history-item';
    row.innerHTML = `
      <div class="history-left">
        <img src="${item.dataUrl}" class="history-thumb" alt="History thumbnail">
        <div class="history-info">
          <h5>${escapeHtml(item.fileName)}</h5>
          <p>${escapeHtml(item.timestamp)}</p>
        </div>
      </div>
      <div class="history-right">
        <span class="history-link-text">${item.shortlink}</span>
        <button class="btn btn-sm btn-primary-blue" onclick="copyCustomText('${item.shortlink}')">
          <i class="fa-solid fa-copy"></i> Salin
        </button>
        <a href="${item.dataUrl}" target="_blank" class="btn btn-sm btn-secondary" title="Lihat Foto">
          <i class="fa-solid fa-eye"></i>
        </a>
      </div>
    `;
    list.appendChild(row);
  });
}

// --------------------------------------------------------------------------
// 9. LIGHTBOX MODAL INSPECTION & WHATSAPP SHARING
// --------------------------------------------------------------------------
async function shareSlideToWhatsApp(slideId) {
  const slide = slidesState.find(s => s.id === slideId);
  if (!slide || slide.photos.length === 0) {
    showToast('Tambahkan foto terlebih dahulu ke slide ini.', 'warning');
    return;
  }

  const canvas = document.getElementById(`canvas-${slideId}`);
  if (!canvas) return;

  showToast('💬 Mengunggah foto ke Cloud & menyiapkan WhatsApp...', 'info', 4000);

  const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
  const cloudResult = await uploadToCloudStorage(dataUrl);

  let linkUrl = '';
  if (cloudResult && cloudResult.url) {
    linkUrl = cloudResult.url;
  } else {
    showToast('⚠️ Tidak dapat terhubung ke Cloud. Pastikan koneksi internet aktif.', 'error');
    return;
  }

  const slideTitle = slide.title || 'Slide Foto Paket';

  // Format persis sesuai permintaan:
  // FOTO
  // (NAMA FILE)
  // LINK : (LINK FOTONYA)
  const textMsg = 
    `FOTO\n` +
    `${slideTitle}\n` +
    `LINK : ${linkUrl}`;

  const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(textMsg)}`;
  window.open(waUrl, '_blank');
  showToast('📱 Berhasil! Membuka aplikasi WhatsApp...', 'success');
}

function shareUploadResultToWhatsApp() {
  const urlInput = document.getElementById('shortlink-url-input');
  const nameEl = document.getElementById('result-filename');
  if (!urlInput || !urlInput.value || urlInput.value.startsWith('[')) {
    showToast('Belum ada link foto online untuk dibagikan.', 'warning');
    return;
  }

  const fileName = nameEl ? nameEl.textContent : 'Foto Paket';
  const linkUrl = urlInput.value;

  // Format persis sesuai permintaan:
  // FOTO
  // (NAMA FILE)
  // LINK : (LINK FOTONYA)
  const textMsg = 
    `FOTO\n` +
    `${fileName}\n` +
    `LINK : ${linkUrl}`;

  const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(textMsg)}`;
  window.open(waUrl, '_blank');
  showToast('📱 Membuka WhatsApp...', 'success');
}

function openLightbox(slideId) {
  const slide = slidesState.find(s => s.id === slideId);
  if (!slide || slide.photos.length === 0) {
    showToast('Tidak ada gambar untuk diperbesar.', 'warning');
    return;
  }

  const canvas = document.getElementById(`canvas-${slideId}`);
  if (!canvas) return;

  const modal = document.getElementById('lightbox-modal');
  const modalImg = document.getElementById('modal-image-preview');
  const titleEl = document.getElementById('modal-slide-title');
  const downloadBtn = document.getElementById('modal-download-btn');
  const waBtn = document.getElementById('modal-wa-btn');

  modalImg.src = canvas.toDataURL('image/jpeg', 0.95);
  titleEl.innerHTML = `<i class="fa-solid fa-expand text-red"></i> ${escapeHtml(slide.title)}`;
  downloadBtn.onclick = () => downloadSingleSlide(slideId);
  if (waBtn) waBtn.onclick = () => shareSlideToWhatsApp(slideId);

  modal.classList.add('active');
}

function closeLightbox(e) {
  const modal = document.getElementById('lightbox-modal');
  if (modal) modal.classList.remove('active');
}

// --------------------------------------------------------------------------
// 10. TOAST NOTIFICATION SYSTEM
// --------------------------------------------------------------------------
function showToast(message, type = 'info', duration = 3500) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast-item toast-${type}`;

  let iconClass = 'fa-info-circle';
  if (type === 'success') iconClass = 'fa-circle-check';
  if (type === 'warning') iconClass = 'fa-triangle-exclamation';
  if (type === 'error') iconClass = 'fa-circle-xmark';

  toast.innerHTML = `
    <i class="fa-solid ${iconClass} toast-icon"></i>
    <span class="toast-message">${escapeHtml(message)}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// --------------------------------------------------------------------------
// 11. HELPER UTILITIES
// --------------------------------------------------------------------------
function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>"']/g, function(m) {
    return {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    }[m];
  });
}
