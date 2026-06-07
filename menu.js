document.addEventListener("DOMContentLoaded", () => {
    const configForm = document.getElementById("game-config");

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

            initGameMode(selectedMode);

         
            const gameData = getThemeAssets(selectedTheme, pairCount);

          
            if (gameData) {
               
                document.getElementById("main-menu").classList.add("hidden");
                document.getElementById("game-screen").classList.remove("hidden");
                
            
                document.getElementById("hud-region").textContent = `Región: ${selectedTheme.toUpperCase()}`;

               
                createBoard(gameData.cards, selectedDifficulty, gameData.styles);
                
               
                if (selectedMode !== "pvp") {
                    startTimer(selectedMode, selectedDifficulty);
                }
            }
        });
    }
});

// ==========================================================================
// CONTROL DEL BOTÓN DE SALIR (REGRESAR AL MENÚ)
// ==========================================================================
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
            
          
            if (typeof resetTurn === "function") {
                resetTurn();
            }
            matchesFound = 0;
        });
    }
});