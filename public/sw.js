const CACHE_NAME = 'fatureaqui-cache-v4';
const urlsToCache = [
  '/',
  '/favicon.png',
  '/manifest.json'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
      .catch(err => {
        console.warn('SW: Falha parcial ao pré-carregar cache:', err);
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // 1. Apenas interceptar requisições GET
  if (event.request.method !== 'GET') {
    return;
  }

  // 2. Não interceptar protocolos não HTTP/HTTPS
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // 3. Em desenvolvimento local, ir direto para a rede
  if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
    return;
  }

  // 4. CRUCIAL: Nunca interceptar chamadas externas de API (Supabase, etc)
  if (url.origin !== self.location.origin) {
    return;
  }

  // 5. Nunca interceptar rotas de API locais
  if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/rest/')) {
    return;
  }

  // 6. Estratégia Network-First para navegação HTML
  if (event.request.mode === 'navigate' || (event.request.headers.get('accept') && event.request.headers.get('accept').includes('text/html'))) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          if (response && response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, copy);
            }).catch(() => {});
          }
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(event.request);
          if (cached) return cached;
          const fallback = await caches.match('/');
          if (fallback) return fallback;
          return new Response('Offline', { status: 503, headers: { 'Content-Type': 'text/plain' } });
        })
    );
    return;
  }

  // 7. Estratégia Cache-First segura para assets estáticos (CSS, JS, Imagens da mesma origem)
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request)
          .then(networkResponse => {
            if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
              const copy = networkResponse.clone();
              caches.open(CACHE_NAME).then(cache => {
                cache.put(event.request, copy);
              }).catch(() => {});
            }
            return networkResponse;
          })
          .catch(err => {
            // Em caso de falha de rede para asset não em cache, retornar resposta limpa sem rejeitar
            return new Response('', { status: 408, headers: { 'Content-Type': 'text/plain' } });
          });
      })
      .catch(() => fetch(event.request))
  );
});
