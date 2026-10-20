// Signori della Valleriana: salva il gioco sul telefono per giocare offline.
// Quando aggiorni il gioco, cambia il numero di versione qui sotto.
const VERSIONE = 'valleriana-v1';
const FILE = ['./', 'index.html', 'manifest.webmanifest', 'icon.svg', 'icon-192.png', 'icon-512.png', 'maskable-512.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSIONE).then(c => c.addAll(FILE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(n => n !== VERSIONE).map(n => caches.delete(n)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const font = /fonts\.(googleapis|gstatic)\.com/.test(e.request.url);
  e.respondWith(caches.match(e.request, {ignoreSearch: !font}).then(r => r || fetch(e.request).then(res => {
    if (font && res && (res.ok || res.type === 'opaque')) { const c = res.clone(); caches.open(VERSIONE).then(k => k.put(e.request, c)); }
    return res;
  })));
});
