// IAparaTodos — script.js
document.addEventListener('DOMContentLoaded', function () {
  // Año automático en el pie de página
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  // Botón "Copiar" en cada bloque de prompt
  document.querySelectorAll('.prompt-box').forEach(function (box) {
    var btn = document.createElement('button');
    btn.className = 'copy-btn';
    btn.type = 'button';
    btn.textContent = 'Copiar';
    btn.addEventListener('click', function () {
      var text = box.textContent.replace('Copiar', '').replace('¡Copiado!', '').trim();
      navigator.clipboard.writeText(text).then(function () {
        btn.textContent = '¡Copiado!';
        setTimeout(function () { btn.textContent = 'Copiar'; }, 1500);
      });
    });
    box.appendChild(btn);
  });

  // Desplazamiento suave para enlaces internos
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
      }
    });
  });
});