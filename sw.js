const CACHE_VERSION = 'pokememory-v6';
const APP_SHELL = [
    './',
    './index.html',
    './styles.css',
    './audio.js',
    './theme.js',
    './board.js',
    './timer.js',
    './game.js',
    './menu.js',
    './manifest.webmanifest',
    './icons/icon-192.png',
    './icons/icon-512.png',
    './icons/maskable-512.png',
    './icons/apple-touch-icon.png',
    './icons/favicon-96.png',
    './assets/9889becb560835a3d47574202935f737.jpg',
    './assets/pokememory%20match.png',
    './assets/800px-Viridian_Forest_HGSS.png',
    './assets/Hoenn_Route_110_E.png',
    './assets/320px-Sinnoh_Route_217_Pt.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_VERSION).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(keys.filter((key) => key !== CACHE_VERSION).map((key) => caches.delete(key)))
        ).then(() => self.clients.claim())
    );
});

async function cacheFirst(request) {
    const cache = await caches.open(CACHE_VERSION);
    const cached = await cache.match(request, { ignoreSearch: true });
    if (cached) return cached;

    try {
        const response = await fetch(request);
        if (response && (response.status === 200 || response.type === 'opaque')) {
            cache.put(request, response.clone());
        }
        return response;
    } catch (error) {
        const fallback = await cache.match(request, { ignoreSearch: true });
        if (fallback) return fallback;
        if (request.mode === 'navigate') {
            return cache.match('./index.html');
        }
        return new Response('', { status: 408, statusText: 'Offline' });
    }
}

self.addEventListener('fetch', (event) => {
    const { request } = event;
    if (request.method !== 'GET') return;

    event.respondWith(cacheFirst(request));
});
