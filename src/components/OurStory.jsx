import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import SectionTexture from './SectionTexture.jsx';
import useRevealFailsafe from '../hooks/useRevealFailsafe.js';

// Cinco momentos, en orden cronológico. Las fotos reales se colocan en
// /public/assets/historia-01.webp … historia-05.webp; los textos son
// placeholders editoriales a afinar más adelante.
const MOMENTS = [
  {
    src: '/assets/historia-01.webp',
    alt: 'Esteban y Natalia en una noche especial juntos',
    caption: 'El comienzo',
  },
  {
    src: '/assets/historia-02.webp',
    alt: 'Retratos individuales de Esteban y de Natalia',
    caption: 'Caminos que se encontraron',
  },
  {
    src: '/assets/historia-03.webp',
    alt: 'Natalia en la dulce espera de Celeste',
    caption: 'Esperándote',
  },
  {
    src: '/assets/historia-04.webp',
    alt: 'El bautizo de Celeste',
    caption: 'Nuestra bendición',
  },
  {
    src: '/assets/historia-05.webp',
    alt: 'Esteban, Natalia y Celeste, la familia completa',
    caption: 'Nuestra familia',
  },
];

export default function OurStory() {
  const sectionRef = useRef(null);
  const stripRef = useRef(null);
  const firstCardRef = useRef(null);
  const referenceCardRef = useRef(null);
  const photoARef = useRef(null);
  const photoBRef = useRef(null);
  // Se lee una sola vez al montar (igual que en el resto del sitio): con motion
  // reducida, la primera tarjeta renderiza ambas fotos lado a lado y estáticas en
  // vez del par que se cruza con el scroll de la tira, así que ninguna se pierde.
  const [reduceMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  // Con motion reducida la primera tarjeta se ensancha (dos fotos lado a lado en
  // vez de una sola aspect-[3/4]) pero debe conservar el mismo alto que las otras
  // 4 para no romper el ritmo de la tira. En vez de intentar adivinar ese alto con
  // un aspect-ratio distinto por breakpoint, se mide el alto YA renderizado de una
  // tarjeta normal (referenceCardRef, la segunda) y se aplica tal cual — exacto en
  // cualquier ancho de viewport, no solo en los breakpoints previstos.
  //
  // El ancho de cada foto (y por lo tanto el de la tarjeta, w-fit) NO puede
  // dejarse en manos de w-auto + h-full (%) + object-contain, ni tampoco basta con
  // fijar el ancho de cada <img> en px y confiar en que w-fit del contenedor sume
  // ese resultado: en la práctica (probado con dos iframes, uno a 380px y otro a
  // 1200px) el w-fit de la tarjeta — que a su vez es un ítem flex de la tira, con
  // flex-basis resuelto vía una pasada de cálculo de contenido "de máxima
  // preferencia" — terminaba usando un ancho bastante menor que la suma real de
  // las fotos ya redimensionadas, y estas se desbordaban por encima de la tarjeta
  // siguiente aunque el gap entre las CAJAS ya midiera bien los mismos 40px que
  // entre el resto. Por eso el ancho final (alto compartido × ratio de cada foto,
  // más 1px del separador) se calcula en JS y se fija con estilo inline tanto en
  // la tarjeta como en su figure — nunca dependiendo de que fit-content lo infiera
  // correctamente a partir de contenido que cambia después del primer layout.
  useLayoutEffect(() => {
    if (!reduceMotion) return undefined;
    const firstCard = firstCardRef.current;
    const referenceCard = referenceCardRef.current;
    const figure = firstCard?.parentElement;
    if (!firstCard || !referenceCard || !figure) return undefined;

    const DIVIDER_WIDTH = 1;
    const images = Array.from(firstCard.querySelectorAll('img'));

    const sync = () => {
      const height = referenceCard.offsetHeight;
      firstCard.style.height = `${height}px`;

      if (!images.every((img) => img.naturalWidth > 0 && img.naturalHeight > 0)) return;

      let totalWidth = DIVIDER_WIDTH;
      images.forEach((img) => {
        const width = (height * img.naturalWidth) / img.naturalHeight;
        img.style.width = `${width}px`;
        totalWidth += width;
      });
      firstCard.style.width = `${totalWidth}px`;
      figure.style.width = `${totalWidth}px`;
    };
    sync();

    // Si alguna foto todavía no había cargado al momento de sync(), su ancho
    // natural no estaba disponible todavía — se recalcula en cuanto termine de
    // cargar, sin esperar a un resize para corregirlo.
    const pendingImages = images.filter((img) => !(img.naturalWidth > 0));
    const loadListeners = pendingImages.map((img) => {
      const onLoad = () => sync();
      img.addEventListener('load', onLoad);
      return [img, onLoad];
    });

    const resizeObserver = new ResizeObserver(sync);
    resizeObserver.observe(referenceCard);

    return () => {
      resizeObserver.disconnect();
      loadListeners.forEach(([img, onLoad]) => img.removeEventListener('load', onLoad));
    };
  }, [reduceMotion]);

  // useLayoutEffect (no useEffect): el listener de scroll queda enganchado ANTES
  // del primer paint, no después — reduce la ventana en la que un scroll real de
  // la tira (p. ej. una corrección de snap del navegador) pudiera ocurrir antes de
  // que este efecto llegue a atarlo.
  useLayoutEffect(() => {
    if (reduceMotion) {
      // Con motion reducida el JSX de más abajo ya renderiza ambas fotos apiladas
      // en vez del par superpuesto photoA/photoB — no hay nada que fijar aquí.
      return undefined;
    }

    const strip = stripRef.current;
    const firstCard = firstCardRef.current;
    if (!strip || !firstCard) return undefined;

    // Transición de la primera tarjeta: la segunda foto (bebé) se desvanece encima de
    // la primera, que queda estática debajo. Antes este crossfade estaba ligado al
    // scroll VERTICAL de la página, así que podía completarse antes de que la persona
    // hubiera deslizado la tira horizontal lo suficiente para ver bien la tarjeta —
    // ahora el progreso se calcula a partir del scrollLeft de la propia tira: avanza
    // exactamente en el tramo que toma deslizar de la primera tarjeta a la segunda, así
    // que solo cambia cuando de verdad se desliza el carrusel, no al bajar la página.
    //
    // El umbral es solo un CUARTO del ancho de la tarjeta. Ya se probó con la mitad
    // (0.5) y en un swipe real (no un scroll lento y deliberado) seguía sintiéndose
    // tarde: a velocidad normal el gesto entero pasa por el umbral en un instante y
    // sigue de largo, así que hay que dejar el umbral bien dentro del recorrido de la
    // tarjeta 1 para que la foto del bebé (niño) quede completamente visible mientras
    // la tarjeta 1 todavía ocupa casi toda la pantalla — no a medio camino hacia la 2.
    //
    // photoB NO se oculta aquí de entrada. Por defecto (className, sin clase de
    // opacity-0) ya es visible — va después de photoA en el DOM, así que sin JS se ve
    // ELLA directamente. Solo se oculta la PRIMERA VEZ que de verdad llega un evento de
    // scroll real de la tira: eso confirma que el mecanismo está vivo antes de
    // apostarle nada a que siga estándolo. Si el listener de scroll nunca llega a
    // disparar (el mismo tipo de bug reportado), photoB se queda en su estado visible
    // por defecto en vez de congelada en opacity:0 para siempre.
    let threshold = 1;
    // En pantallas anchas la tira puede quedar centrada y (casi) sin overflow —
    // a veces sobra apenas un puñado de píxeles, imperceptible con mouse (no hay
    // scrollbar visible). Exigir deslizar al menos un octavo del ancho de tarjeta para
    // considerarla "deslizable" evita que quede congelada en la primera foto para
    // siempre en esos casos; con overflow real (el carrusel táctil) sí se activa.
    let isScrollable = true;

    const measure = () => {
      threshold = Math.max(firstCard.offsetWidth * 0.25, 1);
      isScrollable = strip.scrollWidth - strip.clientWidth >= threshold * 0.5;
    };

    const updateFade = () => {
      const progress = isScrollable ? gsap.utils.clamp(0, 1, strip.scrollLeft / threshold) : 1;
      gsap.set(photoBRef.current, { opacity: progress });
    };

    measure();

    // Corrige de una sola vez, de forma síncrona y ANTES del primer paint, si la
    // tira ya llegó con scrollLeft distinto de 0 (restauración de scroll del
    // navegador, corrección de snap, lo que sea) — sin esto, photoB se queda en
    // su opacidad visible por defecto hasta que el listener de más abajo alcance
    // a dispararse, y entonces "corrige" de un salto en vez de haber arrancado ya
    // en el valor correcto: ese hueco es el flash reportado. Solo corrige cuando
    // hay evidencia real (scrollLeft > 0) — con scrollLeft en 0 (el caso normal)
    // esto no hace nada, photoB sigue en su default visible como debe ser mientras
    // el scroll no demuestre estar vivo.
    if (strip.scrollLeft > 0) {
      strip.dataset.scrollProven = 'true';
      updateFade();
    }

    const resizeObserver = new ResizeObserver(() => {
      measure();
      // Solo re-aplica el fade tras un resize si el carrusel ya demostró estar vivo
      // (ver onScroll) — antes de eso no hay nada que recalcular, photoB sigue en su
      // valor visible por defecto.
      if (strip.dataset.scrollProven) updateFade();
    });
    resizeObserver.observe(strip);

    const onScroll = () => {
      strip.dataset.scrollProven = 'true';
      updateFade();
    };
    strip.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      resizeObserver.disconnect();
      strip.removeEventListener('scroll', onScroll);
      delete strip.dataset.scrollProven;
    };
  }, [reduceMotion]);

  // Red de seguridad: si el carrusel nunca demuestra estar vivo (el listener de
  // scroll arriba nunca dispara — batería/rAF/lo que sea) pero la sección lleva un
  // buen rato a la vista, fuerza photoB a visible directamente. No debería activarse
  // en un dispositivo sano, donde el usuario ya desliza la tira mucho antes. No
  // aplica con motion reducida: ahí photoBRef ni siquiera se monta (ver JSX).
  const forcePhotoBReveal = useCallback(() => {
    if (!photoBRef.current) return;
    const opacity = Number(getComputedStyle(photoBRef.current).opacity);
    if (opacity < 0.95) {
      gsap.set(photoBRef.current, { opacity: 1 });
    }
  }, []);

  useRevealFailsafe(sectionRef, forcePhotoBReveal);

  return (
    <section
      ref={sectionRef}
      id="nuestra-historia"
      aria-label="Nuestra historia"
      className="relative overflow-hidden bg-bone py-16 sm:py-20"
    >
      <SectionTexture />

      {/* Flor: acento de esquina, marca el inicio de la sección sin invadir el encabezado */}
      <img
        src="/assets/flor-historia.webp"
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="pointer-events-none absolute -top-4 left-0 z-0 w-40 object-contain opacity-90 sm:w-56 md:w-72"
      />
      {/* Misma flor, reflejada, como acento simétrico en la esquina opuesta */}
      <img
        src="/assets/flor-historia.webp"
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="pointer-events-none absolute -top-4 right-0 z-0 w-40 object-contain opacity-90 [transform:scaleX(-1)] sm:w-56 md:w-72"
      />

      <div className="relative z-10">
        {/* Encabezado */}
        <div className="mx-auto max-w-2xl px-6 text-center">
          <p className="font-utility text-[11px] font-medium uppercase tracking-[0.35em] text-stone">
            Nuestra historia
          </p>
          <p className="mt-4 font-display text-3xl font-extrabold text-ink sm:text-4xl md:text-5xl">
            ¡Momentos que nos trajeron aquí!
          </p>
          <span aria-hidden="true" className="mx-auto mt-8 block h-px w-16 bg-champagne" />
        </div>

        {/* Cenefa superior tipo tira de negativos */}
        <div
          aria-hidden="true"
          className="mx-auto mt-16 h-px max-w-6xl bg-[repeating-linear-gradient(90deg,rgba(140,132,120,0.35)_0,rgba(140,132,120,0.35)_6px,transparent_6px,transparent_16px)]"
        />

        {/* Tira cronológica horizontal */}
        <div
          ref={stripRef}
          data-stagger-group
          // items-start: por defecto un flex row estira todos los items a la altura
          // del más alto — con motion reducida la primera tarjeta puede crecer más
          // que las demás (dos fotos a su alto natural en vez de un aspect-[3/4]
          // fijo) y sin esto arrastraría a las otras 4 a estirarse con ella.
          //
          // Sin gap-*: la separación entre tarjetas se da con margin-right explícito
          // en cada figure (ver más abajo) en vez del gap del contenedor flex. La
          // tarjeta 1 con motion reducida es la única con ancho w-fit (en vez de un
          // ancho fijo como las demás) — para no apostarle a que el gap del flex se
          // comporte igual con un ítem de ancho intrínseco que con uno de ancho fijo,
          // la separación se resuelve igual para las 5, vía margin, no vía gap.
          className="[&::-webkit-scrollbar]:hidden mt-10 flex items-start snap-x snap-mandatory overflow-x-auto scroll-px-6 px-6 pb-4 sm:px-12 md:justify-center md:px-6"
          style={{ scrollbarWidth: 'none' }}
        >
          {MOMENTS.map((moment, index) => (
            <figure
              key={moment.src}
              data-stagger-item
              // Con motion reducida, la primera tarjeta deja de compartir el ancho fijo
              // de las demás (w-fit: se ensancha a lo que pidan sus dos fotos lado a
              // lado) — las otras 4 conservan su ancho normal sin cambio alguno.
              // mr-6/sm:mr-10 en vez de gap-* del contenedor (ver arriba): así la
              // separación con la tarjeta siguiente es la misma para las 5, sin
              // depender de cómo el navegador calcule el gap para un ítem w-fit.
              className={`group shrink-0 snap-center ${
                index === 0 && reduceMotion ? 'w-fit' : 'w-[74vw] max-w-[19rem] sm:w-64 md:w-56 lg:w-64'
              } ${index % 2 === 1 ? 'sm:mt-8' : ''} ${index < MOMENTS.length - 1 ? 'mr-6 sm:mr-10' : ''}`}
            >
              <div
                ref={index === 0 ? firstCardRef : (index === 1 ? referenceCardRef : undefined)}
                // Con motion reducida, la primera tarjeta pierde el aspect-[3/4] fijo:
                // pasa a ser una fila (dos fotos lado a lado, como un solo cuadro
                // combinado) con el alto fijado por JS igual al de una tarjeta normal
                // (ver el efecto de arriba) y el ancho ajustado a su contenido.
                className={`relative bg-stone/10 shadow-[0_18px_30px_-20px_rgba(22,21,19,0.45)] ring-1 ring-ink/10 transition-transform duration-500 ease-out group-hover:-translate-y-1 ${
                  index === 0 && reduceMotion ? 'flex w-fit flex-row' : 'aspect-[3/4] overflow-hidden'
                }`}
              >
                {index === 0 ? (
                  reduceMotion ? (
                    // Motion reducida: nunca se anima el crossfade ligado al scroll de la
                    // tira, así que en vez de asentarse en una sola foto se muestran las
                    // dos lado a lado, cada una a su proporción natural (object-contain,
                    // ancho automático a partir del alto fijo) para no recortar ninguna.
                    <>
                      <img
                        src="/assets/historia-01.webp"
                        alt={moment.alt}
                        loading="lazy"
                        className="h-full w-auto object-contain grayscale-[0.15] transition-[filter] duration-500 ease-out group-hover:grayscale-0"
                      />
                      <span aria-hidden="true" className="h-full w-px shrink-0 bg-bone/60" />
                      <img
                        src="/assets/historia-01-b.webp"
                        alt={moment.alt}
                        loading="lazy"
                        className="h-full w-auto object-contain grayscale-[0.15] transition-[filter] duration-500 ease-out group-hover:grayscale-0"
                      />
                    </>
                  ) : (
                    <>
                      {/* photoA: capa base, sin opacidad manipulada — queda debajo,
                          revelada una vez que photoB (el bebé) se desvanece al deslizar
                          la tira lo suficiente. */}
                      <img
                        ref={photoARef}
                        src="/assets/historia-01-b.webp"
                        alt={moment.alt}
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-cover grayscale-[0.15] transition-[filter] duration-500 ease-out group-hover:grayscale-0"
                      />
                      {/* photoB: por defecto visible (opacity:1, sin clase que la
                          oculte) — el bebé (Natalia) es lo que se ve en reposo, encima de
                          photoA, hasta que updateFade la desvanece según el scroll de la
                          tira. */}
                      <img
                        ref={photoBRef}
                        src="/assets/historia-01.webp"
                        alt={moment.alt}
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-cover grayscale-[0.15] transition-[filter] duration-500 ease-out will-change-[opacity] group-hover:grayscale-0"
                      />
                    </>
                  )
                ) : (
                  <img
                    src={moment.src}
                    alt={moment.alt}
                    loading="lazy"
                    className="h-full w-full object-cover grayscale-[0.15] transition-[filter] duration-500 ease-out group-hover:grayscale-0"
                  />
                )}
                <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-bone/20" />
              </div>
              <figcaption className="mt-5 text-center">
                <span className="block font-utility text-[10px] font-light uppercase tracking-[0.3em] text-stone">
                  0{index + 1} / 05
                </span>
                <span className="mt-2 block font-accent text-2xl italic text-ink">
                  {moment.caption}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>

        {/* Cenefa inferior tipo tira de negativos */}
        <div
          aria-hidden="true"
          className="mx-auto mt-6 h-px max-w-6xl bg-[repeating-linear-gradient(90deg,rgba(140,132,120,0.35)_0,rgba(140,132,120,0.35)_6px,transparent_6px,transparent_16px)]"
        />
      </div>
    </section>
  );
}
