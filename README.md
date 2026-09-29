# Carlos Cutini — Creaciones Náuticas

Sitio web de Carlos Cutini, publicado con GitHub Pages en
<https://carloscutini.com.ar/> (dominio propio, configurado en `CNAME`).

## Estructura

```
index.html            Página principal
404.html              Página de error
assets/css/styles.css Estilos
assets/js/main.js     Galería, filtros, carrito, formulario
assets/img/           Fotos optimizadas (WebP + JPEG)
assets/icons/         Logo, favicon e íconos para celular (+ site.webmanifest)
scripts/              Script para optimizar fotos
robots.txt            Indicaciones para buscadores
sitemap.xml           Mapa del sitio para buscadores
llms.txt              Resumen del sitio para asistentes de IA
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

   Para venderla, sumale `usd` (precio en dólares):

   ```js
   { img: 'farol-nuevo', titulo: 'Mi Farol', tipo: 'Farol de latón', medidas: '30 cm', categoria: 'luminarias', usd: 150 },
   ```

   `tipo` y `medidas` son opcionales: se muestran debajo del nombre, en el
   carrito y en el pedido de WhatsApp, y los usan los buscadores.

   La web lo muestra en pesos al dólar blue del día (promedio compra/venta,
   consultado en [dolarapi.com](https://dolarapi.com)), redondeado hacia arriba
   a los $1.000, con el valor en dólares más chico debajo. Si la consulta falla,
   usa la última cotización guardada o `DOLAR_RESPALDO`. Para un precio fijo en
   pesos, usá `precio` en lugar de `usd`.

   Las obras sin precio se muestran igual, pero sin el botón "Agregar".

## Carrito

Los visitantes agregan obras al carrito, completan sus datos y cierran el pedido
por WhatsApp de dos formas: **pago a coordinar** o **transferencia con descuento**.
Se configura al principio de `assets/js/main.js`:

- `WHATSAPP`: número que recibe los pedidos (ej. `5491155551234`).
- `DESCUENTO_TRANSFERENCIA`: % de descuento por transferencia (`0` para no ofrecerlo).
- `TRANSFERENCIA`: alias, CBU y titular que se incluyen en el pedido por transferencia.

Las fotos originales pueden guardarse en `assets/img/originales/`: esa carpeta
no se sube a GitHub.

## Imágenes que usa el sitio

| Archivo                   | Uso                                          |
|---------------------------|----------------------------------------------|
| `assets/img/hero/`        | Pase de fotos de la portada (1200×900, ver abajo) |
| `assets/img/contacto.jpg` | Fondo de la sección de contacto              |
| `assets/img/reparaciones/restauracion-reloj-*`       | Restauración: foto "después"  |
| `assets/img/reparaciones/restauracion-reloj-antes-*` | Restauración: foto "antes"    |
| `assets/img/og-image.jpg` | Vista previa al compartir el link (1200×630) |

## Fotos de la portada

Las fotos que pasan en el fondo de la portada están en `assets/img/hero/`, todas
de 1200×900. Para sumar una:

```sh
scripts/foto-hero.sh assets/img/farol-nuevo.jpg farol-nuevo 20
```

El último número indica desde qué altura se recorta la foto si es vertical
(0 = arriba, 50 = centro). Después sumá `'hero/farol-nuevo.jpg'` a `HERO_FOTOS`
en `assets/js/main.js`.

## Formulario de contacto

Las consultas se envían con [Formspree](https://formspree.io) y llegan al correo
de la cuenta. El código del formulario está en el `action` del `<form>` en
`index.html` (`https://formspree.io/f/<código>`): para cambiarlo, reemplazá lo que
va después de `/f/`.

## Ver el sitio en tu computadora

Abrí `index.html` en el navegador, o levantá un servidor local:

```sh
npx serve .
```
