import { Fragment, useEffect, useState } from 'react';

// Ceremonia: 15 de agosto de 2026, 5:00 pm.
const TARGET_DATE = new Date(2026, 7, 15, 17, 0, 0).getTime();

function getTimeLeft() {
  const diff = TARGET_DATE - Date.now();

  if (diff <= 0) {
    return { done: true, days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    done: false,
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft);

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  const units = [
    { label: 'Días', value: timeLeft.days },
    { label: 'Horas', value: timeLeft.hours },
    { label: 'Minutos', value: timeLeft.minutes },
    { label: 'Segundos', value: timeLeft.seconds },
  ];

  return (
    <section
      id="cuenta-regresiva"
      aria-label="Cuenta regresiva"
      className="relative overflow-hidden bg-ink px-6 py-24 text-center"
    >
      {/* Luz radial suave, coherente con el tratamiento nocturno de la portada */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 [background:radial-gradient(55%_45%_at_50%_0%,rgba(247,245,240,0.06),transparent_70%)]"
      />

      <div data-animate="fade-up" className="relative z-10">
        <p className="font-utility text-[11px] font-light uppercase tracking-[0.35em] text-bone/70">
          Cuenta regresiva
        </p>

        {timeLeft.done ? (
          <p className="mt-6 font-display text-4xl font-bold text-bone sm:text-5xl">
            ¡Hoy nos casamos!
          </p>
        ) : (
          <>
            <p className="mt-4 font-accent text-2xl italic text-bone/90 sm:text-3xl">
              Para decir &ldquo;sí, acepto&rdquo;
            </p>

            <div className="mx-auto mt-12 flex max-w-2xl items-start justify-center gap-3 sm:gap-6">
              {units.map((unit, index) => (
                <Fragment key={unit.label}>
                  <div className="flex flex-col items-center">
                    <span className="font-display text-4xl font-bold tabular-nums text-bone sm:text-6xl md:text-7xl">
                      {String(unit.value).padStart(2, '0')}
                    </span>
                    <span className="mt-3 font-utility text-[10px] font-light uppercase tracking-[0.3em] text-bone/60">
                      {unit.label}
                    </span>
                  </div>
                  {index < units.length - 1 && (
                    <span
                      aria-hidden="true"
                      className="mt-0.5 font-display text-3xl text-champagne sm:text-5xl md:text-6xl"
                    >
                      :
                    </span>
                  )}
                </Fragment>
              ))}
            </div>
          </>
        )}

        <p className="mt-12 font-utility text-xs font-light uppercase tracking-[0.3em] text-bone/50">
          15 de agosto de 2026 · 5:00 pm
        </p>
      </div>
    </section>
  );
}
