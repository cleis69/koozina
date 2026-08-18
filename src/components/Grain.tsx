const grain =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter><rect width="180" height="180" filter="url(#n)" opacity="0.55"/></svg>`,
  );

/** Grain SVG en overlay, mix-blend-multiply, opacité .3 */
export function Grain() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[60] opacity-30 mix-blend-multiply"
      style={{ backgroundImage: `url("${grain}")`, backgroundSize: "180px" }}
    />
  );
}
