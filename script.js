document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav-links');

  toggle?.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });

  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle?.setAttribute('aria-expanded', 'false');
    });
  });

  const tabs = document.querySelectorAll('.tab');
  const cards = document.querySelectorAll('.menu-card');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const category = tab.dataset.category;
      cards.forEach(card => {
        card.classList.toggle('hidden', category !== 'all' && card.dataset.category !== category);
      });
    });
  });

  // Carga las imágenes locales definidas en data-image.
  document.querySelectorAll('[data-image]').forEach(el => {
    const src = el.dataset.image;
    const probe = new Image();
    probe.onload = () => { el.style.backgroundImage = `url("${src}")`; };
    probe.onerror = () => el.classList.add('missing');
    probe.src = src;
  });

  // Oculta visualmente imágenes que todavía no existan en la carpeta img/.
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', () => {
      img.parentElement?.classList.add('missing');
    });
  });

  // Animaciones de entrada.
  const revealItems = document.querySelectorAll('.story-copy, .story-image, .menu-card, .special, .gallery-grid > div, .reservation-form');
  revealItems.forEach(el => el.classList.add('reveal'));
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach(el => observer.observe(el));

  // Evita fechas de reserva anteriores al día actual.
  const dateInput = document.querySelector('input[name="date"]');
  if (dateInput) {
    const today = new Date();
    const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().split('T')[0];
    dateInput.min = localToday;
  }

  const form = document.getElementById('reservationForm');
  const formMessage = document.getElementById('formMessage');
  form?.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(form);
    const name = data.get('name');
    const date = data.get('date');
    const people = data.get('people');
    formMessage.textContent = `Gracias, ${name}. Recibimos tu solicitud para ${people} persona(s) el ${date}. Para confirmar la reserva, comunícate al 77852598 o 64465075.`;
    form.reset();
    if (dateInput) {
      const today = new Date();
      dateInput.min = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().split('T')[0];
    }
  });
});
