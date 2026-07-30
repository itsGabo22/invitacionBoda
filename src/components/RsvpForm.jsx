import { useState } from 'react';

const WHATSAPP_NUMBER = '573188483238';

const ATTENDANCE_OPTIONS = ['Sí, confirmamos', 'No podré asistir'];

function clampGuests(value) {
  const parsed = Math.floor(Number(value));
  return Number.isFinite(parsed) && parsed >= 1 ? parsed : 1;
}

function buildMessage({ fullName, attendance, guests, dietary }) {
  const lines = [
    'Hola, quiero confirmar mi asistencia a la boda:',
    `Nombre: ${fullName}`,
    `Asistencia: ${attendance}`,
  ];

  if (attendance === ATTENDANCE_OPTIONS[0]) {
    lines.push(`Número de invitados: ${guests}`);
    lines.push(`Restricciones alimentarias: ${dietary.trim() || 'Ninguna'}`);
  }

  return lines.join('\n');
}

export default function RsvpForm() {
  const [fullName, setFullName] = useState('');
  const [attendance, setAttendance] = useState(ATTENDANCE_OPTIONS[0]);
  const [guests, setGuests] = useState('1');
  const [dietary, setDietary] = useState('');

  const handleGuestsBlur = () => {
    setGuests(String(clampGuests(guests)));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const message = buildMessage({ fullName, attendance, guests: clampGuests(guests), dietary });
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <section
      id="confirmar-asistencia"
      aria-label="Confirmar asistencia"
      className="relative overflow-hidden bg-ink px-6 py-16 sm:py-20"
    >
      {/* Luz radial suave, coherente con el tratamiento nocturno de la portada */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 [background:radial-gradient(55%_45%_at_50%_0%,rgba(247,245,240,0.06),transparent_70%)]"
      />

      <div data-animate="fade-up" className="relative z-10 mx-auto max-w-md text-center">
        <p className="font-utility text-[11px] font-light uppercase tracking-[0.35em] text-bone/70">
          RSVP
        </p>
        <p className="mt-4 font-display text-4xl font-bold text-bone sm:text-5xl">
          Confirma tu asistencia
        </p>
        <span aria-hidden="true" className="mx-auto mt-8 block h-px w-16 bg-champagne" />

        <p className="mx-auto mt-8 max-w-sm font-display text-lg leading-relaxed text-bone/80">
          Nos encantaría contar contigo. Cuéntanos los detalles y confírmanos por WhatsApp.
        </p>

        <form onSubmit={handleSubmit} className="mt-12 space-y-8 text-left">
          <div>
            <label
              htmlFor="rsvp-name"
              className="font-utility text-[10px] font-light uppercase tracking-[0.3em] text-bone/60"
            >
              Nombre completo
            </label>
            <input
              id="rsvp-name"
              type="text"
              required
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              placeholder="Tu nombre"
              className="mt-3 w-full border-0 border-b border-bone/30 bg-transparent pb-2 font-display text-lg text-bone placeholder:text-bone/30 focus:border-champagne focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="rsvp-attendance"
              className="font-utility text-[10px] font-light uppercase tracking-[0.3em] text-bone/60"
            >
              ¿Nos acompañas?
            </label>
            <select
              id="rsvp-attendance"
              value={attendance}
              onChange={(event) => setAttendance(event.target.value)}
              className="mt-3 w-full appearance-none border-0 border-b border-bone/30 bg-transparent bg-[right_2px_center] bg-no-repeat pb-2 font-display text-lg text-bone focus:border-champagne focus:outline-none"
            >
              {ATTENDANCE_OPTIONS.map((option) => (
                <option key={option} value={option} className="bg-ink text-bone">
                  {option}
                </option>
              ))}
            </select>
          </div>

          {attendance === ATTENDANCE_OPTIONS[0] && (
            <>
              <div>
                <label
                  htmlFor="rsvp-guests"
                  className="font-utility text-[10px] font-light uppercase tracking-[0.3em] text-bone/60"
                >
                  Número de invitados
                </label>
                <input
                  id="rsvp-guests"
                  type="number"
                  min="1"
                  step="1"
                  inputMode="numeric"
                  required
                  value={guests}
                  onChange={(event) => setGuests(event.target.value)}
                  onBlur={handleGuestsBlur}
                  className="mt-3 w-full border-0 border-b border-bone/30 bg-transparent pb-2 font-display text-lg text-bone focus:border-champagne focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="rsvp-dietary"
                  className="font-utility text-[10px] font-light uppercase tracking-[0.3em] text-bone/60"
                >
                  Restricciones alimentarias (opcional)
                </label>
                <input
                  id="rsvp-dietary"
                  type="text"
                  value={dietary}
                  onChange={(event) => setDietary(event.target.value)}
                  placeholder="Vegetariano, alergias, etc."
                  className="mt-3 w-full border-0 border-b border-bone/30 bg-transparent pb-2 font-display text-lg text-bone placeholder:text-bone/30 focus:border-champagne focus:outline-none"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            className="mt-4 w-full bg-bone py-4 font-utility text-xs font-medium uppercase tracking-[0.3em] text-ink transition-colors hover:bg-champagne"
          >
            Confirmar vía WhatsApp
          </button>
        </form>
      </div>
    </section>
  );
}
