/*
 * Hotel Middle Star - main.js (shared by every page)
 * -------------------------------------------------------------
 * 1. Helpers                       5. Gallery filter + lightbox (home strip, gallery page)
 * 2. Scroll reveal animations      6. FAQ accordion (contact page)
 * 3. Mobile menu (hamburger)       7. Offline support (service worker)
 * 4. Header shadow on scroll
 * Every page is its own .html file, so there is no router. Code that needs an
 * element (gallery, FAQ...) only runs on pages where that element exists.
 */

/* ---- 1. HELPERS ------------------------------------------------------
   $ = querySelector, $$ = querySelectorAll (returned as an array). */
const $ = s => document.querySelector(s),
  $$ = s => [...document.querySelectorAll(s)];

/* ---- 2. SCROLL REVEAL ------------------------------------------------
   Elements with class .rv get class .in while they are on screen, so they
   animate in on the way down and again on the way back up.
   Numbers marked data-n="12" count up when they appear (About page). */
const io = new(window.IntersectionObserver || class {
  observe(e) { e.classList.add('in') }
})(entries => entries.forEach(e => {
  e.target.classList.toggle('in', e.isIntersecting);
  if (!e.isIntersecting) return;
  const n = e.target.querySelector('[data-n]');
  if (n && !n.d) {
    n.d = 1;
    let v = 0;
    const N = +n.dataset.n,
      t = setInterval(() => {
        v = Math.min(N, v + Math.max(1, N / 40));
        n.textContent = Math.round(v);
        if (v >= N) clearInterval(t);
      }, 30);
  }
}), { threshold: .12, rootMargin: '0px 0px -6% 0px' });
$$('.rv').forEach(e => io.observe(e));

/* ---- 3. MOBILE MENU (hamburger, screens <= 860px) -------------------- */
const mb = $('#mb'),
  nv = $('#nav');
const menu = open => { // open or close the menu panel
  nv.classList.toggle('open', open);
  mb.setAttribute('aria-expanded', open);
  mb.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
};
mb.onclick = () => menu(!nv.classList.contains('open'));
document.addEventListener('click', e => { if (!e.composedPath().includes($('header'))) menu(false); }); // tap outside
addEventListener('resize', () => { if (innerWidth > 860) menu(false); });
addEventListener('keydown', e => { if (e.key == 'Escape') menu(false); });

/* ---- 4. HEADER SHADOW ON SCROLL --------------------------------------- */
addEventListener('scroll', () => $('#hd').classList.toggle('s', scrollY > 10), { passive: true });

/* ---- 5. GALLERY: category filter + lightbox ----------------------------
   Photos come from the CSS class on each tile (see assets/css/photos.css),
   so no image path appears in JavaScript. To add/change photos edit the
   tiles in index.html / gallery.html (see the comment above the grid). */
if ($('#gf')) $('#gf').onclick = e => { // filter buttons
  const b = e.target.closest('.chip');
  if (!b) return;
  $$('.chip').forEach(c => c.classList.toggle('on', c == b));
  $$('#gg .iw').forEach(t => t.hidden = !(b.dataset.f == 'All' || t.dataset.c == b.dataset.f));
};
const lb = $('#lb');
if (lb && $('#gg')) {
  const vis = () => $$('#gg .iw').filter(t => !t.hidden && t.offsetParent); // tiles currently shown
  let cur = 0;
  const show = n => { // show photo number n (wraps around)
    const L = vis();
    cur = (n + L.length) % L.length;
    const t = L[cur];
    $('#lbi').className = t.querySelector('.sc').className;
    $('#lbc').textContent = t.querySelector('.cap').textContent + '  \u00b7  ' + (cur + 1) + ' / ' + L.length;
  };
  const shut = () => { lb.hidden = true; document.body.style.overflow = ''; };
  $('#gg').onclick = e => {
    const t = e.target.closest('.iw');
    if (!t) return;
    lb.hidden = false;
    document.body.style.overflow = 'hidden';
    show(vis().indexOf(t));
    $('#lbx').focus();
  };
  $('#lbx').onclick = shut;
  $('#lbp').onclick = () => show(cur - 1);
  $('#lbn').onclick = () => show(cur + 1);
  lb.onclick = e => { if (e.target == lb) shut(); };
  addEventListener('keydown', e => {
    if (lb.hidden) return;
    if (e.key == 'Escape') shut();
    if (e.key == 'ArrowLeft') show(cur - 1);
    if (e.key == 'ArrowRight') show(cur + 1);
  });
  let sx = 0; // swipe left/right on phones
  lb.ontouchstart = e => sx = e.touches[0].clientX;
  lb.ontouchend = e => { const x = e.changedTouches[0].clientX - sx; if (Math.abs(x) > 50) show(cur + (x < 0 ? 1 : -1)); };
}

/* ---- 6. FAQ ACCORDION --------------------------------------------------
   Animates height + fade on open/close (a native <details> would just snap). */
$$('.faq details').forEach(d => {
  const body = d.querySelector('.fa-body');
  d.querySelector('summary').addEventListener('click', e => {
    e.preventDefault();
    if (d.anim) return; // ignore clicks while animating
    const open = !d.open;
    if (open) d.open = true;
    const h = body.scrollHeight,
      ms = matchMedia('(prefers-reduced-motion:reduce)').matches ? 0 : 350;
    d.classList.toggle('on', open);
    d.anim = body.animate({ height: open ? ['0px', h + 'px'] : [h + 'px', '0px'], opacity: open ? [0, 1] : [1, 0] }, { duration: ms, easing: 'cubic-bezier(.22,1,.36,1)' });
    d.anim.onfinish = () => { if (!open) d.open = false; d.anim = null; };
  });
});

/* ---- 7. OFFLINE SUPPORT ------------------------------------------------
   sw.js caches every file after the first visit, so the site keeps working
   with no internet. Service workers need http(s), so this is skipped when
   the file is opened straight from disk (file://). */
if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
}
