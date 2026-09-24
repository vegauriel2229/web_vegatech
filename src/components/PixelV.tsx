// src/components/PixelV.tsx

/** "V" del logo en grilla de 10×9 píxeles: banda rosa escalonada con traza de circuito y pads. */
export function PixelV() {
  return (
    <svg width={30} height={27} viewBox="0 0 10 9" aria-hidden="true" className="drop-shadow-[0_0_6px_var(--color-fuchsia-500)]">
      <path
        d="M0 0h2v2h1v2h1v2h2V4h1V2h1V0h2v2H9v2H8v2H7v2H6v1H4V8H3V6H2V4H1V2H0z"
        shapeRendering="crispEdges"
        className="fill-fuchsia-400"
      />
      <path d="M1 1V2H2V4H3V6H4V8H6V6H7V4H8V2H9V1" fill="none" strokeWidth={0.3} className="stroke-purple-700" />
      <circle cx={1} cy={1} r={0.45} className="fill-purple-700" />
      <circle cx={9} cy={1} r={0.45} className="fill-purple-700" />
      <circle cx={5} cy={8.4} r={0.45} className="fill-purple-700" />
    </svg>
  );
}
