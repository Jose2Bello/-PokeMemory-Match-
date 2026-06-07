document.addEventListener("DOMContentLoaded", () => {
    const configForm = document.getElementById("game-config");
    const modeSelect = document.getElementById("config-mode");
    const pvpNamesContainer = document.getElementById("pvp-names-container");

    // --- CAMBIO 1: Mostrar/Ocultar inputs de nombres según el modo seleccionado ---
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

            // --- CAMBIO 2: Capturar los nombres de los jugadores si el modo es PvP ---
            let namesData = null;
            if (selectedMode === "pvp") {
                const p1NameInput = document.getElementById("player1-name").value.trim();
                const p2NameInput = document.getElementById("player2-name").value.trim();
                
                namesData = {
                    p1: p1NameInput || "Jugador 1",
                    p2: p2NameInput || "Jugador 2"
                };
            }

            // --- CAMBIO 3: Pasar el objeto de nombres a la función del juego ---
            initGameMode(selectedMode, namesData);

         
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
            
           
            document.body.className = "";  // ESTA ES LA LINEA QUE FALTABA
          
            if (typeof resetTurn === "function") {
                resetTurn();
            }
            matchesFound = 0;
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

            // Ocultamos la pantalla de victoria y mostramos el menú principal
            document.getElementById("end-screen").classList.add("hidden");
            document.getElementById("main-menu").classList.remove("hidden");

            const pvpInfo = document.getElementById("hud-pvp-info");
            const soloInfo = document.getElementById("hud-solo-info");
            
            if (pvpInfo) pvpInfo.classList.add("hidden");
            if (soloInfo) soloInfo.classList.remove("hidden");

            const boardContainer = document.getElementById("game-board");
            if (boardContainer) boardContainer.innerHTML = "";
            
    
            document.body.className = ""; 

            if (typeof resetTurn === "function") {
                resetTurn();
            }
            matchesFound = 0;
        });
    }
});