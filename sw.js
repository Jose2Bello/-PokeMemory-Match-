const CACHE_VERSION = 'pokememory-v8';

// Lista estricta de TODOS los 124 recursos del juego que deben descargarse al 100% para instalar la PWA
const APP_SHELL = [
    "./",
    "./Hoenn/absol.png",
    "./Hoenn/aggron.png",
    "./Hoenn/altaria.png",
    "./Hoenn/banette.png",
    "./Hoenn/blaziken-f.png",
    "./Hoenn/breloom.png",
    "./Hoenn/deoxys-normal.png",
    "./Hoenn/dusclops.png",
    "./Hoenn/gardevoir.png",
    "./Hoenn/groudon.png",
    "./Hoenn/jirachi.png",
    "./Hoenn/kyogre.png",
    "./Hoenn/latias.png",
    "./Hoenn/latios.png",
    "./Hoenn/metagross.png",
    "./Hoenn/milotic-f.png",
    "./Hoenn/mudkip.png",
    "./Hoenn/ralts.png",
    "./Hoenn/rayquaza.png",
    "./Hoenn/regice.png",
    "./Hoenn/regirock.png",
    "./Hoenn/salamence.png",
    "./Hoenn/sceptile.png",
    "./Hoenn/sharpedo.png",
    "./Hoenn/skitty.png",
    "./Hoenn/slaking.png",
    "./Hoenn/spheal.png",
    "./Hoenn/swampert.png",
    "./Hoenn/torchic.png",
    "./Hoenn/treecko.png",
    "./Hoenn/tropius.png",
    "./Hoenn/wailord.png",
    "./Kanto/alakazam-f.png",
    "./Kanto/arcanine.png",
    "./Kanto/articuno.png",
    "./Kanto/blastoise.png",
    "./Kanto/bulbasaur.png",
    "./Kanto/butterfree-f.png",
    "./Kanto/charizard.png",
    "./Kanto/charmander.png",
    "./Kanto/cubone.png",
    "./Kanto/ditto.png",
    "./Kanto/dragonite.png",
    "./Kanto/eevee.png",
    "./Kanto/flareon.png",
    "./Kanto/gengar.png",
    "./Kanto/gyarados-f.png",
    "./Kanto/hypno-f.png",
    "./Kanto/jigglypuff.png",
    "./Kanto/jolteon.png",
    "./Kanto/lapras.png",
    "./Kanto/machamp.png",
    "./Kanto/meowth.png",
    "./Kanto/mew.png",
    "./Kanto/mewtwo.png",
    "./Kanto/pikachu-f.png",
    "./Kanto/psyduck.png",
    "./Kanto/scyther-f.png",
    "./Kanto/snorlax.png",
    "./Kanto/squirtle.png",
    "./Kanto/starmie.png",
    "./Kanto/vaporeon.png",
    "./Kanto/venusaur-f.png",
    "./Kanto/zapdos.png",
    "./Sinnoh/abomasnow-f.png",
    "./Sinnoh/arceus-normal.png",
    "./Sinnoh/azelf.png",
    "./Sinnoh/cresselia.png",
    "./Sinnoh/darkrai.png",
    "./Sinnoh/dialga.png",
    "./Sinnoh/electivire.png",
    "./Sinnoh/empoleon.png",
    "./Sinnoh/gallade.png",
    "./Sinnoh/garchomp-f.png",
    "./Sinnoh/giratina-altered.png",
    "./Sinnoh/glaceon.png",
    "./Sinnoh/honchkrow.png",
    "./Sinnoh/infernape.png",
    "./Sinnoh/leafeon.png",
    "./Sinnoh/lopunny.png",
    "./Sinnoh/lucario.png",
    "./Sinnoh/luxray-f.png",
    "./Sinnoh/manaphy.png",
    "./Sinnoh/mesprit.png",
    "./Sinnoh/munchlax.png",
    "./Sinnoh/palkia.png",
    "./Sinnoh/phione.png",
    "./Sinnoh/piplup.png",
    "./Sinnoh/regigigas.png",
    "./Sinnoh/shaymin-land.png",
    "./Sinnoh/shinx-f.png",
    "./Sinnoh/spiritomb.png",
    "./Sinnoh/staraptor-f.png",
    "./Sinnoh/togekiss.png",
    "./Sinnoh/torterra.png",
    "./Sinnoh/uxie.png",
    "./assets/320px-Sinnoh_Route_217_Pt.png",
    "./assets/800px-Viridian_Forest_HGSS.png",
    "./assets/9889becb560835a3d47574202935f737.jpg",
    "./assets/Hoenn_Route_110_E.png",
    "./assets/audio/Pok%C3%A9mon%20HeartGold%20%26%20SoulSilver%20-%20Kanto%20Wild%20Pok%C3%A9mon%20Battle%20Music%20%28HQ%29%20-%20Pokeli.mp3",
    "./assets/audio/Pok%C3%A9mon%20Omega%20Ruby%20%26%20Alpha%20Sapphire%20-%20Cobalion%2C%20Virizion%20%26%20Terrakion%20Battle%20Music%20%28HQ%29%20-%20Pokeli.mp3",
    "./assets/audio/Pok%C3%A9mon%20Omega%20Ruby%20%26%20Alpha%20Sapphire%20-%20Elite%20Four%20Battle%20Music%20%28HQ%29%20-%20Pokeli.mp3",
    "./assets/audio/Pok%C3%A9mon%20Opening%20%26%20Title%20Screen%20%2819971998-M01%29.mp3",
    "./assets/audio/Pok%C3%A9mon%20Ruby%20-%20Route%20110.mp3",
    "./assets/audio/Route%201%20Pok%C3%A9mon%20%20Heartgold%20Soulsilver.mp3",
    "./assets/audio/Route%20201%20pokemon%20diamond%20pearl-%20Nicob.mp3",
    "./assets/audio/littleroot%20town%20pokemon%20ruby%20.mp3",
    "./assets/pokememory%20match.png",
    "./audio.js",
    "./board.js",
    "./game.js",
    "./icons/apple-touch-icon.png",
    "./icons/favicon-96.png",
    "./icons/icon-192.png",
    "./icons/icon-512.png",
    "./icons/maskable-512.png",
    "./index.html",
    "./manifest.webmanifest",
    "./menu.js",
    "./styles.css",
    "./theme.js",
    "./timer.js"
];

// Instalación ESTRICTA: El Service Worker SOLO se instala si descarga el 100% de los 124 recursos
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_VERSION)
            .then((cache) => cache.addAll(APP_SHELL))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_VERSION).map((key) => caches.delete(key))))
            .then(() => self.clients.claim())
    );
});

// Interceptor 100% Offline (Cache First)
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
