const NOISE_TEXTURE = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>'
)}`;

// Cinco momentos, en orden cronológico. Las fotos reales se colocan en
// /public/assets/historia-01.png … historia-05.png; los textos son
// placeholders editoriales a afinar más adelante.
const MOMENTS = [
  {
    src: '/assets/historia-01.png',
    alt: 'Esteban y Natalia en una noche especial juntos',
    caption: 'El comienzo',
  },
  {
    src: '/assets/historia-02.png',
    alt: 'Retratos individuales de Esteban y de Natalia',
    caption: 'Caminos que se encontraron',
  },
  {
    src: '/assets/historia-03.png',
    alt: 'Natalia en la dulce espera de Aylin',
    caption: 'Esperándote',
  },
  {
    src: '/assets/historia-04.png',
    alt: 'El bautizo de Aylin',
    caption: 'Nuestra bendición',
  },
  {
    src: '/assets/historia-05.png',
    alt: 'Esteban, Natalia y Aylin, la familia completa',
    caption: 'Los tres',
  },
];

export default function OurStory() {
  return (
    <section
      id="nuestra-historia"
      aria-label="Nuestra historia"
      className="relative overflow-hidden bg-bone py-24"
    >
      {/* Textura de papel, coherente con el resto de secciones sobre bone */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.05] mix-blend-multiply"
        style={{ backgroundImage: `url("${NOISE_TEXTURE}")`, backgroundRepeat: 'repeat' }}
      />

      <div className="relative z-10">
        {/* Encabezado */}
        <div className="mx-auto max-w-2xl px-6 text-center">
          <p className="font-utility text-[11px] font-light uppercase tracking-[0.35em] text-stone">
            Nuestra historia
          </p>
          <p className="mt-4 font-display text-3xl font-bold text-ink sm:text-4xl md:text-5xl">
            Momentos que nos trajeron aquí
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
          data-stagger-group
          className="[&::-webkit-scrollbar]:hidden mt-10 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-px-6 px-6 pb-4 sm:gap-10 sm:px-12 md:justify-center md:px-6"
          style={{ scrollbarWidth: 'none' }}
        >
          {MOMENTS.map((moment, index) => (
            <figure
              key={moment.src}
              data-stagger-item
              className={`group w-[74vw] max-w-[19rem] shrink-0 snap-center sm:w-64 md:w-56 lg:w-64 ${
                index % 2 === 1 ? 'sm:mt-8' : ''
              }`}
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-stone/10 shadow-[0_18px_30px_-20px_rgba(22,21,19,0.45)] ring-1 ring-ink/10 transition-transform duration-500 ease-out group-hover:-translate-y-1">
                <img
                  src={moment.src}
                  alt={moment.alt}
                  loading="lazy"
                  className="h-full w-full object-cover grayscale-[0.15] transition-[filter] duration-500 ease-out group-hover:grayscale-0"
                />
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
