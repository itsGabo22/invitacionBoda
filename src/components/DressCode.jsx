import { useState } from 'react';
import SectionTexture from './SectionTexture.jsx';

// Silueta editorial: PNG transparente sobre fondo bone, con un halo champán suave
// al pasar el cursor. Si el archivo aún no existe, se oculta sola (sin icono roto)
// dejando el espacio reservado para que no haya salto de layout.
function Silhouette({ src, alt }) {
  const [failed, setFailed] = useState(false);

  return (
    <div className="relative aspect-[2/3] w-full max-w-[170px] bg-stone/5 sm:max-w-[210px]">
      {!failed && (
        <img
          src={src}
          alt={alt}
          onError={() => setFailed(true)}
          className="h-full w-full object-contain object-bottom transition-[filter,transform] duration-500 ease-out hover:scale-[1.03] hover:drop-shadow-[0_0_22px_rgba(201,173,127,0.55)]"
        />
      )}
    </div>
  );
}

export default function DressCode() {
  return (
    <section
      id="codigo-vestimenta"
      aria-label="Código de vestimenta"
      className="relative overflow-hidden bg-bone px-6 py-14 sm:py-16"
    >
      <SectionTexture />

      <div data-animate="fade-up" className="relative z-10 mx-auto max-w-xl text-center">
        <p className="font-utility text-[11px] font-light uppercase tracking-[0.35em] text-stone">
          Código de vestimenta
        </p>
        <p className="mt-4 font-display text-4xl font-bold text-ink sm:text-5xl">Formal</p>
        <span aria-hidden="true" className="mx-auto mt-8 block h-px w-16 bg-champagne" />

        <div data-stagger-group className="mx-auto mt-12 flex items-end justify-center gap-8 sm:gap-12">
          <div data-stagger-item>
            <Silhouette src="/assets/silueta-traje.png" alt="Silueta de traje formal para caballero" />
          </div>
          <div data-stagger-item>
            <Silhouette src="/assets/silueta-vestido.png" alt="Silueta de vestido formal para dama" />
          </div>
        </div>
      </div>
    </section>
  );
}
