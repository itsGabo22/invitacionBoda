import { useEffect, useId, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionTexture from './SectionTexture.jsx';

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

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion) {
      gsap.set(flapRef.current, { transformOrigin: '50% 100%', rotateX: -92, opacity: 0 });
      gsap.set(cardRef.current, { yPercent: 0 });
      // photo2 arranca con opacity-0 (clase estática en el JSX) porque normalmente solo
      // se revela en el último tramo de la línea de tiempo — sin este set explícito,
      // con motion reducida (que se salta toda la animación) se quedaría invisible para
      // siempre y solo se vería photo1 (la pareja), nunca la foto del bautizo de Aylin.
      gsap.set(photo1Ref.current, { opacity: 0 });
      gsap.set(photo2Ref.current, { opacity: 1 });
      return undefined;
    }

    const ctx = gsap.context(() => {
      // Estado inicial: la tarjeta empieza desplazada hacia arriba exactamente su propia
      // altura (yPercent: -100), de modo que su borde inferior quede justo en la línea de
      // la solapa (24% del stage) — completamente oculta, en parte por el overflow-hidden
      // del stage y en parte por la solapa (con fondo bone) que la tapa.
      gsap.set(flapRef.current, { transformOrigin: '50% 100%' });
      gsap.set(cardRef.current, { yPercent: -100 });

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

    return () => ctx.revert();
  }, []);

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
            src="/assets/flor-sobre.png"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-6 -left-8 z-0 h-28 w-28 -rotate-[4deg] object-contain sm:-bottom-8 sm:-left-10 sm:h-40 sm:w-40 md:-bottom-12 md:-left-16 md:h-56 md:w-56"
          />

          <div
            ref={envelopeRef}
            className="relative z-10 aspect-[4/5] w-full overflow-hidden"
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
              className="absolute left-[13%] top-[24%] z-10 w-[74%] aspect-[4/5] bg-bone p-2 shadow-[0_18px_30px_-20px_rgba(22,21,19,0.45)] ring-1 ring-ink/10 will-change-transform"
            >
              <div className="relative h-full w-full overflow-hidden">
                <img
                  ref={photo1Ref}
                  src="/assets/sobre-foto-01.png"
                  alt="Esteban y Natalia, retrato de pareja"
                  className="absolute inset-0 h-full w-full object-cover"
                  style={{ objectPosition: '50% 10%' }}
                />
                <img
                  ref={photo2Ref}
                  src="/assets/sobre-foto-02.png"
                  alt="El bautizo de Aylin Celeste"
                  className="absolute inset-0 h-full w-full object-cover opacity-0"
                  style={{ objectPosition: '50% 10%' }}
                />
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
          <p className="mt-1 font-accent text-4xl italic text-ink sm:text-5xl">Aylin Celeste</p>
          <p className="mt-3 font-display text-2xl font-extrabold leading-snug text-ink sm:text-3xl md:text-4xl">
            ¡Nos casamos y bautizamos a Aylin Celeste!
          </p>

          <span aria-hidden="true" className="mx-auto mt-8 block h-px w-16 bg-champagne" />

          <p className="mt-8 font-display text-xl font-semibold leading-relaxed text-ink/80 md:text-2xl">
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
