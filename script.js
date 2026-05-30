/* ============================================================
   ACHADINHOS DA LILU — script.js
   Armazenamento: JSONBin.io (funciona em qualquer navegador)
   ============================================================ */

// ── JSONBin Config ────────────────────────────────────────────
// INSTRUÇÕES: Crie uma conta gratuita em https://jsonbin.io
// 1. Crie um novo Bin com o conteúdo: []
// 2. Copie o BIN ID e a Master Key e cole abaixo
const JSONBIN_BIN_ID  = '6a1a6a22ddf5aa59f77745e3';
const JSONBIN_API_KEY = '$2a$10$Z4HJejDZkl9so/G26RQH7uMhz6m7uH0XFIiO./KTvYbwmLx2yb0DC';
const JSONBIN_URL     = `https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`;

// LocalStorage como cache para funcionar offline
const CACHE_KEY = 'lilu_products_cache';

// ── API helpers ───────────────────────────────────────────────
async function fetchProducts() {
  try {
    const res = await fetch(JSONBIN_URL + '/latest', {
      headers: { 'X-Master-Key': JSONBIN_API_KEY }
    });
    if (!res.ok) throw new Error('fetch failed');
    const data = await res.json();
    const products = Array.isArray(data.record) ? data.record : [];
    localStorage.setItem(CACHE_KEY, JSON.stringify(products));
    return products;
  } catch (e) {
    // Fallback to cache if offline or config not set
    try { return JSON.parse(localStorage.getItem(CACHE_KEY) || '[]'); } catch { return []; }
  }
}

async function pushProducts(products) {
  localStorage.setItem(CACHE_KEY, JSON.stringify(products));
  try {
    await fetch(JSONBIN_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': JSONBIN_API_KEY
      },
      body: JSON.stringify(products)
    });
  } catch (e) {
    console.warn('JSONBin sync failed, saved locally only');
  }
}

// ── Helpers ──────────────────────────────────────────────────
const $ = id => document.getElementById(id);

function showToast(msg) {
  const t = $('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}

// ── Menu ─────────────────────────────────────────────────────
function initMenu() {
  const menuBtn  = $('menu-btn');
  const sideMenu = $('side-menu');
  const overlay  = $('overlay');
  const closeBtn = $('menu-close');

  function open()  { sideMenu.classList.add('open'); overlay.classList.add('open'); document.body.style.overflow = 'hidden'; }
  function close() { sideMenu.classList.remove('open'); overlay.classList.remove('open'); document.body.style.overflow = ''; }

  menuBtn.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', close);
  document.querySelectorAll('.menu-nav a').forEach(a => a.addEventListener('click', close));
}

// ── Search ───────────────────────────────────────────────────
let activeCategory = null;
let searchQuery    = '';
let allProducts    = [];

function initSearch() {
  const input    = $('search-input');
  const clearBtn = $('search-clear');
  input.addEventListener('input', () => {
    searchQuery = input.value.trim().toLowerCase();
    clearBtn.classList.toggle('visible', searchQuery.length > 0);
    renderAll();
  });
  clearBtn.addEventListener('click', () => {
    input.value = ''; searchQuery = '';
    clearBtn.classList.remove('visible');
    renderAll();
  });
}

// ── Category filter ───────────────────────────────────────────
function initCategories() {
  document.querySelectorAll('.cat-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const cat = chip.dataset.cat;
      if (activeCategory === cat) {
        activeCategory = null;
        chip.classList.remove('active');
      } else {
        document.querySelectorAll('.cat-chip').forEach(c => c.classList.remove('active'));
        activeCategory = cat;
        chip.classList.add('active');
      }
      renderAll();
      document.getElementById('side-menu').classList.remove('open');
      document.getElementById('overlay').classList.remove('open');
      document.body.style.overflow = '';
      setTimeout(() => { $('products-section') && $('products-section').scrollIntoView({ behavior: 'smooth' }); }, 200);
    });
  });
}

// ── Filter helper ─────────────────────────────────────────────
function filterProducts(products) {
  return products.filter(p => {
    const matchCat = !activeCategory || p.category === activeCategory;
    const q = searchQuery;
    const matchQ = !q ||
      (p.title || '').toLowerCase().includes(q) ||
      (p.description || '').toLowerCase().includes(q) ||
      (p.category || '').toLowerCase().includes(q);
    return matchCat && matchQ;
  });
}

// ── Render media ─────────────────────────────────────────────
function mediaEl(p) {
  if (p.video) return `<video src="${p.video}" autoplay loop muted playsinline poster="${p.image || ''}"></video>`;
  if (p.image) return `<img src="${p.image}" alt="${p.title}" loading="lazy">`;
  return `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#f0ecff;font-size:2.5rem;">🛍️</div>`;
}

// ── Price formatter ───────────────────────────────────────────
function formatPrice(price) {
  if (!price) return '';
  const p = price.trim();
  if (!p) return '';
  if (p.toLowerCase().startsWith('r$')) return p;
  return 'R$ ' + p;
}

// ── Card extras ───────────────────────────────────────────────
function cardExtras(p) {
  let html = '';
  if (p.store)        html += `<span class="card-store">${p.store}</span>`;
  if (p.freeShipping) html += `<span class="card-free-ship">✓ Frete Grátis</span>`;
  return html ? `<div class="card-extras">${html}</div>` : '';
}

// ── Render Offers ─────────────────────────────────────────────
function renderOffers() {
  const grid    = $('offers-grid');
  const section = $('offers-section');
  if (!grid) return;
  const offers = filterProducts(allProducts.filter(p => p.offerOfDay));
  if (offers.length === 0) { section.style.display = 'none'; return; }
  section.style.display = '';
  grid.innerHTML = offers.map(p => `
    <div class="offer-card" onclick="window.open('${p.affiliateLink}','_blank')">
      <span class="offer-badge">⭐ Oferta do Dia</span>
      <div class="offer-img-wrap">${mediaEl(p)}</div>
      <div class="offer-info">
        <div class="offer-name">${p.title}</div>
        ${p.description ? `<div class="offer-desc">${p.description}</div>` : ''}
        ${formatPrice(p.price) ? `<div class="offer-price">${formatPrice(p.price)}</div>` : ''}
        ${cardExtras(p)}
        <button class="offer-btn" onclick="event.stopPropagation();window.open('${p.affiliateLink}','_blank')">Ver Oferta ↗</button>
      </div>
    </div>
  `).join('');
}

// ── Render Products ───────────────────────────────────────────
function renderProducts() {
  const grid      = $('products-grid');
  const filterBar = $('filter-bar');
  if (!grid) return;
  const filtered = filterProducts(allProducts.filter(p => !p.offerOfDay));
  if (filterBar) {
    filterBar.innerHTML = activeCategory
      ? `<div class="filter-tag">${activeCategory}<button onclick="clearFilter()">✕</button></div>`
      : '';
  }
  if (filtered.length === 0) {
    grid.innerHTML = `<div class="empty-state"><div class="emoji">🔍</div><p>Nenhum produto encontrado.<br>Tente outra busca ou categoria.</p></div>`;
    return;
  }
  grid.innerHTML = filtered.map((p, i) => `
    <div class="product-card" style="animation-delay:${(i % 10) * 0.04}s" onclick="window.open('${p.affiliateLink}','_blank')">
      <div class="product-img-wrap">
        ${mediaEl(p)}
        <span class="product-cat-badge">${p.category}</span>
      </div>
      <div class="product-info">
        <div class="product-name">${p.title}</div>
        ${p.description ? `<div class="product-desc-mini">${p.description}</div>` : ''}
        ${formatPrice(p.price) ? `<div class="product-price">${formatPrice(p.price)}</div>` : ''}
        ${cardExtras(p)}
        <button class="product-btn" onclick="event.stopPropagation();window.open('${p.affiliateLink}','_blank')">Ver Oferta ↗</button>
      </div>
    </div>
  `).join('');
}

window.clearFilter = function () {
  activeCategory = null;
  document.querySelectorAll('.cat-chip').forEach(c => c.classList.remove('active'));
  renderAll();
};

function renderAll() { renderOffers(); renderProducts(); }

// ── Nav scroll-to ─────────────────────────────────────────────
function initNavLinks() {
  $('nav-inicio')  && $('nav-inicio').addEventListener('click',  () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  $('nav-ofertas') && $('nav-ofertas').addEventListener('click', () => $('offers-section').scrollIntoView({ behavior: 'smooth' }));
  $('nav-sobre')   && $('nav-sobre').addEventListener('click',   () => $('about-section').scrollIntoView({ behavior: 'smooth' }));
  $('nav-cats')    && $('nav-cats').addEventListener('click',    () => $('products-section').scrollIntoView({ behavior: 'smooth' }));
}

// ── Hero button ───────────────────────────────────────────────
function initHero() {
  $('hero-btn') && $('hero-btn').addEventListener('click', () => {
    const offerSec = $('offers-section');
    const target = offerSec && offerSec.style.display !== 'none' ? offerSec : $('products-section');
    target && target.scrollIntoView({ behavior: 'smooth' });
  });
}

// ── Load & auto-refresh ───────────────────────────────────────
async function loadAndRender() {
  allProducts = await fetchProducts();
  renderAll();
}

// ── Init ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initMenu();
  initSearch();
  initCategories();
  initNavLinks();
  initHero();

  // Load from cache instantly, then fetch fresh from cloud
  try { allProducts = JSON.parse(localStorage.getItem(CACHE_KEY) || '[]'); } catch { allProducts = []; }
  renderAll();
  loadAndRender();

  // Refresh every 60s so visitors always see latest products
  setInterval(loadAndRender, 60000);
});
