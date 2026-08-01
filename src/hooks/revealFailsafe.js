// Red de seguridad independiente de GSAP para el patrón "oculto hasta que el scroll
// lo revela". Deliberadamente NO usa requestAnimationFrame, el ticker de GSAP, NI
// IntersectionObserver — solo setTimeout + una lectura síncrona de
// getBoundingClientRect(). Se probó en este mismo proyecto que, en una pestaña sin
// foco real del SO, tanto rAF como IntersectionObserver pueden dejar de disparar
// callbacks por completo (0 disparos en varios segundos), mientras que setTimeout
// sigue llegando con normalidad. Si la causa real en el dispositivo Android reportado
// es algo similar (ahorro de batería del sistema, lo que sea), un plan B que dependa
// de CUALQUIERA de esos dos APIs correría el mismo riesgo que el bug que intenta
// resolver — por eso el sondeo aquí es deliberadamente "tosco" (poll con setTimeout)
// en vez de "elegante" (observers).
//
// No sustituye a GSAP: si la animación ya reveló el contenido a tiempo, forceReveal
// simplemente no debería tener nada que hacer (cada componente decide qué revisar
// antes de forzar). Es un plan B, no el mecanismo principal.
function isInViewport(el) {
  const rect = el.getBoundingClientRect();
  return rect.bottom > 0 && rect.top < window.innerHeight && rect.right > 0 && rect.left < window.innerWidth;
}

export function observeRevealFailsafe(el, forceReveal, delay = 2200, pollInterval = 500) {
  if (!el) return () => {};

  let stopped = false;
  let visibleSince = null;
  let timerId = null;

  const tick = () => {
    if (stopped) return;

    if (isInViewport(el)) {
      if (visibleSince === null) visibleSince = performance.now();

      if (performance.now() - visibleSince >= delay) {
        forceReveal();
        return;
      }
    } else {
      visibleSince = null;
    }

    timerId = setTimeout(tick, pollInterval);
  };

  timerId = setTimeout(tick, pollInterval);

  return () => {
    stopped = true;
    clearTimeout(timerId);
  };
}
