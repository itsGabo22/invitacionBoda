import { useState } from 'react';
import SectionTexture from './SectionTexture.jsx';

// Silueta editorial, ahora seleccionable: al tocarla queda "elegida" con un halo
// champán persistente y un aro alrededor de la caja; la otra silueta se atenúa,
// como invitando a la o el invitado a señalar cuál le corresponde. Vuelve a tocarla
// para deseleccionar. Si el archivo aún no existe, se oculta sola (sin icono roto)
// dejando el espacio reservado para que no haya salto de layout.
function Silhouette({ src, alt, label, selected, dimmed, onSelect }) {
  const [failed, setFailed] = useState(false);

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      aria-label={label}
      className={`group relative aspect-[2/3] w-full max-w-[170px] cursor-pointer bg-stone/5 ring-1 transition-[opacity,background-color,box-shadow] duration-500 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne focus-visible:ring-offset-2 focus-visible:ring-offset-bone sm:max-w-[210px] ${
        selected ? 'bg-champagne/10 ring-champagne shadow-[0_0_0_1px_rgba(201,173,127,0.3)]' : 'ring-transparent'
      } ${dimmed ? 'opacity-45' : 'opacity-100'}`}
    >
      {!failed && (
        <img
          src={src}
          alt=""
          onError={() => setFailed(true)}
          className={`h-full w-full object-contain object-bottom transition-[filter,transform] duration-500 ease-out ${
            selected
              ? 'scale-[1.06] drop-shadow-[0_0_30px_rgba(201,173,127,0.8)]'
              : 'group-hover:scale-[1.03] group-hover:drop-shadow-[0_0_22px_rgba(201,173,127,0.55)]'
          }`}
        />
      )}
      <span className="sr-only">{alt}</span>
    </button>
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

        <div data-stagger-group className="mx-auto mt-12 flex items-end justify-center gap-8 sm:gap-12">
          <div data-stagger-item>
            <Silhouette
              src="/assets/silueta-traje.png"
              alt="Silueta de traje formal para caballero"
              label="Traje formal"
              selected={selected === 'traje'}
              dimmed={selected === 'vestido'}
              onSelect={() => setSelected((current) => (current === 'traje' ? null : 'traje'))}
            />
          </div>
          <div data-stagger-item>
            <Silhouette
              src="/assets/silueta-vestido.png"
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
