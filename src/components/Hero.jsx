export default function Hero() {
  return (
    <section
      id="portada"
      aria-label="Portada"
      className="relative flex min-h-screen w-full flex-col justify-between overflow-hidden bg-ink"
    >
      {/* Fotografía editorial: capa de parallax, se mueve en translateY vía GSAP */}
      <div data-parallax="24" className="absolute inset-0 will-change-transform">
        <img
          src="/assets/portada-placeholder.webp"
          alt="Esteban, Natalia y Aylin, la familia que celebra su historia"
          className="h-full w-full scale-110 object-cover object-center"
        />
        <div className="absolute inset-0 bg-ink/30" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/55 via-transparent to-ink/70" />
      </div>

      {/* Kicker superior */}
      <div className="relative z-10 flex items-center justify-center gap-4 px-6 pt-10 sm:gap-6 sm:pt-14">
        <span className="h-px w-8 bg-bone/40 sm:w-14" />
        <p className="whitespace-nowrap font-utility text-[10px] font-medium uppercase tracking-[0.35em] text-bone/90 sm:text-xs">
          Esteban &amp; Natalia
        </p>
        <span className="h-px w-8 bg-bone/40 sm:w-14" />
      </div>

      {/* Masthead central */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <h1
          className="font-display text-[3.75rem] font-normal uppercase leading-[0.9] tracking-tight text-bone [text-shadow:0_2px_24px_rgba(22,21,19,0.45)] sm:text-8xl md:text-9xl"
        >
          Vogue
        </h1>
        <div className="relative mt-5 max-w-[92%] sm:mt-7 sm:max-w-none">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-x-5 -inset-y-3 rounded-full bg-ink/60 blur-lg sm:-inset-x-8 sm:-inset-y-4 sm:blur-xl"
          />
          <p className="relative z-10 font-utility text-[9px] font-light uppercase tracking-[0.25em] text-bone/85 sm:text-[11px] sm:tracking-[0.3em]">
            15.08.2026
          </p>
        </div>
      </div>

      {/* Indicador de scroll */}
      <div className="relative z-10 flex flex-col items-center gap-2 pb-8 sm:pb-12">
        <span className="font-utility text-[10px] font-light uppercase tracking-[0.35em] text-bone/80">
          Desliza
        </span>
        <svg
          className="h-4 w-4 animate-bounce text-bone/80"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          aria-hidden="true"
        >
          <path d="M12 4v16m0 0l-6-6m6 6l6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </section>
  );
}
