const NOISE_TEXTURE = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>'
)}`;

export default function GodparentsSection() {
  return (
    <section
      id="padrinos"
      aria-label="Padrinos"
      className="relative overflow-hidden bg-bone px-6 py-24"
    >
      {/* Textura de papel, coherente con el resto de secciones sobre bone */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.05] mix-blend-multiply"
        style={{ backgroundImage: `url("${NOISE_TEXTURE}")`, backgroundRepeat: 'repeat' }}
      />

      <div data-animate="fade-up" className="relative z-10 mx-auto max-w-xl text-center">
        <p className="font-utility text-[11px] font-light uppercase tracking-[0.35em] text-stone">
          Padrinos
        </p>
        <p className="mt-4 font-display text-3xl font-bold text-ink sm:text-4xl">
          En compañía de nuestros padrinos
        </p>
        <span aria-hidden="true" className="mx-auto mt-8 block h-px w-16 bg-champagne" />
        <p className="mt-8 font-accent text-3xl italic text-ink sm:text-4xl">
          Carlos Paz y Nidia Guerrero
        </p>
      </div>
    </section>
  );
}
