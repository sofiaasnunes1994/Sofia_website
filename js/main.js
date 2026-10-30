// H-AGE - small helpers shared by every page

// Smooth scrolling
if (window.Lenis && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const lenis = new Lenis({ duration: 1.1 });
  requestAnimationFrame(function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  });
}

// Mobile menu
const nav = document.querySelector('.nav');
document.querySelector('.menu-btn')?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  document.querySelector('.menu-btn').setAttribute('aria-expanded', open);
});

// Events with data-until="YYYY-MM-DD" are tagged "Upcoming" until that day is over
const today = new Date().toISOString().slice(0, 10);
document.querySelectorAll('[data-until]').forEach(el => {
  if (el.dataset.until >= today) el.classList.add('is-upcoming');
});

// Fade sections in as they scroll into view
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Until the real photos are added to assets/, show a labelled placeholder instead of a broken image
function placeholder(img) {
  if (img.dataset.optional !== undefined) { img.remove(); return; }
  const box = document.createElement('div');
  box.className = 'ph ' + img.className;
  box.textContent = img.getAttribute('src').split('/').pop();
  box.title = img.alt;
  img.replaceWith(box);
  if (box.classList.contains('reveal')) { io.unobserve(img); io.observe(box); }
}
document.querySelectorAll('img').forEach(img => {
  if (img.complete && img.naturalWidth === 0) placeholder(img);
  else img.addEventListener('error', () => placeholder(img));
});

// Contact form: no server on a static site, so open the visitor's email app with the message filled in
document.querySelector('#contact-form')?.addEventListener('submit', e => {
  e.preventDefault();
  const f = e.target;
  const subject = `H-AGE enquiry from ${f.name.value}`;
  const body = `${f.message.value}\n\n${f.name.value}\n${f.email.value}`;
  location.href = `mailto:${f.dataset.to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});
