import { useRef } from "react";
import { E, useGsap } from "@/lib/anim";
import { revealOnScroll } from "@/lib/reveal";

/** Largeurs générées pour chaque photo (cf. public/photos). */
const VARIANTS: Record<string, number[]> = {
  "cour-arcades": [640, 1080, 1440, 1920],
  "tagine-cour": [640, 1080],
  "bowls-quinoa": [640, 1080],
  "table-vichy": [640, 1080, 1440],
  "table-zellige": [640, 1080, 1440],
  desserts: [640, 1080],
};

/**
 * Photo responsive : WebP en `srcset`, JPEG en repli, révélée par clip-path.
 *
 * Les photos sont servies depuis `public/photos` déjà compressées et
 * déclinées — un mobile ne télécharge que la variante 640 (43 à 120 Ko),
 * jamais l'original. `sizes` doit décrire la largeur d'affichage réelle,
 * sinon le navigateur choisit toujours la plus grande.
 */
export function Picture({
  name,
  alt,
  ratio,
  sizes = "100vw",
  className = "",
  eager,
  credit,
}: {
  name: keyof typeof VARIANTS | string;
  alt: string;
  ratio?: string;
  sizes?: string;
  className?: string;
  eager?: boolean;
  /** mention d'origine, affichée discrètement sous la photo */
  credit?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const widths = VARIANTS[name] ?? [640, 1080];
  const srcSet = widths.map((w) => `/photos/${name}-${w}.webp ${w}w`).join(", ");

  useGsap(({ gsap, ScrollTrigger }) => {
    const el = ref.current;
    if (!el) return;
    const img = el.querySelector("img");
    const volet = revealOnScroll(gsap, ScrollTrigger, el, {
      from: { clipPath: "inset(0 0 100% 0)" },
      clipPath: "inset(0 0 0% 0)",
      duration: 1.35,
      ease: E.ink.ease,
    });
    const zoom = img
      ? revealOnScroll(gsap, ScrollTrigger, img,
          { from: { scale: 1.28 }, scale: 1, duration: 1.8, ease: E.ink.ease }, el)
      : null;
    return () => { volet?.(); zoom?.(); };
  }, []);

  return (
    <figure className={className}>
      <div
        ref={ref}
        data-cursor="view"
        className="relative overflow-hidden rounded-[4px] bg-beige-3"
        style={ratio ? { aspectRatio: ratio } : undefined}
      >
        <picture>
          <source type="image/webp" srcSet={srcSet} sizes={sizes} />
          <img
            src={`/photos/${name}.jpg`}
            alt={alt}
            loading={eager ? "eager" : "lazy"}
            {...(eager ? { fetchPriority: "high" as const } : {})}
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-[1400ms] ease-editorial hover:scale-[1.045]"
          />
        </picture>
      </div>
      {credit ? (
        <figcaption className="mt-2 text-[10.5px] tracking-[0.12em] text-quiet/70">
          {credit}
        </figcaption>
      ) : null}
    </figure>
  );
}
