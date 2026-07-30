const NOISE_TEXTURE = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>'
)}`;

// La paleta de la propia invitación, usada como guía de color para los invitados.
const SWATCHES = [
  { name: 'Tinta', className: 'bg-ink' },
  { name: 'Salvia', className: 'bg-sage' },
  { name: 'Champán', className: 'bg-champagne' },
];

export default function DressCode() {
  return (
    <section
      id="codigo-vestimenta"
      aria-label="Código de vestimenta"
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
          Código de vestimenta
        </p>
        <p className="mt-4 font-display text-4xl font-bold text-ink sm:text-5xl">Elegante</p>
        <span aria-hidden="true" className="mx-auto mt-8 block h-px w-16 bg-champagne" />

        <div className="mx-auto mt-10 flex justify-center gap-8">
          {SWATCHES.map((swatch) => (
            <div key={swatch.name} className="flex flex-col items-center gap-3">
              <span className={`h-14 w-14 ring-1 ring-ink/10 ${swatch.className}`} aria-hidden="true" />
              <span className="font-utility text-[10px] font-light uppercase tracking-[0.25em] text-stone">
                {swatch.name}
              </span>
            </div>
          ))}
        </div>

        <p className="mx-auto mt-10 max-w-md font-display text-lg leading-relaxed text-ink/80 md:text-xl">
          Los invitamos a acompañarnos con atuendo formal. Nuestra paleta —tinta, salvia y
          champán— es una guía bienvenida para su elección.
          <br />
          Por favor eviten el blanco y el marfil, reservados para la novia.
        </p>
      </div>
    </section>
  );
}
