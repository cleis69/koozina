import { useEffect, useRef } from "react";
import { isCoarse, lerp, prefersReduced } from "@/lib/anim";

/**
 * Le poulpe seul — la version lisible sous 40 px (header, filigrane).
 * Fichier de marque : `public/brand/koozina-mark-simple.svg`.
 *
 * Rendu par `mask-image` plutôt que par `<img>` : le tracé est monochrome
 * (#211F1B en dur), or le header change de couleur selon qu'il survole le hero
 * (beige) ou repose sur le bandeau opaque (encre). Le masque fait porter la
 * couleur par `currentColor` — le logo n'est jamais recoloré, et **le fond
 * reste intact** puisque rien n'est peint derrière la marque.
 *
 * `interactive` ajoute une réaction au curseur : le poulpe dérive vers la
 * souris et ondule légèrement, comme s'il nageait. Le mouvement est borné à
 * quelques pixels — c'est une respiration, pas un effet.
 */
export function LogoMark({
  className = "",
  title,
  interactive = false,
  style,
}: {
  className?: string;
  title?: string;
  interactive?: boolean;
  /** Pour poser une animation CSS depuis l'appelant. Fusionne avec le masque. */
  style?: React.CSSProperties;
}) {
  const el = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = el.current;
    if (!node || !interactive) return;
    if (isCoarse() || prefersReduced()) return;

    // Zone de sensibilité : le poulpe réagit avant même d'être survolé.
    const RANGE = 110;
    const PULL = 5.5; // amplitude maximale, en pixels
    const TILT = 6; // degrés

    const target = { x: 0, y: 0, r: 0, s: 1 };
    const pos = { ...target };
    let raf = 0;
    let inside = false;

    const onMove = (e: PointerEvent) => {
      const b = node.getBoundingClientRect();
      const cx = b.left + b.width / 2;
      const cy = b.top + b.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);

      if (dist < RANGE) {
        // plus la souris est proche, plus l'attraction est forte
        const force = 1 - dist / RANGE;
        target.x = (dx / RANGE) * PULL * force * 2;
        target.y = (dy / RANGE) * PULL * force * 2;
        target.r = (dx / RANGE) * TILT * force * 2;
        target.s = 1 + 0.06 * force;
        inside = true;
      } else if (inside) {
        target.x = target.y = target.r = 0;
        target.s = 1;
        inside = false;
      }
    };

    const loop = () => {
      // lerp doux : le retour au repos est plus lent que l'attraction
      const k = inside ? 0.16 : 0.09;
      pos.x = lerp(pos.x, target.x, k);
      pos.y = lerp(pos.y, target.y, k);
      pos.r = lerp(pos.r, target.r, k);
      pos.s = lerp(pos.s, target.s, k);
      node.style.transform = `translate3d(${pos.x.toFixed(2)}px, ${pos.y.toFixed(2)}px, 0) rotate(${pos.r.toFixed(2)}deg) scale(${pos.s.toFixed(3)})`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
      node.style.transform = "";
    };
  }, [interactive]);

  const mask = "url(/brand/koozina-mark-simple.svg)";

  return (
    // Le ratio est porté ici (viewBox 305,2 × 228) : sans lui, un appelant qui
    // ne fixe que la largeur obtient une hauteur nulle, donc rien à l'écran.
    <span
      ref={el}
      className={`inline-block aspect-[305.2/228] bg-current will-change-transform ${className}`}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : "true"}
      style={{
        ...style,
        WebkitMaskImage: mask,
        maskImage: mask,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
        WebkitMaskSize: "contain",
        maskSize: "contain",
      }}
    />
  );
}
