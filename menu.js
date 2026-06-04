document.addEventListener("DOMContentLoaded", () => {
    const configForm = document.getElementById("game-config");

    configForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const selectedTheme = document.getElementById("config-theme").value;
        const selectedDifficulty = document.getElementById("config-difficulty").value;
        const selectedMode = document.getElementById("config-mode").value; // Captura el modo

        let pairCount = 8;
        if (selectedDifficulty === "medium") pairCount = 18;
        if (selectedDifficulty === "hard") pairCount = 32;

      
        matchesFound = 0;
        totalPairsNeeded = pairCount; 
  

        const gameData = getThemeAssets(selectedTheme, pairCount);

        if (gameData) {
            document.getElementById("main-menu").classList.add("hidden");
            document.getElementById("game-screen").classList.remove("hidden");
            
            document.getElementById("hud-region").textContent = `Región: ${selectedTheme.toUpperCase()}`;

            createBoard(gameData.cards, selectedDifficulty, gameData.styles);
            
            // --- ARRANCAR EL RELOJ (timer.js) ---
            startTimer(selectedMode, selectedDifficulty);
        }
    });
});