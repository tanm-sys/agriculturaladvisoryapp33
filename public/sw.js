const CACHE_NAME = 'krishi-sahayak-cache-v1';
const urlsToCache = [
  '/',
  '/dashboard',
  '/diagnose',
  '/market',
  '/community',
  '/schemes',
  '/contact',
  '/profile',
  '/globals.css',
  '/placeholder-logo.png'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});