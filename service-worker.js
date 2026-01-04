const CACHE_NAME = "clinelph-cache-v1";

const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/dashboard.html",
  "/study.html",
  "/patient.html",
  "/patient-card.html",
  "/css/main.css",
  "/css/dashboard.css",
  "/css/patient.css",
  "/css/visits.css",
  "/js/db.js",
  "/js/auth.js",
  "/js/patient.js",
  "/js/visits.js",
  "/js/validation.js",
  "/js/randomization.js",
  "/assets/logo.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
