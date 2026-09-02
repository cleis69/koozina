import { asset } from "@/lib/asset";
import { useRef } from "react";
import { E, useGsap } from "@/lib/anim";
import { parallaxOnScroll, revealOnScroll } from "@/lib/reveal";

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
  const calque = useRef<HTMLDivElement>(null);
  const widths = VARIANTS[name] ?? [640, 1080];
  const srcSet = widths.map((w) => `${asset(`photos/${name}-${w}.webp`)} ${w}w`).join(", ");

  /* Trois transformations, trois proprietaires distincts.
     Le cadre porte le volet (clip-path), le calque porte le zoom d'entree et
     la parallaxe (gsap ecrit un transform en style inline), l'image ne porte
     que le survol (CSS). C'est ce partage qui compte : un transform inline
     pose par gsap gagne toujours contre une classe `hover:scale-*`, donc tant
     que le zoom et le survol visaient le meme <img>, le survol etait mort des
     que la photo avait fini d'apparaitre. */
  useGsap(({ gsap, ScrollTrigger }) => {
    const el = ref.current;
    const inner = calque.current;
    if (!el || !inner) return;

    const volet = revealOnScroll(gsap, ScrollTrigger, el, {
      from: { clipPath: "inset(0 0 100% 0)" },
      clipPath: "inset(0 0 0% 0)",
      duration: 1.35,
      ease: E.ink.ease,
    });
    const zoom = revealOnScroll(
      gsap,
      ScrollTrigger,
      inner,
      { from: { scale: 1.28 }, scale: 1, duration: 1.8, ease: E.ink.ease },
      el,
    );
    const glisse = parallaxOnScroll(gsap, ScrollTrigger, inner, el);

    return () => {
      volet?.();
      zoom?.();
      glisse?.();
    };
  }, []);

  return (
    <figure className={className}>
      <div
        ref={ref}
        data-cursor="view"
        className="group relative overflow-hidden rounded-[28px] bg-sand"
        style={ratio ? { aspectRatio: ratio } : undefined}
      >
        {/* 116% de haut, cale a -8% : la reserve que consomme la parallaxe.
            Sans elle, glisser l'image decouvrirait le fond sable du cadre. */}
        <div ref={calque} className="absolute inset-x-0 -top-[8%] h-[116%] will-change-transform">
          <picture>
            <source type="image/webp" srcSet={srcSet} sizes={sizes} />
            <img
              src={asset(`photos/${name}.jpg`)}
              alt={alt}
              loading={eager ? "eager" : "lazy"}
              {...(eager ? { fetchPriority: "high" as const } : {})}
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-[1200ms] ease-editorial group-hover:scale-[1.055]"
            />
          </picture>
        </div>
      </div>
      {credit ? (
        <figcaption className="mt-2 text-[10.5px] tracking-[0.12em] text-quiet/70">
          {credit}
        </figcaption>
      ) : null}
    </figure>
  );
}
