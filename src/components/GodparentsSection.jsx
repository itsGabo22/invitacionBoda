import SectionTexture from './SectionTexture.jsx';

export default function GodparentsSection() {
  return (
    <section
      id="padrinos"
      aria-label="Padrinos"
      className="relative overflow-hidden bg-bone px-6 py-14 sm:py-16"
    >
      <SectionTexture />

      <div data-animate="fade-up" className="relative z-10 mx-auto max-w-xl text-center">
        <p className="font-utility text-[11px] font-medium uppercase tracking-[0.35em] text-stone">
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
