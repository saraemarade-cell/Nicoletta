'use strict';

/* ---- Utility ---------------------------------------------- */
const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

/* ---- Info bar --------------------------------------------- */
(function () {
  const bar = $('.info-bar');
  const btn = $('.info-bar__close');
  const header = $('.site-header');
  if (!bar || !btn || !header) return;
  function syncTop() {
    if (bar.classList.contains('hidden')) {
      header.style.top = '0px';
      return;
    }
    const bottom = bar.getBoundingClientRect().bottom;
    header.style.top = Math.max(0, bottom) + 'px';
  }
  btn.addEventListener('click', () => { bar.classList.add('hidden'); syncTop(); });
  syncTop();
  window.addEventListener('scroll', syncTop, { passive: true });
  window.addEventListener('resize', syncTop);
})();

/* ---- Sticky header ---------------------------------------- */
(function () {
  const header = $('.site-header');
  if (!header) return;
  function tick() {
    header.classList.toggle('scrolled', window.scrollY > 10);
  }
  window.addEventListener('scroll', tick, { passive: true });
  tick();
})();

/* ---- Active nav link -------------------------------------- */
(function () {
  const page = location.pathname.split('/').pop() || 'index.html';
  $$('.site-nav__link, .mobile-nav__link').forEach(a => {
    const href = a.getAttribute('href') || '';
    const name = href.split('/').pop();
    if (name === page || (page === '' && name === 'index.html')) {
      a.classList.add('active');
      a.setAttribute('aria-current', 'page');
    }
  });
})();

/* ---- Mobile nav ------------------------------------------- */
(function () {
  const hamburger = $('.hamburger');
  const nav = $('.mobile-nav');
  if (!hamburger || !nav) return;
  const links = nav.querySelectorAll('a');
  const open  = () => { hamburger.classList.add('open'); nav.classList.add('open'); document.body.style.overflow = 'hidden'; hamburger.setAttribute('aria-expanded', 'true'); nav.setAttribute('aria-hidden', 'false'); };
  const close = () => { hamburger.classList.remove('open'); nav.classList.remove('open'); document.body.style.overflow = ''; hamburger.setAttribute('aria-expanded', 'false'); nav.setAttribute('aria-hidden', 'true'); };
  hamburger.addEventListener('click', () => hamburger.classList.contains('open') ? close() : open());
  links.forEach(l => l.addEventListener('click', close));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
})();

/* ---- Scroll reveal ---------------------------------------- */
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const els = $$('.reveal');
  if (!els.length) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
  els.forEach(el => io.observe(el));
})();

/* ---- Parallasse leggera (home Nicoletta) ------------------ */
(function () {
  const img = $('.nicoletta-preview__img-container');
  if (!img) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.matchMedia('(max-width: 767px)').matches) return;
  function tick() {
    const section = img.closest('section, .section');
    if (!section) return;
    const rect = section.getBoundingClientRect();
    const prog = 1 - rect.bottom / (window.innerHeight + rect.height);
    img.style.transform = `translateY(${(prog - 0.5) * 60}px)`;
  }
  window.addEventListener('scroll', tick, { passive: true });
  tick();
})();

/* ---- FAQ accordion ---------------------------------------- */
(function () {
  $$('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      // Chiudi tutti
      $$('.faq-item.open').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
})();

/* ---- Hero slider (homepage) ------------------------------- */
(function () {
  const slides = $$('.hero-slide');
  const dots   = $$('.hero-dot');
  const prev   = $('.hero-prev');
  const next   = $('.hero-next');
  if (!slides.length) return;

  let cur = 0;
  let timer = null;

  function goTo(n) {
    slides[cur].classList.remove('active');
    if (dots[cur]) { dots[cur].classList.remove('active'); dots[cur].setAttribute('aria-selected', 'false'); }
    cur = (n + slides.length) % slides.length;
    slides[cur].classList.add('active');
    if (dots[cur]) { dots[cur].classList.add('active'); dots[cur].setAttribute('aria-selected', 'true'); }
    resetTimer();
  }

  function resetTimer() {
    clearInterval(timer);
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      /* 12 secondi per dare tempo di leggere il testo e scegliere la CTA */
      timer = setInterval(() => goTo(cur + 1), 12000);
    }
  }

  dots.forEach((d, i) => d.addEventListener('click', () => goTo(i)));
  prev?.addEventListener('click', () => goTo(cur - 1));
  next?.addEventListener('click', () => goTo(cur + 1));

  // Swipe touch
  const hero = $('.home-hero');
  if (hero) {
    let sx = 0;
    hero.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
    hero.addEventListener('touchend',   e => {
      const dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 50) goTo(dx < 0 ? cur + 1 : cur - 1);
    }, { passive: true });
  }

  goTo(0);
})();

/* ---- Form contatto (frontend only) ----------------------- */
(function () {
  const form = $('.contact-form');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    const btn = form.querySelector('[type="submit"]');
    const msg = form.querySelector('.form-success');
    if (btn) { btn.disabled = true; btn.textContent = 'Invio in corso…'; }
    setTimeout(() => {
      form.reset();
      if (btn) { btn.disabled = false; btn.textContent = 'Invia la richiesta'; }
      if (msg) { msg.classList.add('visible'); setTimeout(() => msg.classList.remove('visible'), 5000); }
    }, 900);
  });
})();

/* ---- Newsletter (frontend only) -------------------------- */
(function () {
  $$('.newsletter-form').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('[type="submit"]');
      if (btn) { btn.textContent = 'Iscritto ✓'; btn.disabled = true; }
    });
  });
})();

/* ---- Stat "+3.000" — count-up animato (Chi sono) --------- */
(function () {
  const el = $('.nicoletta-stat__num');
  if (!el) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    el.classList.add('is-visible');
    return;
  }
  const target = parseInt(el.dataset.target, 10);
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      io.unobserve(entry.target);
      el.classList.add('is-visible');
      const duration = 900, step = 16;
      const increment = target / (duration / step);
      let current = 0;
      const tick = setInterval(() => {
        current = Math.min(current + increment, target);
        el.textContent = '+' + Math.floor(current).toLocaleString('it-IT');
        if (current >= target) { clearInterval(tick); el.textContent = '+3.000'; }
      }, step);
    });
  }, { threshold: 0.5 });
  io.observe(el);
})();

/* ---- Cert stat "+3.000" — count-up animato (chi-sono) --- */
(function () {
  const el = $('.js-cert-count');
  if (!el) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const target = parseInt(el.dataset.target, 10);
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      io.unobserve(entry.target);
      const duration = 1100, step = 16;
      const increment = target / (duration / step);
      let current = 0;
      const tick = setInterval(() => {
        current = Math.min(current + increment, target);
        el.textContent = '+' + Math.floor(current).toLocaleString('it-IT');
        if (current >= target) { clearInterval(tick); el.textContent = '+3.000'; }
      }, step);
    });
  }, { threshold: 0.5 });
  io.observe(el);
})();

/* ---- Anno footer ----------------------------------------- */
$$('.footer-year').forEach(el => { el.textContent = new Date().getFullYear(); });
