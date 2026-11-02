(function () {
  var ID = 'G-FP2QLS573G', KEY = 'pc-cookies';
  function leer() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function guardar(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }
  var cargado = false;
  function activar() {
    if (cargado) return; cargado = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { dataLayer.push(arguments); };
    gtag('js', new Date()); gtag('config', ID);
    var s = document.createElement('script');
    s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + ID;
    document.head.appendChild(s);
  }
  function borrar() {
    document.cookie.split(';').forEach(function (c) {
      var n = c.split('=')[0].trim();
      if (n.indexOf('_ga') === 0) {
        document.cookie = n + '=; Max-Age=0; path=/';
        document.cookie = n + '=; Max-Age=0; path=/; domain=.' + location.hostname.replace(/^www\./, '');
      }
    });
  }
  var aviso = document.getElementById('aviso-cookies');
  function responder(v) {
    var antes = leer();
    guardar(v); aviso.hidden = true;
    if (v === 'si') activar();
    else { borrar(); if (antes === 'si' && cargado) location.reload(); }
  }
  document.getElementById('cookies-si').addEventListener('click', function () { responder('si'); });
  document.getElementById('cookies-no').addEventListener('click', function () { responder('no'); });
  document.querySelectorAll('[data-cookies]').forEach(function (a) {
    a.addEventListener('click', function (e) { e.preventDefault(); aviso.hidden = false; document.getElementById('cookies-si').focus(); });
  });
  var v = leer();
  if (v === 'si') activar(); else if (v !== 'no') aviso.hidden = false;
})();
