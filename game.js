/* game.js 
   Responsabilidad: Controlar el estado de la partida, voltear cartas y validar parejas.
*/

// Variables de estado del juego (Globales para este archivo)
let matchesFound = 0;   // Contador de parejas logradas
let totalPairsNeeded = 0; // Cantidad total de parejas según el nivel (16 cartas = 8 pares, 36 cartas = 18 pares, etc.)
let flippedCards = []; // Guarda las dos cartas seleccionadas en el turno actual
let lockBoard = false;  // Bandera de seguridad para bloquear clics durante animaciones

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
function disableCards(card1, card2) {
    card1.classList.add('matched');
    card2.classList.add('matched');
    
    matchesFound++; // Aumentamos el contador de parejas encontradas

    resetTurn();

    // Verificación de victoria: si las parejas encontradas equivalen a las del mapa, ganaste
    if (matchesFound === totalPairsNeeded) {
        const finalTime = stopTimer(); // Detiene el reloj de timer.js
        setTimeout(() => endGame(true, finalTime), 600); // Pequeña espera para ver la última animación
    }
}
/**
 * Si las cartas NO coinciden, se bloquea el tablero un segundo y se vuelven a ocultar.
 */
function unflipCards(card1, card2) {
    lockBoard = true; // Congela el tablero para que el jugador no cliquee una tercera carta

    setTimeout(() => {
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
        
        resetTurn(); // Libera el tablero y vacía el array de seleccionados
    }, 1000); // 1000 milisegundos = 1 segundo de visualización
}

/**
 * Reinicia las variables de control al finalizar un turno.
 */
function resetTurn() {
    flippedCards = [];
    lockBoard = false;
}


/**
 * @param {boolean} isWin
 * @param {string} finalTime
 */
function endGame(isWin, finalTime = "00:00") {
    // Forzamos la detención del reloj por si acaso fue una derrota
    if (!isWin) stopTimer();

    // Ocultamos la pantalla de juego y mostramos la pantalla de resultados
    document.getElementById("game-screen").classList.add("hidden");
    const endScreen = document.getElementById("end-screen");
    endScreen.classList.remove("hidden");

    const endTitle = document.getElementById("end-title");
    const endMessage = document.getElementById("end-message");
    const endTimeResult = document.getElementById("end-time-result");

    endTimeResult.textContent = finalTime;

    if (isWin) {
        endTitle.textContent = "¡Felicidades, Ganaste!";
        endMessage.textContent = "quequerei...tengo 10 bs te sirven?.";
        endTitle.style.color = "#ffcb05";
    } else {
        endTitle.textContent = "Seteacabo el tiempo bro";
        endMessage.textContent = "El contador llegó a cero, perdiste! ¡Inténtalo de nuevo!";
        endTitle.style.color = "#ff3333";
    }
}