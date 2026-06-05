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

/* ── activeStore começa como Mercado Livre ── */
let activeStore    = 'Mercado Livre';
let activeCategory = null;
let searchQuery    = '';

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

/* ── Dark Mode ── */
function initDarkMode() {
  const btn  = $('dark-toggle');
  const body = document.body;
  const saved = localStorage.getItem('darkMode');
  if (saved === 'true') { body.classList.add('dark'); btn.textContent = '☀️'; }
  btn.addEventListener('click', () => {
    const isDark = body.classList.toggle('dark');
    btn.textContent = isDark ? '☀️' : '🌙';
    localStorage.setItem('darkMode', isDark);
  });
}

/* ── Voltar ao Topo ── */
function initBackToTop() {
  const btn = $('back-to-top');
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 300);
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ── Compartilhar produto ── */
window.shareProduct = async function(title, link, e) {
  e && e.stopPropagation();
  try {
    await navigator.share({ title: '🛍️ ' + title, text: 'Olha esse achado incrível!', url: link });
  } catch(_) {
    /* usuário cancelou ou não suportado */
  }
};

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
    const matchCat   = !activeCategory || p.category === activeCategory;
    const matchStore = !activeStore    || p.store === activeStore;
    const q = searchQuery;
    const matchQ = !q ||
      (p.title || '').toLowerCase().includes(q) ||
      (p.description || '').toLowerCase().includes(q) ||
      (p.category || '').toLowerCase().includes(q);
    return matchCat && matchStore && matchQ;
  });
}

/* ── selectStore: corrigido para .store-card ── */
window.selectStore = function(btn) {
  document.querySelectorAll('.store-card').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  activeStore = btn.dataset.store;
  renderAll();
};

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

/* ── renderOffers: carrossel com bolinhas ── */
function renderOffers() {
  const grid    = $('offers-grid');
  const section = $('offers-section');
  if (!grid) return;

  const offers = allProducts.filter(p => {
    if (!p.offer_of_day) return false;
    const matchCat = !activeCategory || p.category === activeCategory;
    const q = searchQuery;
    const matchQ = !q ||
      (p.title || '').toLowerCase().includes(q) ||
      (p.description || '').toLowerCase().includes(q) ||
      (p.category || '').toLowerCase().includes(q);
    return matchCat && matchQ;
  });

  if (offers.length === 0) { section.style.display = 'none'; return; }
  section.style.display = '';

  grid.innerHTML = offers.map(p => `
    <div class="offer-card">
      <span class="offer-badge">✨</span>
      <div class="offer-img-wrap" onclick="openModal(${JSON.stringify(p).replace(/"/g, '&quot;')})">${mediaEl(p)}</div>
      <div class="offer-info">
        <div class="offer-name">${p.title}</div>
        ${p.description ? `<div class="offer-desc">${p.description}</div>` : ''}
        ${formatPrice(p.price) ? `<div class="offer-price">${formatPrice(p.price)}</div>` : ''}
        ${cardExtras(p)}
        <button class="offer-btn" onclick="trackClick(${JSON.stringify(p).replace(/"/g, '&quot;')});window.open('${p.affiliate_link}','_blank')">Ver Oferta ↗</button>
      </div>
    </div>
  `).join('');

  /* ── Bolinhas de navegação ── */
  let dotsEl = $('offers-dots');
  if (!dotsEl) {
    dotsEl = document.createElement('div');
    dotsEl.id = 'offers-dots';
    dotsEl.className = 'offers-dots';
    grid.parentNode.insertBefore(dotsEl, grid.nextSibling);
  }

  if (offers.length <= 1) { dotsEl.innerHTML = ''; return; }

  dotsEl.innerHTML = offers.map((_, i) =>
    `<div class="offers-dot${i === 0 ? ' active' : ''}" data-i="${i}"></div>`
  ).join('');

  dotsEl.querySelectorAll('.offers-dot').forEach(dot => {
    dot.addEventListener('click', () => {
      const cards = grid.querySelectorAll('.offer-card');
      cards[+dot.dataset.i]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    });
  });

  /* Atualiza bolinha conforme scroll */
  grid.addEventListener('scroll', () => {
    const cards = grid.querySelectorAll('.offer-card');
    const center = grid.scrollLeft + grid.offsetWidth / 2;
    let closest = 0, minDist = Infinity;
    cards.forEach((c, i) => {
      const dist = Math.abs(c.offsetLeft + c.offsetWidth / 2 - center);
      if (dist < minDist) { minDist = dist; closest = i; }
    });
    dotsEl.querySelectorAll('.offers-dot').forEach((d, i) =>
      d.classList.toggle('active', i === closest)
    );
  }, { passive: true });
}

/* ── Registra clique no Supabase ── */
async function trackClick(p) {
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/cliques`, {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify({
        produto_id: p.id,
        produto_title: p.title,
        store: p.store || '',
        category: p.category || ''
      })
    });
  } catch(e) { /* silencioso */ }
}

/* ── Modal de produto ── */
window.openModal = function(p) {
  let modal = $('product-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'product-modal';
    modal.className = 'product-modal';
    modal.innerHTML = `
      <div class="modal-overlay" onclick="closeModal()"></div>
      <div class="modal-box">
        <button class="modal-close" onclick="closeModal()">✕</button>
        <div class="modal-img-wrap" id="modal-img"></div>
        <div class="modal-body">
          <div class="modal-title" id="modal-title"></div>
          <div class="modal-desc"  id="modal-desc"></div>
          <div class="modal-price" id="modal-price"></div>
          <div class="modal-extras" id="modal-extras"></div>
          <div style="display:flex;gap:8px;">
            <button class="modal-btn" id="modal-btn" style="flex:1">Ver Oferta ↗</button>
            <button class="modal-btn" id="modal-share-btn" style="flex:0 0 48px;padding:0;font-size:1.1rem;" title="Compartilhar">🔗</button>
          </div>
        </div>
      </div>`;
    document.body.appendChild(modal);
  }
  $('modal-img').innerHTML   = mediaEl(p);
  $('modal-title').textContent = p.title || '';
  $('modal-desc').textContent  = p.description || '';
  $('modal-desc').style.display = p.description ? '' : 'none';
  $('modal-price').textContent  = formatPrice(p.price) || '';
  $('modal-price').style.display = p.price ? '' : 'none';
  $('modal-extras').innerHTML  = cardExtras(p);
  $('modal-btn').onclick = () => { trackClick(p); window.open(p.affiliate_link, '_blank'); };
  $('modal-share-btn').onclick = () => shareProduct(p.title, p.affiliate_link);
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
};

window.closeModal = function() {
  const modal = $('product-modal');
  if (modal) { modal.classList.remove('open'); document.body.style.overflow = ''; }
};

function skeletonCards(n = 6) {
  return Array(n).fill(`
    <div class="product-card skeleton-card">
      <div class="product-img-wrap skeleton"></div>
      <div class="product-info">
        <div class="sk-line skeleton"></div>
        <div class="sk-line short skeleton"></div>
        <div class="sk-btn skeleton"></div>
      </div>
    </div>`).join('');
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
    <div class="product-card" style="animation-delay:${(i % 10) * 0.04}s">
      <div class="product-img-wrap" onclick="openModal(${JSON.stringify(p).replace(/"/g, '&quot;')})">
        ${mediaEl(p)}
        <span class="product-cat-badge">${p.category}</span>
      </div>
      <div class="product-info">
        <div class="product-name">${p.title}</div>
        ${p.description ? `<div class="product-desc-mini">${p.description}</div>` : ''}
        ${formatPrice(p.price) ? `<div class="product-price">${formatPrice(p.price)}</div>` : ''}
        ${cardExtras(p)}
        <div style="display:flex;gap:6px;margin-top:auto;">
          <button class="product-btn" style="flex:1" onclick="trackClick(${JSON.stringify(p).replace(/"/g, '&quot;')});window.open('${p.affiliate_link}','_blank')">Ver Oferta ↗</button>
          <button class="product-btn" style="flex:0 0 36px;padding:0;font-size:1rem;" onclick="shareProduct('${p.title.replace(/'/g,"\\'")}','${p.affiliate_link}',event)" title="Compartilhar">🔗</button>
        </div>
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

/* ── Marca Mercado Livre como ativo visualmente ao carregar ── */
function initStoreCards() {
  const mlBtn = document.querySelector('.store-card[data-store="Mercado Livre"]');
  if (mlBtn) {
    document.querySelectorAll('.store-card').forEach(b => b.classList.remove('active'));
    mlBtn.classList.add('active');
  }
}

async function loadAndRender() {
  /* mostra skeleton enquanto carrega */
  const grid = $('products-grid');
  if (grid) grid.innerHTML = skeletonCards(6);
  allProducts = await fetchProducts();
  renderAll();
}

document.addEventListener('DOMContentLoaded', () => {
  initDarkMode();
  initBackToTop();
  initMenu();
  initSearch();
  initCategories();
  initNavLinks();
  initHero();
  initStoreCards();
  loadAndRender();
});
