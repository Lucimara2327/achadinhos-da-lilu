/* ============================================================
   ACHADINHOS DA LILU — script.js
   Banco de dados: Supabase
   ============================================================ */

const SUPABASE_URL = 'https://aerzkxexdvjtarbixado.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFlcnpreGV4ZHZqdGFyYml4YWRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxMDY5NDQsImV4cCI6MjA5NTY4Mjk0NH0.xjfvyLMX8z7-VqGtzmYo4jKQN069gs9r6Le_cz1rDqQ';
const API = `${SUPABASE_URL}/rest/v1/produtos`;
const HEADERS = {
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json'
};

const $ = id => document.getElementById(id);
let allProducts = [];

function showToast(msg) {
  const t = $('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}

async function fetchProducts() {
  try {
    const res = await fetch(API + '?order=created_at.desc', { headers: HEADERS });
    if (!res.ok) return [];
    const data = await res.json();
    return data || [];
  } catch(e) { return []; }
}

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

function mediaEl(p) {
  if (p.video) return `<video src="${p.video}" autoplay loop muted playsinline poster="${p.image || ''}"></video>`;
  if (p.image) return `<img src="${p.image}" alt="${p.title}" loading="lazy">`;
  return `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#f0ecff;font-size:2.5rem;">🛍️</div>`;
}

function formatPrice(price) {
  if (!price) return '';
  const p = price.trim();
  if (!p) return '';
  if (p.toLowerCase().startsWith('r$')) return p;
  return 'R$ ' + p;
}

function cardExtras(p) {
  let html = '';
  if (p.store)         html += `<span class="card-store">${p.store}</span>`;
  if (p.free_shipping) html += `<span class="card-free-ship">✓ Frete Grátis</span>`;
  return html ? `<div class="card-extras">${html}</div>` : '';
}

function renderOffers() {
  const grid    = $('offers-grid');
  const section = $('offers-section');
  if (!grid) return;
  const offers = filterProducts(allProducts.filter(p => p.offer_of_day));
  if (offers.length === 0) { section.style.display = 'none'; return; }
  section.style.display = '';
  grid.innerHTML = offers.map(p => `
    <div class="offer-card" onclick="window.open('${p.affiliate_link}','_blank')">
      <span class="offer-badge">⭐ Oferta do Dia</span>
      <div class="offer-img-wrap">${mediaEl(p)}</div>
      <div class="offer-info">
        <div class="offer-name">${p.title}</div>
        ${p.description ? `<div class="offer-desc">${p.description}</div>` : ''}
        ${formatPrice(p.price) ? `<div class="offer-price">${formatPrice(p.price)}</div>` : ''}
        ${cardExtras(p)}
        <button class="offer-btn" onclick="event.stopPropagation();window.open('${p.affiliate_link}','_blank')">Ver Oferta ↗</button>
      </div>
    </div>
  `).join('');
}

function renderProducts() {
  const grid      = $('products-grid');
  const filterBar = $('filter-bar');
  if (!grid) return;
  const filtered = filterProducts(allProducts.filter(p => !p.offer_of_day));
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
    <div class="product-card" style="animation-delay:${(i % 10) * 0.04}s" onclick="window.open('${p.affiliate_link}','_blank')">
      <div class="product-img-wrap">
        ${mediaEl(p)}
        <span class="product-cat-badge">${p.category}</span>
      </div>
      <div class="product-info">
        <div class="product-name">${p.title}</div>
        ${p.description ? `<div class="product-desc-mini">${p.description}</div>` : ''}
        ${formatPrice(p.price) ? `<div class="product-price">${formatPrice(p.price)}</div>` : ''}
        ${cardExtras(p)}
        <button class="product-btn" onclick="event.stopPropagation();window.open('${p.affiliate_link}','_blank')">Ver Oferta ↗</button>
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

function initNavLinks() {
  $('nav-inicio')  && $('nav-inicio').addEventListener('click',  () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  $('nav-ofertas') && $('nav-ofertas').addEventListener('click', () => $('offers-section').scrollIntoView({ behavior: 'smooth' }));
  $('nav-sobre')   && $('nav-sobre').addEventListener('click',   () => $('about-section').scrollIntoView({ behavior: 'smooth' }));
  $('nav-cats')    && $('nav-cats').addEventListener('click',    () => $('products-section').scrollIntoView({ behavior: 'smooth' }));
}

function initHero() {
  $('hero-btn') && $('hero-btn').addEventListener('click', () => {
    const offerSec = $('offers-section');
    const target = offerSec && offerSec.style.display !== 'none' ? offerSec : $('products-section');
    target && target.scrollIntoView({ behavior: 'smooth' });
  });
}

async function loadAndRender() {
  allProducts = await fetchProducts();
  renderAll();
}

document.addEventListener('DOMContentLoaded', () => {
  initMenu();
  initSearch();
  initCategories();
  initNavLinks();
  initHero();
  loadAndRender();
  setInterval(loadAndRender, 60000);
});
