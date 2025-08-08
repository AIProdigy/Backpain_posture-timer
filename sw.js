
self.addEventListener('install', event => {
  event.waitUntil(caches.open('posture-timer-v1').then(cache => {
    return cache.addAll(['./','./index.html','./style.css','./manifest.webmanifest']);
  }));
});
self.addEventListener('fetch', event => {
  event.respondWith(caches.match(event.request).then(resp => resp || fetch(event.request)));
});
