import SectionTexture from './SectionTexture.jsx';

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
  { time: '7:00 pm', label: 'Recepción', icon: 'door' },
  { time: '7:30 pm', label: 'Brindis', icon: 'toast' },
  { time: '8:30 pm', label: 'Primer baile', icon: 'dance' },
  { time: '9:00 pm', label: 'Cena', icon: 'dinner' },
  { time: '2:00 am', label: 'Fin', icon: 'moon' },
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

// Iconografía en miniatura para cada instante del itinerario, mismo trazo fino
// que el resto del sitio: sin relleno (salvo pequeños acentos), extremos redondeados.
function DoorIcon(props) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" {...props}>
      <path d="M8 5h12v22H8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20 5l5 3v18l-5 1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="22" cy="17" r="1" fill="currentColor" />
    </svg>
  );
}

function ToastIcon(props) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" {...props}>
      <g stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <g transform="rotate(-18 16 16)">
          <path d="M8 6h6l-1 9a2 2 0 0 1-4 0z" />
          <path d="M11 15v9" />
          <path d="M8 24h6" />
        </g>
        <g transform="rotate(18 16 16)">
          <path d="M18 6h6l-1 9a2 2 0 0 1-4 0z" />
          <path d="M21 15v9" />
          <path d="M18 24h6" />
        </g>
      </g>
    </svg>
  );
}

function DanceIcon(props) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" {...props}>
      <g stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="7" r="2.1" />
        <path d="M12 9.3v8.5M12 12l-5 3M12 12l4-2M7 26l3-7.5M15 22l-3-4" />
        <circle cx="21" cy="6" r="2.1" />
        <path d="M21 8.3v8.5M21 11l5-2M21 11l-4 3M26 22l-3-4.5M17 26l4-8" />
      </g>
    </svg>
  );
}

function DinnerIcon(props) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" {...props}>
      <g stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 4v9M7 4v5a2 2 0 0 0 2 2 2 2 0 0 0 2-2V4M9 13v15" />
        <path d="M22 4c-2.2 0-3.5 3-3.5 6.5S19.8 16 22 16V4zM22 4v24" />
      </g>
    </svg>
  );
}

function MoonIcon(props) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" {...props}>
      <path
        d="M20.5 6.2A9.8 9.8 0 1 0 25.8 24a8 8 0 0 1-5.3-17.8Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.5 7.5l1 2.5 2.5 1-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1z"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const EVENT_ICONS = { door: DoorIcon, toast: ToastIcon, dance: DanceIcon, dinner: DinnerIcon, moon: MoonIcon };

function VenueCard({ venue, className = '' }) {
  const Icon = ICONS[venue.icon];

  return (
    <div
      className={`relative overflow-hidden bg-ink p-10 text-center shadow-[0_30px_55px_-28px_rgba(22,21,19,0.65)] ring-1 ring-champagne/20 sm:p-12 ${className}`}
    >
      {/* Luz radial suave, coherente con el tratamiento nocturno de Cuenta regresiva / RSVP */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 [background:radial-gradient(65%_55%_at_50%_0%,rgba(247,245,240,0.08),transparent_70%)]"
      />

      <div className="relative">
        <Icon className="mx-auto h-16 w-16 text-champagne sm:h-20 sm:w-20" />

        <p className="mt-7 font-utility text-[11px] font-light uppercase tracking-[0.35em] text-bone/60">
          {venue.eyebrow}
        </p>
        <p className="mt-3 font-display text-2xl font-bold text-bone sm:text-3xl">{venue.name}</p>
        <p className="mt-2 font-accent text-lg italic text-champagne">{venue.time}</p>

        <a
          href={venue.href}
          target="_blank"
          rel="noopener noreferrer"
          className="group mt-8 inline-flex items-center gap-2 border border-bone/25 px-6 py-2.5 font-utility text-[11px] font-light uppercase tracking-[0.25em] text-bone transition-colors duration-300 hover:border-champagne hover:bg-champagne hover:text-ink"
        >
          Ver ubicación
          <ArrowIcon className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5" />
        </a>
      </div>
    </div>
  );
}

export default function TimelineLocations() {
  return (
    <section
      id="itinerario"
      aria-label="Itinerario y ubicaciones"
      className="relative overflow-hidden bg-bone px-6 py-16 sm:py-20"
    >
      <SectionTexture />

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
          {/* Columna izquierda: díptico de tarjetas oscuras, en capas como la foto sobre el sobre */}
          <div className="relative mx-auto w-full max-w-md md:mx-0">
            <VenueCard venue={VENUES[0]} />
            <VenueCard
              venue={VENUES[1]}
              className="-mt-6 z-10 border-t-2 border-t-champagne shadow-[0_36px_60px_-24px_rgba(22,21,19,0.7)] ring-champagne/40 sm:-mt-8"
            />
          </div>

          {/* Columna derecha: itinerario vertical, línea en degradado champán y marcadores ilustrados */}
          <div className="relative mx-auto w-full max-w-md md:mx-0">
            <div
              aria-hidden="true"
              className="absolute left-5 top-6 bottom-6 w-px bg-gradient-to-b from-champagne/80 via-champagne/25 to-transparent"
            />

            <ol data-stagger-group className="relative space-y-14">
              {ITINERARY.map((item) => {
                const EventIcon = EVENT_ICONS[item.icon];
                return (
                  <li key={item.label} data-stagger-item className="relative flex items-start gap-6 pl-[3.25rem]">
                    <span
                      aria-hidden="true"
                      className="absolute left-0 top-0 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-bone ring-1 ring-champagne/60 shadow-[0_10px_18px_-10px_rgba(22,21,19,0.4)]"
                    >
                      <EventIcon className="h-5 w-5 text-champagne" />
                    </span>
                    <div className="pt-1">
                      <p className="font-display text-3xl font-bold tabular-nums text-ink sm:text-4xl">
                        {item.time}
                      </p>
                      <p className="mt-2 font-utility text-xs font-light uppercase tracking-[0.28em] text-stone">
                        {item.label}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
