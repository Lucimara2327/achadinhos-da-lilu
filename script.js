/* ============================================================
   ACHADINHOS DA LILU — script.js  |  Ocean Blue Edition
   ============================================================ */

const SUPABASE_URL = 'https://aerzkxexdvjtarbixado.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFlcnpreGV4ZHZqdGFyYml4YWRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxMDY5NDQsImV4cCI6MjA5NTY4Mjk0NH0.xjfvyLMX8z7-VqGtzmYo4jKQN069gs9r6Le_cz1rDqQ';
const API     = `${SUPABASE_URL}/rest/v1/produtos`;
const API_FAV = `${SUPABASE_URL}/rest/v1/favoritos`;
const API_POSTS = `${SUPABASE_URL}/rest/v1/posts`;
const HEADERS = {
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json'
};

const $ = id => document.getElementById(id);
let allProducts = [];
let activeStore    = 'Mercado Livre';
let activeCategory = null;
let searchQuery    = '';

function showToast(msg) {
  const t = $('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}

/* ── Fetch ── */
async function fetchProducts() {
  try {
    const res = await fetch(API + '?order=created_at.desc', { headers: HEADERS });
    if (!res.ok) return [];
    return (await res.json()) || [];
  } catch(e) { return []; }
}

async function fetchPosts() {
  try {
    const res = await fetch(API_POSTS + '?order=created_at.desc', { headers: HEADERS });
    if (!res.ok) return null;
    return (await res.json()) || [];
  } catch(e) { return null; }
}

async function fetchFavoritos() {
  try {
    const res = await fetch(API_FAV + '?order=ordem.asc', { headers: HEADERS });
    if (!res.ok) return null;
    return (await res.json()) || [];
  } catch(e) { return null; }
}

/* ── Menu ── */
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

/* ── Search ── */
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

/* ── Categories ── */
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
      $('side-menu').classList.remove('open');
      $('overlay').classList.remove('open');
      document.body.style.overflow = '';
      setTimeout(() => { $('products-section')?.scrollIntoView({ behavior: 'smooth' }); }, 200);
    });
  });
}

/* ── Filter ── */
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

/* ── selectStore ── */
window.selectStore = function(btn) {
  document.querySelectorAll('.store-card').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  activeStore = btn.dataset.store;
  renderAll();
};

/* ── Media ── */
function mediaEl(p) {
  if (p.video) return `<video src="${p.video}" loop muted playsinline preload="metadata" poster="${p.image || ''}" onloadeddata="this.play().catch(()=>{})"></video>`;
  if (p.image) return `<img src="${p.image}" alt="${p.title}" loading="lazy" decoding="async">`;
  return `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#e0f2fe;font-size:2.5rem;">🛍️</div>`;
}

function formatPrice(price) {
  if (!price) return '';
  const p = price.trim();
  if (!p) return '';
  return p.toLowerCase().startsWith('r$') ? p : 'R$ ' + p;
}

function cardExtras(p) {
  let html = '';
  if (p.store)         html += `<span class="card-store">${p.store}</span>`;
  if (p.free_shipping) html += `<span class="card-free-ship">✓ Frete Grátis</span>`;
  return html ? `<div class="card-extras">${html}</div>` : '';
}

/* ── Track click ── */
async function trackClick(p) {
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/cliques`, {
      method: 'POST', headers: HEADERS,
      body: JSON.stringify({ produto_id: p.id, produto_title: p.title, store: p.store || '', category: p.category || '' })
    });
  } catch(e) {}
}

/* ── Compartilhar ── */
window.shareProduct = async function(title, link, e) {
  if (e) { e.stopPropagation(); e.preventDefault(); }
  try {
    if (navigator.share) {
      await navigator.share({ title: '🛍️ ' + title, text: 'Olha esse achado incrível!', url: link });
    } else {
      await navigator.clipboard.writeText(link);
      showToast('Link copiado! 📋');
    }
  } catch(_) {}
};

/* ── Modal ── */
window.openModal = function(p) {
  const modal = $('product-modal');
  if (!modal) return;
  $('modal-img').innerHTML = mediaEl(p);
  $('modal-title').textContent = p.title || '';
  $('modal-desc').textContent  = p.description || '';
  $('modal-desc').style.display = p.description ? '' : 'none';
  $('modal-price').textContent  = formatPrice(p.price) || '';
  $('modal-price').style.display = p.price ? '' : 'none';
  $('modal-extras').innerHTML  = cardExtras(p);
  $('modal-btn').textContent = p.affiliate_link ? 'Conferir Produto ↗' : 'Ver Detalhes';
  $('modal-btn').onclick = () => { if (p.affiliate_link) { trackClick(p); window.open(p.affiliate_link, '_blank'); } };
  $('modal-share-btn').onclick = () => shareProduct(p.title, p.affiliate_link || location.href);
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
};

window.closeModal = function() {
  const modal = $('product-modal');
  if (modal) { modal.style.display = 'none'; document.body.style.overflow = ''; }
};

/* ── Skeleton ── */
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

/* ── Carrossel helper ── */
function buildCarousel(gridId, dotsId, items, renderCard) {
  const grid = $(gridId);
  const dotsEl = $(dotsId);
  if (!grid) return;
  if (!items || items.length === 0) return;

  grid.innerHTML = items.map(renderCard).join('');

  if (dotsEl) {
    dotsEl.innerHTML = items.length > 1
      ? items.map((_, i) => `<div class="offers-dot${i === 0 ? ' active' : ''}" data-i="${i}"></div>`).join('')
      : '';

    dotsEl.querySelectorAll('.offers-dot').forEach(dot => {
      dot.addEventListener('click', () => {
        const cards = grid.querySelectorAll('.offer-card');
        cards[+dot.dataset.i]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      });
    });

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
}

/* ── Render Posts (Achados em Destaque) ── */
async function renderPosts() {
  const section = $('offers-section');
  if (!section) return;

  // Tenta buscar posts da tabela posts; fallback para produtos com offer_of_day
  const posts = await fetchPosts();

  if (posts && posts.length > 0) {
    section.style.display = '';
    buildCarousel('offers-grid', 'offers-dots', posts, p => `
      <div class="offer-card" onclick="openModal(${JSON.stringify(p).replace(/"/g,'&quot;')})">
        <span class="offer-badge">✨ Destaque</span>
        <div class="offer-img-wrap">${p.image ? `<img src="${p.image}" alt="${p.title}" loading="lazy">` : `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#e0f2fe;font-size:2.5rem;">✨</div>`}</div>
        <div class="offer-info">
          <div class="offer-name">${p.title}</div>
          ${p.description ? `<div class="offer-desc">${p.description}</div>` : ''}
          ${p.price ? `<div class="offer-price">${formatPrice(p.price)}</div>` : ''}
          ${p.store ? `<div class="card-extras"><span class="card-store">${p.store}</span></div>` : ''}
          <button class="offer-btn" onclick="event.stopPropagation();${p.affiliate_link ? `trackClick(${JSON.stringify(p).replace(/"/g,'&quot;')});window.open('${p.affiliate_link}','_blank')` : `openModal(${JSON.stringify(p).replace(/"/g,'&quot;')})`}">Ver Detalhes ↗</button>
        </div>
      </div>`);
  } else {
    // Fallback: usa produtos com offer_of_day
    const offers = allProducts.filter(p => {
      if (!p.offer_of_day) return false;
      const matchCat = !activeCategory || p.category === activeCategory;
      const q = searchQuery;
      const matchQ = !q || (p.title||'').toLowerCase().includes(q) || (p.description||'').toLowerCase().includes(q);
      return matchCat && matchQ;
    });

    if (offers.length === 0) { section.style.display = 'none'; return; }
    section.style.display = '';
    buildCarousel('offers-grid', 'offers-dots', offers, p => `
      <div class="offer-card" onclick="openModal(${JSON.stringify(p).replace(/"/g,'&quot;')})">
        <span class="offer-badge">✨ Destaque</span>
        <div class="offer-img-wrap">${mediaEl(p)}</div>
        <div class="offer-info">
          <div class="offer-name">${p.title}</div>
          ${p.description ? `<div class="offer-desc">${p.description}</div>` : ''}
          ${formatPrice(p.price) ? `<div class="offer-price">${formatPrice(p.price)}</div>` : ''}
          ${cardExtras(p)}
          <button class="offer-btn" onclick="event.stopPropagation();trackClick(${JSON.stringify(p).replace(/"/g,'&quot;')});window.open('${p.affiliate_link}','_blank')">Ver Detalhes ↗</button>
        </div>
      </div>`);
  }
}

/* ── Render Favoritos ── */
async function renderFavoritos() {
  const section = $('favoritos-section');
  if (!section) return;

  const favs = await fetchFavoritos();
  if (!favs || favs.length === 0) { section.style.display = 'none'; return; }

  // Busca os produtos correspondentes pelos IDs
  const favProducts = favs
    .map(f => allProducts.find(p => p.id === f.produto_id))
    .filter(Boolean);

  if (favProducts.length === 0) { section.style.display = 'none'; return; }
  section.style.display = '';

  buildCarousel('favoritos-grid', 'favoritos-dots', favProducts, p => `
    <div class="offer-card" onclick="openModal(${JSON.stringify(p).replace(/"/g,'&quot;')})">
      <span class="offer-badge" style="background:linear-gradient(135deg,#0284c7,#0ea5e9)">💙 Favorito</span>
      <div class="offer-img-wrap">${mediaEl(p)}</div>
      <div class="offer-info">
        <div class="offer-name">${p.title}</div>
        ${p.description ? `<div class="offer-desc">${p.description}</div>` : ''}
        ${formatPrice(p.price) ? `<div class="offer-price">${formatPrice(p.price)}</div>` : ''}
        ${cardExtras(p)}
        <button class="offer-btn" onclick="event.stopPropagation();trackClick(${JSON.stringify(p).replace(/"/g,'&quot;')});window.open('${p.affiliate_link}','_blank')">Conferir Produto ↗</button>
      </div>
    </div>`);
}

/* ── Render Products ── */
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
    grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1;text-align:center;padding:40px 20px;color:#6b90b0"><div style="font-size:2.5rem;margin-bottom:12px">🔍</div><p>Nenhum produto encontrado.<br>Tente outra busca ou categoria.</p></div>`;
    return;
  }
  grid.innerHTML = filtered.map((p, i) => `
    <div class="product-card" style="animation-delay:${(i%10)*.04}s">
      <div class="product-img-wrap" onclick="openModal(${JSON.stringify(p).replace(/"/g,'&quot;')})">
        ${mediaEl(p)}
        <span class="product-cat-badge">${p.category}</span>
      </div>
      <div class="product-info">
        <div class="product-name">${p.title}</div>
        ${p.description ? `<div class="product-desc-mini">${p.description}</div>` : ''}
        ${formatPrice(p.price) ? `<div class="product-price">${formatPrice(p.price)}</div>` : ''}
        ${cardExtras(p)}
        <div style="display:flex;gap:6px;margin-top:auto;">
          <button class="product-btn" style="flex:1" onclick="event.stopPropagation();trackClick(${JSON.stringify(p).replace(/"/g,'&quot;')});window.open('${p.affiliate_link}','_blank')">Conferir Produto ↗</button>
          <button class="product-btn" style="flex:0 0 36px;padding:0;font-size:1.1rem;" onclick="shareProduct('${p.title.replace(/'/g,"\\'")}','${p.affiliate_link}',event)" title="Compartilhar">➤</button>
        </div>
      </div>
    </div>`).join('');
}

window.clearFilter = function() {
  activeCategory = null;
  document.querySelectorAll('.cat-chip').forEach(c => c.classList.remove('active'));
  renderAll();
};

function renderAll() { renderPosts(); renderProducts(); renderFavoritos(); }

/* ── Nav links ── */
function initNavLinks() {
  $('nav-inicio')  && $('nav-inicio').addEventListener('click',  () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  $('nav-ofertas') && $('nav-ofertas').addEventListener('click', () => $('offers-section')?.scrollIntoView({ behavior: 'smooth' }));
  $('nav-sobre')   && $('nav-sobre').addEventListener('click',   () => $('about-section')?.scrollIntoView({ behavior: 'smooth' }));
  $('nav-cats')    && $('nav-cats').addEventListener('click',    () => $('products-section')?.scrollIntoView({ behavior: 'smooth' }));
}

/* ── Back to top ── */
function initBackToTop() {
  const btn = $('back-to-top');
  window.addEventListener('scroll', () => btn.classList.toggle('visible', window.scrollY > 300), { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ── Store cards ── */
function initStoreCards() {
  const mlBtn = document.querySelector('.store-card[data-store="Mercado Livre"]');
  if (mlBtn) {
    document.querySelectorAll('.store-card').forEach(b => b.classList.remove('active'));
    mlBtn.classList.add('active');
  }
}

/* ── Load ── */
async function loadAndRender() {
  const grid = $('products-grid');
  if (grid) grid.innerHTML = skeletonCards(6);
  allProducts = await fetchProducts();
  renderAll();
}

document.addEventListener('DOMContentLoaded', () => {
  try {
    localStorage.removeItem('lilu_products_cache');
    localStorage.removeItem('lilu_products_cache_time');
  } catch(e) {}

  initBackToTop();
  initMenu();
  initSearch();
  initCategories();
  initNavLinks();
  initStoreCards();
  loadAndRender();
});
