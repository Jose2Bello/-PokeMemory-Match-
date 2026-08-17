const CACHE_VERSION = 'pokememory-v4';
const APP_SHELL = [
    './',
    './index.html',
    './styles.css',
    './audio.js',
    './footer.js',
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
    './assets/9889becb560835a3d47574202935f737.jpg'
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

async function networkFirst(request, fallbackUrl) {
    const cache = await caches.open(CACHE_VERSION);
    try {
        const response = await fetch(request);
        if (response && response.ok && (response.type === 'basic' || response.type === 'cors')) {
            cache.put(request, response.clone());
        }
        return response;
    } catch (error) {
        const cached = await cache.match(request);
        return cached || cache.match(fallbackUrl);
    }
}

async function cacheFirst(request) {
    const cache = await caches.open(CACHE_VERSION);
    const cached = await cache.match(request);
    if (cached) return cached;

    try {
        const response = await fetch(request);
        if (response && response.ok && (response.type === 'basic' || response.type === 'cors')) {
            cache.put(request, response.clone());
        }
        return response;
    } catch (error) {
        return cache.match('./icons/icon-192.png');
    }
}

self.addEventListener('fetch', (event) => {
    const { request } = event;
    if (request.method !== 'GET') return;

    if (request.mode === 'navigate') {
        event.respondWith(networkFirst(request, './index.html'));
    } else {
        const url = new URL(request.url);
        const isCode = url.pathname.endsWith('.css') || url.pathname.endsWith('.js');
        event.respondWith(isCode ? networkFirst(request, './index.html') : cacheFirst(request));
    }
});
