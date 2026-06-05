// Service worker minimo — network only (dati live da GAS, niente cache offline)
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', () => self.clients.claim());
self.addEventListener('fetch', e => e.respondWith(fetch(e.request)));
