/* game.js 
   Responsabilidad: Controlar el estado de la partida, voltear cartas y validar parejas.
*/

// Variables de estado del juego (Globales para este archivo)
let matchesFound = 0;   // Contador de parejas logradas
let totalPairsNeeded = 0; // Cantidad total de parejas según el nivel (16 cartas = 8 pares, 36 cartas = 18 pares, etc.)
let flippedCards = []; // Guarda las dos cartas seleccionadas en el turno actual
let lockBoard = false;  // Bandera de seguridad para bloquear clics durante animaciones
let gameMode = "solo"; // Puede ser 'solo', 'time-attack' o 'pvp'
let activePlayer = 1;  // Identifica si juega el Jugador 1 o el Jugador 2
let pvpScores = { player1: 0, player2: 0 }; // Almacena los puntajes de cada jugador en modo PvP
let playerNames = { player1: "Jugador 1", player2: "Jugador 2" };
/**
 * Función que se ejecuta cada vez que el usuario hace clic en una carta.
 * @param {HTMLElement} cardElement - El contenedor de la carta cliqueada.
 */
function handleCardClick(cardElement) {
    // 1. Guardas de seguridad obligatorias
    if (lockBoard) return; // Si el tablero está congelado por animación, ignora el clic
    if (cardElement.classList.contains('flipped')) return; // Si la carta ya está volteada, ignora
    if (cardElement.classList.contains('matched')) return; // Si ya fue emparejada, ignora

    // 2. Voltear la carta visualmente añadiendo la clase CSS
    cardElement.classList.add('flipped');

    // 3. Registrar la carta seleccionada en el turno actual
    flippedCards.push(cardElement);

    // 4. Si es la primera carta que voltea en este turno, salimos y esperamos la segunda
    if (flippedCards.length === 1) return;

    // 5. Si llegamos aquí, es la segunda carta. Evaluamos de inmediato
    checkForMatch();
}

/**
 * Compara los IDs de las dos cartas actualmente volteadas.
 */
function checkForMatch() {
    const [card1, card2] = flippedCards;
    
    // Obtenemos los data-pokemon-id que inyectamos en board.js
    const isMatch = card1.dataset.pokemonId === card2.dataset.pokemonId;

    if (isMatch) {
        disableCards(card1, card2);
    } else {
        unflipCards(card1, card2);
    }
}

/**
 * Si las cartas coinciden, se quedan fijas boca arriba y se limpian del estado.
 */
function disableCards() {
    const [card1, card2] = flippedCards;
    card1.classList.add('matched');
    card2.classList.add('matched');
    
    matchesFound++;

    // --- LOGICA PVP: Asignar punto al jugador activo ---
    if (gameMode === "pvp") {
        if (activePlayer === 1) {
            pvpScores.player1++;
        } else {
            pvpScores.player2++;
        }
        updatePvpHUD();
    }

    if (matchesFound === totalPairsNeeded) {
        endGame(true);
    } else {
        resetTurn(); // Limpia el array de cartas volteadas para el siguiente intento
    }
}

function unflipCards() {
    lockBoard = true;

    setTimeout(() => {
        const [card1, card2] = flippedCards;
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');

        // --- LÓGICA PVP: Intercambiar turno al fallar ---
        if (gameMode === "pvp") {
            // Si es 1 pasa a 2, si no, pasa a 1
            activePlayer = activePlayer === 1 ? 2 : 1; 
            updatePvpHUD();
        }

        resetTurn();
    }, 1000);
}


function resetTurn() {
    flippedCards = [];
    lockBoard = false;
}


/**
 * @param {boolean} isWin
 * @param {string} finalTime
 * 
 */
function endGame(isWin) {
    // 1. Detenemos los relojes por si acaso estábamos en modo Solo/Time Attack
    if (typeof stopTimer === "function") {
        stopTimer();
    }

    const gameScreen = document.getElementById("game-screen");
    const endScreen = document.getElementById("end-screen");
    const endMessage = document.getElementById("end-message");
    const endTimeResult = document.getElementById("end-time-result");

    if (gameScreen && endScreen) {
        gameScreen.classList.add("hidden");
        endScreen.classList.remove("hidden");

        if (gameMode === "pvp") {
            // Ocultamos el texto del tiempo porque en PvP no importa el reloj
            if (endTimeResult) endTimeResult.classList.add("hidden");

                if (pvpScores.player1 > pvpScores.player2) {
                endMessage.innerHTML = `¡Victoria para <span style="color: #ffcb05;">${playerNames.player1}</span>!<br>Puntaje: ${pvpScores.player1} a ${pvpScores.player2}`;
            } else if (pvpScores.player2 > pvpScores.player1) {
                endMessage.innerHTML = `¡Victoria para <span style="color: #ffcb05;">${playerNames.player2}</span>!<br>Puntaje: ${pvpScores.player2} a ${pvpScores.player1}`;
            } else {
                endMessage.innerHTML = `¡Empate técnico!<br>Ambos consiguieron ${pvpScores.player1} parejas.`;
            }
}
        } else {
            // MODO SOLO: Muestra los mensajes clásicos de tiempo récord o derrota
            if (endTimeResult) endTimeResult.classList.remove("hidden");
            
            if (isWin) {
                endMessage.textContent = "¡Felicidades! Completaste el tablero.";
                
            const currentDifficulty = document.getElementById("config-difficulty")?.value || "easy";
            
            if (currentDifficulty === "medium") {
                unlockAchievement("Superbola de Plata", "Completaste el juego en modo Medio.", "🔵");
            } else if (currentDifficulty === "hard") {
                unlockAchievement("Ultra Máster", "¡Increíble! Completaste el tablero en modo Difícil.", "🟡");
            } else if (currentDifficulty === "easy") {
                unlockAchievement("Primeros Pasos", "Completaste el juego en modo Fácil.", "🔴");
            }

                const finalTime = document.getElementById("hud-timer")?.textContent || "00:00";
                if (endTimeResult) endTimeResult.textContent = `Tiempo total: ${finalTime}`;
            } else {
                endMessage.textContent = "¡Se agotó el tiempo! Inténtalo de nuevo.";
                if (endTimeResult) endTimeResult.textContent = "";
            }
        }
    }


function initGameMode(mode, names = null) {
    gameMode = mode;
    activePlayer = 1;
    pvpScores.player1 = 0;
    pvpScores.player2 = 0;

    // Si pasamos nombres desde el menú, los guardamos; si no, dejamos los de por defecto
    if (names) {
        playerNames.player1 = names.p1 || "Jugador 1";
        playerNames.player2 = names.p2 || "Jugador 2";
    }

    const soloHud = document.getElementById("hud-solo-info");
    const pvpInfo = document.getElementById("hud-pvp-info");

    if (gameMode === "pvp") {
        if (soloHud) soloHud.classList.add("hidden");
        if (pvpInfo) {
            pvpInfo.classList.remove("hidden");
            updatePvpHUD(); 
        }
    } else {
        if (soloHud) soloHud.classList.remove("hidden");
        if (pvpInfo) pvpInfo.classList.add("hidden");
    }
}


function updatePvpHUD() {
    const p1Element = document.getElementById("score-p1");
    const p2Element = document.getElementById("score-p2");

    if (p1Element && p2Element) {
     
        p1Element.textContent = `${playerNames.player1}: ${pvpScores.player1}`;
        p2Element.textContent = `${playerNames.player2}: ${pvpScores.player2}`;

        if (activePlayer === 1) {
            p1Element.classList.add("player-turn-indicator");
            p2Element.classList.remove("player-turn-indicator");
        } else {
            p2Element.classList.add("player-turn-indicator");
            p1Element.classList.remove("player-turn-indicator");
        }
    }
}


window.unlockAchievement = function(title, description, icon = "🏆") {
    const container = document.getElementById("achievement-container");
    if (!container) return; // Seguridad en caso de que falte el div
    
    const toast = document.createElement("div");
    toast.classList.add("achievement-toast");
    
    toast.innerHTML = `
        <span style="font-size: 1.5rem;">${icon}</span>
        <div>
            <strong style="color: #f6b216; display: block;">¡LOGRO DESBLOQUEADO!</strong>
            <span style="font-size: 0.9rem;">${title}: ${description}</span>
        </div>
    `;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add("fade-out");
        setTimeout(() => toast.remove(), 500);
    }, 4000);
}