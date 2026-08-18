import { LogoMark } from "./LogoMark";

function Poppy({
  x,
  y,
  s = 1,
  r = 0,
  className = "",
}: {
  x: number;
  y: number;
  s?: number;
  r?: number;
  className?: string;
}) {
  return (
    <g
      transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}
      className={className}
    >
      <path
        d="M0-9c4.4 0 8 3.2 8 7 0 1.6-.6 3-1.6 4.2C8.6 3.4 10 5.6 10 8c0 3.4-3 6-6.6 6C1.8 14 .6 13.4 0 12.4-.6 13.4-1.8 14-3.4 14-7 14-10 11.4-10 8c0-2.4 1.4-4.6 3.6-5.8A6.7 6.7 0 0 1-8-2c0-3.8 3.6-7 8-7Z"
        fill="var(--color-poppy)"
      />
      <circle cx="0" cy="3" r="2.4" fill="var(--color-ink)" />
    </g>
  );
}

/** Version complète : anneau + poulpe + coquelicots + wordmark. */
export function LogoBadge({
  className = "",
  drawRef,
}: {
  className?: string;
  drawRef?: React.Ref<SVGCircleElement>;
}) {
  return (
    <svg
      viewBox="0 0 220 220"
      className={className}
      fill="none"
      role="img"
      aria-label="Koozina Garden"
    >
      <circle
        ref={drawRef}
        cx="110"
        cy="110"
        r="102"
        stroke="var(--color-green)"
        strokeWidth="1.4"
        transform="rotate(-90 110 110)"
      />
      <circle cx="110" cy="110" r="94" stroke="var(--color-green)" strokeWidth="0.6" />

      <g data-logo-octopus className="text-ink">
        <svg x="58" y="42" width="104" height="100" viewBox="0 0 100 96">
          <LogoMark className="h-full w-full" />
        </svg>
      </g>

      <g data-logo-poppies>
        <Poppy x={52} y={96} s={1.1} r={-18} />
        <Poppy x={168} y={92} s={0.95} r={16} />
        <Poppy x={110} y={44} s={0.7} r={4} />
      </g>

      <g data-logo-wordmark fill="var(--color-ink)">
        <text
          x="110"
          y="166"
          textAnchor="middle"
          fontFamily="var(--font-display)"
          fontWeight="500"
          fontSize="21"
          letterSpacing="1.4"
        >
          KOOZINA
        </text>
        <text
          x="110"
          y="186"
          textAnchor="middle"
          fontFamily="var(--font-display)"
          fontStyle="italic"
          fontWeight="400"
          fontSize="17"
          fill="var(--color-green-2)"
        >
          Garden
        </text>
      </g>
    </svg>
  );
}
