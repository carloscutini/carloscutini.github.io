#!/usr/bin/env bash
# Optimiza una foto para la galería.
# Uso: scripts/optimizar-foto.sh ruta/a/foto.jpeg nombre-de-la-obra
# Genera en assets/img/: nombre-600.webp, nombre-1200.webp y nombre.jpg
# Requiere ImageMagick (comando "magick").
set -euo pipefail

src="$1"
nombre="$2"
dest="$(dirname "$0")/../assets/img"
opts=(-auto-orient -strip -colorspace sRGB)

magick "$src" "${opts[@]}" -resize '600x>'  -quality 78 "$dest/$nombre-600.webp"
magick "$src" "${opts[@]}" -resize '1200x>' -quality 78 "$dest/$nombre-1200.webp"
magick "$src" "${opts[@]}" -resize '1200x>' -sampling-factor 4:2:0 -interlace JPEG -quality 80 "$dest/$nombre.jpg"

echo "Listo: $nombre (agregalo a OBRAS en assets/js/main.js)"
