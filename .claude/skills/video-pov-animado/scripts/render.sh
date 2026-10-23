#!/usr/bin/env bash
# Uso: render.sh <proyecto> still <frame> <salida.png> [escala]
#      render.sh <proyecto> video <salida.mp4>
# Usa el Chromium preinstalado: en el contenedor remoto Remotion no puede
# descargar su propio navegador (el proxy bloquea remotion.media).
set -euo pipefail
PROJECT="$1"; MODE="$2"; shift 2
BROWSER="$(ls /opt/pw-browsers/chromium_headless_shell-*/chrome-linux/headless_shell 2>/dev/null | head -1 || true)"
FLAGS=()
if [ -n "$BROWSER" ]; then FLAGS=(--browser-executable="$BROWSER" --chrome-mode=headless-shell); fi
cd "$PROJECT"
case "$MODE" in
  still) npx remotion still PovMotivacion "$2" --frame="$1" --scale="${3:-0.4}" "${FLAGS[@]}" ;;
  video) npx remotion render PovMotivacion "$1" "${FLAGS[@]}" ;;
  *) echo "modo desconocido: $MODE" >&2; exit 1 ;;
esac
