// service-worker.js

const CACHE_NAME = "clinelph-cache-v1";

/*
  IMPORTANT:
  Change BASE to your repo name on GitHub Pages
  Example: https://username.github.io/clinelph/
*/
const BASE = "/clinelph/";

const FILES_TO_CACHE = [
  BASE,
  BASE + "index.html",
  BASE + "dashboard.html",
  BASE + "study.html",
  BASE + "patient.html",
  BASE + "patient-card.html",

  BASE + "css/main.css",
  BASE + "css/patient.css",
  BASE + "css/visits.css",

  BASE + "js/db.js",
  BASE + "js/auth.js",
  BASE + "js/patient.js",
  BASE + "js/visits.js",
  BASE + "js/validation.js",
  BASE + "js/randomization.js",

  BASE + "assets/logo.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(FILES_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
