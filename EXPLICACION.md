# Portfolio de Agustin Geonas Stunf · cómo está hecho

Página de una sola pantalla larga con estética de macOS, hecha con HTML, CSS y JavaScript sin librerías. Se abre haciendo doble clic en `index.html`.

## Estructura de carpetas

```
portfolio-agus/
├── index.html        contenido: fondo, barra de menú, secciones y dock
├── css/styles.css    diseño: colores, ventanas, layout y animaciones
├── js/main.js        comportamiento: dock, galería, consulta, terminal
└── img/              capturas de las ventanas y fotos de la galería
```

## index.html

| Bloque | Qué es |
|---|---|
| `.wall` | el fondo de macOS, dibujado como SVG con círculos y cintas en degradé |
| `.menubar` | la barra de arriba con el nombre de la app activa, el menú y el reloj |
| `#inicio` | nombre y ventana "Acerca de Agustin" |
| `#universo` | ventana Finder con las cuatro áreas |
| `#frontend` | capturas de VS Code y Portal |
| `#proyectos` | la app Fotos con álbumes por año |
| `#sistemas` | ventana tipo Postman con el diagrama de tablas y la consulta |
| `#metodo` | el loop `learn(); create(); improve();` y la terminal |
| `#contacto` | mail y GitHub |
| `.dockw` | el dock de abajo, que funciona como menú |
| `#ql` | la "vista rápida" que agranda una foto |

Cada sección imita una ventana de Mac: `.win` es el marco, `.tbar` la barra con los tres botones de colores (`.dots`) y `.wbody` el contenido.

## css/styles.css

### Variables
`:root` define los colores (`--blue`, `--violet`, `--orange`, `--mint`, `--pink`) y la curva de movimiento `--ease`. Cada tarjeta de "Universo" recibe su color con una variable local, por ejemplo `style="--c: var(--blue)"`, y el CSS usa `var(--c)` para el ícono y el borde al hacer hover.

### Fondo
`.wall` es `position: fixed`, así queda quieto detrás de todo mientras la página se mueve. El `::after` agrega una capa oscura encima para que el texto se lea bien.

### Efecto vidrio
La barra de menú, el dock y algunos paneles usan `backdrop-filter: blur(...)` con un fondo semitransparente. Eso desenfoca lo que hay detrás, como en macOS.

### Celular
`@media (max-width: 900px)` pasa todas las grillas a una columna, oculta el menú de texto de la barra y achica el dock.

## js/main.js

1. **Reloj:** arma la fecha y hora en español y la actualiza cada 15 segundos.
2. **Dock:** crea los íconos desde la lista `DOCK` y maneja el zoom y el rebote.
3. **Aparición:** abre las ventanas cuando entran en pantalla.
4. **Fondo con scroll:** mueve las manchas de color del fondo.
5. **Sección activa:** cambia el nombre de la app en la barra según la sección.
6. **Fotos:** arma la galería desde la lista `T`, filtra por álbum y abre la vista rápida.
7. **Sistemas:** simula la consulta a la API.
8. **Método:** escribe la terminal y anima el loop.

## Animaciones

### 1. Ventanas que se abren
**Dónde:** `.open` y `.st` en el CSS, parte "aparición" del JS.

Las ventanas arrancan invisibles, un poco más chicas y más abajo (`opacity: 0; scale: .94; translate: 0 40px`). Un `IntersectionObserver` les agrega la clase `in` cuando entran en pantalla, y la `transition` de 0,9 s las lleva a tamaño y posición normales. Es parecido a como macOS abre una ventana.

Los elementos de adentro tienen la clase `st` y aparecen después, escalonados con `transition-delay` según su posición (`:nth-child(2)`, `(3)`, etc.).

### 2. Dock con zoom tipo Mac
**Dónde:** parte "dock" del JS.

Con cada movimiento del mouse sobre el dock, el JS mide la distancia `d` entre el mouse y el centro de cada ícono. Calcula `k = 1 - d/140`: vale 1 cuando el mouse está justo encima y 0 a 140px o más.

El tamaño final es `52 * (1 + 0.55 * k² * (3 - 2k))`. Esa fórmula (smoothstep) hace que el agrandado sea suave: el ícono de abajo del mouse crece un 55% y los vecinos crecen menos. Al salir del dock vuelven a 52px con una transición de 0,18 s.

Solo se activa si `matchMedia("(pointer: fine)")` es verdadero, o sea con mouse. En celular no tiene sentido.

### 3. Rebote al hacer clic en el dock
**Dónde:** `@keyframes bounce` y el `click` de cada ícono.

Al tocar un ícono, el JS le saca la clase `bounce`, fuerza al navegador a recalcular con `void i.offsetWidth` y se la vuelve a poner. Ese truco reinicia la animación aunque se toque dos veces seguidas. El keyframe sube el ícono 18px y lo baja, como cuando se abre una app en Mac.

### 4. Punto de app abierta y nombre en la barra
**Dónde:** parte "sección activa" del JS.

En cada scroll se calcula qué sección está en pantalla. El ícono del dock de esa sección recibe la clase `on`, que muestra el puntito blanco abajo. La barra de menú cambia el nombre de la app según el objeto `APP`: Finder, Code, Fotos, Postman, Terminal o Mail.

### 5. Fondo que se mueve con el scroll
**Dónde:** parte "fondo que acompaña el scroll" del JS.

Se calcula `p`, el porcentaje de la página que ya bajaste (de 0 a 1). Cada mancha de color tiene una dirección en el arreglo `drift` y se mueve `drift * p * 3` píxeles. Como cada una va para un lado distinto, el fondo parece tener profundidad.

El cálculo va dentro de `requestAnimationFrame` y con la bandera `ticking`, para hacerlo como máximo una vez por cuadro y que no se trabe.

### 6. Álbumes de fotos
**Dónde:** parte "fotos" del JS y `.tile.off` en el CSS.

Cada foto tiene un `data-al` con su álbum. Al elegir uno en la barra lateral, las fotos de otros álbumes reciben la clase `off`, que las deja casi transparentes y un poco más chicas. La transición hace que se apaguen en vez de desaparecer de golpe.

### 7. Vista rápida
**Dónde:** `.ql` y `.qlw` en el CSS.

Al tocar una foto, el JS completa título, imagen y descripción y agrega `open` a `.ql`. El fondo oscuro aparece con `opacity` y la ventana crece de `scale: .9` a `1`. Se cierra con el botón, tocando afuera o con Escape.

### 8. Diagrama que se dibuja solo
**Dónde:** `.er path` en el CSS.

Las líneas entre tablas son `<path>` de SVG con `stroke-dasharray: 400` y `stroke-dashoffset: 400`. Eso arma una raya de 400px corrida 400px, o sea invisible. Cuando la ventana recibe `in`, el offset pasa a 0 en 1,4 s y la línea se ve como si se dibujara.

### 9. Consulta a la API
**Dónde:** función `send()` del JS.

Cuando la ventana de Sistemas aparece, a los 0,9 s se ejecuta `send()` sola, y también se puede tocar **Send**. Muestra "Enviando…", espera 0,55 s, escribe `200 OK · 48 ms` y después agrega las líneas del JSON una cada 0,11 s. La variable `busy` evita que se mezclen dos envíos si se toca varias veces.

### 10. Terminal y loop del método
**Dónde:** funciones `typeTerm()` y `runLoop()` del JS.

`typeTerm()` recorre la lista `TERM`. Si la línea es texto, la muestra entera. Si es un comando, escribe el prompt y después el comando letra por letra cada 30 ms. Al final deja el cursor verde titilando.

`runLoop()` usa `setInterval` cada 1,1 s para pasar la clase `on` de `learn()` a `create()` y a `improve()`. Las que no están activas quedan al 30% de opacidad, así se ve el loop dando vueltas.

### 11. Accesibilidad del movimiento
`@media (prefers-reduced-motion: reduce)` apaga las animaciones y `sleep()` devuelve 0 ms, para quien tenga activada la reducción de movimiento en su sistema.
