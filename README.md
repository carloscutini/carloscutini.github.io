# Carlos Cutini — Creaciones Náuticas

Sitio web de Carlos Cutini, publicado con GitHub Pages en
<https://carloscutini.github.io/>.

## Estructura

```
index.html            Página principal
404.html              Página de error
assets/css/styles.css Estilos
assets/js/main.js     Galería, filtros, formulario
assets/img/           Fotos optimizadas (WebP + JPEG)
scripts/              Script para optimizar fotos
favicon.svg           Ícono del sitio
site.webmanifest      Datos para instalar el sitio en el celular
robots.txt            Indicaciones para buscadores
sitemap.xml           Mapa del sitio para buscadores
```

## Cómo agregar una obra

1. Optimizá la foto (necesita [ImageMagick](https://imagemagick.org)):

   ```sh
   scripts/optimizar-foto.sh ~/Descargas/foto.jpeg farol-nuevo
   ```

   Esto crea `farol-nuevo-600.webp`, `farol-nuevo-1200.webp` y `farol-nuevo.jpg`
   en `assets/img/`.

2. En `assets/js/main.js`, sumá una línea a la lista `OBRAS`:

   ```js
   { img: 'farol-nuevo', titulo: 'Farol nuevo', categoria: 'luminarias' },
   ```

   Categorías: `luminarias`, `decoracion`, `maquetas`, `taller`. Los filtros
   sin obras se ocultan solos.

Las fotos originales pueden guardarse en `assets/img/originales/`: esa carpeta
no se sube a GitHub.

## Imágenes que usa el sitio

| Archivo                   | Uso                                          |
|---------------------------|----------------------------------------------|
| `assets/img/hero.jpg`     | Fondo de la portada                          |
| `assets/img/taller.jpg`   | Fondo de la cita                             |
| `assets/img/contacto.jpg` | Fondo de la sección de contacto              |
| `assets/img/og-image.jpg` | Vista previa al compartir el link (1200×630) |

## Correo del formulario

Cambiá `EMAIL_CONTACTO` al principio de `assets/js/main.js`.

## Ver el sitio en tu computadora

Abrí `index.html` en el navegador, o levantá un servidor local:

```sh
npx serve .
```
