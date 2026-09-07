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
// MULTI-LANGUAGE (i18n) DICTIONARY & ENGINE (ID 🇮🇩 / EN 🇬🇧)
// --------------------------------------------------------------------------
let currentLang = localStorage.getItem('jt_app_lang') || 'id';

const i18nDict = {
  id: {
    nav_dashboard: 'Beranda',
    nav_merge: 'Gabung Foto',
    nav_upload: 'Upload Link',
    nav_template: 'Template Kerja',
    nav_delivery: 'Monitor Delivery',
    nav_settings: 'Pengaturan',
    nav_help: 'Butuh Bantuan?',
    nav_faq: 'Panduan & FAQ',

    btn_dashboard: 'Dashboard',
    btn_theme_dark: 'Mode Gelap',
    btn_theme_light: 'Mode Terang',

    hero_welcome: 'Selamat Datang di',
    hero_portal_title: 'SOLUSI KERJA',
    hero_subtitle: 'Solusi Cepat, Modern & Praktis untuk Operasional Harian Anda',

    card1_title: 'Gabung Foto Multi-Slide',
    card1_desc: 'Gabungkan hingga 5 foto per slide dengan watermark J&T & stempel waktu otomatis.',
    card1_tag1: 'Maks 5 Foto',
    card1_tag2: 'Multi-Slide',
    card1_btn: 'Buka Fitur Gabung Foto',
    card1_drop: 'Drag & Drop foto di sini',
    card1_drop_sub: 'atau klik untuk memilih',

    card2_title: 'Upload Foto Jadi Link Online',
    card2_desc: 'Unggah foto atau tempel dari clipboard untuk buat link publik instan.',
    card2_tag1: 'Cloud Storage',
    card2_tag2: 'Clipboard Ctrl+V',
    card2_btn: 'Buka Fitur Upload Link',
    card2_drop: 'Drag & Drop atau Ctrl+V',
    card2_drop_sub: 'untuk upload',

    card3_title: 'Template Kerja (PTMP & Konfirmasi)',
    card3_desc: 'Buat pesan konfirmasi PTMP & Returan otomatis dengan logika waktu pintar.',
    card3_tag1: 'Logika Waktu Pintar',
    card3_tag2: 'Auto WA Chat',
    card3_btn: 'Buka Template Kerja',
    card3_preview: 'Pilih template & kirim otomatis',
    card3_preview_sub: 'ke WhatsApp',

    quick_tools_heading: 'Tools Cepat',
    quick_tool_layout: 'Layout Presisi 4 Variasi',
    quick_tool_timestamp: 'Stempel Waktu Real-Time WITA',
    quick_tool_zip: 'Batch ZIP Exporter',
    quick_tool_paste: 'Universal Clipboard Paste',

    merge_sec_title: 'Penggabung Foto Multi-Slide',
    merge_sec_sub: 'Buat kolase foto paket presisi tinggi dengan stempel waktu & watermark.',
    btn_add_slide: 'Tambah Slide Baru',
    btn_download_zip: 'Unduh Semua Slide (ZIP)',
    btn_share_all_wa: 'Share Semua Foto',
    btn_merge_settings: 'Pengaturan Gabung Foto',

    upload_sec_title: 'Upload Foto Jadi Link Online Publik',
    upload_sec_sub: 'Unggah foto atau tempel dari clipboard (Ctrl + V) untuk buat link publik instan.',
    dropzone_title: 'Tarik & Lepas Foto di Sini, atau Pilih File',
    dropzone_sub: 'Mendukung format JPG, PNG, WEBP, GIF (Maks 10MB)',

    template_sec_title: 'Template Kerja Operasional J&T',
    template_sec_sub: 'Buat pesan konfirmasi otomatis & kirim ke WhatsApp instan.',

    settings_main_title: 'Pengaturan Sistem & Informasi Versi',
    settings_main_subtitle: 'Kelola preference otomatisasi cabang, staff, dan lihat informasi versi aplikasi.',
    settings_info_title: 'Informasi Versi Sistem',
    settings_theme_title: 'Mode Tema Tampilan',
    settings_theme_desc: 'Pilih mode tema tampilan layar yang nyaman untuk mata saat bekerja di siang maupun malam hari:',
    lang_card_title: 'Pilihan Bahasa / Language',
    lang_card_desc: 'Pilih bahasa pengantar sistem operasional (Bahasa Indonesia / English):'
  },
  en: {
    nav_dashboard: 'Home',
    nav_merge: 'Merge Photos',
    nav_upload: 'Upload Link',
    nav_template: 'Work Templates',
    nav_settings: 'Settings',
    nav_help: 'Need Help?',
    nav_faq: 'Guide & FAQ',

    btn_dashboard: 'Dashboard',
    btn_theme_dark: 'Dark Mode',
    btn_theme_light: 'Light Mode',

    hero_welcome: 'Welcome to',
    hero_portal_title: 'Photo Portal',
    hero_subtitle: 'Fast, Modern & Practical Solution for Your Daily Operations',

    card1_title: 'Multi-Slide Photo Merger',
    card1_desc: 'Combine up to 5 photos per slide with J&T watermark & auto timestamps.',
    card1_tag1: 'Max 5 Photos',
    card1_tag2: 'Multi-Slide',
    card1_btn: 'Open Photo Merger',
    card1_drop: 'Drag & Drop photos here',
    card1_drop_sub: 'or click to choose',

    card2_title: 'Upload Photo to Online Link',
    card2_desc: 'Upload photo or paste from clipboard to generate instant public link.',
    card2_tag1: 'Cloud Storage',
    card2_tag2: 'Clipboard Ctrl+V',
    card2_btn: 'Open Upload Link',
    card2_drop: 'Drag & Drop or Ctrl+V',
    card2_drop_sub: 'to upload',

    card3_title: 'Work Templates (PTMP & Confirmation)',
    card3_desc: 'Generate automated PTMP & Return confirmation messages with smart time logic.',
    card3_tag1: 'Smart Time Logic',
    card3_tag2: 'Auto WA Chat',
    card3_btn: 'Open Work Templates',
    card3_preview: 'Select template & send automatically',
    card3_preview_sub: 'to WhatsApp',

    quick_tools_heading: 'Quick Tools',
    quick_tool_layout: '4 Precision Layout Variations',
    quick_tool_timestamp: 'Real-Time WITA Timestamp',
    quick_tool_zip: 'Batch ZIP Exporter',
    quick_tool_paste: 'Universal Clipboard Paste',

    merge_sec_title: 'Multi-Slide Photo Merger',
    merge_sec_sub: 'Create high-precision parcel photo collages with timestamp & watermark.',
    btn_add_slide: 'Add New Slide',
    btn_download_zip: 'Download All Slides (ZIP)',
    btn_share_all_wa: 'Share All Photos',
    btn_merge_settings: 'Photo Merge Settings',

    upload_sec_title: 'Upload Photo to Public Online Link',
    upload_sec_sub: 'Upload photo or paste from clipboard (Ctrl + V) to generate instant public link.',
    dropzone_title: 'Drag & Drop Photo Here, or Choose File',
    dropzone_sub: 'Supports JPG, PNG, WEBP, GIF (Max 10MB)',

    template_sec_title: 'J&T Operational Work Templates',
    template_sec_sub: 'Generate automated confirmation messages & send to WhatsApp instantly.',

    settings_main_title: 'System Settings & Version Info',
    settings_main_subtitle: 'Manage branch and staff automation preferences, and view app version info.',
    settings_info_title: 'System Version Information',
    settings_theme_title: 'Display Theme Mode',
    settings_theme_desc: 'Select display theme mode comfortable for your eyes working day or night:',
    lang_card_title: 'Language Selection / Pilihan Bahasa',
    lang_card_desc: 'Select operational system language (Bahasa Indonesia / English):'
  }
};

function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('jt_app_lang', lang);

  // Update top bar flag button
  const flagIcon = document.getElementById('lang-flag-icon');
  const langText = document.getElementById('lang-btn-text');
  if (flagIcon) flagIcon.textContent = lang === 'en' ? '🇬🇧' : '🇮🇩';
  if (langText) langText.textContent = lang.toUpperCase();

  // Update settings page language card buttons
  const btnId = document.getElementById('lang-btn-id');
  const btnEn = document.getElementById('lang-btn-en');
  const statusTag = document.getElementById('settings-lang-status-tag');

  if (btnId) btnId.classList.toggle('active', lang === 'id');
  if (btnEn) btnEn.classList.toggle('active', lang === 'en');
  if (statusTag) statusTag.textContent = lang === 'en' ? '🇬🇧 English' : '🇮🇩 Indonesian';

  // Apply translations to all data-i18n elements
  const dict = i18nDict[lang] || i18nDict.id;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) {
      el.textContent = dict[key];
    }
  });

  showToast(lang === 'en' ? '🇬🇧 Language switched to English!' : '🇮🇩 Bahasa diubah ke Bahasa Indonesia!', 'info');
}

function toggleLanguage() {
  const targetLang = currentLang === 'id' ? 'en' : 'id';
  setLanguage(targetLang);
}

// --------------------------------------------------------------------------
// 2. INITIALIZATION & ROUTING
// --------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  initThemeMode();
  loadPreferences();
  loadUploadHistory();
  initDefaultSlides();
  setupEventListeners();
  updateGlobalConfigUI();
  startHeaderLiveClock();
  initWitaOffsetUI();
  setLanguage(currentLang);
  initPwaServiceWorker();
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
  const views = ['dashboard', 'merge', 'upload', 'template', 'delivery', 'settings'];
  views.forEach(v => {
    const sec = document.getElementById(`${v}-view`);
    const btn = document.getElementById(`nav-${v}`);
    const sideBtn = document.getElementById(`side-nav-${v}`);
    const mobBtn = document.getElementById(`mobile-nav-${v}`);
    if (sec) sec.classList.toggle('active', v === viewName);
    if (btn) btn.classList.toggle('active', v === viewName);
    if (sideBtn) sideBtn.classList.toggle('active', v === viewName);
    if (mobBtn) mobBtn.classList.toggle('active', v === viewName);
  });

  // Re-render canvases if switching to merge view
  if (viewName === 'merge') {
    slidesState.forEach(s => renderSlideCanvas(s.id));
  }

  if (viewName === 'template') {
    initPTMPDefaults();
  }

  if (viewName === 'settings') {
    initSettingsDefaults();
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function initSettingsDefaults() {
  const savedBranch = localStorage.getItem('jt_saved_branch_name') || 'KS Tubun';
  const savedCity = localStorage.getItem('jt_saved_city_name') || '';
  const savedStaff = localStorage.getItem('jt_saved_staff_name') || 'Imam';

  const branchEl = document.getElementById('settings-branch-name');
  const cityEl = document.getElementById('settings-city-name');
  const staffEl = document.getElementById('settings-staff-name');

  if (branchEl) branchEl.value = savedBranch;
  if (cityEl) cityEl.value = savedCity;
  if (staffEl) staffEl.value = savedStaff;
}

function saveSettingsFromPage() {
  const branchVal = document.getElementById('settings-branch-name')?.value.trim() || 'KS Tubun';
  const cityVal = document.getElementById('settings-city-name')?.value.trim() || '';
  const staffVal = document.getElementById('settings-staff-name')?.value.trim() || 'Imam';

  localStorage.setItem('jt_saved_branch_name', branchVal);
  localStorage.setItem('jt_saved_city_name', cityVal);
  localStorage.setItem('jt_saved_staff_name', staffVal);

  showToast('💾 Preference Nama Cabang & Staff berhasil disimpan!', 'success');
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

function openMergeSettingsModal() {
  const modal = document.getElementById('merge-settings-modal');
  if (modal) {
    updateGlobalConfigUI();
    modal.classList.add('active');
  }
}

function closeMergeSettingsModal(event) {
  if (event && event.target !== event.currentTarget) return;
  const modal = document.getElementById('merge-settings-modal');
  if (modal) modal.classList.remove('active');
}

function openFaqModal() {
  const modal = document.getElementById('faq-help-modal');
  if (modal) modal.classList.add('active');
}

function closeFaqModal(event) {
  if (event && event.target !== event.currentTarget) return;
  const modal = document.getElementById('faq-help-modal');
  if (modal) modal.classList.remove('active');
}

function updateGlobalConfigUI() {
  const qualityEl = document.getElementById('jpg-quality');
  const qualityValEl = document.getElementById('jpg-quality-val');
  const resEl = document.getElementById('canvas-resolution');
  const watermarkEl = document.getElementById('show-watermark');
  const timestampEl = document.getElementById('show-timestamp');
  const watermarkPosEl = document.getElementById('watermark-pos');
  const gapEl = document.getElementById('grid-gap');
  const gapValEl = document.getElementById('grid-gap-val');

  if (qualityEl) qualityEl.value = Math.round(globalConfig.jpgQuality * 100);
  if (qualityValEl) qualityValEl.textContent = Math.round(globalConfig.jpgQuality * 100) + '%';
  if (resEl) resEl.value = globalConfig.maxResolution || 1920;
  if (watermarkEl) watermarkEl.checked = !!globalConfig.enableWatermark;
  if (timestampEl) timestampEl.checked = !!globalConfig.enableTimestamp;
  if (watermarkPosEl) watermarkPosEl.value = globalConfig.watermarkPos || 'bottom-right';
  if (gapEl) gapEl.value = globalConfig.gap || 12;
  if (gapValEl) gapValEl.textContent = (globalConfig.gap || 12) + 'px';

  // Toggle Format Buttons (JPG vs PNG)
  const btnJpg = document.getElementById('fmt-jpg');
  const btnPng = document.getElementById('fmt-png');
  const sliderGroup = document.getElementById('quality-slider-group');

  if (btnJpg) btnJpg.classList.toggle('active', globalConfig.format === 'jpg');
  if (btnPng) btnPng.classList.toggle('active', globalConfig.format === 'png');
  if (sliderGroup) sliderGroup.style.display = (globalConfig.format === 'jpg') ? 'block' : 'none';
}

function updateGlobalConfig() {
  const qualityEl = document.getElementById('jpg-quality');
  const qualityValEl = document.getElementById('jpg-quality-val');
  const resEl = document.getElementById('canvas-resolution');
  const watermarkEl = document.getElementById('show-watermark');
  const timestampEl = document.getElementById('show-timestamp');
  const watermarkPosEl = document.getElementById('watermark-pos');
  const gapEl = document.getElementById('grid-gap');
  const gapValEl = document.getElementById('grid-gap-val');

  if (qualityEl) {
    globalConfig.jpgQuality = parseInt(qualityEl.value) / 100;
    if (qualityValEl) qualityValEl.textContent = Math.round(globalConfig.jpgQuality * 100) + '%';
  }
  if (resEl) globalConfig.maxResolution = parseInt(resEl.value);
  if (watermarkEl) globalConfig.enableWatermark = watermarkEl.checked;
  if (timestampEl) globalConfig.enableTimestamp = timestampEl.checked;
  if (watermarkPosEl) globalConfig.watermarkPos = watermarkPosEl.value;
  if (gapEl) {
    globalConfig.gap = parseInt(gapEl.value);
    if (gapValEl) gapValEl.textContent = globalConfig.gap + 'px';
  }

  // Re-render all slides live
  slidesState.forEach(slide => renderSlideCanvas(slide.id));
}

function setExportFormat(fmt) {
  globalConfig.format = fmt;
  updateGlobalConfigUI();
  slidesState.forEach(slide => renderSlideCanvas(slide.id));
  showToast(`Format output diubah ke ${fmt.toUpperCase()}`, 'info');
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
          <input type="text" id="slide-title-${slide.id}" class="slide-title-input" value="${escapeHtml(slide.title)}"
                 placeholder="Nama Slide / Nomor Resi..."
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

      <!-- Micro Mini Result Badge (Tampilan Hasil Mini Super Ringkas) -->
      <div id="mini-result-box-${slide.id}" class="slide-mini-result-box hidden">
        <img id="preview-img-${slide.id}" class="mini-result-img" alt="Pratinjau Mini" title="Ketuk untuk memperbesar" onclick="openLightbox('${slide.id}')">
        <div class="mini-result-info">
          <span class="mini-result-label"><i class="fa-solid fa-wand-magic-sparkles text-red"></i> Hasil Merged (Mini)</span>
          <span class="mini-result-sub">Ketuk foto atau 'Perbesar' untuk tampilan 4K</span>
        </div>
      </div>

      <!-- Hidden canvas for 4K / Full HD rendering -->
      <canvas id="canvas-${slide.id}" class="canvas-element" style="display:none;"></canvas>

      <!-- Sleek Action Toolbar -->
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
  const miniBox = document.getElementById(`mini-result-box-${slideId}`);
  if (!canvas) return;

  if (slide.photos.length === 0) {
    if (miniBox) miniBox.classList.add('hidden');
    return;
  }

  if (miniBox) miniBox.classList.remove('hidden');

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
  if (imgResult) imgResult.src = dataUrl;
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

function getFormattedTimestamp(tzStr = 'WITA') {
  const now = new Date();
  let targetTime;
  if (tzStr === 'WITA') {
    targetTime = getWitaDate(now);
  } else if (tzStr === 'WIT') {
    targetTime = new Date(now.getTime() + (2 * 3600000));
  } else {
    // WIB
    targetTime = now;
  }

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

async function shareAllSlidesWhatsApp() {
  const activeSlides = slidesState.filter(s => s.photos && s.photos.length > 0);
  if (activeSlides.length === 0) {
    showToast('Tambahkan foto pada slide terlebih dahulu sebelum berbagi!', 'warning');
    return;
  }

  showToast('⏳ Memproses & mengunggah seluruh foto slide ke cloud...', 'info');

  const messageLines = [];

  for (let i = 0; i < activeSlides.length; i++) {
    const slide = activeSlides[i];
    const canvas = document.getElementById(`canvas-${slide.id}`);
    if (!canvas) continue;

    const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
    const uploadRes = await uploadToCloudStorage(dataUrl);

    const slideTitle = slide.title.trim() ? slide.title.trim() : `Slide Foto ${i + 1}`;
    const slideLink = (uploadRes && uploadRes.url) ? uploadRes.url : 'Gagal membuat link';

    // Format requested by user:
    // (NAMA FILE)
    // LINK : (LINK YANG DI BUAT)
    messageLines.push(`📦 *${slideTitle}*\nLINK : ${slideLink}`);
  }

  if (messageLines.length === 0) {
    showToast('Gagal memproses gambar slide.', 'error');
    return;
  }

  const fullMessage = messageLines.join('\n\n');
  const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(fullMessage)}`;
  window.open(waUrl, '_blank');
  showToast('💬 WhatsApp berhasil dibuka dengan seluruh link foto!', 'success');
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
    shortlink = cloudResult.viewerUrl || cloudResult.url;
    showToast('🎉 Foto Berhasil Online! Link siap dibagikan.', 'success', 5000);
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

  showToast('💬 Menyiapkan foto & membuka WhatsApp...', 'info', 4000);

  const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
  const cloudResult = await uploadToCloudStorage(dataUrl);

  let linkUrl = '';
  if (cloudResult && cloudResult.url) {
    linkUrl = cloudResult.url;
  } else {
    showToast('⚠️ Tidak dapat terhubung ke Cloud. Pastikan koneksi internet aktif.', 'error');
    return;
  }

  const slideTitle = slide.title || 'Foto Paket J&T Ks_Tubun';
  const textMsg = `${slideTitle}\nLINK : ${linkUrl}`;

  // 1. Coba Bagikan File Foto Hasil Gabungan Aktual + Teks via Native Share API (HP Smartphone / Chrome)
  try {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    const file = new File([blob], `${slideTitle.replace(/[^a-zA-Z0-9]/g, '_')}.jpg`, { type: 'image/jpeg' });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        title: slideTitle,
        text: textMsg,
        files: [file]
      });
      showToast('📱 Foto & Teks Berhasil Dibagikan ke WhatsApp!', 'success');
      return;
    }
  } catch (err) {
    console.log('Web Share API fallback to WhatsApp URL:', err);
  }

  // 2. Fallback WhatsApp URL untuk Browser Desktop
  const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(textMsg)}`;
  window.open(waUrl, '_blank');
  showToast('📱 Membuka aplikasi WhatsApp...', 'success');
}

async function shareUploadResultToWhatsApp() {
  const urlInput = document.getElementById('shortlink-url-input');
  const nameEl = document.getElementById('result-filename');
  const thumb = document.getElementById('result-thumb');
  if (!urlInput || !urlInput.value || urlInput.value.startsWith('[')) {
    showToast('Belum ada link foto online untuk dibagikan.', 'warning');
    return;
  }

  const fileName = nameEl ? nameEl.textContent : 'Foto Paket';
  const linkUrl = urlInput.value;
  const textMsg = `${fileName}\nLINK : ${linkUrl}`;

  if (thumb && thumb.src && thumb.src.startsWith('data:image')) {
    try {
      const res = await fetch(thumb.src);
      const blob = await res.blob();
      const file = new File([blob], fileName, { type: 'image/jpeg' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: fileName,
          text: textMsg,
          files: [file]
        });
        showToast('📱 Foto & Teks Berhasil Dibagikan ke WhatsApp!', 'success');
        return;
      }
    } catch (err) {
      console.log('Web Share API fallback:', err);
    }
  }

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

// --------------------------------------------------------------------------
// 12. TEMPLATE KERJA OPERASIONAL PTMP ENGINE & AUTO-SAVE PREFERENCES
// --------------------------------------------------------------------------
function loadPreferences() {
  const savedBranch = localStorage.getItem('jt_saved_branch_name');
  const savedStaff = localStorage.getItem('jt_saved_staff_name');

  if (savedBranch) {
    const ptmpBranch = document.getElementById('ptmp-branch-name');
    const returanBranch = document.getElementById('returan-branch-name');
    if (ptmpBranch) ptmpBranch.value = savedBranch;
    if (returanBranch) returanBranch.value = savedBranch;
  }

  if (savedStaff) {
    const ptmpStaff = document.getElementById('ptmp-staff-name');
    if (ptmpStaff) ptmpStaff.value = savedStaff;
  }
}

function saveUserPreferences() {
  const ptmpBranch = document.getElementById('ptmp-branch-name')?.value.trim();
  const returanBranch = document.getElementById('returan-branch-name')?.value.trim();
  const ptmpCity = document.getElementById('ptmp-city-name')?.value.trim();
  const ptmpStaff = document.getElementById('ptmp-staff-name')?.value.trim();

  const branchToSave = ptmpBranch || returanBranch;
  if (branchToSave) {
    localStorage.setItem('jt_saved_branch_name', branchToSave);
  }

  if (ptmpCity !== undefined) {
    localStorage.setItem('jt_saved_city_name', ptmpCity);
  }

  if (ptmpStaff) {
    localStorage.setItem('jt_saved_staff_name', ptmpStaff);
  }
}

function syncBranchName(source) {
  const ptmpBranch = document.getElementById('ptmp-branch-name');
  const returanBranch = document.getElementById('returan-branch-name');
  const podBranch = document.getElementById('podcancel-branch-name');

  const activeVal = source === 'ptmp' ? ptmpBranch?.value : (source === 'returan' ? returanBranch?.value : podBranch?.value);

  if (activeVal !== undefined) {
    if (ptmpBranch) ptmpBranch.value = activeVal;
    if (returanBranch) returanBranch.value = activeVal;
    if (podBranch) podBranch.value = activeVal;
    localStorage.setItem('jt_saved_branch_name', activeVal);
  }
}

function initPTMPDefaults() {
  loadPreferences();
  const savedBranch = localStorage.getItem('jt_saved_branch_name');
  const savedCity = localStorage.getItem('jt_saved_city_name');
  const savedStaff = localStorage.getItem('jt_saved_staff_name');

  const ptmpBranch = document.getElementById('ptmp-branch-name');
  const ptmpCity = document.getElementById('ptmp-city-name');
  const ptmpStaff = document.getElementById('ptmp-staff-name');

  if (ptmpBranch && savedBranch) ptmpBranch.value = savedBranch;
  if (ptmpCity && savedCity !== null) ptmpCity.value = savedCity;
  if (ptmpStaff && savedStaff) ptmpStaff.value = savedStaff;

  updatePTMPPreview();
}

function generatePTMPMessage() {
  const branchName = document.getElementById('ptmp-branch-name')?.value.trim() || 'KS Tubun';
  const cityName = document.getElementById('ptmp-city-name')?.value.trim() || '';
  const role = document.getElementById('ptmp-role')?.value || 'Admin';
  const staffName = document.getElementById('ptmp-staff-name')?.value.trim() || 'Imam';
  const customerName = document.getElementById('ptmp-customer-name')?.value.trim() || 'Budi Santoso';
  const resi = document.getElementById('ptmp-resi')?.value.trim() || 'JX123456789';

  const fullBranchStr = cityName ? `${branchName} ${cityName}` : branchName;

  return (
    `Halo kak, kami J&T EXPRESS *${fullBranchStr}*.\n\n` +
    `Kami mau konfirmasi paket kakak atas nama *${customerName}* dengan resi *${resi}*\n` +
    `Mohon maaf, kurir kami sempat salah melakukan pengantaran, tetapi paket sudah diantarkan kembali ke alamat yang benar.\n` +
    `Apakah paket sudah diterima, kak? Mohon konfirmasinya yaa kak.\n\n` +
    `Terima kasih 🙏\n` +
    `Tertanda\n` +
    `${role} ${staffName}`
  );
}

function updatePTMPPreview(showFeedback = false) {
  const textarea = document.getElementById('ptmp-output-text');
  if (!textarea) return;

  const msg = generatePTMPMessage();
  textarea.value = msg;

  if (showFeedback) {
    showToast('⚡ Pesan konfirmasi PTMP berhasil diperbarui!', 'success');
  }
}

function copyPTMPMessage() {
  const message = generatePTMPMessage();
  navigator.clipboard.writeText(message).then(() => {
    showToast('📋 Pesan konfirmasi PTMP berhasil disalin ke clipboard!', 'success');
  }).catch(() => {
    const textarea = document.getElementById('ptmp-output-text');
    if (textarea) {
      textarea.select();
      document.execCommand('copy');
      showToast('📋 Pesan konfirmasi PTMP disalin!', 'success');
    }
  });
}

function sendPTMPWhatsApp() {
  const message = generatePTMPMessage();
  const phoneInput = document.getElementById('ptmp-customer-phone')?.value.trim() || '';

  let waUrl = '';
  if (phoneInput) {
    let cleanPhone = phoneInput.replace(/[^0-9]/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '62' + cleanPhone.substring(1);
    }
    waUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(message)}`;
  } else {
    waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
  }

  window.open(waUrl, '_blank');
  showToast('📱 Membuka aplikasi WhatsApp...', 'success');
}

function switchSubTemplate(subName) {
  const tabPtmp = document.getElementById('tab-ptmp');
  const tabReturan = document.getElementById('tab-returan');
  const tabPodCancel = document.getElementById('tab-podcancel');
  const tabNoWA = document.getElementById('tab-nowa');

  const secPtmp = document.getElementById('subtemplate-ptmp');
  const secReturan = document.getElementById('subtemplate-returan');
  const secPodCancel = document.getElementById('subtemplate-podcancel');
  const secNoWA = document.getElementById('subtemplate-nowa');

  if (tabPtmp) tabPtmp.classList.toggle('active', subName === 'ptmp');
  if (tabReturan) tabReturan.classList.toggle('active', subName === 'returan');
  if (tabPodCancel) tabPodCancel.classList.toggle('active', subName === 'podcancel');
  if (tabNoWA) tabNoWA.classList.toggle('active', subName === 'nowa');

  if (secPtmp) secPtmp.classList.toggle('hidden', subName !== 'ptmp');
  if (secReturan) secReturan.classList.toggle('hidden', subName !== 'returan');
  if (secPodCancel) secPodCancel.classList.toggle('hidden', subName !== 'podcancel');
  if (secNoWA) secNoWA.classList.toggle('hidden', subName !== 'nowa');

  if (subName === 'ptmp') {
    initPTMPDefaults();
  } else if (subName === 'returan') {
    initReturanDefaults();
  } else if (subName === 'podcancel') {
    initPODCancelDefaults();
  } else if (subName === 'nowa') {
    initNoWADefaults();
  }
}

// --------------------------------------------------------------------------
// 13. TEMPLATE #2: PTMP RETURAN ENGINE
// --------------------------------------------------------------------------
function formatSmartDateTime(dateStr, timeStr, tzStr = 'WITA') {
  const todayObj = new Date();
  const yyyy = todayObj.getFullYear();
  const mm = String(todayObj.getMonth() + 1).padStart(2, '0');
  const dd = String(todayObj.getDate()).padStart(2, '0');
  const todayYMD = `${yyyy}-${mm}-${dd}`;

  const yestObj = new Date();
  yestObj.setDate(todayObj.getDate() - 1);
  const yestYyyy = yestObj.getFullYear();
  const yestMm = String(yestObj.getMonth() + 1).padStart(2, '0');
  const yestDd = String(yestObj.getDate()).padStart(2, '0');
  const yestYMD = `${yestYyyy}-${yestMm}-${yestDd}`;

  let formattedTime = '15.30';
  if (timeStr) {
    formattedTime = timeStr.replace(':', '.');
  }

  if (!dateStr || dateStr === todayYMD) {
    return `hari ini pukul ${formattedTime} ${tzStr}`;
  } else if (dateStr === yestYMD) {
    return `kemarin pukul ${formattedTime} ${tzStr}`;
  } else {
    try {
      const parts = dateStr.split('-');
      const year = parseInt(parts[0]);
      const month = parseInt(parts[1]) - 1;
      const day = parseInt(parts[2]);
      const targetDate = new Date(year, month, day);

      const daysIndo = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
      const monthsIndo = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
      ];

      const dayName = daysIndo[targetDate.getDay()];
      const monthName = monthsIndo[targetDate.getMonth()];

      return `${dayName}, ${day} ${monthName} ${year} pukul ${formattedTime} ${tzStr}`;
    } catch (e) {
      return `${dateStr} pukul ${formattedTime} ${tzStr}`;
    }
  }
}

function initReturanDefaults() {
  loadPreferences();
  const dateInput = document.getElementById('returan-date');
  const timeInput = document.getElementById('returan-time');

  if (dateInput && !dateInput.value) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    dateInput.value = `${yyyy}-${mm}-${dd}`;
  }

  if (timeInput && !timeInput.value) {
    const today = new Date();
    const hh = String(today.getHours()).padStart(2, '0');
    const min = String(today.getMinutes()).padStart(2, '0');
    timeInput.value = `${hh}:${min}`;
  }

  updateReturanPreview();
}

function toggleReturanCustomRole() {
  const select = document.getElementById('returan-receiver-role');
  const customInput = document.getElementById('returan-receiver-role-custom');
  if (select && customInput) {
    if (select.value === 'Lainnya') {
      customInput.classList.remove('hidden');
      customInput.focus();
    } else {
      customInput.classList.add('hidden');
    }
  }
}

function generateReturanMessage() {
  const branchName = document.getElementById('returan-branch-name')?.value.trim() || 'KS Tubun';
  const shopName = document.getElementById('returan-shop-name')?.value.trim() || 'Toko Berkah';
  const resi = document.getElementById('returan-resi')?.value.trim() || 'JX123456789';
  const dateVal = document.getElementById('returan-date')?.value || '';
  const timeVal = document.getElementById('returan-time')?.value || '';
  const tzVal = document.getElementById('returan-tz')?.value || 'WITA';
  const receiverName = document.getElementById('returan-receiver-name')?.value.trim() || 'Andi';

  const roleSelect = document.getElementById('returan-receiver-role')?.value || 'Karyawan';
  let receiverRole = roleSelect;
  if (roleSelect === 'Lainnya') {
    receiverRole = document.getElementById('returan-receiver-role-custom')?.value.trim() || 'penerima';
  }

  const roleFormatted = receiverRole.toLowerCase();
  const timeFormatted = formatSmartDateTime(dateVal, timeVal, tzVal);

  return (
    `Permisi Kak, saya dari J&T Express Cabang *${branchName}*.\n\n` +
    `Ingin mengonfirmasi terkait paket retur atas nama *${shopName}* dengan nomor resi *${resi}*.\n\n` +
    `Paket retur tersebut telah dikirim ke alamat pada ${timeFormatted}, dan berdasarkan informasi pengantaran, paket telah diterima oleh *${receiverName}* selaku *${roleFormatted}*.\n\n` +
    `Mohon konfirmasinya, apakah paket tersebut sudah diterima dengan baik?\n\n` +
    `Terima kasih atas konfirmasinya, Kak. 🙏`
  );
}

function updateReturanPreview(showFeedback = false) {
  const textarea = document.getElementById('returan-output-text');
  if (!textarea) return;

  const msg = generateReturanMessage();
  textarea.value = msg;

  if (showFeedback) {
    showToast('⚡ Pesan PTMP Returan berhasil diperbarui!', 'success');
  }
}

function copyReturanMessage() {
  const message = generateReturanMessage();
  navigator.clipboard.writeText(message).then(() => {
    showToast('📋 Pesan PTMP Returan berhasil disalin ke clipboard!', 'success');
  }).catch(() => {
    const textarea = document.getElementById('returan-output-text');
    if (textarea) {
      textarea.select();
      document.execCommand('copy');
      showToast('📋 Pesan PTMP Returan disalin!', 'success');
    }
  });
}

function sendReturanWhatsApp() {
  const message = generateReturanMessage();
  const phoneInput = document.getElementById('returan-phone')?.value.trim() || '';

  let waUrl = '';
  if (phoneInput) {
    let cleanPhone = phoneInput.replace(/[^0-9]/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '62' + cleanPhone.substring(1);
    }
    waUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(message)}`;
  } else {
    waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
  }

  window.open(waUrl, '_blank');
  showToast('📱 Membuka aplikasi WhatsApp...', 'success');
}

// --------------------------------------------------------------------------
// 14. TEMPLATE #3: POD CANCEL ORDER ENGINE
// --------------------------------------------------------------------------
function initPODCancelDefaults() {
  loadPreferences();
  const savedBranch = localStorage.getItem('jt_saved_branch_name');
  const savedCity = localStorage.getItem('jt_saved_city_name');

  const podBranch = document.getElementById('podcancel-branch-name');
  const podCity = document.getElementById('podcancel-city-name');

  if (podBranch && savedBranch) {
    podBranch.value = savedBranch;
  }
  if (podCity && savedCity !== null) {
    podCity.value = savedCity;
  }

  // Set default greeting based on current hour
  const currentHour = new Date().getHours();
  let defaultGreeting = 'siang';
  if (currentHour >= 5 && currentHour < 11) {
    defaultGreeting = 'pagi';
  } else if (currentHour >= 11 && currentHour < 15) {
    defaultGreeting = 'siang';
  } else if (currentHour >= 15 && currentHour < 18) {
    defaultGreeting = 'sore';
  } else {
    defaultGreeting = 'malam';
  }

  const greetingSelect = document.getElementById('podcancel-greeting');
  if (greetingSelect) {
    greetingSelect.value = defaultGreeting;
  }

  updatePODCancelPreview();
}

function togglePODCancelOtherInput() {
  const reasonSelect = document.getElementById('podcancel-reason-select');
  const otherWrap = document.getElementById('podcancel-other-reason-wrap');
  if (reasonSelect && otherWrap) {
    if (reasonSelect.value === 'lainnya') {
      otherWrap.classList.remove('hidden');
    } else {
      otherWrap.classList.add('hidden');
    }
  }
}

function generatePODCancelMessage() {
  const greeting = document.getElementById('podcancel-greeting')?.value || 'siang';
  const branchName = document.getElementById('podcancel-branch-name')?.value.trim() || 'KS Tubun';
  const cityName = document.getElementById('podcancel-city-name')?.value.trim() || '';
  const senderName = document.getElementById('podcancel-sender-name')?.value.trim() || '(Nama Pengirim)';
  const orderNo = document.getElementById('podcancel-order-no')?.value.trim() || '(No. Order)';

  const reasonSelect = document.getElementById('podcancel-reason-select')?.value || 'Salah memasukan detail pesanan';
  let finalReason = reasonSelect;

  if (reasonSelect === 'lainnya') {
    const otherText = document.getElementById('podcancel-other-reason-input')?.value.trim();
    finalReason = otherText ? otherText : '(Alasan Cancel Order)';
  }

  const locationStr = cityName ? `${cityName}, Cabang ${branchName}` : `Cabang ${branchName}`;

  return (
    `Selamat ${greeting} Kak 👋\n` +
    `Kami dari Kurir J&T Express *${locationStr}*.\n\n` +
    `Ingin menanyakan perihal paket *Cancel Order* kiriman Kakak.\n` +
    `*Detail Paket:*\n` +
    `Nama Pengirim : *${senderName}*\n` +
    `No. Order : *${orderNo}*\n\n` +
    `Alasan Cancel Order : *${finalReason}*\n` +
    `Apakah benar Kakak melakukan pembatalan order dengan alasan tersebut?\n\n` +
    `Mohon konfirmasinya ya Kak, ditunggu informasinya. Terima kasih 🙏`
  );
}

function updatePODCancelPreview(showFeedback = false) {
  const textarea = document.getElementById('podcancel-result-text');
  if (!textarea) return;

  const msg = generatePODCancelMessage();
  textarea.value = msg;

  if (showFeedback) {
    showToast('⚡ Pesan POD Cancel Order berhasil diperbarui!', 'success');
  }
}

function copyPODCancelText() {
  const message = generatePODCancelMessage();
  navigator.clipboard.writeText(message).then(() => {
    showToast('📋 Pesan POD Cancel Order berhasil disalin!', 'success');
  }).catch(() => {
    const textarea = document.getElementById('podcancel-result-text');
    if (textarea) {
      textarea.select();
      document.execCommand('copy');
      showToast('📋 Pesan POD Cancel Order disalin!', 'success');
    }
  });
}

function sharePODCancelWhatsApp() {
  const message = generatePODCancelMessage();
  const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
  window.open(waUrl, '_blank');
  showToast('📱 Membuka WhatsApp dengan pesan POD Cancel Order...', 'success');
}

// --------------------------------------------------------------------------
// 15. TEMPLATE #4: NO WA TIDAK TERDAFTAR ENGINE
// --------------------------------------------------------------------------
function formatPhoneWithPlus62(phoneStr, defaultFallback = '') {
  if (!phoneStr) return defaultFallback;
  let trimmed = phoneStr.trim().replace(/[\s\-\(\)]/g, '');
  if (!trimmed) return defaultFallback;

  // STRICT RULE: Hanya nomor yang berawalan '08' yang diubah otomatis menjadi '+628'
  if (trimmed.startsWith('08')) {
    return '+62' + trimmed.substring(1);
  } else if (trimmed.startsWith('628')) {
    return '+' + trimmed;
  } else if (trimmed.startsWith('+628')) {
    return trimmed;
  }

  // Jika awalan 05, 02, atau selain 08, tetap seperti yang diketikkan (tanpa +62)
  return trimmed;
}

function initNoWADefaults() {
  updateNoWAPreview();
}

function toggleNoWAOtherSourceInput() {
  const select = document.getElementById('nowa-source-select');
  const otherWrap = document.getElementById('nowa-other-source-wrap');
  if (select && otherWrap) {
    if (select.value === 'lainnya') {
      otherWrap.classList.remove('hidden');
    } else {
      otherWrap.classList.add('hidden');
    }
  }
}

function generateNoWAMessage() {
  const role = document.getElementById('nowa-role')?.value || 'SPRINTER';
  
  const sourceSelect = document.getElementById('nowa-source-select')?.value || 'ORANG RUMAH';
  let finalSource = sourceSelect;
  if (sourceSelect === 'lainnya') {
    const otherText = document.getElementById('nowa-other-source-input')?.value.trim();
    finalSource = otherText ? otherText.toUpperCase() : 'SUMBER NOMOR';
  }

  const rawInactive = document.getElementById('nowa-inactive-phone')?.value.trim() || '';
  const rawActive = document.getElementById('nowa-active-phone')?.value.trim() || '';
  const customerName = document.getElementById('nowa-customer-name')?.value.trim() || 'NAMA CUSTOMER';

  const formattedInactive = rawInactive ? formatPhoneWithPlus62(rawInactive, 'NO TIDAK AKTIF') : 'NO TIDAK AKTIF';
  const formattedActive = rawActive ? formatPhoneWithPlus62(rawActive, 'NO AKTIFNYA') : 'NO AKTIFNYA';

  return (
    `Permisi Kak, kami dari J&T Express. Saya selaku *${role}* ingin mengonfirmasi perihal paket Kakak.\n\n` +
    `Saya mendapatkan nomor Kakak dari *${finalSource}*, dikarenakan nomor yang tertera pada paket ${formattedInactive} tidak aktif atau tidak terdaftar WhatsApp.\n\n` +
    `Untuk nomor ${formattedActive}, nomor ini merupakan nomor yang aktif dan dapat dihubungi?\n` +
    `Dan apakah benar dengan Kakak a/n *${customerName}*?\n\n` +
    `Mohon konfirmasinya ya Kak, agar paket dapat kami proses dengan baik. Terima kasih 🙏`
  );
}

function updateNoWAPreview(showFeedback = false) {
  const textarea = document.getElementById('nowa-result-text');
  if (!textarea) return;

  const msg = generateNoWAMessage();
  textarea.value = msg;

  if (showFeedback) {
    showToast('⚡ Pesan No WA Tidak Terdaftar berhasil diperbarui!', 'success');
  }
}

function copyNoWAText() {
  const message = generateNoWAMessage();
  navigator.clipboard.writeText(message).then(() => {
    showToast('📋 Pesan No WA Tidak Terdaftar berhasil disalin!', 'success');
  }).catch(() => {
    const textarea = document.getElementById('nowa-result-text');
    if (textarea) {
      textarea.select();
      document.execCommand('copy');
      showToast('📋 Pesan No WA Tidak Terdaftar disalin!', 'success');
    }
  });
}

function shareNoWAWhatsApp() {
  const message = generateNoWAMessage();
  const phoneInput = document.getElementById('nowa-active-phone')?.value.trim() || '';

  let waUrl = '';
  if (phoneInput) {
    let cleanPhone = formatPhoneWithPlus62(phoneInput).replace(/[^0-9]/g, '');
    waUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(message)}`;
  } else {
    waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
  }

  window.open(waUrl, '_blank');
  showToast('📱 Membuka WhatsApp...', 'success');
}

// --------------------------------------------------------------------------
// 14. REAL-TIME WITA CLOCK ENGINE FOR HEADER BANNER
// --------------------------------------------------------------------------
function getWitaDate(baseDate = new Date()) {
  // Device/computer clock in Indonesia is typically set to WIB (UTC+7).
  // WITA (Waktu Indonesia Tengah - Balikpapan UTC+8) is WIB + 1 hour (+1 jam).
  const offsetHours = parseFloat(localStorage.getItem('jt_wita_offset') ?? '1');
  return new Date(baseDate.getTime() + (offsetHours * 3600000));
}

function startHeaderLiveClock() {
  function updateClock() {
    const clockEl = document.getElementById('header-clock-text');
    const dateEl = document.getElementById('header-clock-date');
    const timeEl = document.getElementById('header-clock-time');

    const now = new Date();
    const daysIndo = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const monthsIndo = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];

    const witaDate = getWitaDate(now);

    const dayName = daysIndo[witaDate.getDay()];
    const day = witaDate.getDate();
    const monthName = monthsIndo[witaDate.getMonth()];
    const year = witaDate.getFullYear();

    const hh = String(witaDate.getHours()).padStart(2, '0');
    const mm = String(witaDate.getMinutes()).padStart(2, '0');
    const ss = String(witaDate.getSeconds()).padStart(2, '0');

    if (clockEl) clockEl.textContent = `${dayName}, ${day} ${monthName} ${year} • ${hh}:${mm}:${ss} WITA`;
    if (dateEl) dateEl.textContent = `${dayName}, ${day} ${monthName} ${year}`;
    if (timeEl) timeEl.textContent = `${hh}:${mm}:${ss} WITA`;
  }

  updateClock();
  setInterval(updateClock, 1000);
}

function setWitaOffset(hours) {
  localStorage.setItem('jt_wita_offset', String(hours));
  initWitaOffsetUI();
  showToast(hours === 1 ? '⏰ Jam disesuaikan ke WITA (Waktu Komputer/WIB + 1 Jam)!' : '⏰ Jam disesuaikan langsung ke waktu komputer!', 'success');
}

function initWitaOffsetUI() {
  const offset = parseFloat(localStorage.getItem('jt_wita_offset') ?? '1');
  const tagEl = document.getElementById('settings-tz-status-tag');
  const btnPlus1 = document.getElementById('tz-btn-wita-plus1');
  const btnDirect = document.getElementById('tz-btn-wita-direct');

  if (tagEl) tagEl.textContent = offset === 1 ? 'WITA (Komputer + 1 Jam)' : 'WITA (Sesuai Komputer +0)';
  if (btnPlus1) btnPlus1.classList.toggle('active', offset === 1);
  if (btnDirect) btnDirect.classList.toggle('active', offset === 0);
}

// --------------------------------------------------------------------------
// 15. DARK / LIGHT THEME MODE SWITCHER ENGINE
// --------------------------------------------------------------------------
function initThemeMode() {
  const savedTheme = localStorage.getItem('jt_theme_mode');
  if (savedTheme === 'dark') {
    applyThemeMode('dark');
  } else {
    applyThemeMode('light');
  }
}

function toggleThemeMode() {
  const isDark = document.body.classList.contains('dark-mode');
  const targetTheme = isDark ? 'light' : 'dark';
  applyThemeMode(targetTheme);
  localStorage.setItem('jt_theme_mode', targetTheme);

  if (targetTheme === 'dark') {
    showToast('🌙 Mode Gelap diaktifkan!', 'info');
  } else {
    showToast('☀️ Mode Terang diaktifkan!', 'info');
  }
}

function applyThemeMode(theme) {
  const btnIcon = document.querySelector('#theme-toggle-btn i');
  const btnText = document.getElementById('theme-btn-text');
  const tagEl = document.getElementById('settings-theme-status-tag');
  const btnLight = document.getElementById('theme-btn-light');
  const btnDark = document.getElementById('theme-btn-dark');

  if (theme === 'dark') {
    document.body.classList.add('dark-mode');
    if (btnIcon) btnIcon.className = 'fa-solid fa-sun text-yellow-glow';
    if (btnText) btnText.textContent = 'Mode Terang';
    if (tagEl) tagEl.textContent = 'Mode Gelap Active';
    if (btnLight) btnLight.classList.remove('active');
    if (btnDark) btnDark.classList.add('active');
  } else {
    document.body.classList.remove('dark-mode');
    if (btnIcon) btnIcon.className = 'fa-solid fa-moon';
    if (btnText) btnText.textContent = 'Mode Gelap';
    if (tagEl) tagEl.textContent = 'Mode Terang Active';
    if (btnLight) btnLight.classList.add('active');
    if (btnDark) btnDark.classList.remove('active');
  }
  localStorage.setItem('jt_theme_mode', theme);
}

// --------------------------------------------------------------------------
// 16. PWA (PROGRESSIVE WEB APP) SERVICE WORKER & INSTALLATION ENGINE
// --------------------------------------------------------------------------
let deferredPwaPrompt = null;

function initPwaServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').then((registration) => {
        console.log('PWA ServiceWorker registered with scope:', registration.scope);
      }).catch((err) => {
        console.log('PWA ServiceWorker registration failed:', err);
      });
    });
  }

  // Capture PWA Install Prompt
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPwaPrompt = e;

    // Show Install Buttons
    const btnTop = document.getElementById('pwa-install-btn');
    const btnHero = document.getElementById('pwa-hero-install-btn');

    if (btnTop) btnTop.classList.remove('hidden');
    if (btnHero) btnHero.classList.remove('hidden');
  });

  // Check if already installed / standalone
  if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
    console.log('PWA is currently running in Standalone mode!');
  }
}

function triggerPwaInstall() {
  if (deferredPwaPrompt) {
    deferredPwaPrompt.prompt();
    deferredPwaPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        showToast('🎉 Aplikasi J&T Express Berhasil Di-install ke layar HP!', 'success', 6000);
        const btnTop = document.getElementById('pwa-install-btn');
        const btnHero = document.getElementById('pwa-hero-install-btn');
        if (btnTop) btnTop.classList.add('hidden');
        if (btnHero) btnHero.classList.add('hidden');
      } else {
        showToast('Installasi aplikasi dibatalkan.', 'info');
      }
      deferredPwaPrompt = null;
    });
  } else {
    // Fallback info for iOS Safari or browsers without native prompt
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    if (isIOS) {
      alert('📱 Cara Install di iPhone/iPad:\n1. Tekan tombol Share (Ikon Panah di Safari)\n2. Pilih "Tambah ke Layar Utama" (Add to Home Screen)');
    } else {
      showToast('📱 Untuk meng-install aplikasi: Buka menu titik 3 browser Anda, lalu pilih "Tambah ke Layar Utama" / "Install App".', 'info', 7000);
    }
  }
}

// --------------------------------------------------------------------------
// 17. MONITOR DELIVERY & REPORT GENERATOR ENGINE (UNIVERSAL & DYNAMIC)
// --------------------------------------------------------------------------
let generatedDeliveryReportData = null;

function parseDelimitedText(text) {
  const lines = text.split(/\r?\n/).filter(l => l.trim() !== '');
  if (lines.length === 0) return [];
  // Sample first few lines to detect delimiter
  const sample = lines.slice(0, 5).join('\n');
  let delimiter = '\t';
  if ((sample.match(/\t/g) || []).length >= 2) {
    delimiter = '\t';
  } else if ((sample.match(/;/g) || []).length >= 2) {
    delimiter = ';';
  } else if ((sample.match(/,/g) || []).length >= 2) {
    delimiter = ',';
  }
  return lines.map(line => line.split(delimiter).map(c => c.trim()));
}

function handleDeliveryFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  showToast('📄 Membaca file report...', 'info');

  const reader = new FileReader();

  if (file.name.endsWith('.csv') || file.name.endsWith('.txt')) {
    reader.onload = (e) => {
      const text = e.target.result;
      const rows = parseDelimitedText(text);
      parseDeliveryRows(rows);
    };
    reader.readAsText(file);
  } else {
    // Excel file via SheetJS
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });
        parseDeliveryRows(rows);
      } catch (err) {
        console.error(err);
        showToast('❌ Gagal membaca file Excel. Pastikan file valid!', 'error');
      }
    };
    reader.readAsArrayBuffer(file);
  }
}

function processDeliveryPasteInput() {
  const pasteVal = document.getElementById('delivery-paste-input')?.value || '';
  if (!pasteVal.trim()) {
    showToast('⚠️ Silakan tempelkan data teks report terlebih dahulu!', 'warning');
    return;
  }
  const rows = parseDelimitedText(pasteVal);
  parseDeliveryRows(rows);
}

function parseDeliveryRows(rows) {
  if (!rows || rows.length === 0) {
    showToast('⚠️ Data kosong atau format tidak valid!', 'warning');
    return;
  }

  // Detect header row & format type
  let headerIndex = -1;
  let isDetailFormat = false; // true if waybill level data
  let colIndexMap = {
    waybill: -1,
    tanggal: -1,
    dp: -1,
    kode: -1,
    nama: -1,
    totalDeliv: -1,
    ttdNormal: -1,
    waktuTtd: -1,
    ttdRetur: -1
  };

  for (let r = 0; r < Math.min(10, rows.length); r++) {
    const row = rows[r];
    if (!Array.isArray(row)) continue;

    for (let c = 0; c < row.length; c++) {
      const cell = String(row[c] || '').trim().toLowerCase();
      if (cell.includes('waybill') || cell.includes('resi') || cell.includes('no. waybill')) {
        colIndexMap.waybill = c;
        isDetailFormat = true;
      }
      if (cell.includes('tanggal') && colIndexMap.tanggal === -1) {
        colIndexMap.tanggal = c;
      }
      if ((cell.includes('dp delivery') || cell.includes('nama dp') || cell === 'dp') && colIndexMap.dp === -1) {
        colIndexMap.dp = c;
      }
      if ((cell.includes('kode sprinter') || cell === 'kode') && colIndexMap.kode === -1) {
        colIndexMap.kode = c;
      }
      if ((cell.includes('sprinter delivery') || cell === 'nama') && colIndexMap.nama === -1) {
        colIndexMap.nama = c;
      }
      if (cell.includes('total delivery') && colIndexMap.totalDeliv === -1) {
        colIndexMap.totalDeliv = c;
      }
      if ((cell.includes('ttd normal') || cell === 'normal') && colIndexMap.ttdNormal === -1) {
        colIndexMap.ttdNormal = c;
      }
      if (cell.includes('waktu ttd') && colIndexMap.waktuTtd === -1) {
        colIndexMap.waktuTtd = c;
      }
      if ((cell.includes('scan ttd retur') || cell.includes('ttd retur') || cell === 'retur') && colIndexMap.ttdRetur === -1) {
        colIndexMap.ttdRetur = c;
      }
    }

    if (colIndexMap.kode !== -1 || colIndexMap.nama !== -1) {
      headerIndex = r;
      break;
    }
  }

  let startDateStr = '';
  let detectedBranch = '';

  if (isDetailFormat) {
    // ----------------------------------------------------------------------
    // DETAIL FORMAT (Waybill / AWB Level Data)
    // ----------------------------------------------------------------------
    let sprinterMap = {};

    const startLine = headerIndex >= 0 ? headerIndex + 1 : 0;
    for (let r = startLine; r < rows.length; r++) {
      const row = rows[r];
      if (!row || row.length < 3) continue;

      let kode = String(row[colIndexMap.kode !== -1 ? colIndexMap.kode : 6] || '').trim();
      let nama = String(row[colIndexMap.nama !== -1 ? colIndexMap.nama : 7] || '').trim();
      let waktuTtd = String(row[colIndexMap.waktuTtd !== -1 ? colIndexMap.waktuTtd : 16] || '').trim();
      let ttdReturVal = String(row[colIndexMap.ttdRetur !== -1 ? colIndexMap.ttdRetur : 22] || '').trim();
      const dpVal = String(row[colIndexMap.dp !== -1 ? colIndexMap.dp : 2] || '').trim();

      if (dpVal && !detectedBranch && !dpVal.toLowerCase().includes('dp')) {
        detectedBranch = dpVal.replace(/_/g, ' ').toUpperCase();
      }

      if (!kode && !nama) continue;
      if (kode.toLowerCase().includes('kode') || nama.toLowerCase().includes('sprinter')) continue;

      kode = kode.replace(/\.0$/, '');

      const key = kode || nama;
      if (!sprinterMap[key]) {
        sprinterMap[key] = {
          kode: kode,
          nama: nama,
          deliv: 0,
          ttdNorm: 0,
          ttdRetur: 0
        };
      }

      sprinterMap[key].deliv += 1;
      if (waktuTtd && waktuTtd !== '-' && waktuTtd !== '0') {
        sprinterMap[key].ttdNorm += 1;
      }
      if (ttdReturVal && ttdReturVal !== '-' && ttdReturVal !== '0') {
        sprinterMap[key].ttdRetur += 1;
      }
    }

    let parsedSprinters = Object.values(sprinterMap);
    let activeSprinters = parsedSprinters.filter(s => s.deliv > 0);
    activeSprinters.sort((a, b) => b.deliv - a.deliv);

    let offSprinters = parsedSprinters.filter(s => s.deliv === 0);
    offSprinters.sort((a, b) => a.nama.localeCompare(b.nama));

    renderReportDeliveryTableUI(startDateStr, activeSprinters, offSprinters, detectedBranch);
    showToast('✅ Report Delivery berhasil diproses!', 'success');
  } else {
    // ----------------------------------------------------------------------
    // TOTAL FORMAT (Summary Data from J&T Report Delivery Excel / TSV)
    // ----------------------------------------------------------------------
    if (colIndexMap.dp === -1) colIndexMap.dp = 2;
    if (colIndexMap.kode === -1) colIndexMap.kode = 3;
    if (colIndexMap.nama === -1) colIndexMap.nama = 4;
    if (colIndexMap.totalDeliv === -1) colIndexMap.totalDeliv = 5;
    if (colIndexMap.ttdNormal === -1) colIndexMap.ttdNormal = 6;
    if (colIndexMap.ttdRetur === -1) colIndexMap.ttdRetur = 9;

    let parsedSprinters = [];
    const startLine = headerIndex >= 0 ? headerIndex + 1 : 0;

    for (let r = startLine; r < rows.length; r++) {
      const row = rows[r];
      if (!row || row.length < 3) continue;

      const tgl = String(row[colIndexMap.tanggal !== -1 ? colIndexMap.tanggal : 0] || '').trim();
      const dpVal = String(row[colIndexMap.dp !== -1 ? colIndexMap.dp : 2] || '').trim();
      let kode = String(row[colIndexMap.kode !== -1 ? colIndexMap.kode : 3] || '').trim();
      let nama = String(row[colIndexMap.nama !== -1 ? colIndexMap.nama : 4] || '').trim();
      const delivVal = row[colIndexMap.totalDeliv !== -1 ? colIndexMap.totalDeliv : 5];
      const ttdNormVal = row[colIndexMap.ttdNormal !== -1 ? colIndexMap.ttdNormal : 6];
      const ttdReturVal = row[colIndexMap.ttdRetur !== -1 ? colIndexMap.ttdRetur : 9];

      if (!kode && !nama) continue;
      if (kode.toLowerCase().includes('kode') || nama.toLowerCase().includes('sprinter') || kode.toLowerCase().includes('total')) continue;

      if (tgl && !startDateStr && tgl.includes('202')) {
        startDateStr = tgl.split(' ')[0].split('~')[0];
      }

      if (dpVal && !detectedBranch && !dpVal.toLowerCase().includes('dp') && !dpVal.toLowerCase().includes('agent')) {
        detectedBranch = dpVal.replace(/_/g, ' ').toUpperCase();
      }

      kode = kode.replace(/\.0$/, '');

      const deliv = Math.round(parseFloat(String(delivVal).replace(/[^0-9.]/g, '')) || 0);
      const ttdNorm = Math.round(parseFloat(String(ttdNormVal).replace(/[^0-9.]/g, '')) || 0);
      const ttdRetur = Math.round(parseFloat(String(ttdReturVal).replace(/[^0-9.]/g, '')) || 0);

      parsedSprinters.push({
        kode: kode,
        nama: nama,
        deliv: deliv,
        ttdNorm: ttdNorm,
        ttdRetur: ttdRetur
      });
    }

    if (parsedSprinters.length === 0) {
      showToast('⚠️ Gagal membaca baris data sprinter dari input!', 'error');
      return;
    }

    // 100% Dynamic: Only sprinters that actually exist in data are shown!
    let activeSprinters = parsedSprinters.filter(s => s.deliv > 0);
    activeSprinters.sort((a, b) => b.deliv - a.deliv);

    let offSprinters = parsedSprinters.filter(s => s.deliv === 0);
    offSprinters.sort((a, b) => a.nama.localeCompare(b.nama));

    renderReportDeliveryTableUI(startDateStr, activeSprinters, offSprinters, detectedBranch);
    showToast('✅ Report Delivery berhasil diproses!', 'success');
  }
}

let originalDeliveryDataState = null;
let currentDeliverySortCol = 'deliv';
let currentDeliverySortDir = 'desc';

function renderReportDeliveryTableUI(dateStr, activeSprinters, offSprinters, detectedBranch) {
  const outputWrap = document.getElementById('delivery-report-output-wrap');
  if (!outputWrap) return;

  const now = new Date();
  const witaNow = getWitaDate(now);
  const dateFormatted = dateStr || witaNow.toISOString().split('T')[0];
  
  // Update header text
  const daterangeEl = document.getElementById('rd-header-daterange');
  const timeEl = document.getElementById('rd-header-time');
  const branchEl = document.getElementById('rd-header-branch');

  if (daterangeEl) daterangeEl.textContent = `${dateFormatted} 00:00:00 ~ ${dateFormatted} 23:59:59`;
  
  const hh = String(witaNow.getHours()).padStart(2, '0');
  const mm = String(witaNow.getMinutes()).padStart(2, '0');
  if (timeEl) timeEl.textContent = `${hh}:${mm} WITA`;

  const finalBranch = detectedBranch || localStorage.getItem('jt_branch_name') || 'J&T EXPRESS';
  if (branchEl) branchEl.textContent = finalBranch.toUpperCase();

  // Store original unmutated dataset for filtering & sorting
  originalDeliveryDataState = {
    branch: finalBranch,
    dateStr: dateFormatted,
    timeStr: `${hh}:${mm} WITA`,
    activeSprinters: [...activeSprinters],
    offSprinters: [...offSprinters]
  };

  currentDeliverySortCol = 'deliv';
  currentDeliverySortDir = 'desc';

  // Reset filter inputs
  const searchEl = document.getElementById('delivery-search-filter');
  if (searchEl) searchEl.value = '';
  const statusEl = document.getElementById('delivery-status-filter');
  if (statusEl) statusEl.value = 'all';
  const sortEl = document.getElementById('delivery-sort-filter');
  if (sortEl) sortEl.value = 'deliv_desc';

  updatePillButtonsState('all');

  // Apply default filtering & render
  applyDeliveryFilters();

  outputWrap.classList.remove('hidden');
  outputWrap.scrollIntoView({ behavior: 'smooth' });
}

function handleSortDropdownChange(val) {
  const parts = val.split('_');
  currentDeliverySortCol = parts[0];
  currentDeliverySortDir = parts[1] || 'desc';
  applyDeliveryFilters();
}

function handleHeaderSort(col) {
  if (currentDeliverySortCol === col) {
    currentDeliverySortDir = currentDeliverySortDir === 'desc' ? 'asc' : 'desc';
  } else {
    currentDeliverySortCol = col;
    currentDeliverySortDir = (col === 'deliv' || col === 'ttdNorm' || col === 'ttdRetur' || col === 'pct') ? 'desc' : 'asc';
  }

  // Synchronize dropdown if valid
  const sortSelect = document.getElementById('delivery-sort-filter');
  if (sortSelect) {
    const key = `${col}_${currentDeliverySortDir}`;
    if (sortSelect.querySelector(`option[value="${key}"]`)) {
      sortSelect.value = key;
    }
  }

  applyDeliveryFilters();
  const dirLabel = currentDeliverySortDir === 'desc' ? 'Terbesar' : 'Terkecil';
  showToast(`📊 Diurutkan berdasarkan ${col.toUpperCase()} (${dirLabel})`, 'info', 2000);
}

function setQuickStatusFilter(val) {
  const statusEl = document.getElementById('delivery-status-filter');
  if (statusEl) {
    statusEl.value = val;
    updatePillButtonsState(val);
    applyDeliveryFilters();
  }
}

function updatePillButtonsState(activeVal) {
  document.querySelectorAll('.delivery-filter-pill-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.getAttribute('onclick')?.includes(`'${activeVal}'`)) {
      btn.classList.add('active');
    }
  });
}

function resetDeliveryFilters() {
  const searchEl = document.getElementById('delivery-search-filter');
  if (searchEl) searchEl.value = '';
  
  const statusEl = document.getElementById('delivery-status-filter');
  if (statusEl) statusEl.value = 'all';

  const sortEl = document.getElementById('delivery-sort-filter');
  if (sortEl) sortEl.value = 'deliv_desc';

  currentDeliverySortCol = 'deliv';
  currentDeliverySortDir = 'desc';

  updatePillButtonsState('all');
  applyDeliveryFilters();
  showToast('🔄 Filter berhasil di-reset ke tampilan default!', 'info');
}

function applyDeliveryFilters() {
  if (!originalDeliveryDataState) return;

  const tbody = document.getElementById('report-delivery-tbody');
  if (!tbody) return;

  const searchQuery = (document.getElementById('delivery-search-filter')?.value || '').trim().toLowerCase();
  const statusFilter = document.getElementById('delivery-status-filter')?.value || 'all';
  updatePillButtonsState(statusFilter);

  // Update top header sort arrow indicators
  updateHeaderArrowIndicators();

  // Filter Sprinters
  let filteredActive = [...originalDeliveryDataState.activeSprinters];
  let filteredOff = [...originalDeliveryDataState.offSprinters];

  // 1. Text Search Filter
  if (searchQuery) {
    filteredActive = filteredActive.filter(s => 
      s.nama.toLowerCase().includes(searchQuery) || s.kode.toLowerCase().includes(searchQuery)
    );
    filteredOff = filteredOff.filter(s => 
      s.nama.toLowerCase().includes(searchQuery) || s.kode.toLowerCase().includes(searchQuery)
    );
  }

  // 2. Status / Category Filter
  let showActive = true;
  let showOff = true;

  if (statusFilter === 'active') {
    showOff = false;
  } else if (statusFilter === 'tier_90') {
    showOff = false;
    filteredActive = filteredActive.filter(s => {
      const pct = s.deliv > 0 ? ((s.ttdNorm + s.ttdRetur) / s.deliv * 100) : 0;
      return pct >= 89.0;
    });
  } else if (statusFilter === 'tier_70') {
    showOff = false;
    filteredActive = filteredActive.filter(s => {
      const pct = s.deliv > 0 ? ((s.ttdNorm + s.ttdRetur) / s.deliv * 100) : 0;
      return pct >= 70.0 && pct < 89.0;
    });
  } else if (statusFilter === 'tier_50') {
    showOff = false;
    filteredActive = filteredActive.filter(s => {
      const pct = s.deliv > 0 ? ((s.ttdNorm + s.ttdRetur) / s.deliv * 100) : 0;
      return pct >= 50.0 && pct < 70.0;
    });
  } else if (statusFilter === 'tier_under50') {
    showOff = false;
    filteredActive = filteredActive.filter(s => {
      const pct = s.deliv > 0 ? ((s.ttdNorm + s.ttdRetur) / s.deliv * 100) : 0;
      return pct < 50.0;
    });
  } else if (statusFilter === 'ttd_issues') {
    showOff = false;
    filteredActive = filteredActive.filter(s => (s.ttdNorm + s.ttdRetur) > 0);
  } else if (statusFilter === 'off') {
    showActive = false;
  } else if (statusFilter === 'shift1') {
    showOff = false;
  }

  // 3. Sorting
  const sortCol = currentDeliverySortCol;
  const sortDir = currentDeliverySortDir;

  const sortFn = (a, b) => {
    let valA, valB;
    if (sortCol === 'deliv') {
      valA = a.deliv;
      valB = b.deliv;
    } else if (sortCol === 'ttdNorm') {
      valA = a.ttdNorm;
      valB = b.ttdNorm;
    } else if (sortCol === 'ttdRetur') {
      valA = a.ttdRetur;
      valB = b.ttdRetur;
    } else if (sortCol === 'pct') {
      valA = a.deliv > 0 ? ((a.ttdNorm + a.ttdRetur) / a.deliv) : 0;
      valB = b.deliv > 0 ? ((b.ttdNorm + b.ttdRetur) / b.deliv) : 0;
    } else if (sortCol === 'nama') {
      return sortDir === 'asc' ? a.nama.localeCompare(b.nama) : b.nama.localeCompare(a.nama);
    } else if (sortCol === 'kode') {
      return sortDir === 'asc' ? a.kode.localeCompare(b.kode) : b.kode.localeCompare(a.kode);
    } else if (sortCol === 'no') {
      valA = sprinterNoMap[a.kode] || 999;
      valB = sprinterNoMap[b.kode] || 999;
    } else {
      valA = a.deliv;
      valB = b.deliv;
    }
    return sortDir === 'asc' ? valA - valB : valB - valA;
  };

  if (showActive) filteredActive.sort(sortFn);
  if (showOff) filteredOff.sort(sortFn);

  // Render Rows (Khusus Sprinter Saja)
  let html = '';
  let sumDelivery = 0;
  let sumTtdNormal = 0;
  let sumTtdRetur = 0;
  let rowIndex = 1;

  // 2. Active Sprinters Rows
  if (showActive) {
    filteredActive.forEach((s) => {
      sumDelivery += s.deliv;
      sumTtdNormal += s.ttdNorm;
      sumTtdRetur += s.ttdRetur;

      const totalTtd = s.ttdNorm + s.ttdRetur;
      const pct = s.deliv > 0 ? (totalTtd / s.deliv * 100) : 0;
      const pctStr = pct.toFixed(2).replace('.', ',') + '%';

      // Graduated color highlighting
      let pctStyle = '';
      if (pct >= 2.0) {
        pctStyle = 'background: #ff0000 !important; color: #ffffff !important; font-weight: 900;';
      } else if (pct >= 1.0) {
        pctStyle = 'background: #f47b7b !important; color: #ffffff !important; font-weight: 900;';
      } else if (pct > 0) {
        pctStyle = 'background: #f8cecc !important; color: #000000 !important; font-weight: 900;';
      }

      const ttdNormStr = s.ttdNorm > 0 ? s.ttdNorm : '-';
      const ttdReturStr = s.ttdRetur > 0 ? s.ttdRetur : '-';

      const rowNumber = rowIndex++;

      html += `
        <tr>
          <td class="td-center">${rowNumber}</td>
          <td class="td-left">Sprinter</td>
          <td class="td-center td-kode">${s.kode}</td>
          <td class="td-left">${s.nama}</td>
          <td class="td-center" style="color: #ed7d31; font-weight: 700;">SHIFT 1</td>
          <td class="td-center" style="font-weight: 900;">${s.deliv}</td>
          <td class="td-center" style="${s.ttdNorm > 0 ? 'font-weight: 900;' : ''}">${ttdNormStr}</td>
          <td class="td-center">${ttdReturStr}</td>
          <td class="td-center" style="${pctStyle}">${pctStr}</td>
        </tr>
      `;
    });
  }

  // 3. OFF Sprinters Rows
  if (showOff) {
    filteredOff.forEach((s) => {
      sumDelivery += s.deliv;
      sumTtdNormal += s.ttdNorm;
      sumTtdRetur += s.ttdRetur;

      const totalTtd = s.ttdNorm + s.ttdRetur;
      const pct = s.deliv > 0 ? (totalTtd / s.deliv * 100) : 0;
      const pctStr = pct.toFixed(2).replace('.', ',') + '%';

      const rowNumber = rowIndex++;

      html += `
        <tr class="tr-off-row">
          <td class="td-center">${rowNumber}</td>
          <td class="td-left">Sprinter</td>
          <td class="td-center td-kode">${s.kode}</td>
          <td class="td-left">${s.nama}</td>
          <td class="td-center">OFF</td>
          <td class="td-center">${s.deliv > 0 ? s.deliv : '-'}</td>
          <td class="td-center">${s.ttdNorm > 0 ? s.ttdNorm : '-'}</td>
          <td class="td-center">${s.ttdRetur > 0 ? s.ttdRetur : '-'}</td>
          <td class="td-center">0,00%</td>
        </tr>
      `;
    });
  }

  if (filteredActive.length === 0 && filteredOff.length === 0) {
    html += `
      <tr>
        <td colspan="9" style="text-align: center; padding: 24px; color: #64748b; font-style: italic;">
          🔍 Tidak ada data sprinter yang sesuai dengan pencarian / filter ini.
        </td>
      </tr>
    `;
  }

  tbody.innerHTML = html;

  // Calculate & Render Footer Totals
  const overallTtd = sumTtdNormal + sumTtdRetur;
  const overallPct = sumDelivery > 0 ? (overallTtd / sumDelivery * 100) : 0;
  const overallPctStr = overallPct.toFixed(2).replace('.', ',') + '%';

  document.getElementById('rd-total-delivery').textContent = sumDelivery.toLocaleString('id-ID');
  document.getElementById('rd-total-ttd-normal').textContent = sumTtdNormal > 0 ? sumTtdNormal : '-';
  document.getElementById('rd-total-ttd-retur').textContent = sumTtdRetur > 0 ? sumTtdRetur : '-';
  
  const pctFooterEl = document.getElementById('rd-total-percentage');
  if (pctFooterEl) {
    pctFooterEl.textContent = overallPctStr;
    pctFooterEl.style.cssText = 'background: #ff0000 !important; color: #ffffff !important; font-weight: 900 !important; text-align: center;';
  }

  // Update Summary Tag
  const summaryTag = document.getElementById('delivery-report-summary-tag');
  if (summaryTag) {
    const filterTag = statusFilter !== 'all' ? ` [Filter: ${statusFilter.toUpperCase()}]` : '';
    summaryTag.textContent = `Total Delivery: ${sumDelivery.toLocaleString('id-ID')} | TTD: ${sumTtdNormal} (${overallPctStr})${filterTag}`;
  }

  // Save generated data for WA text / Excel export
  generatedDeliveryReportData = {
    branch: originalDeliveryDataState.branch,
    dateStr: originalDeliveryDataState.dateStr,
    timeStr: originalDeliveryDataState.timeStr,
    sumDelivery: sumDelivery,
    sumTtdNormal: sumTtdNormal,
    sumTtdRetur: sumTtdRetur,
    overallPctStr: overallPctStr,
    activeSprinters: filteredActive,
    offSprinters: filteredOff,
    filterTitle: statusFilter !== 'all' ? statusFilter : null
  };
}

function updateHeaderArrowIndicators() {
  const cols = ['no', 'pos', 'kode', 'nama', 'ket', 'deliv', 'ttdNorm', 'ttdRetur', 'pct'];
  cols.forEach(col => {
    const arrowTop = document.getElementById(`filter-arrow-top-${col}`);
    if (arrowTop) {
      if (currentDeliverySortCol === col) {
        arrowTop.textContent = currentDeliverySortDir === 'asc' ? '▲' : '▼';
        arrowTop.parentElement?.classList.add('active-sort');
      } else {
        arrowTop.textContent = '▼';
        arrowTop.parentElement?.classList.remove('active-sort');
      }
    }
  });
}

function copyDeliveryWaText() {
  if (!generatedDeliveryReportData) {
    showToast('⚠️ Belum ada data report yang diproses!', 'warning');
    return;
  }

  const d = generatedDeliveryReportData;
  let text = `📊 *REPORT DELIVERY ${d.branch.toUpperCase()}*\n`;
  if (d.filterTitle) {
    let filterLabel = d.filterTitle.toUpperCase();
    if (d.filterTitle === 'ttd_issues') filterLabel = 'TTD BERMASALAH (> 0%)';
    else if (d.filterTitle === 'active') filterLabel = 'SPRINTER AKTIF';
    else if (d.filterTitle === 'tier_90') filterLabel = 'PERSENTASE >= 89%';
    else if (d.filterTitle === 'tier_70') filterLabel = 'PERSENTASE 70% - 88.9%';
    else if (d.filterTitle === 'tier_50') filterLabel = 'PERSENTASE 50% - 69.9%';
    else if (d.filterTitle === 'tier_under50') filterLabel = 'PERSENTASE < 50%';
    text += `🏷️ *FILTER: ${filterLabel}*\n`;
  }
  text += `📅 *${d.dateStr}* (${d.timeStr})\n\n`;
  text += `*SPRINTER DELIVERY:*\n`;

  d.activeSprinters.forEach((s, idx) => {
    const totalTtd = s.ttdNorm + s.ttdRetur;
    const pct = s.deliv > 0 ? (totalTtd / s.deliv * 100) : 0;
    const pctStr = pct.toFixed(2).replace('.', ',') + '%';

    // Percentage color indicators:
    // >= 89%        -> 🟢
    // 70% - 88.99%  -> 🟡
    // 50% - 69.99%  -> 🟠
    // < 50%         -> 🔴
    let colorEmoji = '🔴';
    if (pct >= 89.0) {
      colorEmoji = '🟢';
    } else if (pct >= 70.0) {
      colorEmoji = '🟡';
    } else if (pct >= 50.0) {
      colorEmoji = '🟠';
    } else {
      colorEmoji = '🔴';
    }

    text += `${idx + 1}. *${s.nama}*: ${s.deliv} Paket (TTD: ${s.ttdNorm} | *${pctStr}* ${colorEmoji})\n`;
  });

  if (d.offSprinters.length > 0) {
    text += `\n*SPRINTER OFF / LOW:*\n`;
    d.offSprinters.forEach((s) => {
      text += `• ${s.nama} (${s.deliv > 0 ? s.deliv + ' Paket' : 'OFF'})\n`;
    });
  }

  const target89 = Math.round(d.sumDelivery * 0.89);
  const totalTtdDone = (d.sumTtdNormal || 0) + (d.sumTtdRetur || 0);
  const targetKekurangan = Math.max(0, target89 - totalTtdDone);

  text += `----------------------------------------\n`;
  text += `📦 *TOTAL DELIVERY:* *${d.sumDelivery.toLocaleString('id-ID')} Paket*\n`;
  text += `✍️ *TOTAL TTD:* *${d.sumTtdNormal}* (*${d.overallPctStr}*)\n`;
  text += `🎯 *TARGET PAKET TTD:* *${targetKekurangan.toLocaleString('id-ID')} Paket*\n`;

  navigator.clipboard.writeText(text).then(() => {
    showToast('📋 Pesan Report Delivery berhasil disalin untuk WhatsApp!', 'success');
  }).catch(() => {
    showToast('📋 Pesan berhasil disalin!', 'success');
  });
}

function copyDeliveryTableImage() {
  const targetArea = document.getElementById('delivery-table-capture-area');
  if (!targetArea) return;

  showToast('📸 Mengambil gambar tabel high-res...', 'info');

  html2canvas(targetArea, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#ffffff'
  }).then(canvas => {
    canvas.toBlob(blob => {
      if (navigator.clipboard && navigator.clipboard.write) {
        const item = new ClipboardItem({ 'image/png': blob });
        navigator.clipboard.write([item]).then(() => {
          showToast('📋 Gambar tabel berhasil disalin ke Clipboard! Tinggal Ctrl+V di WA', 'success', 5000);
        }).catch(() => {
          downloadCanvasAsPng(canvas);
        });
      } else {
        downloadCanvasAsPng(canvas);
      }
    });
  }).catch(err => {
    console.error(err);
    showToast('❌ Gagal membuat gambar tabel.', 'error');
  });
}

function downloadCanvasAsPng(canvas) {
  const link = document.createElement('a');
  link.download = `Report_Delivery_${Date.now()}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
  showToast('📥 Gambar tabel berhasil diunduh!', 'success');
}

function exportDeliveryExcel() {
  const table = document.getElementById('report-delivery-table');
  if (!table) return;

  try {
    const wb = XLSX.utils.table_to_book(table, { sheet: "REPORT DELIVERY" });
    XLSX.writeFile(wb, `Report_Delivery_${Date.now()}.xlsx`);
    showToast('📥 File Excel berhasil diunduh!', 'success');
  } catch (err) {
    console.error(err);
    showToast('❌ Gagal membuat file Excel.', 'error');
  }
}

function openDeliveryStaffConfigModal() {
  showToast('ℹ️ Daftar staff default (PIC, Admin, Dispatch, Helper) dapat disesuaikan di Pengaturan.', 'info', 5000);
}
