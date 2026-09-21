(function () {
  var root = document.querySelector('.carousel');
  if (root) {
    var slides = root.querySelectorAll('.slide');
    var dotsBox = root.querySelector('.dots');
    var index = 0;
    var timer = null;
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
      slides.forEach(function (s, i) { s.classList.toggle('is-active', i === index); });
      dots.forEach(function (d, i) { d.setAttribute('aria-selected', i === index ? 'true' : 'false'); });
    }
    function restart() {
      clearInterval(timer);
      if (!reduce && slides.length > 1) timer = setInterval(function () { go(index + 1); }, 5000);
    }

    root.querySelector('.prev').addEventListener('click', function () { go(index - 1); restart(); });
    root.querySelector('.next').addEventListener('click', function () { go(index + 1); restart(); });
    root.addEventListener('mouseenter', function () { clearInterval(timer); });
    root.addEventListener('mouseleave', restart);

    var startX = null;
    root.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
    root.addEventListener('touchend', function (e) {
      if (startX === null) return;
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) { go(index + (dx < 0 ? 1 : -1)); restart(); }
      startX = null;
    });

    go(0);
    restart();
  }

  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
