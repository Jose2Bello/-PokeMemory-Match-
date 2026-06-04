let timerInterval = null;
let timeElapsed = 0; // Para modo libre (cuenta ascendente)
let timeRemaining = 0; // Para modo tiempo (cuenta descendente)
let currentGameMode = "free";

/**
 * Inicia el temporizador según el modo seleccionado.
 * @param {string} mode - 'free' o 'time'
 * @param {string} difficulty - Para calcular el límite de tiempo del modo contrarreloj
 */
function startTimer(mode, difficulty) {
    clearInterval(timerInterval); 
    currentGameMode = mode;
    const timerDisplay = document.getElementById("hud-timer");

    if (mode === "free") {
        timeElapsed = 0;
        timerDisplay.textContent = "Tiempo: 00:00";

        timerInterval = setInterval(() => {
            timeElapsed++;
            timerDisplay.textContent = `Tiempo: ${formatTime(timeElapsed)}`;
        }, 1000);
        
    } else if (mode === "time") {
      
        if (difficulty === "easy") timeRemaining = 60;       // 60 seg 
        if (difficulty === "medium") timeRemaining = 120;    // 2 min 
        if (difficulty === "hard") timeRemaining = 240;      // 4 min 

        timerDisplay.textContent = `Tiempo: ${formatTime(timeRemaining)}`;

        timerInterval = setInterval(() => {
            timeRemaining--;
            timerDisplay.textContent = `Tiempo: ${formatTime(timeRemaining)}`;

            if (timeRemaining <= 0) {
                clearInterval(timerInterval);
                endGame(false); // Derrota por tiempo
            }
        }, 1000);
    }
}


function stopTimer() {
    clearInterval(timerInterval);
    const finalSeconds = (currentGameMode === "free") ? timeElapsed : timeRemaining;
    return formatTime(finalSeconds);
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}