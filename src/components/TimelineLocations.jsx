const NOISE_TEXTURE = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>'
)}`;

// Datos reales de la boda.
const VENUES = [
  {
    key: 'ceremonia',
    eyebrow: 'Ceremonia',
    time: '5:00 pm',
    name: 'Capilla Cristo Obrero',
    href: 'https://maps.app.goo.gl/UUtzyapwtu3QGZQK7',
    icon: 'chapel',
  },
  {
    key: 'recepcion',
    eyebrow: 'Recepción',
    time: '7:00 pm',
    name: 'Salón Coonartax',
    href: 'https://maps.app.goo.gl/GHEwSdbHPgviXYLY7',
    icon: 'hall',
  },
];

const ITINERARY = [
  { time: '7:00 pm', label: 'Recepción' },
  { time: '7:30 pm', label: 'Brindis' },
  { time: '8:30 pm', label: 'Primer baile' },
  { time: '9:00 pm', label: 'Cena' },
  { time: '2:00 am', label: 'Fin' },
];

// Iconografía de línea, mismo lenguaje que las vetas de pliegue del sobre:
// trazo fino, sin relleno, extremos redondeados.
function ChapelIcon(props) {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" {...props}>
      <path d="M24 2v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M20 5h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M24 10 6 26M24 10l18 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 26v16M42 26v16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M6 42h36" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="24" cy="21" r="2.6" stroke="currentColor" strokeWidth="1.5" />
      <path d="M18 42V32a6 6 0 0 1 12 0v10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function HallIcon(props) {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" {...props}>
      <path d="M5 18 24 6l19 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 18h40" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M10 21v19M18 21v19M30 21v19M38 21v19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M5 42h38" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M20 42v-8a4 4 0 0 1 8 0v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const ICONS = { chapel: ChapelIcon, hall: HallIcon };

function ArrowIcon(props) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function VenueCard({ venue, className = '' }) {
  const Icon = ICONS[venue.icon];

  return (
    <div className={`relative bg-bone p-8 shadow-lg ring-1 ring-ink/10 sm:p-10 ${className}`}>
      <Icon className="h-11 w-11 text-sage" />

      <p className="mt-6 font-utility text-[11px] font-light uppercase tracking-[0.3em] text-stone">
        {venue.eyebrow}
      </p>
      <p className="mt-2 font-display text-2xl font-bold text-ink sm:text-[1.75rem]">{venue.name}</p>
      <p className="mt-1 font-accent text-lg italic text-ink/70">{venue.time}</p>

      <a
        href={venue.href}
        target="_blank"
        rel="noopener noreferrer"
        className="group mt-7 inline-flex items-center gap-2 border border-ink/25 px-5 py-2.5 font-utility text-[11px] font-light uppercase tracking-[0.25em] text-ink transition-colors duration-300 hover:border-ink hover:bg-ink hover:text-bone"
      >
        Ver ubicación
        <ArrowIcon className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5" />
      </a>
    </div>
  );
}

export default function TimelineLocations() {
  return (
    <section
      id="itinerario"
      aria-label="Itinerario y ubicaciones"
      className="relative overflow-hidden bg-bone px-6 py-24"
    >
      {/* Textura de papel, coherente con el resto de secciones sobre bone */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.05] mix-blend-multiply"
        style={{ backgroundImage: `url("${NOISE_TEXTURE}")`, backgroundRepeat: 'repeat' }}
      />

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Encabezado */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-utility text-[11px] font-light uppercase tracking-[0.35em] text-stone">
            Itinerario
          </p>
          <p className="mt-4 font-display text-3xl font-bold text-ink sm:text-4xl md:text-5xl">
            Cuándo y dónde
          </p>
          <span aria-hidden="true" className="mx-auto mt-8 block h-px w-16 bg-champagne" />
        </div>

        <div className="mt-16 grid grid-cols-1 gap-16 md:grid-cols-2 md:gap-12">
          {/* Columna izquierda: tarjetas de ubicación, en capas como la foto sobre el sobre */}
          <div className="relative mx-auto w-full max-w-md md:mx-0">
            <VenueCard venue={VENUES[0]} />
            <VenueCard
              venue={VENUES[1]}
              className="-mt-8 z-10 shadow-xl border-t-2 border-t-champagne"
            />
          </div>

          {/* Columna derecha: itinerario vertical */}
          <div className="mx-auto w-full max-w-md md:mx-0">
            <ol data-stagger-group className="relative border-l border-stone/40 pl-9">
              {ITINERARY.map((item) => (
                <li key={item.label} data-stagger-item className="relative pb-10 last:pb-0">
                  <span
                    aria-hidden="true"
                    className="absolute -left-[39px] top-1.5 h-2.5 w-2.5 rounded-full bg-champagne ring-4 ring-bone"
                  />
                  <p className="font-display text-xl font-bold text-ink sm:text-2xl">{item.time}</p>
                  <p className="mt-1 font-utility text-sm font-light uppercase tracking-[0.2em] text-stone">
                    {item.label}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
