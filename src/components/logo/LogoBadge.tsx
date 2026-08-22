import type { Ref } from "react";

/**
 * Le badge complet : anneau olive, poulpe, coquelicots, wordmark.
 *
 * ⚠️ Reconstruction d'après le logo fourni en image — **pas** une
 * vectorisation du fichier d'origine. Composition, proportions et palette sont
 * reprises au plus près ; le tracé exact demande le fichier du graphiste
 * (.ai / .eps / .svg) ou un PNG ≥ 2000 px déposé dans `public/brand/`.
 *
 * Le wordmark est du **texte vivant en Zilla Slab 700** — la police du logo,
 * embarquée dans le projet. C'est plus fidèle qu'un tracé approximatif, et ça
 * reste net à toute taille. Contrepartie : dans un SVG servi en fichier
 * autonome (favicon), la police n'est pas garantie — ces cas-là utilisent
 * LogoMark, le poulpe seul, qui est de toute façon la bonne version en petit.
 */
export function LogoBadge({
  className = "",
  drawRef,
  withWordmark = true,
}: {
  className?: string;
  /** l'anneau, animé en stroke-dashoffset par le preloader */
  drawRef?: Ref<SVGCircleElement>;
  withWordmark?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 400 400"
      className={className}
      fill="none"
      role="img"
      aria-label="Koozina Garden"
    >
      {/* Anneau olive */}
      <circle
        ref={drawRef}
        cx="200"
        cy="200"
        r="172"
        stroke="var(--color-green, #7E8C50)"
        strokeWidth="7"
        fill="none"
      />

      {/* ── Coquelicots : dessinés avant le poulpe, donc derrière lui ── */}
      <g data-logo-poppies>
        <Stem d="M243 148c4 34 2 62-9 96" />
        <Stem d="M279 176c-3 30-10 52-26 74" />
        <Stem d="M296 214c-6 22-16 38-32 50" />
        <Stem d="M251 176c8 6 14 9 22 10" />
        <Leaf x={236} y={214} r={-24} />
        <Leaf x={268} y={244} r={16} />

        <Poppy x={232} y={132} s={1.15} r={-12} />
        <Poppy x={283} y={160} s={0.98} r={14} />
        <Poppy x={300} y={205} s={0.88} r={-6} />
        {/* bouton non éclos */}
        <g transform="translate(250 168) rotate(-18)">
          <ellipse rx="7.5" ry="10" fill="var(--color-green-2, #5C6A38)" />
        </g>
      </g>

      {/* ── Le poulpe ── */}
      <g data-logo-octopus fill="var(--color-ink, #15140F)">
        <path d="M158 78c30 0 52.5 22.2 52.5 51.8 0 15.2-5.2 27.5-14.4 37.8-4.9 5.4-8.6 10.2-10.9 15.4-1.7 4-5.6 6.3-9.9 6.3h-34.6c-4.3 0-8.2-2.3-9.9-6.3-2.3-5.2-6-10-10.9-15.4-9.2-10.3-14.4-22.6-14.4-37.8C105.5 100.2 128 78 158 78Z" />
      </g>

      {/* le croissant clair au centre de la tête */}
      <path
        d="M150 118c0-8.7 6.3-15.8 14.4-16.8-1.6-.6-3.3-.9-5.1-.9-9.2 0-16.7 7.9-16.7 17.7s7.5 17.7 16.7 17.7c1.8 0 3.5-.3 5.1-.9-8.1-1-14.4-8.1-14.4-16.8Z"
        fill="var(--color-paper, #FDFBF6)"
      />

      {/* tentacules */}
      <g
        stroke="var(--color-ink, #15140F)"
        strokeWidth="9"
        strokeLinecap="round"
        fill="none"
      >
        <path d="M129 188c-11 7-15 18-27 22s-19-2-18-11 11-12 17-7" />
        <path d="M141 193c-9 14-9 28-19 38s-22 7-25-3 4-17 11-15" />
        <path d="M156 196c-3 17 1 34-4 46s-18 14-24 6" />
        <path d="M172 196c4 17 1 35 8 46s19 11 24 3" />
        <path d="M186 191c10 13 11 27 22 35s22 3 24-7-6-16-13-13" />
        <path d="M195 184c13 7 18 17 31 20s19-4 17-14-13-11-17-6" />
      </g>

      {/* ventouses */}
      <g fill="var(--color-paper, #FDFBF6)">
        {[
          [123, 199],
          [114, 209],
          [107, 221],
          [103, 234],
          [148, 211],
          [144, 226],
          [141, 241],
        ].map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="3" />
        ))}
      </g>

      {/* ── Wordmark ── */}
      {withWordmark ? (
        <g
          data-logo-wordmark
          fill="var(--color-ink, #15140F)"
          fontFamily="'Zilla Slab', Rockwell, Georgia, serif"
          fontWeight={700}
          textAnchor="middle"
        >
          <text x="200" y="322" fontSize="62" letterSpacing="1">
            KOOZINA
          </text>
          <text x="200" y="364" fontSize="35" letterSpacing="6">
            GARDEN
          </text>
        </g>
      ) : null}
    </svg>
  );
}

function Poppy({
  x,
  y,
  s = 1,
  r = 0,
}: {
  x: number;
  y: number;
  s?: number;
  r?: number;
}) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
      {/* quatre pétales froissés, la silhouette large et basse du coquelicot */}
      <path
        d="M0-20c9.5 0 17.5 6.6 17.5 14.8 0 3.4-1.4 6.5-3.6 9C18.8 6.6 22 11.4 22 16.6 22 24 15.4 29.8 7.4 29.8 3.6 29.8 1 28.4 0 26.2c-1 2.2-3.6 3.6-7.4 3.6C-15.4 29.8-22 24-22 16.6c0-5.2 3.2-10 8.1-12.8a13.7 13.7 0 0 1-3.6-9C-17.5-13.4-9.5-20 0-20Z"
        fill="var(--color-poppy, #D33B2C)"
      />
      <circle cy="6" r="5" fill="var(--color-ink, #15140F)" />
    </g>
  );
}

function Stem({ d }: { d: string }) {
  return (
    <path
      d={d}
      stroke="var(--color-green-2, #5C6A38)"
      strokeWidth="5"
      strokeLinecap="round"
      fill="none"
    />
  );
}

function Leaf({ x, y, r }: { x: number; y: number; r: number }) {
  return (
    <path
      d="M0 0c9-3 17 1 22 10-9 4-18 1-22-10Z"
      transform={`translate(${x} ${y}) rotate(${r})`}
      fill="var(--color-green, #7E8C50)"
    />
  );
}
