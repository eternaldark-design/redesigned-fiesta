# Guía de estilo: video POV animado

## Estructura del video (24 s)

| Escena | Cuadros | Segundos | Música | Expresión | Función |
|---|---|---|---|---|---|
| 1 | 0–120 | 0–4 | pad suave | `tired` | el problema / punto de partida |
| 2 | 120–240 | 4–8 | entra el arpegio | `grit` | la decisión |
| 3 | 240–420 | 8–14 | bombo + bajo + hi-hats | `effort` | el esfuerzo (sudor, repeticiones) |
| 4 | 420–540 | 14–18 | redoble + riser | `tired` mirando abajo | la persistencia (nadie lo ve) |
| 5 | 540–630 | 18–21 | impacto + todo el arreglo | `happy` | la transformación (confeti, trofeo) |
| 6 | 630–720 | 21–24 | continúa y se apaga | `happy` | cierre con sticker "EMPIEZA HOY." |

Cada escena es un `Sequence` con su propio `BeatFrame`: golpe de zoom (1.06 → 1 en 8
cuadros) y destello blanco en los primeros 4. La música cambia de sección en los
segundos 8, 14 y 18, así que mantén esos puntos de corte.

## Pantalla

- Barra negra `0–470 px` con el texto (Montserrat Black 62 px, centrado, palabras que
  aparecen con resorte, primera palabra amarilla `#ffd23f`).
- Zona de escena `470–1920 px` con fondo plano degradado, cono de luz (`Spot`), viñeta
  radial y grano (`feTurbulence`, opacidad 0.09).
- Personaje en `(620, 1390)`, escala 1.15: la cabeza ocupa x 355–885. Deja libre el lado
  izquierdo (x < 350) para objetos y etiquetas; el derecho para ventana o rack.
- Evita poner contenido importante en los últimos ~350 px (interfaz de TikTok).

## Personaje (`Mascot.tsx`)

Props principales: `mood`, `t` (cuadro global), `look` ([-1..1, -1..1], hacia dónde mira),
`droop` (cuánto se hunde de cansancio), `sweat`, `left` / `right` (manos).

- Una mano es `{ x, y, rot, fist, front, prop }` en coordenadas locales del personaje
  (origen en el centro de la cabeza). `prop` se dibuja justo debajo del guante, así el
  guante "agarra" el objeto. `front: true` dibuja el brazo encima de la cabeza (agarrar la gorra).
- Expresiones: `tired` (párpados al 52 %, ojeras fuertes), `grit` (cejas enojadas, dientes
  apretados), `effort` (ojos entrecerrados arriba y abajo, sudor), `happy` (ojos con
  destello de estrella, boca abierta, mejillas rosadas, sin ojeras). Para otra emoción
  añade una entrada a `MOODS` (parámetros: `lid`, `low`, `tilt`, `bags`, `brow`, `mouth`, `blush`).
- Animación automática: respiración, balanceo de cabeza, parpadeo cada 110 cuadros,
  temblor de línea, destello en la gorra.

## Objetos disponibles (en `PovVideo.tsx`)

`Clock` (despertador que suena), `Barbell`, `Notebook` + `Pencil` (escribe líneas),
`Trophy`, `Mug` (con vapor), `Window` (con luna y estrellas), `Lamp` (con cono de luz),
`Confetti`, `Spot`, `FinalSticker`. Del arte orgánico (`art.tsx`): `Cloud`, `Mountains`,
`Sparkle`, `Flock`, `LeafyTree`, `PineTree`, `Skyline`, `GrassTuft`, `LightShafts`.
Todos con contorno oscuro grueso; los objetos nuevos deben seguirlo.

## Etiquetas sticker (`Tag`)

Rectángulo blanco, contorno oscuro, sombra desplazada, texto en color según el sentido:
rojo `#d6342c` (alarma/problema), naranja `#e8742a` (decisión), verde `#2d9d4b`
(progreso: "DÍA 30"). Máximo ~10 caracteres; colócala sin tapar cara ni manos (tras ver
los stills, muévela si se cruza con una pesa, un brazo o un objeto).

## Ideas de guion

- **Gimnasio:** "POV: Es tu primer día en el gym" → "POV: Todo te duele pero vuelves" →
  "POV: Tres meses después, ya no te cansas" (etiquetas DÍA 1 / DÍA 30 / DÍA 90).
- **Estudio:** "POV: Falta una semana para el examen" → "POV: Estudias aunque no entiendas" →
  "POV: Ves tu nota y no lo crees".
- **Ahorro:** "POV: Decides ahorrar desde hoy" → "POV: Dices no a la compra impulsiva" →
  "POV: Un año después, tu meta está cumplida".
- **Humor/historia:** misma estructura, cambiando objetos y expresión; el arco
  problema → esfuerzo → remate sigue funcionando.

## Retocar la música

`scripts/make_music.py` genera `public/music.wav` (24 s). Las secciones dependen de
`BAR = 2.0` s y de los umbrales 4, 8, 14, 16, 17.82 y 18 s. Si cambias la duración de las
escenas, mueve esos umbrales en el script y vuelve a generarla; después comprueba el
volumen con `ffmpeg -i public/music.wav -af volumedetect -f null -`.
