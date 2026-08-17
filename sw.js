const CACHE_VERSION = 'pokememory-v7';

// Lista completa de todos los recursos esenciales, imágenes de Pokémon, temas e iconos
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
    
    // Iconos de PWA
    './icons/icon-192.png',
    './icons/icon-512.png',
    './icons/maskable-512.png',
    './icons/apple-touch-icon.png',
    './icons/favicon-96.png',
    
    // Imágenes de interfaz y fondos de región
    './assets/9889becb560835a3d47574202935f737.jpg',
    './assets/pokememory%20match.png',
    './assets/800px-Viridian_Forest_HGSS.png',
    './assets/Hoenn_Route_110_E.png',
    './assets/320px-Sinnoh_Route_217_Pt.png',

    // Cartas de Pokémon - Región Kanto (32 cartas)
    './Kanto/alakazam-f.png', './Kanto/arcanine.png', './Kanto/articuno.png', './Kanto/blastoise.png',
    './Kanto/bulbasaur.png', './Kanto/butterfree-f.png', './Kanto/charizard.png', './Kanto/charmander.png',
    './Kanto/cubone.png', './Kanto/ditto.png', './Kanto/dragonite.png', './Kanto/eevee.png',
    './Kanto/flareon.png', './Kanto/gengar.png', './Kanto/gyarados-f.png', './Kanto/hypno-f.png',
    './Kanto/jigglypuff.png', './Kanto/jolteon.png', './Kanto/lapras.png', './Kanto/machamp.png',
    './Kanto/meowth.png', './Kanto/mew.png', './Kanto/mewtwo.png', './Kanto/pikachu-f.png',
    './Kanto/psyduck.png', './Kanto/scyther-f.png', './Kanto/snorlax.png', './Kanto/squirtle.png',
    './Kanto/starmie.png', './Kanto/vaporeon.png', './Kanto/venusaur-f.png', './Kanto/zapdos.png',

    // Cartas de Pokémon - Región Hoenn (32 cartas)
    './Hoenn/absol.png', './Hoenn/aggron.png', './Hoenn/altaria.png', './Hoenn/banette.png',
    './Hoenn/blaziken-f.png', './Hoenn/breloom.png', './Hoenn/deoxys-normal.png', './Hoenn/dusclops.png',
    './Hoenn/gardevoir.png', './Hoenn/groudon.png', './Hoenn/jirachi.png', './Hoenn/kyogre.png',
    './Hoenn/latias.png', './Hoenn/latios.png', './Hoenn/metagross.png', './Hoenn/milotic-f.png',
    './Hoenn/mudkip.png', './Hoenn/ralts.png', './Hoenn/rayquaza.png', './Hoenn/regice.png',
    './Hoenn/regirock.png', './Hoenn/salamence.png', './Hoenn/sceptile.png', './Hoenn/sharpedo.png',
    './Hoenn/skitty.png', './Hoenn/slaking.png', './Hoenn/spheal.png', './Hoenn/swampert.png',
    './Hoenn/torchic.png', './Hoenn/treecko.png', './Hoenn/tropius.png', './Hoenn/wailord.png',

    // Cartas de Pokémon - Región Sinnoh (32 cartas)
    './Sinnoh/abomasnow-f.png', './Sinnoh/arceus-normal.png', './Sinnoh/azelf.png', './Sinnoh/cresselia.png',
    './Sinnoh/darkrai.png', './Sinnoh/dialga.png', './Sinnoh/electivire.png', './Sinnoh/empoleon.png',
    './Sinnoh/gallade.png', './Sinnoh/garchomp-f.png', './Sinnoh/giratina-altered.png', './Sinnoh/glaceon.png',
    './Sinnoh/honchkrow.png', './Sinnoh/infernape.png', './Sinnoh/leafeon.png', './Sinnoh/lopunny.png',
    './Sinnoh/lucario.png', './Sinnoh/luxray-f.png', './Sinnoh/manaphy.png', './Sinnoh/mesprit.png',
    './Sinnoh/munchlax.png', './Sinnoh/palkia.png', './Sinnoh/phione.png', './Sinnoh/piplup.png',
    './Sinnoh/regigigas.png', './Sinnoh/shaymin-land.png', './Sinnoh/shinx-f.png', './Sinnoh/spiritomb.png',
    './Sinnoh/staraptor-f.png', './Sinnoh/togekiss.png', './Sinnoh/torterra.png', './Sinnoh/uxie.png',

    // Canciones de Audio
    encodeURI('./assets/audio/Pokémon Opening & Title Screen (19971998-M01).mp3'),
    encodeURI('./assets/audio/Route 1 Pokémon  Heartgold Soulsilver.mp3'),
    encodeURI('./assets/audio/Pokémon HeartGold & SoulSilver - Kanto Wild Pokémon Battle Music (HQ) - Pokeli.mp3'),
    encodeURI('./assets/audio/Pokémon Ruby - Route 110.mp3'),
    encodeURI('./assets/audio/Pokémon Omega Ruby & Alpha Sapphire - Elite Four Battle Music (HQ) - Pokeli.mp3'),
    encodeURI('./assets/audio/Route 201 pokemon diamond pearl- Nicob.mp3'),
    encodeURI('./assets/audio/Pokémon Omega Ruby & Alpha Sapphire - Cobalion, Virizion & Terrakion Battle Music (HQ) - Pokeli.mp3'),
    encodeURI('./assets/audio/littleroot town pokemon ruby .mp3')
];

// Instalación robusta: guarda individualmente cada archivo para garantizar 100% offline
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_VERSION).then((cache) => {
            return Promise.allSettled(
                APP_SHELL.map((url) => cache.add(url).catch((err) => console.log('Opcional no guardado aún:', url)))
            );
        }).then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(keys.filter((key) => key !== CACHE_VERSION).map((key) => caches.delete(key)))
        ).then(() => self.clients.claim())
    );
});

// Interceptor de peticiones: prioriza caché y guarda en segundo plano
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
