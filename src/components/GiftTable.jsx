import SectionTexture from './SectionTexture.jsx';

// Pequeño glifo de sobre, mismo lenguaje de línea que el resto del sitio.
function EnvelopeIcon(props) {
  return (
    <svg viewBox="0 0 48 34" fill="none" aria-hidden="true" {...props}>
      <rect x="1" y="1" width="46" height="32" stroke="currentColor" strokeWidth="1.5" />
      <path d="M2 2l22 18L46 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// "Lluvia de sobres" tomado al pie de la letra: sobres cayendo en bucle detrás del
// título. Posiciones/velocidades/tamaños generados una sola vez (a nivel de módulo)
// para que no salten al re-renderizar. La sección quedó muy baja (solo el título),
// así que el barrido de la animación es en píxeles fijos (±110px alrededor del "top"
// base de cada sobre) en vez de vh — a esta altura, un barrido pensado para una
// sección alta dejaría casi todo el recorrido fuera de la vista.
const FALLING_ENVELOPES = Array.from({ length: 16 }, (_, i) => ({
  id: i,
  left: Math.round(Math.random() * 96),
  top: Math.round(Math.random() * 90),
  size: 16 + Math.random() * 16,
  duration: 3.5 + Math.random() * 3.5,
  delay: -(Math.random() * 7),
  opacity: 0.25 + Math.random() * 0.3,
  rotA: -14 + Math.random() * 10,
  rotB: 4 + Math.random() * 10,
}));

export default function GiftTable() {
  return (
    <section
      id="regalos"
      aria-label="Regalos"
      className="relative overflow-hidden bg-bone px-6 py-14 sm:py-16"
    >
      <SectionTexture />

      {/* Lluvia de sobres: puramente decorativa, detrás del título. Estática (sin
          bucle) si el usuario prefiere menos movimiento, vía motion-safe. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
        {FALLING_ENVELOPES.map((envelope) => (
          <EnvelopeIcon
            key={envelope.id}
            className="absolute text-champagne motion-safe:animate-envelope-fall"
            style={{
              left: `${envelope.left}%`,
              top: `${envelope.top}%`,
              width: envelope.size,
              height: (envelope.size * 34) / 48,
              opacity: envelope.opacity,
              animationDuration: `${envelope.duration}s`,
              animationDelay: `${envelope.delay}s`,
              '--fall-opacity': envelope.opacity,
              '--fall-rot-a': `${envelope.rotA}deg`,
              '--fall-rot-b': `${envelope.rotB}deg`,
            }}
          />
        ))}
      </div>

      <div data-animate="fade-up" className="relative z-10 mx-auto max-w-xl text-center">
        <p className="font-display text-3xl font-bold text-ink sm:text-4xl">Lluvia de sobres</p>
      </div>
    </section>
  );
}
