

const THEMES_CATALOG = {
    kanto: {
        name: "Región de Kanto",
        folder: "Kanto/",            
        cardColor: "#e30d0d",       
        accentColor: "#31A7D7",     
        bgClass: "theme-kanto",
        images: [
            "alakazam-f.png", "arcanine.png", "articuno.png", "blastoise.png",
            "bulbasaur.png", "butterfree-f.png", "charizard.png", "charmander.png",
            "cubone.png", "ditto.png", "dragonite.png", "eevee.png",
            "flareon.png", "gengar.png", "gyarados-f.png", "hypno-f.png",
            "jigglypuff.png", "jolteon.png", "lapras.png", "machamp.png",
            "meowth.png", "mew.png", "mewtwo.png", "pikachu-f.png",
            "psyduck.png", "scyther-f.png", "snorlax.png", "squirtle.png",
            "starmie.png", "vaporeon.png", "venusaur-f.png", "zapdos.png"
        ]
    },
    hoenn: {
        name: "Región de Hoenn",
        folder: "Hoenn/",            
        cardColor: "#08afac",       
        accentColor: "#E08300",     
        bgClass: "theme-hoenn",
        images: [
            "absol.png", "aggron.png", "altaria.png", "banette.png",
            "blaziken-f.png", "breloom.png", "deoxys-normal.png", "dusclops.png",
            "gardevoir.png", "groudon.png", "jirachi.png", "kyogre.png",
            "latias.png", "latios.png", "metagross.png", "milotic-f.png",
            "mudkip.png", "ralts.png", "rayquaza.png", "regice.png",
            "regirock.png", "salamence.png", "sceptile.png", "sharpedo.png",
            "skitty.png", "slaking.png", "spheal.png", "swampert.png",
            "torchic.png", "treecko.png", "tropius.png", "wailord.png"
        ]
    },
    sinnoh: {
        name: "Región de Sinnoh",
        folder: "Sinnoh/",           
        cardColor: "#7942bb",       
        accentColor: "#C0C0C0",     
        bgClass: "theme-sinnoh",
        images: [
            "abomasnow-f.png", "arceus-normal.png", "azelf.png", "cresselia.png",
            "darkrai.png", "dialga.png", "electivire.png", "empoleon.png",
            "gallade.png", "garchomp-f.png", "giratina-altered.png", "glaceon.png",
            "honchkrow.png", "infernape.png", "leafeon.png", "lopunny.png",
            "lucario.png", "luxray-f.png", "manaphy.png", "mesprit.png",
            "munchlax.png", "palkia.png", "phione.png", "piplup.png",
            "regigigas.png", "shaymin-land.png", "shinx-f.png", "spiritomb.png",
            "staraptor-f.png", "togekiss.png", "torterra.png", "uxie.png"
        ]
    }
};

/**
 * Obtiene el mazo de cartas barajado y configurado para la partida.
 */
function getThemeAssets(themeKey, pairCount) {
    const theme = THEMES_CATALOG[themeKey];
    if (!theme) {
        console.error(`La temática "${themeKey}" no existe en el catálogo.`);
        return null;
    }

    let sourceImages = [...theme.images];

    // Barajar imágenes originales
    for (let i = sourceImages.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [sourceImages[i], sourceImages[j]] = [sourceImages[j], sourceImages[i]];
    }

    const selectedPokemon = sourceImages.slice(0, pairCount);
    const deck = [];

    selectedPokemon.forEach(imgName => {
        const fullPath = `${theme.folder}${imgName}`; 
        const pokemonName = imgName.split('.')[0];

        const cardData = {
            id: pokemonName,
            src: fullPath
        };

        deck.push({ ...cardData }, { ...cardData });
    });

    // Barajar mazo final
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    return {
        cards: deck,
        styles: {
            cardColor: theme.cardColor,
            accentColor: theme.accentColor,
            bgClass: theme.bgClass
        }
    };
}