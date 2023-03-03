const cacheName = "pwa-conf-v1";
const staticAssets = [
  "/",
  "index.html",
  "donate.html",
  "js/app.js",
  "js/main.js",
  "css/style.css",
  "css/bootstrap.min.css",
  "css/bootstrap.min.css",
  "lib/waypoints/waypoints.min.js",
  "lib/tempusdominus/js/moment.min.js",
  "lib/tempusdominus/js/tempusdominus-bootstrap-4.min.js"
];

self.addEventListener("install", async (event) => {
  const cache = await caches.open(cacheName);
  await cache.addAll(staticAssets);
});
self.addEventListener("fetch", (event) => {
  const req = event.request;
  event.respondWith(cacheFirst(req));
});

async function cacheFirst(req) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(req);
  return cachedResponse || fetch(req);
}