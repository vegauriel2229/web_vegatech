/* ==========================================================
   VEGATECH — scripts
   1) Tema claro/oscuro   2) Carrusel con fade
   3) Fondo de estrellas (solo modo oscuro)   4) Foco de luz en tarjetas
   ========================================================== */

(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function isDark() { return root.getAttribute('data-theme') !== 'light'; }

  /* ---------- 1) Tema claro / oscuro ----------
     El tema inicial ya lo puso el script del <head>; acá solo se maneja el botón. */
  var toggle = document.querySelector('.theme-toggle');
  var metaTheme = document.querySelector('meta[name="theme-color"]');

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    try { localStorage.setItem('vegatech-theme', theme); } catch (e) {}
    if (toggle) {
      toggle.setAttribute('aria-label', theme === 'dark' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro');
    }
    if (metaTheme) metaTheme.setAttribute('content', theme === 'dark' ? '#07070d' : '#f5f6fc');
    document.dispatchEvent(new CustomEvent('themechange'));
  }

  if (toggle) {
    applyTheme(isDark() ? 'dark' : 'light');
    toggle.addEventListener('click', function () {
      applyTheme(isDark() ? 'light' : 'dark');
    });
  }

  /* ---------- 2) Carrusel (fundido entre fotos) ----------
     El fade lo hace el CSS (clase .is-active); acá solo se cambia de slide. */
  var carousel = document.querySelector('.carousel');
  if (carousel) {
    var slides = carousel.querySelectorAll('.slide');
    var dotsBox = carousel.querySelector('.dots');
    var index = 0;
    var timer = null;

    slides.forEach(function (_, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('role', 'tab');
      b.setAttribute('aria-label', 'Ir a la foto ' + (i + 1));
      b.addEventListener('click', function () { go(i); restart(); });
      dotsBox.appendChild(b);
    });
    var dots = dotsBox.querySelectorAll('button');

    function go(n) {
      index = (n + slides.length) % slides.length;
      slides.forEach(function (s, i) {
        var active = i === index;
        s.classList.toggle('is-active', active);
        s.setAttribute('aria-hidden', active ? 'false' : 'true');
      });
      dots.forEach(function (d, i) { d.setAttribute('aria-selected', i === index ? 'true' : 'false'); });
    }
    function stop() { clearInterval(timer); }
    function restart() {
      stop();
      if (!reduceMotion && slides.length > 1) timer = setInterval(function () { go(index + 1); }, 5500);
    }

    carousel.querySelector('.prev').addEventListener('click', function () { go(index - 1); restart(); });
    carousel.querySelector('.next').addEventListener('click', function () { go(index + 1); restart(); });
    carousel.addEventListener('mouseenter', stop);
    carousel.addEventListener('mouseleave', restart);

    // Gesto de deslizar en celular
    var startX = null;
    carousel.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
    carousel.addEventListener('touchend', function (e) {
      if (startX === null) return;
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) { go(index + (dx < 0 ? 1 : -1)); restart(); }
      startX = null;
    });

    go(0);
    restart();
  }

  /* ---------- 3) Fondo de estrellas (solo modo oscuro) ----------
     Estrellas más grandes y brillantes, con variación de tamaño y color;
     algunas tienen halo (glow). En modo claro el canvas está oculto por CSS
     y la animación se detiene por completo. */
  var canvas = document.getElementById('bg-stars');
  if (canvas && canvas.getContext) {
    var ctx = canvas.getContext('2d');
    var stars = [];
    var w = 0, h = 0, dpr = 1, raf = null;

    // Colores de las estrellas (RGB): blanco, celeste, violeta claro, rosa
    var PALETTE = ['255,255,255', '255,255,255', '150,235,255', '200,175,255', '255,160,225'];

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      var count = Math.max(50, Math.min(140, Math.round((w * h) / 10000)));
      stars = [];
      for (var i = 0; i < count; i++) {
        var glow = Math.random() < 0.16;                       // ~16% con halo
        var big = Math.pow(Math.random(), 2.2);                // mayoría chicas, algunas grandes
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: glow ? 1.6 + Math.random() * 1.2 : 0.7 + big * 1.9,
          vx: (Math.random() - 0.5) * 0.14,
          vy: Math.random() * 0.2 + 0.04,
          a: 0.6 + Math.random() * 0.4,                        // opacidad base alta
          t: Math.random() * Math.PI * 2,
          tv: 0.012 + Math.random() * 0.02,                    // velocidad de parpadeo
          c: PALETTE[Math.floor(Math.random() * PALETTE.length)],
          glow: glow
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      if (!isDark()) return;
      for (var i = 0; i < stars.length; i++) {
        var s = stars[i];
        if (!reduceMotion) {
          s.x += s.vx; s.y += s.vy; s.t += s.tv;
          if (s.y > h + 6) { s.y = -6; s.x = Math.random() * w; }
          if (s.x < -6) s.x = w + 6; else if (s.x > w + 6) s.x = -6;
        }
        var alpha = Math.min(1, s.a * (0.7 + 0.3 * Math.sin(s.t)));

        if (s.glow) {                                          // halo suave
          var gr = s.r * 6;
          var g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, gr);
          g.addColorStop(0, 'rgba(' + s.c + ',' + (alpha * 0.55).toFixed(3) + ')');
          g.addColorStop(1, 'rgba(' + s.c + ',0)');
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(s.x, s.y, gr, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = 'rgba(' + s.c + ',' + alpha.toFixed(3) + ')';
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function loop() { draw(); raf = requestAnimationFrame(loop); }
    function start() { if (!reduceMotion && isDark() && !document.hidden && !raf) loop(); }
    function pause() { if (raf) { cancelAnimationFrame(raf); raf = null; } }

    resize();
    draw();
    start();

    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () { resize(); draw(); }, 150);
    });
    document.addEventListener('visibilitychange', function () { document.hidden ? pause() : start(); });
    // Al cambiar de tema: en claro se detiene y se limpia; en oscuro se reanuda
    document.addEventListener('themechange', function () {
      if (isDark()) { draw(); start(); } else { pause(); ctx.clearRect(0, 0, w, h); }
    });
  }

  /* ---------- 4) Foco de luz que sigue al cursor en las tarjetas ----------
     Solo actualiza variables CSS (--mx / --my); el dibujo lo hace el CSS. */
  if (window.matchMedia('(hover: hover)').matches) {
    var SPOT = '.card, .steps li, .info div, .checks';
    document.addEventListener('pointermove', function (e) {
      var el = e.target.closest ? e.target.closest(SPOT) : null;
      if (!el) return;
      var r = el.getBoundingClientRect();
      el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      el.style.setProperty('--my', (e.clientY - r.top) + 'px');
    }, { passive: true });
  }

  /* ---------- Año del footer ---------- */
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
