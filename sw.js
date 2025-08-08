
// bump this whenever you want to force an update
const CACHE = 'posture-timer-v6';

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE).then(cache =>
      cache.addAll(['./','./index.html','./style.css','./manifest.webmanifest'])
    )
  );
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map(k => (k !== CACHE) && caches.delete(k)));
    await self.clients.claim();
  })());
});

// Network-first so you always get the newest JS; falls back to cache offline
self.addEventListener('fetch', event => {
  event.respondWith((async () => {
    try {
      const fresh = await fetch(event.request);
      const cache = await caches.open(CACHE);
      cache.put(event.request, fresh.clone());
      return fresh;
    } catch (e) {
      const cached = await caches.match(event.request);
      return cached || Response.error();
    }
  })());
});
