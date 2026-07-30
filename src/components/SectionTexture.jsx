// Textura compartida para las secciones bone: fotografía real de seda (no un patrón
// SVG), aplicada en "cover" (no repeat, la imagen no es un tile continuo) y mezclada
// en multiply sobre el bone de fondo para que las arrugas y sombras queden visibles
// sin oscurecer el texto, que vive en una capa z-10 aparte por encima de esto.
export default function SectionTexture() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 opacity-[0.55] mix-blend-multiply"
      style={{
        backgroundImage: 'url("/assets/textura-seda.webp")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    />
  );
}
