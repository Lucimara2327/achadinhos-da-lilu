/* ============================================================
   ACHADINHOS DA LILU — script.js
   ============================================================ */

const STORAGE_KEY = 'lilu_products_v2';

// ── Helpers ──────────────────────────────────────────────────
const $ = id => document.getElementById(id);
const getProducts = () => { try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch(e) { return []; } };

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
let searchQuery = '';

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
function mediaEl(product) {
  if (product.video) return `<video src="${product.video}" autoplay loop muted playsinline poster="${product.image || ''}"></video>`;
  if (product.image) return `<img src="${product.image}" alt="${product.title}" loading="lazy">`;
  return `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#f0ecff;font-size:2.5rem;">🛍️</div>`;
}

// ── Price formatter ───────────────────────────────────────────
function formatPrice(price) {
  if (!price) return '';
  // Add R$ if not present
  const p = price.trim();
  if (!p) return '';
  if (p.startsWith('R$') || p.startsWith('r$')) return p;
  return 'R$ ' + p;
}

// ── Card extras (store + free shipping) ──────────────────────
function cardExtras(p) {
  let html = '';
  if (p.store) html += `<span class="card-store">${p.store}</span>`;
  if (p.freeShipping) html += `<span class="card-free-ship">✓ Frete Grátis</span>`;
  if (html) return `<div class="card-extras">${html}</div>`;
  return '';
}

// ── Render Offers ─────────────────────────────────────────────
function renderOffers() {
  const grid    = $('offers-grid');
  const section = $('offers-section');
  if (!grid) return;
  const offers = filterProducts(getProducts().filter(p => p.offerOfDay));
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

  const filtered = filterProducts(getProducts().filter(p => !p.offerOfDay));

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

// ── SYNC: listen for changes from admin / other tabs ─────────
// Uses both localStorage event (same browser, other tabs) and
// a periodic poll (covers GitHub Pages where storage events
// don't fire across different visitors).
window.addEventListener('storage', e => { if (e.key === STORAGE_KEY) renderAll(); });

// Poll every 30s so visitors always see the latest products
setInterval(renderAll, 30000);

// ── Init ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initMenu();
  initSearch();
  initCategories();
  initNavLinks();
  initHero();
  renderAll();

  // Only add demo products if storage is truly empty AND no products exist
  if (getProducts().length === 0) {
    // Don't add demos — show empty state so real products appear cleanly
    // Remove this block entirely so demos never overwrite real data
  }
});
