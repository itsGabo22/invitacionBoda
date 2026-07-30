import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Orquesta las animaciones de scroll compartidas entre secciones (parallax,
// entradas con fade + rise, y stagger de tarjetas/eventos). El sobre de
// IntroStory gestiona su propia animación por separado y no se toca aquí.
export default function useWeddingAnimations(scopeRef) {
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return undefined;

    const ctx = gsap.context(() => {
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
      gsap.utils.toArray('[data-animate="fade-up"]').forEach((el) => {
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
        const items = group.querySelectorAll('[data-stagger-item]');
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

    return () => ctx.revert();
  }, [scopeRef]);
}
