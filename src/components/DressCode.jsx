import { useEffect, useRef, useState } from 'react';
import SectionTexture from './SectionTexture.jsx';

function ChevronIcon({ direction, ...props }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
      <path
        d={direction === 'left' ? 'M10 3 5 8l5 5' : 'M6 3l5 5-5 5'}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Medio tiempo del "giro" (colapsa a scaleX:0, cambia el src, se reabre) — el total
// percibido es el doble de esto.
const FLIP_HALF_DURATION = 150;

// Silueta editorial con dos variantes por rol (traje/vestido), cicladas con flechas
// al estilo "character select": un giro rápido en X (como una tarjeta volteándose)
// en vez de un corte seco o un crossfade — puramente decorativo y efímero, no hay
// nada que guardar ni confirmar. Sigue siendo seleccionable (halo champán + atenuar
// la otra silueta), esa interacción convive con el ciclo de variantes pero es
// independiente de ella. El giro vive en un <span> envolvente aparte del <img> —
// separar los dos transforms evita que choquen entre sí, ya que Tailwind compone
// scale-x-* y scale-[...] sobre las MISMAS variables CSS si están en el mismo
// elemento (el giro perdería o pisaría el zoom de hover/selección). Si un archivo
// aún no existe, se oculta solo (sin icono roto) dejando el espacio reservado.
function Silhouette({ variants, alt, label, selected, dimmed, onSelect }) {
  const [variantIndex, setVariantIndex] = useState(0);
  const [collapsed, setCollapsed] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const [failed, setFailed] = useState(false);
  const timeoutsRef = useRef([]);

  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(clearTimeout);
    };
  }, []);

  const cycle = (direction) => () => {
    if (isFlipping) return;

    const nextIndex = (variantIndex + direction + variants.length) % variants.length;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion) {
      setVariantIndex(nextIndex);
      setFailed(false);
      return;
    }

    setIsFlipping(true);
    setCollapsed(true);

    timeoutsRef.current.push(
      setTimeout(() => {
        setVariantIndex(nextIndex);
        setFailed(false);
        setCollapsed(false);
      }, FLIP_HALF_DURATION),
      setTimeout(() => {
        setIsFlipping(false);
      }, FLIP_HALF_DURATION * 2),
    );
  };

  return (
    <div
      className={`flex flex-col items-center transition-opacity duration-500 ease-out ${
        dimmed ? 'opacity-45' : 'opacity-100'
      }`}
    >
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={selected}
        aria-label={label}
        className={`group relative aspect-[2/3] w-full max-w-[170px] cursor-pointer bg-stone/5 ring-1 transition-[background-color,box-shadow] duration-500 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne focus-visible:ring-offset-2 focus-visible:ring-offset-bone sm:max-w-[210px] ${
          selected ? 'bg-champagne/10 ring-champagne shadow-[0_0_0_1px_rgba(201,173,127,0.3)]' : 'ring-transparent'
        }`}
      >
        <span
          className={`block h-full w-full transition-transform duration-150 ease-out motion-reduce:transition-none ${
            collapsed ? 'scale-x-0' : 'scale-x-100'
          }`}
        >
          {!failed && (
            <img
              src={variants[variantIndex]}
              alt=""
              onError={() => setFailed(true)}
              className={`h-full w-full object-contain object-bottom transition-[filter,transform] duration-500 ease-out ${
                selected
                  ? 'scale-[1.06] drop-shadow-[0_0_30px_rgba(201,173,127,0.8)]'
                  : 'group-hover:scale-[1.03] group-hover:drop-shadow-[0_0_22px_rgba(201,173,127,0.55)]'
              }`}
            />
          )}
        </span>
        <span className="sr-only">{alt}</span>
      </button>

      <div className="mt-3 flex items-center gap-5">
        <button
          type="button"
          onClick={cycle(-1)}
          disabled={isFlipping}
          aria-label={`${label}: ver silueta anterior`}
          className="rounded-full p-1.5 text-stone transition-colors duration-300 hover:text-champagne focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne disabled:opacity-40"
        >
          <ChevronIcon direction="left" className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={cycle(1)}
          disabled={isFlipping}
          aria-label={`${label}: ver silueta siguiente`}
          className="rounded-full p-1.5 text-stone transition-colors duration-300 hover:text-champagne focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne disabled:opacity-40"
        >
          <ChevronIcon direction="right" className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

export default function DressCode() {
  const [selected, setSelected] = useState(null);

  return (
    <section
      id="codigo-vestimenta"
      aria-label="Tipo de vestimenta"
      className="relative overflow-hidden bg-bone px-6 py-14 sm:py-16"
    >
      <SectionTexture />

      <div data-animate="fade-up" className="relative z-10 mx-auto max-w-xl text-center">
        <p className="font-utility text-[11px] font-medium uppercase tracking-[0.35em] text-stone">
          Tipo de vestimenta
        </p>
        <p className="mt-4 font-display text-4xl font-bold text-ink sm:text-5xl">Formal</p>
        <span aria-hidden="true" className="mx-auto mt-8 block h-px w-16 bg-champagne" />

        <div data-stagger-group className="mx-auto mt-12 flex items-start justify-center gap-8 sm:gap-12">
          <div data-stagger-item>
            <Silhouette
              variants={['/assets/silueta-traje.png', '/assets/silueta-traje-02.png']}
              alt="Silueta de traje formal para caballero"
              label="Traje formal"
              selected={selected === 'traje'}
              dimmed={selected === 'vestido'}
              onSelect={() => setSelected((current) => (current === 'traje' ? null : 'traje'))}
            />
          </div>
          <div data-stagger-item>
            <Silhouette
              variants={['/assets/silueta-vestido.png', '/assets/silueta-vestido-02.png']}
              alt="Silueta de vestido formal para dama"
              label="Vestido formal"
              selected={selected === 'vestido'}
              dimmed={selected === 'traje'}
              onSelect={() => setSelected((current) => (current === 'vestido' ? null : 'vestido'))}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
