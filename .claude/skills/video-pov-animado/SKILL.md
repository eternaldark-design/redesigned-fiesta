---
name: video-pov-animado
description: Crea videos verticales cortos (TikTok, Reels, Shorts) en el formato "POV" caricaturesco - barra negra arriba con el texto "POV: ...", un personaje 2D de cabeza redonda con trazo grueso que cambia de expresión, etiquetas tipo sticker, escenas con cortes rápidos y música original sincronizada. Úsalo siempre que el usuario pida un video, un TikTok, un reel, un short o una animación (motivacional, de hábitos, de historia, humor, educativo), aunque no mencione "POV" ni el estilo; el formato por defecto de cualquier video que pida es este. Renderiza con Remotion y entrega el MP4.
---

# Video POV animado (estilo caricatura para TikTok)

Este es el formato que el usuario aprobó y quiere por defecto en cualquier video: un
personaje original de dibujos animados 2D, escenas cortas y texto "POV:" arriba. El
proyecto base ya está construido en `assets/template/`; el trabajo consiste en
adaptar el guion, las expresiones y los objetos al tema que pida el usuario, no en
reinventar el estilo.

## Flujo

1. **Entender el tema.** Si el usuario ya dio un tema, empieza sin preguntar. Si solo dijo
   "hazme un video", elige un tema motivacional/de hábitos y avisa que puede cambiarse.
2. **Escribir el guion en 6 escenas** (24 s, 30 fps = 720 cuadros). Cada escena tiene:
   una frase "POV: ..." (máx. ~45 caracteres, cabe en 2 líneas), una expresión del
   personaje, un objeto principal y una etiqueta sticker corta ("DÍA 30", "05:00 AM").
   Estructura que funciona (arco de esfuerzo → recompensa, ver `references/estilo.md`):
   problema → decisión → esfuerzo → persistencia → transformación (impacto en el segundo 18) → llamada a la acción.
3. **Montar el proyecto.**
   ```bash
   npx create-video@latest --yes --blank --no-tailwind <carpeta> && cd <carpeta>
   npx remotion add @remotion/fonts
   cp -r <skill>/assets/template/* .      # src/, scripts/, public/fonts/
   python3 scripts/make_music.py public/music.wav
   ```
   Si ya existe un proyecto con la plantilla (por ejemplo `video-motivacion/`), reutilízalo
   y solo edita.
4. **Adaptar** `src/pov/PovVideo.tsx`: la lista `BEATS` (textos y orden) y un componente
   `BeatN` por escena (fondo, objetos, `mood`, posición de las manos, `Tag`). Los
   componentes de utilería (`Clock`, `Barbell`, `Notebook`, `Trophy`, `Mug`, `Window`,
   `Lamp`, `Confetti`) están ahí mismo; crea los que falten con el mismo trazo
   (`{...ol}`: contorno `#14142b`, grosor 6, esquinas redondeadas).
5. **Verificar antes de renderizar.** Genera stills de un cuadro por escena y júntalos en
   una hoja de contacto con ffmpeg; revisa texto cortado, etiquetas encima de la cara o
   de las manos y objetos fuera de cuadro.
   ```bash
   <skill>/scripts/render.sh . still 70 out/p70.png 0.4     # repetir por escena
   ffmpeg -y -i out/p70.png -i out/p200.png ... -filter_complex hstack=inputs=6 out/sheet.png
   ```
6. **Renderizar y entregar:** `<skill>/scripts/render.sh . video out/<nombre>.mp4`, luego
   envía el MP4 con `SendUserFile` (`display: "render"` si quiere verlo en el chat,
   `"attach"` para descargarlo). Comprueba con `ffprobe` que sea 1080x1920 con pista de audio.
7. **Guardar el trabajo:** haz commit y push a la rama de la sesión (los archivos sin
   versionar disparan el hook de cierre). `node_modules` y `out/` ya están en `.gitignore`.

## Reglas del formato (y por qué)

- **1080x1920, 30 fps, 24 s.** Es el tamaño de TikTok; 24 s es la longitud que la música
  de `make_music.py` ya cubre. Si cambias la duración, ajusta también `DUR`, la lista de
  compases y `TOTAL_FRAMES` para que música y escenas sigan sincronizadas.
- **Barra negra de 470 px arriba con el texto "POV:".** Deja libre la zona donde TikTok
  superpone su interfaz y es el sello del formato. La primera palabra va en amarillo.
- **Personaje original.** Cabeza redonda blanca, ojos naranjas, gorra azul, guantes
  blancos. No copies personajes, marcas ni logos de otros videos; la gorra lleva una
  montaña con bandera, no el emblema de nadie.
- **Trazo oscuro grueso, colores planos, grano y viñeta.** Es lo que da el aspecto de
  caricatura de "internet"; el personaje "hierve" (tiembla 1 px cada 3 cuadros) y parpadea.
- **Una expresión por escena** (`tired`, `grit`, `effort`, `happy`) y una etiqueta sticker
  que rebota al entrar. El cambio de escena es un corte con golpe de zoom y destello.
- **Música original generada** (`make_music.py`, La menor épico, 120 BPM): intro suave,
  bombo desde el segundo 8, build-up 14–18 s, impacto en 18 s. Sincroniza el cambio
  de "esfuerzo" a "recompensa" con ese impacto. Es WAV a propósito: el MP3 de ffmpeg
  distorsiona los picos del impacto. No uses canciones con copyright.
- **Contenido responsable.** Nada de promesas de ingresos ni de resultados garantizados
  ("ganas X dólares con...", "baja 10 kg en 1 semana"); si el usuario las pide, propón la
  misma estructura con un tema aspiracional que no suene a estafa.

## Trampas del entorno (contenedor en la nube)

- **Chromium:** Remotion intenta descargar su propio navegador y el proxy lo bloquea
  (`ENOTFOUND remotion.media`). `scripts/render.sh` usa el que ya está en
  `/opt/pw-browsers`; no ejecutes `playwright install`.
- **Fuente local:** `@remotion/google-fonts` falla por el proxy. La plantilla ya carga
  `public/fonts/Montserrat-Black.ttf` con `@remotion/fonts`.
- **tsc:** corre `npx tsc --noEmit` antes de renderizar; el render completo tarda ~1 min.
- Para una sola escena de prueba renderiza stills, no el video entero.

## Archivos

- `assets/template/` - proyecto base (Mascot, escenas de ejemplo, arte orgánico, música).
- `references/estilo.md` - guía visual detallada, expresiones, mapa de objetos y guiones de ejemplo.
- `scripts/render.sh` - still / video con el Chromium correcto.
