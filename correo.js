(function () {
  var c = [112, 114, 102, 49, 111, 108, 100, 112, 106, 67, 115, 108, 107, 118, 117, 114, 119, 102, 104, 117, 108, 103, 100, 101, 100, 120, 103], t = '';
  for (var i = c.length - 1; i >= 0; i--) t += String.fromCharCode(c[i] - 3);
  document.querySelectorAll('a.correo').forEach(function (a) {
    a.textContent = t;
    a.addEventListener('click', function (e) { e.preventDefault(); location.href = 'mai' + 'lto:' + t; });
  });
})();
