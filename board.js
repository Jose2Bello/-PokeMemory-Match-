function createBoard(cards, difficulty, styles) {
    const boardContainer = document.getElementById("game-board");
    boardContainer.innerHTML = "";

    let gridCols, gridRows;
    switch (difficulty) {
        case "easy":
            gridCols = 4;
            gridRows = 4;
            break;
        case "medium":
            gridCols = 6;
            gridRows = 6;
            break;
        case "hard":
            gridCols = 8;
            gridRows = 8;
            break;
        default:
            gridCols = 4;
            gridRows = 4;
    }

    boardContainer.style.display = "grid";
    boardContainer.style.gridTemplateColumns = `repeat(${gridCols}, 1fr)`;
    boardContainer.style.gridTemplateRows = `repeat(${gridRows}, 1fr)`;
    boardContainer.style.gap = "8px"; 

    cards.forEach((cardData, index) => {
        const cardElement = document.createElement("div");
        cardElement.classList.add("card");
        cardElement.dataset.pokemonId = cardData.id;
        cardElement.dataset.index = index;

        // --- CONEXIÓN DE EVENT LISTENER CON GAME.JS ---
        cardElement.addEventListener("click", () => handleCardClick(cardElement));
        // -----------------------------------------------

        const cardInner = document.createElement("div");
        cardInner.classList.add("card-inner");

        const cardBack = document.createElement("div");
        cardBack.classList.add("card-back");
        cardBack.style.backgroundColor = styles.cardColor; 
        
        const pokeballIcon = document.createElement("span");
        pokeballIcon.textContent = "🔴"; 
        cardBack.appendChild(pokeballIcon);

        const cardFront = document.createElement("div");
        cardFront.classList.add("card-front");
        
        const pokemonImg = document.createElement("img");
        pokemonImg.src = cardData.src;
        pokemonImg.alt = cardData.id;

        cardFront.appendChild(pokemonImg);
        cardInner.appendChild(cardBack);
        cardInner.appendChild(cardFront);
        cardElement.appendChild(cardInner);
        
        boardContainer.appendChild(cardElement);
    });
}