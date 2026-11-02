(function () {
  var FRASES = {
    hola: ['안녕!', 'annyeong = ¡Hola!'],
    hambre: ['배고파!', 'baegopa = ¡Tengo hambre!'],
    crujiente: ['바삭바삭!', 'basak-basak = ¡Crujiente!'],
    pica: ['매워!', 'maewo = ¡Pica!'],
    chimaek: ['치맥 어때?', 'chimaek eottae? = ¿Un chimaek?'],
    rico: ['맛있어!', 'masisseo = ¡Qué rico!'],
    gracias: ['고마워!', 'gomawo = ¡Gracias!'],
    adios: ['또 봐!', 'tto bwa = ¡Hasta luego!']
  };
  var CLAVE = 'pc-pollo';
  var sinMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function leer() { try { return localStorage.getItem(CLAVE); } catch (e) { return null; } }
  function guardar(v) { try { localStorage.setItem(CLAVE, v); } catch (e) {} }

  /* ---------- Ojos del logo ---------- */
  var pendiente = null;
  function mirar() {
    var p = pendiente; pendiente = null;
    document.querySelectorAll('.logo-vivo').forEach(function (svg) {
      var r = svg.getBoundingClientRect();
      if (!r.width || r.bottom < 0 || r.top > innerHeight) return;
      var escala = r.width / 300;
      svg.querySelectorAll('.pupila').forEach(function (o) {
        var cx = r.left + (+o.getAttribute('cx')) * escala;
        var cy = r.top + (+o.getAttribute('cy')) * escala;
        var dx = p.x - cx, dy = p.y - cy, d = Math.hypot(dx, dy) || 1;
        var m = Math.min(7, d / 12);
        o.setAttribute('transform', 'translate(' + (dx / d * m).toFixed(1) + ' ' + (dy / d * m).toFixed(1) + ')');
      });
    });
  }
  if (!sinMovimiento) {
    window.addEventListener('pointermove', function (e) {
      if (!pendiente) requestAnimationFrame(mirar);
      pendiente = { x: e.clientX, y: e.clientY };
    }, { passive: true });
    window.addEventListener('pointerdown', function (e) {
      if (!pendiente) requestAnimationFrame(mirar);
      pendiente = { x: e.clientX, y: e.clientY };
    }, { passive: true });
  }

  /* ---------- Sésamo y plumas ---------- */
  function lanzar(x, y, clase, n) {
    if (sinMovimiento) return;
    for (var i = 0; i < n; i++) {
      var s = document.createElement('span');
      s.className = clase;
      s.setAttribute('aria-hidden', 'true');
      s.style.left = x + 'px'; s.style.top = y + 'px';
      s.style.setProperty('--dx', (Math.random() * 160 - 80).toFixed(0) + 'px');
      s.style.setProperty('--dy', (Math.random() * 90 + 50).toFixed(0) + 'px');
      s.style.setProperty('--giro', (Math.random() * 500 - 250).toFixed(0) + 'deg');
      document.body.appendChild(s);
      s.addEventListener('animationend', function () { this.remove(); });
    }
  }
  var logoGrande = document.querySelector('.logo-hero');
  if (logoGrande) {
    logoGrande.addEventListener('click', function () {
      logoGrande.classList.remove('salta'); void logoGrande.offsetWidth; logoGrande.classList.add('salta');
      var r = logoGrande.getBoundingClientRect();
      lanzar(r.left + r.width / 2, r.top + r.height / 3, 'sesamo', 10);
      decir('rico');
    });
  }

  /* ---------- El pollo ---------- */
  var pollo = document.createElement('div');
  pollo.className = 'pollo';
  pollo.innerHTML =
    '<div class="bocadillo-pollo" role="status" hidden><span class="ko" lang="ko"></span><span class="es"></span></div>' +
    '<button class="pollo-cuerpo" type="button" aria-label="Saluda al pollo">' +
    '<svg viewBox="0 0 120 132" aria-hidden="true">' +
    '<g class="patas" fill="none" stroke="#000" stroke-width="6" stroke-linecap="round"><path class="pata pata1" d="M46 100v22m-9 0h17"/><path class="pata pata2" d="M72 100v22m-9 0h17"/></g>' +
    '<g class="tronco">' +
    '<path d="M42 30c-5-20 11-25 15-11 2-18 22-18 20 2 9-12 24-4 15 12z" fill="#E0115F" stroke="#000" stroke-width="5" stroke-linejoin="round"/>' +
    '<circle cx="60" cy="66" r="42" fill="#FFC400" stroke="#000" stroke-width="6"/>' +
    '<circle cx="74" cy="56" r="7" fill="#000"/><circle cx="76.500" cy="53.500" r="2.500" fill="#fff"/>' +
    '<path d="M94 58l22 8-22 9z" fill="#F07A00" stroke="#000" stroke-width="5" stroke-linejoin="round"/>' +
    '<circle cx="82" cy="76" r="7" fill="#FF8FA3"/>' +
    '<path class="ala" d="M26 66c12-6 28 0 28 14 0 12-20 16-30 4z" fill="#FFE27A" stroke="#000" stroke-width="5" stroke-linejoin="round"/>' +
    '<g class="prop prop-casco"><path d="M20 50c0-48 80-48 80 0z" fill="#5B6B2F" stroke="#000" stroke-width="5" stroke-linejoin="round"/><path d="M12 50h98" stroke="#000" stroke-width="8" stroke-linecap="round"/></g>' +
    '<g class="prop prop-sudor" fill="#3AA6FF" stroke="#000" stroke-width="3"><path d="M26 18c6 8 8 12 4 16-5 3-10-1-8-6z"/><path d="M104 28c5 7 7 11 3 14-4 3-9-1-7-5z"/></g>' +
    '<g class="prop prop-cerveza"><rect x="2" y="70" width="26" height="34" rx="3" fill="#FFB300" stroke="#000" stroke-width="5"/><path d="M0 72c2-9 28-9 30 0z" fill="#fff" stroke="#000" stroke-width="4"/></g>' +
    '</g></svg></button>';
  document.body.appendChild(pollo);

  var boton = pollo.querySelector('.pollo-cuerpo');
  var bocadillo = pollo.querySelector('.bocadillo-pollo');
  var quitar = null;
  var ultimaActividad = Date.now();

  function decir(clave) {
    if (pollo.hidden) return;
    var f = FRASES[clave]; if (!f) return;
    bocadillo.querySelector('.ko').textContent = f[0];
    bocadillo.querySelector('.es').textContent = f[1];
    bocadillo.hidden = false;
    var r = pollo.getBoundingClientRect();
    bocadillo.classList.toggle('a-la-derecha', r.left + r.width / 2 < innerWidth / 2);
    bocadillo.classList.remove('sale'); void bocadillo.offsetWidth; bocadillo.classList.add('sale');
    clearTimeout(quitar);
    quitar = setTimeout(function () { bocadillo.hidden = true; }, 3500);
  }

  boton.addEventListener('click', function () {
    var r = boton.getBoundingClientRect();
    lanzar(r.left + r.width / 2, r.top + r.height / 3, 'pluma', 7);
    pollo.classList.remove('brinca'); void pollo.offsetWidth; pollo.classList.add('brinca');
    decir('gracias');
  });

  ['scroll', 'pointermove', 'keydown', 'touchstart'].forEach(function (ev) {
    window.addEventListener(ev, function () { ultimaActividad = Date.now(); }, { passive: true });
  });
  setInterval(function () {
    if (Date.now() - ultimaActividad > 30000) { ultimaActividad = Date.now(); decir('hambre'); }
  }, 2000);

  var objetivos = [].slice.call(document.querySelectorAll('[data-pollo]'));
  var modoActor = objetivos.length > 0 && !sinMovimiento;

  /* ---------- Pollo actor: salta de viñeta en viñeta ---------- */
  function colocar(el) {
    var r = el.getBoundingClientRect();
    var a = boton.offsetWidth, h = boton.offsetHeight;
    var y = el.dataset.pollo === 'abajo' ? Math.min(r.bottom - h - 2, innerHeight - h - 40) : r.top - h + 7;
    pollo.style.left = Math.round(r.right + scrollX - a - 14) + 'px';
    pollo.style.top = Math.round(y + scrollY) + 'px';
  }
  function iniciarActor() {
    pollo.classList.add('actor');
    var actual = null;
    function elegir() {
      var linea = innerHeight * 0.45, mejor = null, dist = Infinity;
      objetivos.forEach(function (el) {
        var r = el.getBoundingClientRect();
        var d = Math.abs((r.top + r.bottom) / 2 - linea);
        if (d < dist) { dist = d; mejor = el; }
      });
      return mejor;
    }
    function ir() {
      var el = elegir();
      if (!el || el === actual) return;
      actual = el;
      pollo.classList.remove('salto'); void pollo.offsetWidth; pollo.classList.add('salto');
      colocar(el);
      pollo.dataset.prop = el.dataset.prop || '';
      if (el.dataset.frase) decir(el.dataset.frase);
    }
    var tic = false;
    window.addEventListener('scroll', function () {
      if (tic) return; tic = true;
      setTimeout(function () { tic = false; ir(); }, 180);
    }, { passive: true });
    window.addEventListener('resize', function () { if (actual) colocar(actual); });
    window.addEventListener('load', function () { if (actual) colocar(actual); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { if (actual) colocar(actual); });
    actual = elegir(); if (actual) { colocar(actual); pollo.dataset.prop = actual.dataset.prop || ''; }
  }

  /* ---------- Pollo paseante: camina por abajo ---------- */
  function iniciarPaseante() {
    pollo.classList.add('paseante');
    var aviso = document.getElementById('aviso-cookies');
    function subir() {
      var alto = aviso && !aviso.hidden ? aviso.getBoundingClientRect().height + 24 : 8;
      pollo.style.bottom = Math.round(alto) + 'px';
    }
    subir();
    if (aviso && window.MutationObserver) new MutationObserver(subir).observe(aviso, { attributes: true, attributeFilter: ['hidden'] });
    window.addEventListener('resize', subir);

    if (!sinMovimiento) {
      var x = 16, destino = x, previo = performance.now(), hasta = 0;
      var v = 55;
      var paso = function (t) {
        var dt = Math.min(0.1, (t - previo) / 1000); previo = t;
        var max = Math.max(16, innerWidth - boton.offsetWidth - 16);
        if (t >= hasta) {
          var resto = destino - x;
          if (Math.abs(resto) < 2) {
            pollo.classList.remove('anda');
            if (pollo.classList.contains('quieto')) {
              pollo.classList.remove('quieto');
              destino = 16 + Math.random() * (max - 16);
            } else {
              pollo.classList.add('quieto');
              pollo.classList.toggle('picotea', Math.random() < 0.7);
              hasta = t + 1500 + Math.random() * 3000;
            }
          } else {
            pollo.classList.add('anda');
            pollo.classList.remove('picotea');
            pollo.classList.toggle('izquierda', resto < 0);
            x += Math.sign(resto) * Math.min(Math.abs(resto), v * dt);
            pollo.style.transform = 'translateX(' + x.toFixed(1) + 'px)';
          }
        }
        requestAnimationFrame(paso);
      };
      pollo.style.transform = 'translateX(16px)';
      requestAnimationFrame(paso);
    } else {
      pollo.classList.add('fijo');
    }

    var marcas = document.querySelectorAll('[data-frase]');
    var pie = document.querySelector('.pie');
    if (pie && !pie.dataset.frase) { pie.dataset.frase = 'adios'; }
    marcas = document.querySelectorAll('[data-frase]');
    if ('IntersectionObserver' in window) {
      var vista = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting && !e.target.dataset.dicho) {
            e.target.dataset.dicho = '1';
            decir(e.target.dataset.frase);
          }
        });
      }, { rootMargin: '-35% 0px -45% 0px' });
      marcas.forEach(function (m) { vista.observe(m); });
    }
  }

  if (modoActor) iniciarActor(); else iniciarPaseante();

  /* ---------- Ocultar el pollo ---------- */
  var interruptor = document.getElementById('interruptor-pollo');
  function aplicar(oculto) {
    pollo.hidden = oculto;
    if (interruptor) interruptor.textContent = oculto ? 'Mostrar el pollo' : 'Ocultar el pollo';
  }
  aplicar(leer() === 'oculto');
  if (interruptor) {
    interruptor.addEventListener('click', function () {
      var oculto = !pollo.hidden;
      guardar(oculto ? 'oculto' : 'visible');
      aplicar(oculto);
      if (!oculto) decir('hola');
    });
  }

  setTimeout(function () { decir('hola'); }, sinMovimiento ? 300 : 1200);
})();
