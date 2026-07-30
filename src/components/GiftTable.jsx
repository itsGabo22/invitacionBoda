const NOISE_TEXTURE = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>'
)}`;

// Pequeño glifo de sobre, mismo lenguaje de línea que el resto del sitio.
function EnvelopeIcon(props) {
  return (
    <svg viewBox="0 0 48 34" fill="none" aria-hidden="true" {...props}>
      <rect x="1" y="1" width="46" height="32" stroke="currentColor" strokeWidth="1.5" />
      <path d="M2 2l22 18L46 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function GiftTable() {
  return (
    <section
      id="regalos"
      aria-label="Regalos"
      className="relative overflow-hidden bg-bone px-6 py-24"
    >
      {/* Textura de papel, coherente con el resto de secciones sobre bone */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.05] mix-blend-multiply"
        style={{ backgroundImage: `url("${NOISE_TEXTURE}")`, backgroundRepeat: 'repeat' }}
      />

      <div data-animate="fade-up" className="relative z-10 mx-auto max-w-xl text-center">
        <EnvelopeIcon className="mx-auto h-9 w-auto text-champagne" />

        <p className="mt-6 font-utility text-[11px] font-light uppercase tracking-[0.35em] text-stone">
          Regalos
        </p>
        <p className="mt-4 font-display text-3xl font-bold text-ink sm:text-4xl">
          Lluvia de sobres
        </p>
        <span aria-hidden="true" className="mx-auto mt-8 block h-px w-16 bg-champagne" />

        <p className="mx-auto mt-8 max-w-md font-display text-lg leading-relaxed text-ink/80 md:text-xl">
          Tu presencia es nuestro mejor regalo; si deseas obsequiarnos algo, agradecemos una
          lluvia de sobres.
        </p>
      </div>
    </section>
  );
}
