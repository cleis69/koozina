/**
 * Le poulpe seul, monochrome (`currentColor`).
 *
 * C'est la version qui reste lisible en dessous de 40 px : header, favicon,
 * pastille WhatsApp. Le badge complet (anneau + coquelicots + wordmark) devient
 * illisible à cette taille — cf. LogoBadge.
 *
 * ⚠️ Reconstruction d'après le logo fourni, pas une vectorisation du fichier
 * d'origine. Les proportions, la silhouette de la tête, l'enroulement des huit
 * tentacules et les ventouses sont repris au plus près, mais seul le fichier
 * vectoriel du graphiste (AI / EPS / SVG) donnera l'identique au tracé.
 */
export function LogoMark({
  className = "",
  title,
  ...rest
}: {
  className?: string;
  title?: string;
} & React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      fill="none"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : "true"}
      focusable="false"
      {...rest}
    >
      {title ? <title>{title}</title> : null}

      <g fill="currentColor">
        {/* Manteau : dôme haut et large, épaules qui retombent en cloche */}
        <path d="M100 18c26.5 0 46.5 19.6 46.5 45.8 0 13.4-4.6 24.3-12.8 33.4-4.3 4.8-7.6 9-9.6 13.6-1.5 3.5-5 5.6-8.8 5.6H84.7c-3.8 0-7.3-2.1-8.8-5.6-2-4.6-5.3-8.8-9.6-13.6C58.1 88.1 53.5 77.2 53.5 63.8 53.5 37.6 73.5 18 100 18Z" />

        {/* Le croissant clair sur le manteau — le seul détail interne du logo */}
        <path
          d="M92 52c0-7.7 5.6-14 12.8-14.9-1.4-.5-2.9-.8-4.5-.8-8.2 0-14.8 7-14.8 15.7S92.1 67.7 100.3 67.7c1.6 0 3.1-.3 4.5-.8C97.6 66 92 59.7 92 52Z"
          fill="var(--color-paper, #FDFBF6)"
        />
      </g>

      {/* Les huit tentacules : quatre par côté, enroulement alterné vers
          l'extérieur. Tracés en `stroke` pour garder une épaisseur régulière
          quelle que soit la taille de rendu. */}
      <g
        stroke="currentColor"
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
      >
        <path d="M78 116c-8 5-11 13-19 16s-14-1-13-8 8-9 12-5" />
        <path d="M86 119c-6 10-6 20-13 27s-16 5-18-2 3-12 8-11" />
        <path d="M97 121c-2 12 1 24-3 33s-13 10-17 4" />
        <path d="M108 121c3 12 1 25 6 33s14 8 17 2" />
        <path d="M118 118c7 9 8 19 16 25s16 2 17-5-4-11-9-9" />
        <path d="M124 113c9 5 13 12 22 14s14-3 12-10-9-8-12-4" />
      </g>

      {/* Ventouses : deux files de points clairs sur les tentacules avant */}
      <g fill="var(--color-paper, #FDFBF6)">
        {[
          [74, 124],
          [68, 131],
          [63, 139],
          [60, 148],
          [92, 130],
          [89, 140],
          [87, 150],
        ].map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="2.1" />
        ))}
      </g>
    </svg>
  );
}
