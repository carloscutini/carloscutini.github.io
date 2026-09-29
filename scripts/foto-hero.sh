#!/usr/bin/env bash
# Prepara una foto para el pase de fotos de la portada (hero).
# Uso: scripts/foto-hero.sh ruta/a/foto.jpg nombre [desde-arriba-%]
# Genera assets/img/hero/nombre.jpg de 1200x900 (horizontal 4:3).
# desde-arriba-%: dónde empieza el recorte en fotos verticales (0 = arriba, 50 = centro). Por defecto 25.
# Después sumá "hero/nombre.jpg" a HERO_FOTOS en assets/js/main.js.
# Requiere ImageMagick (comando "magick").
set -euo pipefail

src="$1"
nombre="$2"
arriba="${3:-25}"
dest="$(dirname "$0")/../assets/img/hero"
mkdir -p "$dest"

# Alto de la foto una vez llevada a 1200 de ancho
alto=$(magick "$src" -auto-orient -resize 1200x -format '%h' info:)
y=$(( alto * arriba / 100 ))
(( y > alto - 900 )) && y=$(( alto - 900 ))
(( y < 0 )) && y=0

magick "$src" -auto-orient -strip -colorspace sRGB -resize '1200x' \
  -crop "1200x900+0+$y" +repage -resize '1200x900^' -gravity center -extent 1200x900 \
  -sampling-factor 4:2:0 -interlace JPEG -quality 60 "$dest/$nombre.jpg"

echo "Listo: hero/$nombre.jpg (agregalo a HERO_FOTOS en assets/js/main.js)"
