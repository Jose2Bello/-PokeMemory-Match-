/**
 * Componente de pie de página.
 * Renderiza el footer dentro del contenedor indicado.
 * @param {HTMLElement} container - Elemento donde se monta el footer.
 */
function createFooter(container) {
    if (!container) return null;

    container.innerHTML = `
        <footer class="game-footer">
            <p>Desarrollado por <strong>José Bello y Santiago Salas</strong> &copy; 2026</p>
            <p class="disclaimer">
                Pokémon es una marca registrada de Nintendo, Creatures Inc. y Game Freak.
                Este es un proyecto académico sin fines de lucro creado con fines ilustrativos y de entretenimiento.
            </p>
        </footer>
    `;

    return container;
}

document.addEventListener("DOMContentLoaded", () => {
    const root = document.getElementById("footer-root");
    if (root) createFooter(root);
});
