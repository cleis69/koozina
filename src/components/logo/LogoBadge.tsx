import type { Ref } from "react";

/**
 * Le badge complet — anneau olive, poulpe, coquelicots, wordmark.
 * Fichier de marque : `public/brand/koozina-logo.svg` (108 Ko de tracé).
 *
 * Servi en `<img>` et non inliné : à cette taille de tracé, l'inliner
 * alourdirait chaque rendu HTML de la page pour un visuel qui n'apparaît que
 * deux fois (preloader, footer). En fichier externe il est mis en cache une
 * fois et partagé.
 *
 * `variant="white"` bascule sur la version inversée du kit, à utiliser sur les
 * fonds sombres — jamais un filtre CSS, qui dénaturerait le rouge coquelicot.
 */
export function LogoBadge({
  className = "",
  variant = "color",
  ringRef,
  priority,
}: {
  className?: string;
  variant?: "color" | "white";
  /** l'anneau tracé au-dessus du badge, animé par le preloader */
  ringRef?: Ref<SVGCircleElement>;
  priority?: boolean;
}) {
  const src = variant === "white" ? "/brand/koozina-logo-white.svg" : "/brand/koozina-logo.svg";

  return (
    <div className={`relative ${className}`}>
      <img
        src={src}
        alt="Koozina Garden"
        width={369}
        height={369}
        {...(priority
          ? { loading: "eager" as const, fetchPriority: "high" as const }
          : { loading: "lazy" as const })}
        decoding="async"
        className="block h-auto w-full"
      />

      {/* Anneau de tracé, superposé au badge.
          Le logo réel dessine son cercle en aplat (`<circle fill>`), pas en
          contour : impossible de l'animer en `stroke-dashoffset`. Le preloader
          trace donc ce cercle-ci, calé sur le rayon exact du fichier de marque
          (r = 170,3 dans un viewBox de 368,6), et le badge apparaît dedans. */}
      {ringRef ? (
        <svg
          viewBox="0 0 368.6 368.6"
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full"
          fill="none"
        >
          <circle
            ref={ringRef}
            cx="184.3"
            cy="184.3"
            r="170.3"
            stroke="#929261"
            strokeWidth="9.5"
            transform="rotate(-90 184.3 184.3)"
          />
        </svg>
      ) : null}
    </div>
  );
}
