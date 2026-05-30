/* ============================================================
   ACHADINHOS DA LILU — Service Worker (PWA)
   ============================================================ */

const CACHE_NAME = 'lilu-v1';
const STATIC_FILES = [
  '/achadinhos-da-lilu/',
  '/achadinhos-da-lilu/index.html',
  '/achadinhos-da-lilu/style.css',
  '/achadinhos-da-lilu/script.js',
  '/achadinhos-da-lilu/logo.png',
  '/achadinhos-da-lilu/icon-192.png',
  '/achadinhos-da-lilu/icon-512.png'
];

// Instala e faz cache dos arquivos estáticos
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_FILES))
  );
  self.skipWaiting();
});

// Remove caches antigos
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Estratégia: Network first (tenta internet, cai no cache se offline)
self.addEventListener('fetch', e => {
  // Requisições ao Supabase — sempre tenta a rede
  if (e.request.url.includes('supabase.co')) {
    e.respondWith(
      fetch(e.request).catch(() => new Response('[]', { headers: { 'Content-Type': 'application/json' } }))
    );
    return;
  }

  // Arquivos do site — tenta rede, usa cache como fallback
  e.respondWith(
    fetch(e.request)
      .then(res => {
        // Atualiza o cache com a versão mais recente
        const clone = res.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
