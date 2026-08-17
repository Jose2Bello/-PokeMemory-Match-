/* game.js 
   Responsabilidad: Controlar el estado de la partida, voltear cartas, validar parejas y gestionar logros.
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
let moveCount = 0;     // 🆕 Contador global de movimientos para modos solitarios

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

    // 5. Si llegamos aquí, es la segunda carta. Incrementamos movimientos y evaluamos de inmediato
    if (gameMode !== "pvp") {
        moveCount++; 
    }
    checkForMatch();
}

function checkForMatch() {
    const [card1, card2] = flippedCards;
    
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
        window.endGame(true);
    } else {
        resetTurn(); 
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

// ==========================================================================
// 🏆 SISTEMA GLOBAL DE LOGROS (TOASTS Y CONTENEDOR PERSISTENTE)
// ==========================================================================
window.unlockAchievement = function(title, description, icon = "🏆") {
    let savedAchievements = JSON.parse(localStorage.getItem("poke_achievements")) || [];
    
    const alreadyUnlocked = savedAchievements.some(ach => ach.title === title);

    // Guardamos en el almacenamiento únicamente si es la primera vez que se gana
    if (!alreadyUnlocked) {
        savedAchievements.push({ title, description, icon });
        localStorage.setItem("poke_achievements", JSON.stringify(savedAchievements));
        
        // Refrescamos el estante del menú principal de inmediato si la función existe
        renderAchievementsShelf();
    }

    // EL TOAST APARECE SIEMPRE (Sacado de la condicional para asegurar el pop-up visual)
    const container = document.getElementById("achievement-container");
    if (!container) return; 
    
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
};

function renderAchievementsShelf() {
    const shelfList = document.getElementById("shelf-list");
    if (!shelfList) return;

    // Limpiamos el contenedor para no duplicar elementos
    shelfList.innerHTML = "";

    const savedAchievements = JSON.parse(localStorage.getItem("poke_achievements")) || [];

    if (savedAchievements.length === 0) {
        shelfList.innerHTML = `<span style="color: #888; font-size: 0.85rem; font-style: italic;">Ningún logro desbloqueado aún. ¡Completa tableros para conseguirlos!</span>`;
        return;
    }

    // Renderizado estructurado: Muestra Título Y Descripción fija debajo
    savedAchievements.forEach(ach => {
        const badge = document.createElement("div");
        badge.classList.add("shelf-badge");
        badge.title = ach.description; 
        
        badge.innerHTML = `
            <span class="badge-icon" style="font-size: 1.4rem;">${ach.icon}</span>
            <div class="badge-info" style="text-align: left;">
                <strong class="badge-title" style="color: #ffcb05; display: block; font-size: 0.95rem;">${ach.title}</strong>
                <span class="badge-desc" style="color: #cccccc; display: block; font-size: 0.75rem; font-style: italic; margin-top: 2px;">${ach.description}</span>
            </div>
        `;
        
        shelfList.appendChild(badge);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    renderAchievementsShelf();
});


window.endGame = function(isWin) {
    const endScreen = document.getElementById("end-screen");
    const endMessage = document.getElementById("end-message");
    const endTimeResult = document.getElementById("end-time-result");
    const endMovesResult = document.getElementById("end-moves-result");
    const gameScreen = document.getElementById("game-screen"); 
    const boardContainer = document.getElementById("board-container"); 

    if (!endScreen) return;


    if (typeof stopTimer === "function") {
        stopTimer();
    }

    
    if (gameScreen) {
        gameScreen.classList.add("hidden");
    } else if (boardContainer) {
        boardContainer.classList.add("hidden");
    }

    if (isWin) {
        if (endMessage) {
            if (gameMode === "pvp") {
                if (pvpScores.player1 > pvpScores.player2) {
                    endMessage.textContent = `¡Victoria para ${playerNames.player1}!`;
                } else if (pvpScores.player2 > pvpScores.player1) {
                    endMessage.textContent = `¡Victoria para ${playerNames.player2}!`;
                } else {
                    endMessage.textContent = "¡Empate técnico!";
                }
            } else {
                endMessage.textContent = "¡Felicidades! Completaste el tablero.";
            }
        }
        
        // Ejecución y validación de logros según la dificultad seleccionada
        const currentDifficulty = document.getElementById("config-difficulty")?.value || "easy";
        
        if (typeof window.unlockAchievement === "function") {
            if (gameMode === "time") {
                // --- NUEVOS LOGROS CONTRARRELOJ ---
                if (currentDifficulty === "easy") {
                    window.unlockAchievement("Quick Ball", "Completaste el Contrarreloj en modo Fácil.", "⏳");
                } else if (currentDifficulty === "medium") {
                    window.unlockAchievement("Velocidad Extrema", "¡Superaste el Contrarreloj en modo Intermedio!", "⚡");
                } else if (currentDifficulty === "hard") {
                    window.unlockAchievement("Quick Attack", "¡Nivel Dios! Dominaste el Contrarreloj en modo Difícil.", "🟢");
                }
            } else {
                // --- TUS LOGROS ORIGINALES (MODO LIBRE) ---
                if (currentDifficulty === "medium") {
                    window.unlockAchievement("Super Ball", "Completaste el juego en modo Medio.", "🔵");
                } else if (currentDifficulty === "hard") {
                    window.unlockAchievement("Ultra Ball", "¡Increíble! Completaste el tablero en modo Difícil.", "🟡");
                } else if (currentDifficulty === "easy") {
                    window.unlockAchievement("Pokeball", "Completaste el juego en modo Fácil.", "🔴");
                }
            }
        }
        const finalTime = document.getElementById("hud-timer")?.textContent || "00:00";
        if (endTimeResult) {
            if (gameMode === "pvp") {
                endTimeResult.textContent = `${pvpScores.player1} pts vs ${pvpScores.player2} pts`;
            } else {
                endTimeResult.textContent = `Tiempo total: ${finalTime}`;
            }
        }

        if (endMovesResult) {
            if (gameMode !== "pvp") {
                endMovesResult.textContent = `Movimientos realizados: ${moveCount}`;
            } else {
                endMovesResult.textContent = ""; 
            }
        }
    } else {
        if (endMessage) endMessage.textContent = "¡Se acabó el tiempo! Inténtalo de nuevo.";
        if (endTimeResult) endTimeResult.textContent = "";
        if (endMovesResult) endMovesResult.textContent = "";
    }

    endScreen.classList.remove("hidden");
};

// ==========================================================================
// CONFIGURACIÓN DE TURNOS E INTERFAZ HUD
// ==========================================================================
function initGameMode(mode, names = null) {
    gameMode = mode;
    activePlayer = 1;
    pvpScores.player1 = 0;
    pvpScores.player2 = 0;
    moveCount = 0; //  Reiniciamos el contador cada vez que empieza una partida limpia

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