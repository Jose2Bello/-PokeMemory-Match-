# PokéMemory Match

¡Bienvenido a **PokeMemory Match**! Un clásico juego de memoria (encuentra las parejas) ambientado en el universo de Pokémon, desarrollado con tecnologías web estándar (**HTML5, CSS3 y JavaScript Vanilla**). El proyecto cuenta con un sistema modular de scripts, diseño retro pixelado con fuentes tipográficas personalizadas, y mecánicas avanzadas de juego en solitario y multijugador.

---

## Detalles del Proyecto

* **Estilo Visual:** Interfaz inspirada en los RPG clásicos de Pokémon, utilizando paletas de colores emblemáticas (rojo, amarillo, gris oscuro) y fuentes tipográficas estilo *pixel art*.
* **Modos de Juego:**
    * **Modo Libre (Solo):** Encuentra los pares a tu propio ritmo. Al ganar, la pantalla final te mostrará el total de movimientos realizados.
    * **Contrareloj (Time-Attack):** El usuario compite contra un reloj en cuenta regresiva. Si el tiempo llega a cero, el juego termina.
    * **Modo PvP (Jugador vs Jugador):** Dos jugadores se turnan localmente en el mismo dispositivo. Si un jugador acierta un par, mantiene el turno y suma un punto. Si falla, el turno se intercambia de forma dinámica.
* **Sistema de Logros (Persistencia):** Incluye un sistema de medallas/logros globales. Al ganar en una dificultad específica, saltará un *toast* animado en partida. Además, los logros se guardan de forma permanente en el navegador utilizando `localStorage`, desplegándose en un estante de medallas en el menú principal con su respectivo título y descripción detallada.

---

## Arquitectura de Archivos y Funciones

El código del proyecto está dividido de forma modular según sus responsabilidades para garantizar un mantenimiento limpio y escalable:

### 1. `game.js`
**Responsabilidad:** Controlar el estado interno de la partida, el flujo de los turnos, validación de las cartas y la gestión global de los logros y pantallas de finalización.
* `handleCardClick(cardElement)`: Gestiona los clics de los usuarios sobre las cartas implementando guardas de seguridad contra clics rápidos o cartas ya emparejadas.
* `checkForMatch()`: Evalúa los IDs (`data-pokemon-id`) de las dos cartas volteadas en el turno actual.
* `disableCards()`: Fija las cartas emparejadas, procesa los puntajes si el modo es PvP y valida si se ha completado el tablero para finalizar el juego.
* `unflipCards()`: Aplica una animación de retraso para voltear las cartas boca abajo cuando el usuario falla, intercambiando el turno en el modo PvP.
* `resetTurn()`: Restablece el arreglo de selección y desbloquea el tablero para el siguiente intento.
* `window.unlockAchievement(title, description, icon)`: Registra nuevos logros en el almacenamiento local del navegador y genera el *pop-up (toast)* animado en la interfaz de partida.
* `renderAchievementsShelf()`: Lee los logros guardados en el almacenamiento local e inyecta dinámicamente las medallas visuales (con título y descripción) en el menú principal.
* `window.endGame(isWin)`: Detiene los contadores, oculta la pantalla del tablero de juego, evalúa las condiciones de victoria/derrota/empate y despliega la tarjeta de resultados finales con el tiempo y movimientos realizados.
* `initGameMode(mode, names)`: Configura el estado inicial, reinicia marcadores, resetea el contador de movimientos y ajusta el HUD visual dependiendo del modo seleccionado.
* `updatePvpHUD()`: Actualiza los marcadores en tiempo real del Jugador 1 y Jugador 2, añadiendo un indicador visual al jugador que posee el turno activo.

### 2. `board.js` (Estructura del Tablero)
**Responsabilidad:** Manipulación del DOM para la creación dinámica del tablero de juego, la inyección de nodos HTML para las cartas y la aplicación de estilos adaptativos en cuadrícula (CSS Grid) según la dificultad seleccionada.
* `createBoard(cards, difficulty, styles)`: Limpia el contenedor del tablero y calcula la matriz de la cuadrícula (`4x4` para Fácil, `6x6` para Medio, `8x8` para Difícil). Itera sobre el conjunto de cartas barajadas creando la estructura interna (`card-inner`, `card-back`, `card-front`), inyecta los iconos de Pokébolas temáticas con variables CSS, y asocia el escuchador de clics para la interactividad.

### 3. `menu.js` (Control de Menús y Eventos de Configuración)
**Responsabilidad:** Orquestar el flujo de navegación entre las pantallas de la interfaz, el procesamiento de formularios de configuración inicial, la inicialización del apartado sonoro y el restablecimiento completo del estado del juego en reinicios o salidas.
* **Manejador de Cambio de Modo (`change`):** Monitorea la selección del modo de juego para mostrar u ocultar dinámicamente el contenedor de nombres personalizados en el caso de activar el modo PvP.
* **Manejador de Envío de Configuración (`submit`):** Previene el comportamiento por defecto del formulario, determina el total de parejas según la dificultad, inicializa las propiedades globales, procesa los nombres de los jugadores si aplica, activa las pistas musicales de fondo desde `POKE_PLAYLIST` basándose en la región/modo, altera las clases del `body` para renderizar el tema visual seleccionado e inicia el temporizador de juego en los modos individuales.
* **Manejador de Botón de Salida (`exit-game-btn`):** Detiene los cronómetros activos, restablece los textos informativos a sus valores por defecto (`00:00`), limpia el tablero de juego removiendo las cartas inyectadas, resetea los turnos/parejas y devuelve la pista musical al tema del menú principal.
* **Manejador de Botón de Reinicio/Volver (`restart-btn`):** Oculta la pantalla de victoria/derrota (`end-screen`), remueve las interfaces de juego activas, limpia el tablero del DOM y redirige al usuario al menú de configuración restableciendo los contadores de control.
* **Inicializador de Audio por Interacción (`click` global):** Ejecuta la reproducción inicial de la música del menú principal tras el primer clic del usuario en el documento, burlando de manera segura las restricciones de reproducción automática (*autoplay*) impuestas por los navegadores modernos.


## Tecnologías Utilizadas

* **HTML5:** Estructura semántica del juego, contenedores de vistas y componentes del DOM.
* **CSS3:** Estilos pixelados, animaciones de volteo de cartas en 3D, transiciones de *toasts* flotantes y diseño responsivo para el tablero.
* **JavaScript (ES6+):** Lógica de estados, almacenamiento persistente (`localStorage`), temporizadores y manipulación dinámica de elementos.


## ⚙️ Notas para el Desarrollador 
Si necesitas resetear por completo el sistema de medallas guardadas para realizar pruebas de rendimiento y comprobar las animaciones de los pop-ups desde cero, puedes ejecutar los siguientes comandos en la consola de desarrollador del navegador (**F12**):

* **Borrar solo las medallas:**
    ```javascript
    localStorage.removeItem("poke_achievements"); location.reload();
    ```
* **Borrar todo el almacenamiento (Hard Reset):**
    ```javascript
    localStorage.clear(); location.reload();
    ```

---
💻 Desarrollado con dedicación por **José Bello** y **Santiago Salas** © 2026.  
*Pokémon es una marca registrada de Nintendo, Creatures Inc. y Game Freak.*
