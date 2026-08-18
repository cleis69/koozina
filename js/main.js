/* ═══════════════════════════════════════════════════════════════════════
   KOOZINA GARDEN — main.js
   Vanilla JS. GSAP + ScrollTrigger + Lenis sont optionnels : si les CDN
   tombent, tout reste lisible et navigable. Aucun état n'est caché en CSS.

   1. Contexte   2. Utilitaires   3. Texte   4. Scroll   5. Fond narratif
   6. Mouvements 7. Glisser       8. Éventail 9. Chrome  10. Divers
   ═══════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ─────────── 1. CONTEXTE ─────────── */
  var RM    = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var TOUCH = matchMedia('(hover: none), (pointer: coarse)').matches;
  var G     = window.gsap;
  var ST    = window.ScrollTrigger;
  var HAS   = !!(G && ST) && !RM;
  if (HAS) G.registerPlugin(ST);

  /* les timings suivent la palette */
  var E = {
    beige: { ease: 'power2.out', d: 1.25 },
    green: { ease: 'power3.out', d: 1.05 },
    poppy: { ease: 'power2.out', d: 0.34 },
    rose:  { ease: 'sine.out',   d: 1.50 },
    ink:   { ease: 'expo.out',   d: 1.15 }
  };

  /* ─────────── 2. UTILITAIRES ─────────── */
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var lerp  = function (a, b, t) { return a + (b - a) * t; };
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };

  var mast   = $('#mast');
  var prog   = $('#prog');
  var rail   = $('#rail');
  var wa     = $('.wa');
  var burger = $('#burger');
  var menu   = $('#menu');
  var loader = $('#loader');

  /* filet de sécurité photo : on ne laisse jamais un trou blanc */
  $$('img').forEach(function (img) {
    img.addEventListener('error', function () {
      img.classList.add('failed');
      var w = img.closest('.fig, .gal__item, .plate__fig, .hero__media, .fan__item, .garden__layer');
      if (w) w.classList.add('failed-wrap');
    });
  });

  /* ─────────── 3. TEXTE : découpe par caractères ─────────── */
  $$('[data-split]').forEach(function (el) {
    var words = el.textContent.split(' ');
    el.textContent = '';
    words.forEach(function (word, wi) {
      word.split('').forEach(function (ch) {
        var w = document.createElement('span'); w.className = 'w';
        var c = document.createElement('span'); c.className = 'c'; c.textContent = ch;
        w.appendChild(c); el.appendChild(w);
      });
      if (wi < words.length - 1) el.appendChild(document.createTextNode(' '));
    });
  });

  /* ─────────── 4. SCROLL : Lenis en mode natif ─────────── */
  var lenis = null;
  if (window.Lenis && !RM && !TOUCH) {
    lenis = new window.Lenis({ lerp: 0.082, wheelMultiplier: 1, smoothWheel: true });
    if (HAS) {
      lenis.on('scroll', ST.update);
      G.ticker.add(function (t) { lenis.raf(t * 1000); });
      G.ticker.lagSmoothing(0);
    } else {
      var raf = function (t) { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
  }
  function goTo(target, offset) {
    if (!target) return;
    if (lenis) lenis.scrollTo(target, { offset: offset || -8, duration: 1.5 });
    else window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY + (offset || -8),
                           behavior: RM ? 'auto' : 'smooth' });
  }

  /* ─────────── 5. FOND NARRATIF ───────────
     Chaque section porte data-bg et data-theme. Le fond global se fond
     d'une couleur à l'autre au lieu de changer d'un coup : c'est ce qui
     fait la transition organique entre les mouvements. */
  var backdrop = $('#backdrop');
  function paintFrom(sec) {
    if (!sec) return;
    var bg = sec.getAttribute('data-bg');
    var dark = sec.getAttribute('data-theme') === 'dark';
    if (bg && backdrop) backdrop.style.backgroundColor = bg;
    document.body.classList.toggle('on-dark', dark);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta && bg) meta.setAttribute('content', bg);
  }
  function initBackdrop() {
    var sections = $$('[data-bg]');
    if (!sections.length) return;
    paintFrom(sections[0]);
    if (!HAS) return;
    sections.forEach(function (sec) {
      ST.create({
        trigger: sec, start: 'top 55%', end: 'bottom 55%',
        onEnter:     function () { paintFrom(sec); },
        onEnterBack: function () { paintFrom(sec); }
      });
    });
  }

  /* ─────────── 6. MOUVEMENTS ─────────── */
  function buildScroll() {
    if (!HAS) return;

    /* titres : lettre par lettre, sous masque */
    $$('[data-split]').forEach(function (el) {
      G.from(el.querySelectorAll('.c'), {
        yPercent: 118, duration: E.ink.d, ease: E.ink.ease, stagger: 0.02,
        delay: (+el.dataset.delay || 0) / 1000,
        scrollTrigger: { trigger: el, start: 'top 92%' }
      });
    });

    /* blocs : le rose respire plus lentement que le beige */
    $$('[data-fade]').forEach(function (el) {
      var rose = !!el.closest('[data-bg="#F3E4E0"]');
      G.from(el, {
        opacity: 0, y: rose ? 16 : 26,
        duration: rose ? E.rose.d : E.beige.d,
        ease: rose ? E.rose.ease : E.beige.ease,
        delay: (+el.dataset.delay || 0) / 1000,
        scrollTrigger: { trigger: el, start: 'top 92%' }
      });
    });

    /* images : volet + zoom arrière */
    $$('.fig, .plate__fig, .gal__item').forEach(function (el) {
      var img = el.querySelector('img');
      var trig = { trigger: el, start: 'top 90%' };
      G.fromTo(el, { clipPath: 'inset(0% 0% 100% 0%)' },
                   { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.3, ease: E.ink.ease, scrollTrigger: trig });
      if (img) G.from(img, { scale: 1.22, duration: 1.8, ease: E.ink.ease, scrollTrigger: trig });
    });

    /* parallaxe simple */
    $$('[data-par]').forEach(function (el) {
      var a = parseFloat(el.dataset.par) * 100;
      G.fromTo(el, { yPercent: -a / 2 }, {
        yPercent: a / 2, ease: 'none',
        scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });
    /* le seuil : l'image glisse dans son cadre pendant la traversée */
    $$('[data-par-in]').forEach(function (el) {
      G.fromTo(el, { yPercent: -18 }, {
        yPercent: 0, ease: 'none',
        scrollTrigger: { trigger: el.closest('.threshold'), start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });

    /* ── LE JARDIN : trois plans, trois vitesses ── */
    var stage = $('.garden__stage');
    if (stage && window.innerWidth > 900) {
      $$('.garden__layer').forEach(function (layer) {
        var d = parseFloat(layer.dataset.depth) || 0.5;
        G.fromTo(layer, { yPercent: 26 * d, scale: 1 + 0.05 * d },
          { yPercent: -30 * d, scale: 1, ease: 'none',
            scrollTrigger: { trigger: stage, start: 'top bottom', end: 'bottom top', scrub: 1.1 } });
      });
      /* le mot reste, mais respire */
      G.fromTo($('.garden__word'), { scale: 1.14, letterSpacing: '-0.02em' },
        { scale: 1, letterSpacing: '-0.05em', ease: 'none',
          scrollTrigger: { trigger: stage, start: 'top bottom', end: 'bottom top', scrub: 1.4 } });
      $$('.botanic').forEach(function (b, i) {
        G.fromTo(b, { yPercent: 40, rotate: i ? 34 : -8 }, { yPercent: -40, rotate: i ? 18 : 6, ease: 'none',
          scrollTrigger: { trigger: stage, start: 'top bottom', end: 'bottom top', scrub: 1.6 } });
      });
    }

    /* compteurs */
    $$('[data-count]').forEach(function (el) {
      var to = parseFloat(el.dataset.count), dec = +(el.dataset.dec || 0), o = { v: 0 };
      G.to(o, {
        v: to, duration: 1.8, ease: E.beige.ease,
        scrollTrigger: { trigger: el, start: 'top 94%' },
        onUpdate: function () {
          el.textContent = dec ? o.v.toFixed(dec).replace('.', ',')
                               : Math.round(o.v).toLocaleString('fr-FR');
        }
      });
    });

    /* chrome : masthead, rail, WhatsApp, progression */
    ST.create({ start: function () { return window.innerHeight * 0.86; }, end: function () { return document.body.scrollHeight; },
      onToggle: function (s) { mast.classList.toggle('is-solid', s.isActive); } });
    ST.create({ start: function () { return window.innerHeight * 0.6; }, end: function () { return document.body.scrollHeight; },
      onToggle: function (s) {
        if (wa) wa.classList.toggle('is-on', s.isActive);
        if (rail) rail.classList.toggle('is-on', s.isActive);
      } });
    if (prog) G.to(prog, { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } });

    /* section courante */
    ['maison', 'jardin', 'cuisine', 'carte', 'partager', 'reserver'].forEach(function (id) {
      var sec = document.getElementById(id); if (!sec) return;
      var mark = function () {
        $$('#rail a').forEach(function (a) { a.classList.toggle('is-on', a.dataset.rail === id); });
        $$('.mnav a').forEach(function (a) { a.classList.toggle('is-on', a.dataset.nav === id); });
      };
      ST.create({ trigger: sec, start: 'top 45%', end: 'bottom 45%', onEnter: mark, onEnterBack: mark });
    });

    /* le hero s'éloigne */
    G.to('.hero__in', { yPercent: 11, opacity: 0.25, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  }

  /* ─────────── 7. GLISSER ───────────
     Carrousel éditorial : glisser à la souris, au doigt ou à la molette
     horizontale. La carte suivante reste volontairement amorcée à droite. */
  function makeDraggable(viewport, track, opts) {
    if (!viewport || !track) return null;
    opts = opts || {};
    var x = 0, target = 0, dragging = false, startX = 0, startPos = 0, moved = 0, raf = null;

    function maxScroll() { return Math.max(0, track.scrollWidth - viewport.clientWidth + (opts.pad || 0)); }
    function apply() {
      x = lerp(x, target, 0.12);
      if (Math.abs(target - x) < 0.1) x = target;
      track.style.transform = 'translate3d(' + (-x) + 'px,0,0)';
      if (opts.onMove) opts.onMove(maxScroll() ? x / maxScroll() : 0);
      raf = requestAnimationFrame(apply);
    }
    function setTarget(v) { target = clamp(v, 0, maxScroll()); }

    viewport.addEventListener('pointerdown', function (e) {
      dragging = true; moved = 0; startX = e.clientX; startPos = target;
      viewport.classList.add('is-drag'); viewport.setPointerCapture(e.pointerId);
    });
    viewport.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      var dx = e.clientX - startX; moved = Math.abs(dx);
      setTarget(startPos - dx);
    });
    ['pointerup', 'pointercancel', 'pointerleave'].forEach(function (ev) {
      viewport.addEventListener(ev, function () { dragging = false; viewport.classList.remove('is-drag'); });
    });
    /* on n'ouvre pas un lien si l'utilisateur glissait */
    viewport.addEventListener('click', function (e) { if (moved > 6) { e.preventDefault(); e.stopPropagation(); } }, true);
    viewport.addEventListener('wheel', function (e) {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) { e.preventDefault(); setTarget(target + e.deltaX); }
    }, { passive: false });

    raf = requestAnimationFrame(apply);
    return { setTarget: setTarget, get: function () { return target; }, max: maxScroll,
             step: function (dir) { setTarget(target + dir * (opts.step ? opts.step() : 400)); } };
  }

  function initCarousels() {
    /* galerie du jardin */
    var galTrack = $('#galTrack');
    if (galTrack) {
      var galVp = galTrack.parentElement;
      makeDraggable(galVp, galTrack, { pad: 40 });
      galVp.style.overflow = 'hidden';
    }

    /* les assiettes */
    var vp = $('#platesVp'), track = $('#platesTrack'), bar = $('#platesBar');
    if (!vp || !track) return;
    var first = track.querySelector('.plate');
    var stepSize = function () {
      if (!first) return 500;
      var gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap || 0) || 0;
      return first.getBoundingClientRect().width + gap;
    };
    var ctrl = makeDraggable(vp, track, {
      pad: 40, step: stepSize,
      onMove: function (p) { if (bar) bar.style.transform = 'scaleX(' + clamp(p, 0.06, 1) + ')'; }
    });
    var prev = $('#platesPrev'), next = $('#platesNext');
    if (prev) prev.addEventListener('click', function () { ctrl.step(-1); });
    if (next) next.addEventListener('click', function () { ctrl.step(1); });
    /* clavier */
    vp.setAttribute('tabindex', '0');
    vp.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); ctrl.step(1); }
      if (e.key === 'ArrowLeft')  { e.preventDefault(); ctrl.step(-1); }
    });
  }

  /* ─────────── 8. ÉVENTAIL ───────────
     Les photos se déploient au survol, et se déploient aussi au scroll
     quand la composition entre dans le champ. */
  function initFan() {
    var fan = $('#fan'); if (!fan) return;
    if (!TOUCH) {
      fan.addEventListener('mouseenter', function () { fan.classList.add('is-open'); });
      fan.addEventListener('mouseleave', function () { fan.classList.remove('is-open'); });
    }
    if (HAS) {
      ST.create({
        trigger: fan, start: 'top 62%', end: 'bottom 40%',
        onEnter:     function () { fan.classList.add('is-open'); },
        onLeave:     function () { fan.classList.remove('is-open'); },
        onEnterBack: function () { fan.classList.add('is-open'); },
        onLeaveBack: function () { fan.classList.remove('is-open'); }
      });
    } else {
      fan.classList.add('is-open');
    }
  }

  /* ─────────── 9. CHROME ─────────── */
  function toggleNav(force) {
    var open = force !== undefined ? force : !document.body.classList.contains('nav-open');
    document.body.classList.toggle('nav-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    if (lenis) { open ? lenis.stop() : lenis.start(); }
  }
  if (burger) burger.addEventListener('click', function () { toggleNav(); });
  window.addEventListener('keydown', function (e) { if (e.key === 'Escape') toggleNav(false); });

  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href'); if (id.length < 2) return;
      var t = document.querySelector(id); if (!t) return;
      e.preventDefault();
      if (document.body.classList.contains('nav-open')) {
        toggleNav(false);
        setTimeout(function () { goTo(t, -8); }, 640);
      } else goTo(t, -8);
    });
  });

  function initCursor() {
    if (TOUCH || RM) return;
    var dot = $('.cur'), ring = $('.curR'), label = $('[data-cur-label]');
    var mx = window.innerWidth / 2, my = window.innerHeight / 2, rx = mx, ry = my;
    window.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = 'translate3d(' + mx + 'px,' + my + 'px,0) translate(-50%,-50%)';
    }, { passive: true });
    (function f() {
      rx = lerp(rx, mx, 0.16); ry = lerp(ry, my, 0.16);
      ring.style.transform = 'translate3d(' + rx + 'px,' + ry + 'px,0) translate(-50%,-50%)';
      requestAnimationFrame(f);
    })();

    $$('a, button, [data-cur="link"]').forEach(function (el) {
      el.addEventListener('mouseenter', function () { document.body.classList.add('cur-link'); });
      el.addEventListener('mouseleave', function () { document.body.classList.remove('cur-link'); });
    });
    $$('.fig, .plate__fig').forEach(function (el) {
      el.addEventListener('mouseenter', function () { if (label) label.textContent = 'Voir'; document.body.classList.add('cur-view'); });
      el.addEventListener('mouseleave', function () { document.body.classList.remove('cur-view'); });
    });
    $$('[data-drag]').forEach(function (el) {
      el.addEventListener('mouseenter', function () { if (label) label.textContent = 'Glisser'; document.body.classList.add('cur-drag'); });
      el.addEventListener('mouseleave', function () { document.body.classList.remove('cur-drag'); });
    });
    /* micro-interaction rapide sur les boutons — le rouge est vif */
    $$('.btn, .mbook, .plates__btn').forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        if (G) G.to(el, { x: (e.clientX - r.left - r.width / 2) * 0.16,
                          y: (e.clientY - r.top - r.height / 2) * 0.22,
                          duration: E.poppy.d, ease: E.poppy.ease, overwrite: 'auto' });
      });
      el.addEventListener('mouseleave', function () {
        if (G) G.to(el, { x: 0, y: 0, duration: 0.7, ease: 'power3.out', overwrite: 'auto' });
      });
    });
  }

  /* ─────────── 10. DIVERS ─────────── */
  var EVIMG = [
    'https://lh3.googleusercontent.com/grass-cs/ACvplmM6UD7QbAKmDz4WJttlxlXi0WsJkgV-MsJSBZ5iCNHGj3-Y6tBAVsqNJe9VhYdQiRO2-kbom6qLyCeDcYTxfxIEXanZvYv99wMocwOratT6H4q_fErwfLUEeLekZXryZkiiDo9XI7KEqBq_=w600-h760-k-no',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWkfivGcvrSgmLfkn0a4iOjUqSYnmoI2Ijz-lJymdN9sphPTyifhaw6oAL42qGaLPLoC0wWigOzs_3X9xPqC-AqkxDa9FePu3hlFg63Bl2K_ztEEPPrdLqGpHP_DZLjlY70CBvKp=w600-h760-k-no',
    'https://lh3.googleusercontent.com/grass-cs/ACvplmNsINR_1ve_y35gcFnUPf-s0u8KU4Eb5Hrn80cH35q5-pDpArll4ZJs23P26WGI6S4DVmLSoHb_326KU-69Ca3hMqcdyT3vOfEKysyDTBipvL5o9h322BP93cgZZz-xLqTXEfpM-oxysnC1=w600-h760-k-no',
    'https://lh3.googleusercontent.com/grass-cs/ACvplmMu2IXasLxe7pw0nzOS7E-fImxMVoyYkqa3UWkaYRZSf3CI_QrViMbQmEYqBEm4J9SwfSTO9qDxcUz5gbwxpvIwMzeaUcqZ_Q5lMpseDQGCdWH_H4VNB75SiLrB3JJMZNowW4cfSQwVa5Sm=w600-h760-k-no'
  ];
  function initEventPreview() {
    var evp = $('#evprev'), evi = $('#evimg');
    if (!evp || TOUCH || RM) return;
    var ex = window.innerWidth / 2, ey = window.innerHeight / 2, tx = ex, ty = ey, on = false;
    $$('.event').forEach(function (el) {
      el.addEventListener('mouseenter', function () { evi.src = EVIMG[+el.dataset.ev] || EVIMG[0]; evp.classList.add('is-on'); on = true; });
      el.addEventListener('mouseleave', function () { evp.classList.remove('is-on'); on = false; });
    });
    window.addEventListener('mousemove', function (e) { tx = e.clientX + 168; ty = e.clientY; }, { passive: true });
    (function f() {
      if (on) { ex = lerp(ex, tx, 0.1); ey = lerp(ey, ty, 0.1); evp.style.left = ex + 'px'; evp.style.top = ey + 'px'; }
      requestAnimationFrame(f);
    })();
  }

  var QUOTES = [
    ["Adresse incontournable à Essaouira, une cuisine généreuse 100 % fait maison, d'une saveur et d'une fraîcheur incroyables.", 'Avis voyageur · Tripadvisor'],
    ["Un havre de paix en bordure de médina. Le jardin, les arcades, l'accueil : on y reste des heures sans s'en rendre compte.", 'Avis voyageur · Google'],
    ['Tout est frais, pensé, joliment présenté. Et les prix restent très doux pour Essaouira.', 'Avis voyageur · Tripadvisor'],
    ["On est revenus trois fois en une semaine. Le brunch sous les arcades, c'est autre chose.", 'Avis voyageur · Google']
  ];
  function initQuotes() {
    var q = $('#quote'), w = $('#quoteWho'), dots = $('#dots');
    if (!q || !dots) return;
    var i = 0, timer;
    QUOTES.forEach(function (_, n) {
      var b = document.createElement('button');
      b.setAttribute('role', 'tab');
      b.setAttribute('aria-label', 'Avis ' + (n + 1));
      b.addEventListener('click', function () { show(n); restart(); });
      dots.appendChild(b);
    });
    function show(n) {
      i = n; q.style.opacity = 0; w.style.opacity = 0;
      setTimeout(function () {
        q.textContent = QUOTES[n][0]; w.textContent = QUOTES[n][1];
        q.style.opacity = 1; w.style.opacity = 1;
      }, 400);
      Array.prototype.forEach.call(dots.children, function (d, j) { d.classList.toggle('is-on', j === n); });
    }
    function restart() { clearInterval(timer); timer = setInterval(function () { show((i + 1) % QUOTES.length); }, 7000); }
    show(0); restart();
  }

  function initForm() {
    var d = $('#f-date');
    if (d) d.value = new Date(Date.now() + 864e5).toISOString().slice(0, 10);
    var form = $('#resa'); if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var b = form.querySelector('.btn'), old = b.textContent;
      b.textContent = 'Merci — nous vous rappelons';
      setTimeout(function () { b.textContent = old; }, 3200);
    });
  }

  /* ─────────── PRELOADER ─────────── */
  function start() {
    document.body.classList.add('is-loaded');
    if (mast) mast.classList.add('is-ready');
    initBackdrop();
    buildScroll();
    initCarousels();
    initFan();
    initCursor();
    initEventPreview();
    if (HAS) requestAnimationFrame(function () { ST.refresh(); });
  }

  function playLoader() {
    if (!loader) { start(); return; }
    var ring = $('.lg-ring', loader), oct = $('.lg-oct', loader), stem = $('.lg-stem', loader),
        pops = $$('.lg-poppy', loader), word = $('.lg-word', loader),
        bar = $('.loader__bar i', loader), cnt = $('.loader__cnt', loader), mid = $('.loader__mid', loader);

    if (RM) { loader.style.display = 'none'; start(); return; }
    if (lenis) lenis.stop();

    ring.style.transition = 'stroke-dashoffset 1.5s cubic-bezier(.16,1,.3,1)';
    requestAnimationFrame(function () { ring.style.strokeDashoffset = '0'; });
    [oct, stem].forEach(function (el, i) {
      el.style.transition = 'opacity .9s ease ' + (0.5 + i * 0.18) + 's';
      requestAnimationFrame(function () { el.style.opacity = '1'; });
    });
    pops.forEach(function (p, i) {
      var d = 0.95 + i * 0.13;
      p.style.transition = 'opacity .6s ease ' + d + 's, transform .9s cubic-bezier(.34,1.56,.64,1) ' + d + 's';
      requestAnimationFrame(function () { p.style.opacity = '1'; p.style.transform = 'scale(1)'; });
    });
    word.style.transition = 'opacity .8s ease 1.35s';
    requestAnimationFrame(function () { word.style.opacity = '1'; });
    bar.style.transition = 'transform 2.1s cubic-bezier(.5,0,.2,1)';
    requestAnimationFrame(function () { bar.style.transform = 'scaleX(1)'; });

    var t0 = performance.now();
    (function tick(t) {
      var p = clamp((t - t0) / 2100, 0, 1);
      cnt.textContent = Math.round(p * 100);
      if (p < 1) requestAnimationFrame(tick);
      else {
        mid.style.opacity = '0'; mid.style.transform = 'translateY(-24px)';
        setTimeout(function () {
          loader.classList.add('is-done');
          loader.style.transition = 'transform 1.15s cubic-bezier(.76,0,.24,1)';
          loader.style.transform = 'translateY(-100%)';
          if (lenis) lenis.start();
          start();
        }, 400);
        setTimeout(function () { loader.style.display = 'none'; if (HAS) ST.refresh(); }, 1750);
      }
    })(t0);
  }

  var rt;
  window.addEventListener('resize', function () {
    clearTimeout(rt);
    rt = setTimeout(function () { if (HAS) ST.refresh(); }, 160);
  });
  window.addEventListener('load', function () { if (HAS) ST.refresh(); });

  initQuotes();
  initForm();
  if (document.readyState !== 'loading') playLoader();
  else document.addEventListener('DOMContentLoaded', playLoader);
})();
