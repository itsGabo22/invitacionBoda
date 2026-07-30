import { useEffect, useId, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const NOISE_TEXTURE = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>'
)}`;

// Silueta del sobre: pentágono con punta superior, lados con leve ángulo y base plana.
const ENVELOPE_OUTLINE = '200,0 400,120 390,300 10,300 0,120';
const FOLD_RIGHT = 'M200,0 L400,120';
const FOLD_LEFT = 'M200,0 L0,120';
// Silueta de la solapa: el tercio superior del mismo pentágono, con bisagra en y=120.
const FLAP_OUTLINE = '200,0 400,120 0,120';
// Recorte de la fotografía: el mismo pentágono, con un margen interior que deja ver el marco.
// Aplicado directamente sobre cada <img> (no sobre un div contenedor) para que el
// recorte y las dimensiones de la imagen coincidan siempre con exactitud.
const PHOTO_CLIP_PATH = 'polygon(50% 4.5%, 93% 43%, 91.5% 95.5%, 8.5% 95.5%, 7% 43%)';

export default function IntroStory() {
  const clipId = useId().replace(/:/g, '');
  const sectionRef = useRef(null);
  const envelopeRef = useRef(null);
  const flapRef = useRef(null);
  const photo1Ref = useRef(null);
  const photo2Ref = useRef(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion) {
      gsap.set(flapRef.current, { rotateX: -172 });
      return undefined;
    }

    const ctx = gsap.context(() => {
      gsap.set(flapRef.current, { transformOrigin: '50% 100%' });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: envelopeRef.current,
          start: 'top 80%',
          end: 'top 20%',
          scrub: 0.6,
        },
      });

      tl.to(flapRef.current, { rotateX: -172, ease: 'power2.inOut', duration: 1 })
        .to(photo1Ref.current, { opacity: 0, ease: 'none', duration: 0.45 }, 0.8)
        .to(photo2Ref.current, { opacity: 1, ease: 'none', duration: 0.45 }, 0.8);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="historia"
      aria-label="Nos casamos"
      className="relative overflow-hidden bg-bone px-6 py-24"
    >
      {/* Textura de papel: grano fino */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.05] mix-blend-multiply"
        style={{ backgroundImage: `url("${NOISE_TEXTURE}")`, backgroundRepeat: 'repeat' }}
      />
      {/* Textura de papel: luz suave radial */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 [background:radial-gradient(60%_50%_at_50%_0%,rgba(140,132,120,0.10),transparent_70%),radial-gradient(55%_45%_at_50%_100%,rgba(140,132,120,0.08),transparent_70%)]"
      />

      <div className="relative z-10">
        {/* Sobre editorial */}
        <div className="relative mx-auto w-full max-w-md">
          {/* Calas de línea: elemento decorativo focal, asoma tras la esquina del sobre */}
          <svg
            aria-hidden="true"
            viewBox="0 -30 140 250"
            fill="none"
            className="pointer-events-none absolute -bottom-8 -left-6 z-0 h-36 w-[5.75rem] -rotate-[6deg] sm:-bottom-10 sm:-left-9 sm:h-48 sm:w-32 md:-bottom-16 md:-left-20 md:h-80 md:w-52"
          >
            <g stroke="currentColor" className="text-sage" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              {/* hojas cruzadas en la base */}
              <path d="M92,214 C112,198 124,172 120,142 C116,166 100,192 80,206 Z" />
              <path d="M30,214 C10,200 -2,174 4,145 C6,168 20,192 42,206 Z" />
              {/* tallo principal */}
              <path d="M90,216 C86,175 92,130 80,90 C76,75 76,68 78,60" />
              {/* tallo secundario */}
              <path d="M40,218 C38,190 42,160 36,138 C34,128 36,123 38,118" />
            </g>
            {/* cala grande: capullo acampanado con el espádice asomando */}
            <g transform="translate(78,60)">
              <path
                d="M0,0 C-16,-7 -24,-24 -16,-41 C-10,-54 3,-60 12,-53 C22,-45 19,-25 5,-9 C3,-6 1,-2 0,0 Z"
                stroke="currentColor"
                className="text-sage"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M-3,-33 C-6,-44 -3,-55 4,-65 C7,-69 5,-74 0,-76"
                stroke="currentColor"
                className="text-champagne"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </g>
            {/* cala pequeña, en segundo plano */}
            <g transform="translate(38,118) scale(0.68)">
              <path
                d="M0,0 C-16,-7 -24,-24 -16,-41 C-10,-54 3,-60 12,-53 C22,-45 19,-25 5,-9 C3,-6 1,-2 0,0 Z"
                stroke="currentColor"
                className="text-sage"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M-3,-33 C-6,-44 -3,-55 4,-65 C7,-69 5,-74 0,-76"
                stroke="currentColor"
                className="text-champagne"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </g>
          </svg>

          <div
            ref={envelopeRef}
            className="relative z-10 aspect-[4/3] w-full"
            style={{ perspective: '1400px' }}
          >
            {/* Silueta del sobre (queda como marco, detrás de la fotografía) */}
            <svg
              aria-hidden="true"
              viewBox="0 0 400 300"
              className="absolute inset-0 z-0 h-full w-full"
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

            {/* Fotografía: el clip-path va en cada <img>, con las mismas dimensiones que el
                contenedor del sobre (absolute inset-0 sobre la caja aspect-[4/3]), para que el
                recorte coincida exactamente con la silueta. Se apila por debajo de la solapa
                (z-10 < z-20) para que la solapa cerrada la cubra por completo. */}
            <div className="absolute inset-0 z-10">
              <img
                ref={photo1Ref}
                src="/assets/sobre-foto-01.png"
                alt="Esteban y Natalia, retrato de pareja"
                className="absolute inset-0 h-full w-full object-cover"
                style={{ clipPath: PHOTO_CLIP_PATH, objectPosition: '50% 10%' }}
              />
              <img
                ref={photo2Ref}
                src="/assets/sobre-foto-02.png"
                alt="Esteban y Natalia, segundo retrato de pareja"
                className="absolute inset-0 h-full w-full object-cover opacity-0"
                style={{ clipPath: PHOTO_CLIP_PATH, objectPosition: '50% 10%' }}
              />
            </div>

            {/* Solapa: se abre en 3D sobre la bisagra inferior, revelando la fotografía */}
            <div
              ref={flapRef}
              className="absolute inset-x-0 top-0 z-20 will-change-transform"
              style={{ height: '40%', transformOrigin: '50% 100%' }}
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
          <p className="mt-2 font-display text-3xl font-bold text-ink sm:text-4xl md:text-5xl">
            ¡Nos casamos!
          </p>

          <span aria-hidden="true" className="mx-auto mt-8 block h-px w-16 bg-champagne" />

          <p className="mt-8 font-display text-xl leading-relaxed text-ink/80 md:text-2xl">
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
