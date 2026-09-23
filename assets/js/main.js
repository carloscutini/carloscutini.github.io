// ===== CONFIGURACIÓN =====
// Correo donde llegan las consultas del formulario.
const EMAIL_CONTACTO = 'carlos@ejemplo.com';

// Obras: optimizá la foto con scripts/optimizar-foto.sh y sumá una línea por pieza.
// img: nombre usado en el script (sin extensión)
// categoria: luminarias | decoracion | maquetas | taller
const OBRAS = [
  { img: 'faro-cobre',        titulo: 'Faro de cobre y latón',   categoria: 'luminarias' },
  { img: 'percheros-veleros', titulo: 'Percheros veleros',       categoria: 'decoracion' },
  { img: 'lampara-moton',     titulo: 'Lámpara de motón',        categoria: 'luminarias' },
  { img: 'faro-recibidor',    titulo: 'Faro de cobre, en casa',  categoria: 'luminarias' },
];
// =========================

const NOMBRES = { luminarias: 'Luminarias', decoracion: 'Decoración', maquetas: 'Maquetas', taller: 'Taller' };
const FOTOS = 'assets/img/';

// Galería
const grid = document.getElementById('grid');
grid.innerHTML = OBRAS.map(o => `
  <figure class="card reveal" data-cat="${o.categoria}" data-full="${FOTOS}${o.img}-1200.webp">
    <picture>
      <source type="image/webp" srcset="${FOTOS}${o.img}-600.webp 1x, ${FOTOS}${o.img}-1200.webp 2x">
      <img src="${FOTOS}${o.img}.jpg" alt="${o.titulo}" loading="lazy" decoding="async" onerror="this.style.visibility='hidden'">
    </picture>
    <figcaption><span>${NOMBRES[o.categoria]}</span><strong>${o.titulo}</strong></figcaption>
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

// Lightbox
const lb = document.getElementById('lightbox');
grid.addEventListener('click', e => {
  const card = e.target.closest('.card');
  if (!card) return;
  const img = card.querySelector('img');
  lb.querySelector('img').src = card.dataset.full;
  lb.querySelector('p').textContent = img.alt;
  lb.classList.add('open');
});
const cerrar = () => lb.classList.remove('open');
lb.addEventListener('click', e => { if (e.target !== lb.querySelector('img')) cerrar(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') cerrar(); });

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

document.getElementById('year').textContent = new Date().getFullYear();
