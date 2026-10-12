/*
 * Hotel Middle Star - service worker (offline support)
 * First visit: every file below is saved in the browser cache.
 * Next visits (even with no internet): files are served from the cache.
 * When you change any file, bump CACHE (v1 -> v2) so visitors get the update.
 */
const CACHE = 'middle-star-v2';
const ASSETS = [
  "./",
  "404.html",
  "about.html",
  "assets/css/animations.css",
  "assets/css/base.css",
  "assets/css/components.css",
  "assets/css/fonts.css",
  "assets/css/hero.css",
  "assets/css/layout.css",
  "assets/css/photos.css",
  "assets/css/responsive.css",
  "assets/fonts/inter-latin-400-normal.woff2",
  "assets/fonts/inter-latin-500-normal.woff2",
  "assets/fonts/inter-latin-600-normal.woff2",
  "assets/fonts/playfair-display-latin-500-normal.woff2",
  "assets/fonts/playfair-display-latin-600-normal.woff2",
  "assets/images/bar-rooftop.jpg",
  "assets/images/favicon.png",
  "assets/images/hotel-exterior.jpg",
  "assets/images/icon-192.png",
  "assets/images/icon-512.png",
  "assets/images/logo.png",
  "assets/images/restaurant-rooftop.jpg",
  "assets/images/room-deluxe-double.jpg",
  "assets/images/room-deluxe-twin.jpg",
  "assets/images/room-lake-view.jpg",
  "assets/js/main.js",
  "contact.html",
  "gallery.html",
  "index.html",
  "manifest.webmanifest",
  "restaurant.html",
  "rooms.html",
  "sw.js"
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  // remove caches from older versions
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const req = e.request;
  // only handle our own GET requests (booking sites, maps etc. need internet anyway)
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith(
    caches.match(req, { ignoreSearch: true }).then(hit => hit || fetch(req).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(req, copy));
      return res;
    }).catch(() => req.mode === 'navigate' ? caches.match('404.html') : undefined))
  );
});
