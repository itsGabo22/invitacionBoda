import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { observeRevealFailsafe } from './revealFailsafe.js';

gsap.registerPlugin(ScrollTrigger);

const FADE_UP_SELECTOR = '[data-animate="fade-up"]';
const STAGGER_ITEM_SELECTOR = '[data-stagger-item]';

// Fuerza un elemento a su estado final visible directamente (sin pasar por GSAP),
// para la red de seguridad de más abajo.
function forceVisible(el) {
  const opacity = Number(getComputedStyle(el).opacity);
  if (opacity < 0.95) {
    el.style.opacity = '1';
    el.style.transform = 'none';
  }
}

// Orquesta las animaciones de scroll compartidas entre secciones (parallax,
// entradas con fade + rise, y stagger de tarjetas/eventos). El sobre de
// IntroStory gestiona su propia animación por separado y no se toca aquí.
export default function useWeddingAnimations(scopeRef) {
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Por defecto (marcado/CSS, sin JS) todo lo marcado con data-animate/data-stagger-item
    // ya es visible — ninguno tiene una clase opacity-0 horneada en el JSX. Lo de abajo
    // solo AGREGA el "empieza oculto, se revela con el scroll" vía gsap.from(), nunca al
    // revés, y va envuelto en try/catch: si gsap/ScrollTrigger truena al armar esto (móvil
    // raro, error de carga, lo que sea), no queda nada oculto porque nunca llegamos a
    // ocultarlo — el contenido por defecto ya es visible. Con motion reducida, ni
    // siquiera se intenta: se sale antes de tocar nada.
    let ctx = null;
    if (!reduceMotion) {
      try {
        ctx = gsap.context(() => {
          // Parallax: capas de fondo/foto posicionadas en absoluto, vía translateY (yPercent).
          gsap.utils.toArray('[data-parallax]').forEach((layer) => {
            const trigger = layer.closest('section') ?? layer;
            const amount = Number(layer.dataset.parallax) || 12;

            gsap.to(layer, {
              yPercent: amount,
              ease: 'none',
              scrollTrigger: {
                trigger,
                start: 'top top',
                end: 'bottom top',
                scrub: true,
              },
            });
          });

          // Entradas simples: fade + leve elevación, una vez por sección.
          gsap.utils.toArray(FADE_UP_SELECTOR).forEach((el) => {
            gsap.from(el, {
              opacity: 0,
              y: 28,
              duration: 0.9,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                toggleActions: 'play none none reverse',
              },
            });
          });

          // Stagger: grupos de tarjetas/eventos (historia, itinerario) entrando en cascada.
          gsap.utils.toArray('[data-stagger-group]').forEach((group) => {
            const items = group.querySelectorAll(STAGGER_ITEM_SELECTOR);
            if (!items.length) return;

            gsap.from(items, {
              opacity: 0,
              y: 20,
              duration: 0.7,
              stagger: 0.2,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: group,
                start: 'top 80%',
                toggleActions: 'play none none reverse',
              },
            });
          });
        }, scopeRef);
      } catch {
        ctx = null;
      }
    }

    // Red de seguridad por elemento: gsap.from() arriba oculta cada elemento de
    // inmediato (si no está ya a la vista) apostando a que el scrollTrigger lo revele
    // más tarde. Si eso nunca llega a pasar (rAF/ticker en pausa, lo que sea) después de
    // que el elemento lleva un buen rato dentro del viewport, esto lo fuerza visible
    // directamente, sin pasar por GSAP en absoluto (ver revealFailsafe.js).
    const scope = scopeRef.current;
    const failsafeCleanups = scope
      ? gsap.utils
          .toArray(`${FADE_UP_SELECTOR}, ${STAGGER_ITEM_SELECTOR}`, scope)
          .map((el) => observeRevealFailsafe(el, () => forceVisible(el)))
      : [];

    return () => {
      ctx?.revert();
      failsafeCleanups.forEach((cleanup) => cleanup());
    };
  }, [scopeRef]);
}
