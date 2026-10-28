// Zuu Music Service Worker for Offline & Background Playback
const CACHE_NAME = 'zuu-music-cache-v3';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Cache first for static UI, Network first with fallback for others
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // CRITICAL FOR MOBILE BACKGROUND PLAYBACK:
  // Never intercept native audio/video streams, byte-range chunks, or external media CDNs.
  // Intercepting streaming audio in service workers crashes background audio decoding on Android & iOS!
  if (
    event.request.destination === 'audio' ||
    event.request.destination === 'video' ||
    event.request.headers.has('range') ||
    url.origin.includes('audius.co') ||
    url.origin.includes('open-audio-validator') ||
    url.origin.includes('monophonic') ||
    url.origin.includes('figment.io') ||
    url.origin.includes('theblueprint.xyz') ||
    url.origin.includes('staked.cloud') ||
    url.origin.includes('soundhelix.com') ||
    url.origin.includes('youtube.com') ||
    url.origin.includes('googlevideo.com') ||
    url.origin.includes('googleapis.com') ||
    url.pathname.includes('/stream') ||
    url.pathname.startsWith('/api/') ||
    url.pathname.endsWith('.mp3') ||
    url.pathname.endsWith('.m4a') ||
    url.pathname.endsWith('.wav') ||
    url.pathname.endsWith('.aac')
  ) {
    return; // Pass through straight to native browser audio engine
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request)
        .then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
            return networkResponse;
          }

          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            // Cache static scripts, styles, and UI icons
            if (
              url.pathname.endsWith('.js') ||
              url.pathname.endsWith('.css') ||
              url.pathname.endsWith('.png') ||
              url.pathname.endsWith('.jpg') ||
              url.pathname.endsWith('.svg')
            ) {
              cache.put(event.request, responseToCache);
            }
          });

          return networkResponse;
        })
        .catch(() => {
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html');
          }
        });
    })
  );
});
