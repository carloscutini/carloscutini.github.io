// ===== CONFIGURACIÓN =====
// Correo donde llegan las consultas del formulario.
const EMAIL_CONTACTO = 'carlos@ejemplo.com';

// WhatsApp donde llegan los pedidos del carrito: código de país + número, sin "+" ni espacios.
const WHATSAPP = '5491168232424';

// Descuento por pago con transferencia, en %. Con 0 no se muestra el descuento.
const DESCUENTO_TRANSFERENCIA = 10;

// Datos bancarios que se incluyen en el pedido por transferencia (dejá '' lo que no quieras mostrar).
const TRANSFERENCIA = { alias: '', cbu: 'xxxxxxxxxxxxxxxxxxxxxx', titular: 'Carlos Cutini' };

// Obras: optimizá la foto con scripts/optimizar-foto.sh y sumá una línea por pieza.
// img: nombre usado en el script (sin extensión)
// categoria: luminarias | decoracion | maquetas | taller
// precio: en pesos, sin puntos. Sin precio, la obra se muestra pero no se puede agregar al carrito.
const OBRAS = [
  { img: 'faro-cobre',        titulo: 'Faro de cobre y latón',   categoria: 'luminarias', precio: 180000 },
  { img: 'percheros-veleros', titulo: 'Percheros veleros',       categoria: 'decoracion', precio: 45000 },
  { img: 'lampara-moton',     titulo: 'Lámpara de motón',        categoria: 'luminarias', precio: 95000 },
  { img: 'faro-recibidor',    titulo: 'Faro de cobre, en casa',  categoria: 'luminarias' },
  { img: 'aplique-barometro', titulo: 'Aplique con barómetro',   categoria: 'luminarias' },
  { img: 'veleros-mesa',      titulo: 'Veleros de mesa',         categoria: 'maquetas' },
];
// =========================

const NOMBRES = { luminarias: 'Luminarias', decoracion: 'Decoración', maquetas: 'Maquetas', taller: 'Taller' };
const FOTOS = 'assets/img/';
const pesos = n => '$' + Math.round(n).toLocaleString('es-AR');

// Galería
const grid = document.getElementById('grid');
grid.innerHTML = OBRAS.map(o => `
  <figure class="card reveal" data-cat="${o.categoria}" data-full="${FOTOS}${o.img}-1200.webp">
    <picture>
      <source type="image/webp" srcset="${FOTOS}${o.img}-600.webp 1x, ${FOTOS}${o.img}-1200.webp 2x">
      <img src="${FOTOS}${o.img}.jpg" alt="${o.titulo}" loading="lazy" decoding="async" onerror="this.style.visibility='hidden'">
    </picture>
    <figcaption>
      <span>${NOMBRES[o.categoria]}</span><strong>${o.titulo}</strong>
      ${o.precio ? `<em class="precio">${pesos(o.precio)}</em>` : ''}
    </figcaption>
    ${o.precio ? `<button class="add" data-add="${o.img}" aria-label="Agregar ${o.titulo} al carrito">Agregar</button>` : ''}
  </figure>`).join('');

// Ocultar filtros de categorías que todavía no tienen obras
document.querySelectorAll('#filters button[data-filter]').forEach(b => {
  if (b.dataset.filter !== 'todos' && !OBRAS.some(o => o.categoria === b.dataset.filter)) b.hidden = true;
});

// Filtros
document.getElementById('filters').addEventListener('click', e => {
  const btn = e.target.closest('button');
  if (!btn) return;
  document.querySelectorAll('#filters button').forEach(b => b.classList.toggle('active', b === btn));
  const f = btn.dataset.filter;
  grid.querySelectorAll('.card').forEach(c => c.classList.toggle('hide', f !== 'todos' && c.dataset.cat !== f));
});

// Restauración: consulta directa por WhatsApp
document.getElementById('restauracion-wa').href =
  `https://wa.me/${WHATSAPP}?text=${encodeURIComponent('Hola Carlos, quería consultarte por la reparación de una pieza antigua.')}`;

// Restauración: comparador antes / después
(() => {
  const ad = document.getElementById('antes-despues');
  const barra = ad.querySelector('.ad-barra');
  const mover = pct => {
    pct = Math.min(100, Math.max(0, pct));
    ad.style.setProperty('--pos', pct + '%');
    barra.setAttribute('aria-valuenow', Math.round(pct));
    ad.classList.toggle('ad-min', pct < 12);
    ad.classList.toggle('ad-max', pct > 88);
  };
  const desdePuntero = e => {
    const r = ad.getBoundingClientRect();
    mover((e.clientX - r.left) / r.width * 100);
  };
  ad.addEventListener('pointerdown', e => {
    ad.setPointerCapture(e.pointerId);
    ad.classList.add('ad-arrastrando');
    desdePuntero(e);
  });
  ad.addEventListener('pointermove', e => { if (ad.hasPointerCapture(e.pointerId)) desdePuntero(e); });
  const soltar = () => ad.classList.remove('ad-arrastrando');
  ad.addEventListener('pointerup', soltar);
  ad.addEventListener('pointercancel', soltar);
  barra.addEventListener('keydown', e => {
    const actual = parseFloat(barra.getAttribute('aria-valuenow'));
    const pasos = { ArrowLeft: -5, ArrowRight: 5, Home: -100, End: 100 };
    if (!(e.key in pasos)) return;
    e.preventDefault();
    mover(actual + pasos[e.key]);
  });
})();

// Lightbox
const lb = document.getElementById('lightbox');
grid.addEventListener('click', e => {
  const add = e.target.closest('[data-add]');
  if (add) { agregar(add.dataset.add); return; }
  const card = e.target.closest('.card');
  if (!card) return;
  const img = card.querySelector('img');
  lb.querySelector('img').src = card.dataset.full;
  lb.querySelector('p').textContent = img.alt;
  lb.classList.add('open');
});
const cerrar = () => lb.classList.remove('open');
lb.addEventListener('click', e => { if (e.target !== lb.querySelector('img')) cerrar(); });
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape' || document.getElementById('transfer').open) return;
  cerrar(); cerrarCarrito();
});

// Header al hacer scroll
const header = document.getElementById('header');
const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 40);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Animación de aparición
const io = new IntersectionObserver(entries => entries.forEach(en => {
  if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
}), { threshold: .15 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Formulario: abre el cliente de correo con la consulta
document.getElementById('form').addEventListener('submit', e => {
  e.preventDefault();
  const f = e.target;
  const asunto = `Consulta de obra — ${f.nombre.value}`;
  const cuerpo = `Nombre: ${f.nombre.value}\nCorreo: ${f.email.value}\n\n${f.mensaje.value}`;
  window.location.href = `mailto:${EMAIL_CONTACTO}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`;
  document.getElementById('form-note').textContent = '¡Gracias! Se abrió tu correo para enviar la consulta.';
});

// ===== Carrito =====
// Se guarda en el navegador del visitante: [{ img, cant }]
let carrito = [];
try { carrito = JSON.parse(localStorage.getItem('carrito')) || []; } catch {}
carrito = carrito.filter(i => OBRAS.some(o => o.img === i.img && o.precio));

const $ = id => document.getElementById(id);
const cart = $('cart');
const cartForm = $('cart-form');
const obra = img => OBRAS.find(o => o.img === img);
const total = () => carrito.reduce((t, i) => t + obra(i.img).precio * i.cant, 0);
const conDescuento = n => n * (1 - DESCUENTO_TRANSFERENCIA / 100);

function guardar() {
  try { localStorage.setItem('carrito', JSON.stringify(carrito)); } catch {}
  pintar();
}

function agregar(img) {
  const item = carrito.find(i => i.img === img);
  if (item) item.cant++; else carrito.push({ img, cant: 1 });
  guardar();
  abrirCarrito();
}

function cambiar(img, delta) {
  const item = carrito.find(i => i.img === img);
  if (!item) return;
  item.cant += delta;
  if (item.cant < 1) carrito = carrito.filter(i => i !== item);
  guardar();
}

function pintar() {
  const cant = carrito.reduce((t, i) => t + i.cant, 0);
  $('cart-count').textContent = cant;
  $('cart-count').hidden = !cant;

  $('cart-items').innerHTML = carrito.map(i => {
    const o = obra(i.img);
    return `
    <li class="cart-item">
      <img src="${FOTOS}${o.img}-600.webp" alt="" onerror="this.src='${FOTOS}${o.img}.jpg'">
      <div>
        <strong>${o.titulo}</strong>
        <div class="qty">
          <button data-menos="${o.img}" aria-label="Quitar uno">−</button>
          <span>${i.cant}</span>
          <button data-mas="${o.img}" aria-label="Agregar uno">+</button>
          <button class="quitar" data-quitar="${o.img}">Quitar</button>
        </div>
      </div>
      <span class="cart-price">${pesos(o.precio * i.cant)}</span>
    </li>`;
  }).join('');

  const vacio = !carrito.length;
  $('cart-empty').hidden = !vacio;
  $('cart-datos').hidden = vacio;
  $('cart-foot').hidden = vacio;

  $('cart-total').textContent = pesos(total());
  $('cart-desc-row').hidden = !DESCUENTO_TRANSFERENCIA;
  $('cart-desc-label').textContent = `Por transferencia (−${DESCUENTO_TRANSFERENCIA}%)`;
  $('cart-total-desc').textContent = pesos(conDescuento(total()));
  $('cart-tr-label').textContent = DESCUENTO_TRANSFERENCIA ? `Transferencia −${DESCUENTO_TRANSFERENCIA}%` : 'Transferencia';
}

function abrirCarrito() {
  actualizarBotones();
  cart.classList.add('open');
  cart.inert = false;
  $('cart-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
  $('cart-close').focus();
}
function cerrarCarrito() {
  if (!cart.classList.contains('open')) return;
  cart.classList.remove('open');
  cart.inert = true;
  $('cart-overlay').classList.remove('open');
  document.body.style.overflow = '';
  $('cart-toggle').focus();
}

$('cart-toggle').addEventListener('click', abrirCarrito);
$('cart-close').addEventListener('click', cerrarCarrito);
$('cart-overlay').addEventListener('click', cerrarCarrito);

$('cart-items').addEventListener('click', e => {
  const b = e.target.closest('button');
  if (!b) return;
  if (b.dataset.mas) cambiar(b.dataset.mas, 1);
  if (b.dataset.menos) cambiar(b.dataset.menos, -1);
  if (b.dataset.quitar) { carrito = carrito.filter(i => i.img !== b.dataset.quitar); guardar(); }
});

// Los botones de finalizar quedan bloqueados hasta completar los datos de entrega
function actualizarBotones() {
  const f = cartForm;
  const envio = f.entrega.value === 'envio';
  const completo = f.nombre.value.trim() && f.entrega.value && (!envio || f.direccion.value.trim());
  cart.querySelectorAll('[data-pago]').forEach(b => { b.disabled = !completo; });
  $('cart-aviso').textContent = completo ? '' :
    'Completá tu nombre y cómo lo recibís' + (envio ? ', con la dirección,' : '') + ' para finalizar.';
}

cartForm.addEventListener('input', actualizarBotones);
cartForm.entrega.addEventListener('change', () => {
  $('c-direccion-field').hidden = cartForm.entrega.value !== 'envio';
  actualizarBotones();
});

// Finalizar: arma el pedido y lo abre en WhatsApp
function enviarPedido(transferencia, pedido) {
  const f = cartForm;
  const lineas = [
    'Hola Carlos! Quiero hacer este pedido:',
    ...(pedido ? [`N° de pedido: ${pedido}`] : []),
    '',
    ...carrito.map(i => `• ${obra(i.img).titulo} x${i.cant} — ${pesos(obra(i.img).precio * i.cant)}`),
    '',
    `Total: ${pesos(total())}`,
  ];
  if (transferencia) {
    lineas.push(DESCUENTO_TRANSFERENCIA
      ? `Pago por transferencia (−${DESCUENTO_TRANSFERENCIA}%): ${pesos(conDescuento(total()))}`
      : 'Pago por transferencia');
  }
  lineas.push('', `Nombre: ${f.nombre.value.trim()}`);
  if (f.telefono.value.trim()) lineas.push(`Teléfono: ${f.telefono.value.trim()}`);
  if (f.email.value.trim()) lineas.push(`Email: ${f.email.value.trim()}`);
  lineas.push(f.entrega.value === 'envio' ? `Envío a: ${f.direccion.value.trim()}` : 'Retiro en el taller');
  if (transferencia) {
    lineas.push('', hayDatosBancarios()
      ? 'Ya hice la transferencia, te adjunto el comprobante.'
      : '¿Me pasás los datos para transferir?');
  }

  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(lineas.join('\n'))}`, '_blank', 'noopener');
  $('cart-note').textContent = '¡Listo! Se abrió WhatsApp con tu pedido.';
}

cart.addEventListener('click', e => {
  const b = e.target.closest('[data-pago]');
  if (!b || b.disabled) return;
  if (b.dataset.pago === 'transferencia') abrirTransferencia();
  else enviarPedido(false);
});

// Ventana de transferencia: datos bancarios + envío del comprobante por WhatsApp
const transfer = $('transfer');
const hayDatosBancarios = () => !!(TRANSFERENCIA.alias || TRANSFERENCIA.cbu);
let pedidoActual = '';

function abrirTransferencia() {
  pedidoActual = 'CC-' + Date.now().toString(36).slice(-5).toUpperCase();
  $('tr-monto').textContent = pesos(conDescuento(total()));
  $('tr-desc').hidden = !DESCUENTO_TRANSFERENCIA;
  $('tr-desc').textContent = `Ya tiene aplicado el ${DESCUENTO_TRANSFERENCIA}% de descuento por transferencia (precio de lista: ${pesos(total())}).`;
  $('tr-datos').innerHTML = [['Alias', TRANSFERENCIA.alias], ['CBU', TRANSFERENCIA.cbu], ['Titular', TRANSFERENCIA.titular]]
    .filter(([, v]) => v)
    .map(([k, v]) => `
      <div class="tr-dato">
        <span class="eyebrow">${k}</span>
        <strong>${v}</strong>
        ${k !== 'Titular' ? `<button type="button" data-copiar="${v}">Copiar</button>` : ''}
      </div>`).join('');
  $('tr-datos').hidden = !hayDatosBancarios();
  $('tr-intro').hidden = !hayDatosBancarios();
  $('tr-sin-datos').hidden = hayDatosBancarios();
  $('tr-pedido').textContent = pedidoActual;
  $('tr-enviar-label').textContent = hayDatosBancarios() ? 'Enviar comprobante por WhatsApp' : 'Pedir datos por WhatsApp';
  transfer.showModal();
}

transfer.addEventListener('click', e => {
  if (e.target === transfer || e.target.closest('.tr-close')) return transfer.close();
  const copiar = e.target.closest('[data-copiar]');
  if (copiar) {
    navigator.clipboard.writeText(copiar.dataset.copiar).then(() => {
      copiar.textContent = '¡Copiado!';
      setTimeout(() => { copiar.textContent = 'Copiar'; }, 1800);
    });
  }
  if (e.target.closest('#tr-enviar')) enviarPedido(true, pedidoActual);
});

pintar();
actualizarBotones();

document.getElementById('year').textContent = new Date().getFullYear();
