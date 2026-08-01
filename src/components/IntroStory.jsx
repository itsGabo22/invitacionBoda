import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionTexture from './SectionTexture.jsx';
import useRevealFailsafe from '../hooks/useRevealFailsafe.js';

gsap.registerPlugin(ScrollTrigger);

// Silueta del sobre: pentágono con punta superior, lados con leve ángulo y base plana.
// Puramente decorativa: ya no enmascara ni contiene la fotografía.
const ENVELOPE_OUTLINE = '200,0 400,120 390,300 10,300 0,120';
const FOLD_RIGHT = 'M200,0 L400,120';
const FOLD_LEFT = 'M200,0 L0,120';
// Silueta de la solapa: el tercio superior del mismo pentágono, con bisagra en y=120.
const FLAP_OUTLINE = '200,0 400,120 0,120';

export default function IntroStory() {
  const clipId = useId().replace(/:/g, '');
  const sectionRef = useRef(null);
  const envelopeRef = useRef(null);
  const flapRef = useRef(null);
  const cardRef = useRef(null);
  const photo1Ref = useRef(null);
  const photo2Ref = useRef(null);
  // Se lee una sola vez al montar (igual que en el resto del sitio): con motion
  // reducida, el card de abajo renderiza ambas fotos apiladas y estáticas en vez
  // del par que se cruza con la animación, así que ninguna de las dos se pierde.
  const [reduceMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  // Estado final "de verdad" del anuncio (sobre abierto, tarjeta afuera): lo usan
  // tanto la rama de motion reducida como la red de seguridad de más abajo. Con
  // motion reducida photo1Ref/photo2Ref no existen (el JSX renderiza otra cosa),
  // de ahí los guards — gsap.set(null, ...) generaría una advertencia en consola.
  const applyFinalState = useCallback(() => {
    gsap.set(flapRef.current, { transformOrigin: '50% 100%', rotateX: -92, opacity: 0 });
    gsap.set(cardRef.current, { yPercent: 0 });
    if (photo1Ref.current) gsap.set(photo1Ref.current, { opacity: 0 });
    if (photo2Ref.current) gsap.set(photo2Ref.current, { opacity: 1 });
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      applyFinalState();
      return undefined;
    }

    // Por defecto (marcado/CSS, sin tocar nada de JS) photo1 y photo2 son ambas
    // visibles — photo2 va después en el DOM, así que sin animación se ve ELLA
    // directamente (el estado final), no un hueco en blanco. Todo lo de acá abajo
    // solo AGREGA el "empieza oculta, se revela con el scroll" — nunca al revés — y
    // va envuelto en try/catch: si gsap/ScrollTrigger truena al armar esto por lo
    // que sea (móvil raro, error de carga, lo que sea), no queda nada oculto porque
    // nunca llegamos a ocultarlo; el contenido por defecto ya es visible.
    let ctx;
    try {
      ctx = gsap.context(() => {
        // Estado inicial: la tarjeta empieza desplazada hacia arriba exactamente su propia
        // altura (yPercent: -100), de modo que su borde inferior quede justo en la línea de
        // la solapa (24% del stage) — completamente oculta, en parte por el overflow-hidden
        // del stage y en parte por la solapa (con fondo bone) que la tapa. photo2 se oculta
        // aquí también, SOLO ahora que el resto de esta configuración (el timeline con su
        // scrollTrigger) se armó sin tronar.
        gsap.set(flapRef.current, { transformOrigin: '50% 100%' });
        gsap.set(cardRef.current, { yPercent: -100 });
        gsap.set(photo2Ref.current, { opacity: 0 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: envelopeRef.current,
            start: 'top 80%',
            end: 'top 20%',
            scrub: 0.6,
          },
        });

        // Secuencia: el sobre se abre primero; la tarjeta empieza a salir a medio abrir
        // (no espera a que la solapa termine) y sigue deslizándose después de que la
        // solapa se detiene, para que se lea "se abre, luego sale la tarjeta" en vez de
        // dos animaciones simultáneas y caóticas.
        // Nota: -172° (casi una vuelta completa) tenía sentido cuando la solapa solo tapaba
        // una foto estática de su mismo tamaño — pero con la tarjeta deslizándose, pasar de
        // -90° hace que la solapa "regrese" proyectada hacia abajo y se monte sobre la
        // tarjeta. Se detiene apenas pasada la perpendicular (-92°, silueta mínima) y además
        // se desvanece: como la tarjeta sigue deslizándose un rato después de que la solapa
        // termina de girar, incluso una silueta residual mínima podría cruzar la foto
        // mientras tanto — el fade a opacity:0 lo evita del todo, sin depender de que la
        // geometría 3D caiga en un ángulo exacto.
        tl.to(flapRef.current, { rotateX: -92, ease: 'power2.inOut', duration: 0.7 })
          .to(flapRef.current, { opacity: 0, ease: 'power1.in', duration: 0.25 }, 0.5)
          .to(cardRef.current, { yPercent: 0, ease: 'power2.inOut', duration: 0.9 }, 0.45)
          .to(photo1Ref.current, { opacity: 0, ease: 'none', duration: 0.35 }, 1.35)
          .to(photo2Ref.current, { opacity: 1, ease: 'none', duration: 0.35 }, 1.35);
      }, sectionRef);
    } catch {
      ctx = null;
    }

    return () => ctx?.revert();
  }, [reduceMotion, applyFinalState]);

  // Red de seguridad: el timeline de arriba es un scrub ligado al scroll — si por lo
  // que sea (rAF/ticker en pausa por ahorro de batería, scroll que deja de disparar
  // eventos, cualquier causa) se queda a medio camino después de que la sección lleva
  // un buen rato a la vista, esto fuerza el estado final directamente, sin pasar por
  // el ticker de GSAP en absoluto (ver revealFailsafe.js). No aplica con motion
  // reducida: ahí nunca se oculta nada, no hay nada que forzar.
  const forceIntroReveal = useCallback(() => {
    if (reduceMotion) return;
    const flapOpacity = Number(getComputedStyle(flapRef.current).opacity);
    const photo2Opacity = Number(getComputedStyle(photo2Ref.current).opacity);
    if (flapOpacity > 0.05 || photo2Opacity < 0.95) {
      applyFinalState();
    }
  }, [reduceMotion, applyFinalState]);

  useRevealFailsafe(sectionRef, forceIntroReveal);

  return (
    <section
      ref={sectionRef}
      id="historia"
      aria-label="Nos casamos"
      className="relative overflow-hidden bg-bone px-6 py-16 sm:py-20"
    >
      <SectionTexture />

      <div className="relative z-10">
        {/* Sobre editorial */}
        <div className="relative mx-auto w-full max-w-md">
          {/* Flor: elemento decorativo focal, asoma tras la esquina del sobre */}
          <img
            src="/assets/flor-sobre.webp"
            alt=""
            aria-hidden="true"
            loading="lazy"
            className="pointer-events-none absolute -bottom-6 -left-8 z-0 h-28 w-28 -rotate-[4deg] object-contain sm:-bottom-8 sm:-left-10 sm:h-40 sm:w-40 md:-bottom-12 md:-left-16 md:h-56 md:w-56"
          />

          <div
            ref={envelopeRef}
            // Con motion reducida el stage deja de tener alto fijo (aspect-[4/5]) y de
            // recortar overflow: la tarjeta de abajo ya no es un rectángulo con crop
            // fijo, sino dos fotos apiladas a su alto natural, así que este contenedor
            // necesita poder crecer para no recortarlas.
            className={`relative z-10 w-full ${reduceMotion ? '' : 'aspect-[4/5] overflow-hidden'}`}
            style={{ perspective: '1400px' }}
          >
            {/* Silueta del sobre: cuerpo + solapa, 100% decorativa. Ya no contiene ni
                enmascara la fotografía — solo se dibuja como fondo, anclada arriba con
                la misma proporción 4:3 que tenía el sobre completo antes. */}
            <div className="absolute inset-x-0 top-0 z-0 aspect-[4/3] w-full">
              <svg
                aria-hidden="true"
                viewBox="0 0 400 300"
                className="absolute inset-0 h-full w-full"
                style={{ filter: 'drop-shadow(0 24px 28px rgba(22,21,19,0.35))' }}
              >
                <defs>
                  <linearGradient id={`sheen-${clipId}`} x1="0" y1="0" x2="1" y2="0.3">
                    <stop offset="0%" stopColor="#100f0d" />
                    <stop offset="50%" stopColor="#221e18" />
                    <stop offset="100%" stopColor="#100f0d" />
                  </linearGradient>
                </defs>
                <polygon points={ENVELOPE_OUTLINE} fill={`url(#sheen-${clipId})`} />
                <path d={FOLD_RIGHT} stroke="#C9AD7F" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6" />
                <path d={FOLD_LEFT} stroke="#C9AD7F" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6" />
              </svg>
            </div>

            {/* Tarjeta de fotografía: rectángulo simple, sin clip-path. Vive detrás de la
                solapa (z-10 < z-20) y se desliza hacia abajo al hacer scroll, como si se
                sacara del sobre. Su reposo (top 24%) coincide exactamente con la bisagra
                de la solapa, así que yPercent:-100 la esconde del todo por encima de ella. */}
            <div
              ref={cardRef}
              // Con motion reducida la tarjeta deja de ser un rectángulo de alto fijo
              // (aspect-[4/5]) posicionado en absoluto sobre el stage — pasa a fluir
              // normalmente (relative + margin-top) para que su alto real (dos fotos a
              // su proporción natural) empuje el alto del stage en vez de desbordarlo.
              className={`z-10 w-[74%] bg-bone p-2 shadow-[0_18px_30px_-20px_rgba(22,21,19,0.45)] ring-1 ring-ink/10 will-change-transform ${
                reduceMotion ? 'relative mx-auto mt-[15%]' : 'absolute left-[13%] top-[24%] aspect-[4/5]'
              }`}
            >
              <div className={`relative w-full ${reduceMotion ? '' : 'h-full overflow-hidden'}`}>
                {reduceMotion ? (
                  // Motion reducida: nunca se anima un crossfade, así que en vez de
                  // asentarse en una sola foto se muestran las dos apiladas — el par
                  // completo (pareja + bautizo), cada una a su proporción natural
                  // (object-contain, alto automático) para no recortar ninguna.
                  <div className="flex w-full flex-col">
                    <img
                      src="/assets/sobre-foto-01.webp"
                      alt="Esteban y Natalia, retrato de pareja"
                      loading="lazy"
                      className="h-auto w-full object-contain"
                    />
                    <span aria-hidden="true" className="h-px w-full bg-champagne/60" />
                    <img
                      src="/assets/sobre-foto-02.webp"
                      alt="El bautizo de Celeste"
                      loading="lazy"
                      className="h-auto w-full object-contain"
                    />
                  </div>
                ) : (
                  <>
                    <img
                      ref={photo1Ref}
                      src="/assets/sobre-foto-01.webp"
                      alt="Esteban y Natalia, retrato de pareja"
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover"
                      style={{ objectPosition: '50% 10%' }}
                    />
                    <img
                      ref={photo2Ref}
                      src="/assets/sobre-foto-02.webp"
                      alt="El bautizo de Celeste"
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover"
                      style={{ objectPosition: '50% 10%' }}
                    />
                  </>
                )}
                <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-bone/20" />
              </div>
            </div>

            {/* Solapa: se abre en 3D sobre la bisagra inferior. Puramente decorativa — ya no
                contiene ni oculta la tarjeta por sí misma durante la animación (eso lo
                resuelve el overflow-hidden del stage); su fondo bone (detrás del triángulo)
                cubre todo el rectángulo del viewBox, no solo el triángulo dibujado, para
                que oculte por completo la tarjeta mientras está cerrada — sin depender del
                ancho de la tarjeta ni de un clip-path. */}
            <div
              ref={flapRef}
              className="absolute inset-x-0 top-0 z-20 bg-bone will-change-transform"
              style={{ height: '24%' }}
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 400 120"
                preserveAspectRatio="none"
                className="h-full w-full overflow-visible"
              >
                <defs>
                  <linearGradient id={`flap-sheen-${clipId}`} x1="0" y1="0" x2="1" y2="0.3">
                    <stop offset="0%" stopColor="#100f0d" />
                    <stop offset="50%" stopColor="#221e18" />
                    <stop offset="100%" stopColor="#100f0d" />
                  </linearGradient>
                </defs>
                <polygon points={FLAP_OUTLINE} fill={`url(#flap-sheen-${clipId})`} />
                <path d={FOLD_RIGHT} stroke="#C9AD7F" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6" />
                <path d={FOLD_LEFT} stroke="#C9AD7F" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6" />
              </svg>
            </div>
          </div>
        </div>

        {/* Anuncio */}
        <div className="mx-auto mt-16 max-w-2xl text-center sm:mt-20">
          <p className="font-accent text-4xl italic text-ink sm:text-5xl">Esteban &amp; Natalia</p>
          <p className="mt-3 font-goudy text-2xl font-normal leading-snug text-ink sm:text-3xl md:text-4xl">
            ¡Acompáñanos a celebrar nuestro matrimonio y el bautizo de nuestra hija!
          </p>
          <p className="mt-4 font-accent text-4xl italic text-ink sm:text-5xl">Celeste</p>

          <span aria-hidden="true" className="mx-auto mt-8 block h-px w-16 bg-champagne" />

          <p className="mt-8 font-goudy text-xl font-normal leading-relaxed text-ink/80 md:text-2xl">
            Dos corazones que se eligen para siempre,
            <br />
            una hija que ilumina nuestras vidas
            <br />
            y la bendición de Dios acompañando cada paso de nuestra historia.
          </p>
        </div>
      </div>
    </section>
  );
}
