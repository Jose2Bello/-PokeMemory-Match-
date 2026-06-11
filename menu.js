document.addEventListener("DOMContentLoaded", () => {
    const configForm = document.getElementById("game-config");
    const modeSelect = document.getElementById("config-mode");
    const pvpNamesContainer = document.getElementById("pvp-names-container");

    if (modeSelect && pvpNamesContainer) {
        modeSelect.addEventListener("change", () => {
            if (modeSelect.value === "pvp") {
                pvpNamesContainer.classList.remove("hidden");
            } else {
                pvpNamesContainer.classList.add("hidden");
            }
        });
    }

    if (configForm) {
        configForm.addEventListener("submit", (event) => {
            
            event.preventDefault();

            const selectedTheme = document.getElementById("config-theme").value;
            const selectedDifficulty = document.getElementById("config-difficulty").value;
            const selectedMode = document.getElementById("config-mode").value; 
           
            let pairCount = 8;
            if (selectedDifficulty === "medium") pairCount = 18;
            if (selectedDifficulty === "hard") pairCount = 32;

            matchesFound = 0;
            totalPairsNeeded = pairCount; 

            let namesData = null;
            if (selectedMode === "pvp") {
                const p1NameInput = document.getElementById("player1-name").value.trim();
                const p2NameInput = document.getElementById("player2-name").value.trim();
                
                namesData = {
                    p1: p1NameInput || "Jugador 1",
                    p2: p2NameInput || "Jugador 2"
                };
            }

            initGameMode(selectedMode, namesData);

    
            const themePlaylist = POKE_PLAYLIST[selectedTheme];
            
            if (themePlaylist) {
                // 2. Extraemos la canción exacta según el modo (free, time, pvp)
                const trackToPlay = themePlaylist[selectedMode];
                
                // 3. Si la canción existe en nuestro mapa, la reproducimos
                if (trackToPlay) {
                    playTrack(trackToPlay);
                }
            }
            // ==================================================================

            const gameData = getThemeAssets(selectedTheme, pairCount);

            if (gameData) {
               
                document.getElementById("main-menu").classList.add("hidden");
                document.getElementById("game-screen").classList.remove("hidden");
                
                document.body.className = ""; 
                document.body.classList.add(`theme-${selectedTheme}`); 
                
                document.getElementById("hud-region").textContent = `Región: ${selectedTheme.toUpperCase()}`;

                createBoard(gameData.cards, selectedDifficulty, gameData.styles);
                
                if (selectedMode !== "pvp") {
                    startTimer(selectedMode, selectedDifficulty);
                }
            }
        });
    }
});


document.addEventListener("DOMContentLoaded", () => {
    const exitBtn = document.getElementById("exit-game-btn");

    if (exitBtn) {
        exitBtn.addEventListener("click", () => {
         
            if (typeof stopTimer === "function") {
                stopTimer();
            }

            const timerElement = document.getElementById("hud-timer");
            if (timerElement) timerElement.textContent = "00:00";

            document.getElementById("game-screen").classList.add("hidden");
            document.getElementById("main-menu").classList.remove("hidden");

            const pvpInfo = document.getElementById("hud-pvp-info");
            const soloInfo = document.getElementById("hud-solo-info");
            
            if (pvpInfo) pvpInfo.classList.add("hidden");
            if (soloInfo) soloInfo.classList.remove("hidden");

            const boardContainer = document.getElementById("game-board");
            if (boardContainer) boardContainer.innerHTML = "";
            
            document.body.className = "";  
            
       
            document.getElementById("end-message").textContent = "";
            document.getElementById("end-time-result").textContent = "";

            if (typeof resetTurn === "function") {
                resetTurn();
            }
            matchesFound = 0;

            // Volvemos a poner la música del menú principal
            if (typeof playTrack === "function") {
                playTrack(POKE_PLAYLIST.menu);
            }
        });
    }
});


document.addEventListener("DOMContentLoaded", () => {
    const restartBtn = document.getElementById("restart-btn");

    if (restartBtn) {
        restartBtn.addEventListener("click", () => {
            
            if (typeof stopTimer === "function") {
                stopTimer();
            }

            const timerElement = document.getElementById("hud-timer");
            if (timerElement) timerElement.textContent = "00:00";

            document.getElementById("end-screen").classList.add("hidden");
            document.getElementById("main-menu").classList.remove("hidden");
            document.getElementById("game-screen").classList.add("hidden");

            const pvpInfo = document.getElementById("hud-pvp-info");
            const soloInfo = document.getElementById("hud-solo-info");
            
            if (pvpInfo) pvpInfo.classList.add("hidden");
            if (soloInfo) soloInfo.classList.remove("hidden");

            const boardContainer = document.getElementById("game-board");
            if (boardContainer) boardContainer.innerHTML = "";
            
            document.body.className = ""; 

            document.getElementById("end-message").textContent = "";
            document.getElementById("end-time-result").textContent = "";

            if (typeof resetTurn === "function") {
                resetTurn();
            }
            matchesFound = 0;

            // Volvemos a poner la música del menú principal
            if (typeof playTrack === "function") {
                playTrack(POKE_PLAYLIST.menu);
            }
        });
    }
});

document.addEventListener("click", () => {
 
    if (!backgroundMusic) {
        playTrack(POKE_PLAYLIST.menu);
    }
}, { once: true });