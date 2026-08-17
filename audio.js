let backgroundMusic = null;


const POKE_PLAYLIST = {
    menu: "assets/audio/Pokémon Opening & Title Screen (19971998-M01).mp3",
    kanto: {
        free: "assets/audio/Route 1 Pokémon  Heartgold Soulsilver.mp3",
        time: "assets/audio/Route 1 Pokémon  Heartgold Soulsilver.mp3",
        pvp: "assets/audio/Pokémon HeartGold & SoulSilver - Kanto Wild Pokémon Battle Music (HQ) - Pokeli.mp3"
    },
    hoenn: {
        free: "assets/audio/Pokémon Ruby - Route 110.mp3",
        time: "assets/audio/Pokémon Ruby - Route 110.mp3",
        pvp: "assets/audio/Pokémon Omega Ruby & Alpha Sapphire - Elite Four Battle Music (HQ) - Pokeli.mp3"
    },
    sinnoh: {
        free: "assets/audio/Route 201 pokemon diamond pearl- Nicob.mp3",
        time: "assets/audio/Route 201 pokemon diamond pearl- Nicob.mp3",
        pvp: "assets/audio/Pokémon Omega Ruby & Alpha Sapphire - Cobalion, Virizion & Terrakion Battle Music (HQ) - Pokeli.mp3"
    }
};

/**
 * @param {string} audioPath - La ruta del archivo .mp3 a reproducir
 */
function playTrack(audioPath) {
    if (backgroundMusic) {
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0;
    }

    backgroundMusic = new Audio(audioPath);
    backgroundMusic.loop = true;

    // Lee el valor actual del slider para que la nueva canción no empiece a tope
    const volumeSlider = document.getElementById("volume-slider");
    if (volumeSlider) {
        backgroundMusic.volume = parseFloat(volumeSlider.value);
    } else {
        backgroundMusic.volume = 0.5; // Respaldo por si acaso
    }

    backgroundMusic.play().catch(error => {
        console.log("Autoplay bloqueado por el navegador. Sonará tras el primer clic.");
    });
}

/**
 * Componente de control de audio (mute + volumen desplegable).
 * Renderiza la UI dentro del contenedor indicado y conecta su lógica.
 * @param {HTMLElement} container - Elemento donde se monta el control.
 */
function createAudioControls(container) {
    if (!container) return null;

    container.innerHTML = `
        <div id="audio-controls-global">
            <button id="btn-mute" type="button" title="Silenciar/Activar sonido">
                <span id="mute-icon">🔊</span>
            </button>
            <button id="btn-volume-toggle" type="button" title="Ajustar volumen" aria-expanded="false">
                <span id="volume-toggle-icon">▾</span>
            </button>
            <div id="volume-panel" class="volume-panel">
                <input type="range" id="volume-slider" min="0" max="1" step="0.05" value="0.5" aria-label="Volumen">
            </div>
        </div>
    `;

    const volumeSlider = document.getElementById("volume-slider");
    const btnMute = document.getElementById("btn-mute");
    const muteIcon = document.getElementById("mute-icon");
    const btnVolumeToggle = document.getElementById("btn-volume-toggle");
    const volumePanel = document.getElementById("volume-panel");
    let previousVolume = 0.5;

    if (btnVolumeToggle && volumePanel) {
        btnVolumeToggle.addEventListener("click", () => {
            const isOpen = volumePanel.classList.toggle("open");
            btnVolumeToggle.setAttribute("aria-expanded", String(isOpen));
            const toggleIcon = document.getElementById("volume-toggle-icon");
            if (toggleIcon) toggleIcon.textContent = isOpen ? "▴" : "▾";
        });
    }

    if (volumeSlider) {
        volumeSlider.addEventListener("input", (e) => {
            const currentVolume = parseFloat(e.target.value);

            if (backgroundMusic) {
                backgroundMusic.volume = currentVolume;
            }

            if (currentVolume === 0) {
                muteIcon.textContent = "🔇";
            } else if (currentVolume < 0.4) {
                muteIcon.textContent = "🔈";
            } else {
                muteIcon.textContent = "🔊";
            }
        });
    }

    if (btnMute && volumeSlider && muteIcon) {
        btnMute.addEventListener("click", () => {
            if (backgroundMusic) {
                if (backgroundMusic.volume > 0) {
                    previousVolume = backgroundMusic.volume;
                    backgroundMusic.volume = 0;
                    volumeSlider.value = 0;
                    muteIcon.textContent = "🔇";
                } else {
                    backgroundMusic.volume = previousVolume > 0 ? previousVolume : 0.5;
                    volumeSlider.value = backgroundMusic.volume;
                    muteIcon.textContent = backgroundMusic.volume < 0.4 ? "🔈" : "🔊";
                }
            } else {
                if (parseFloat(volumeSlider.value) > 0) {
                    previousVolume = parseFloat(volumeSlider.value);
                    volumeSlider.value = 0;
                    muteIcon.textContent = "🔇";
                } else {
                    volumeSlider.value = previousVolume;
                    muteIcon.textContent = previousVolume < 0.4 ? "🔈" : "🔊";
                }
            }
        });
    }

    return container;
}

document.addEventListener("DOMContentLoaded", () => {
    const root = document.getElementById("audio-controls-root");
    if (root) createAudioControls(root);
});
