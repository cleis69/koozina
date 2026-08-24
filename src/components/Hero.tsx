import { useRef } from "react";
import { infos } from "@/data/menu";
import { E, useGsap } from "@/lib/anim";
import { scrollToId } from "./SmoothScroll";

/** Le bandeau de faits : quatre cellules sur une grille a filets de 1 px. */
const FAITS = [
  { label: "Ouvert", valeur: infos.hours },
  { label: "Cuisine", valeur: "Atlantique & jardins" },
  { label: "Budget", valeur: infos.budget.replace(" / personne", "") },
  { label: "Avis", valeur: infos.google },
];

/**
 * Hero — reconstruit d'apres la maquette fournie.
 *
 * Composition : la section fait exactement 100svh, la photo occupe tout le
 * cadre, et un degrade vertical en quatre paliers assied le texte. Pas de
 * cartouche opaque : c'est le degrade qui porte la lisibilite, et ses valeurs
 * sont celles de la maquette.
 *
 * Le bandeau de faits est une grille dont le fond clair transparait dans les
 * gouttieres de 1 px — les filets ne sont pas des bordures, ils sont le fond.
 */
export function Hero() {
  const root = useRef<HTMLElement>(null);

  useGsap(({ gsap }) => {
    const el = root.current;
    if (!el) return;
    const tl = gsap.timeline({ delay: 0.15 });

    tl.fromTo(
      el.querySelectorAll("[data-ligne]"),
      { yPercent: 108, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: E.ink.d, ease: E.ink.ease, stagger: 0.08 },
      0,
    ).fromTo(
      el.querySelectorAll("[data-intro]"),
      { opacity: 0, y: 22 },
      { opacity: 1, y: 0, duration: E.beige.d, ease: E.beige.ease, stagger: 0.09 },
      0.35,
    );

    const media = el.querySelector("[data-hero-media]");
    if (media) {
      void import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);
        gsap.fromTo(
          media,
          { yPercent: 0 },
          {
            yPercent: 18,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
          },
        );
      });
    }

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section
      ref={root}
      id="top"
      className="relative grid h-[100svh] min-h-[100svh] overflow-clip bg-forest"
    >
      <div data-hero-media className="absolute inset-0">
        <picture>
          <source
            type="image/webp"
            sizes="100vw"
            srcSet="/photos/cour-arcades-640.webp 640w, /photos/cour-arcades-1080.webp 1080w, /photos/cour-arcades-1440.webp 1440w, /photos/cour-arcades-1920.webp 1920w"
          />
          <img
            src="/photos/cour-arcades.jpg"
            alt="La cour de Koozina Garden : arcades rayées ocre et blanc, fresque de poulpe peinte sur le mur, tables sous les palmiers"
            width={2400}
            height={1600}
            loading="eager"
            fetchPriority="high"
            decoding="async"
            className="h-full w-full object-cover"
          />
        </picture>
        {/* Degrade en quatre paliers. Forme et positions de la maquette ;
            deux valeurs relevees. Mesure : avec 0,18 a 34 % et 0,46 a 72 %,
            le titre tombait a 1,70 et le paragraphe a 2,27 sur le mur en
            plein soleil. La maquette a ete dessinee pour une image plus
            sombre. A 0,48 et 0,58 : 4,60 et 5,24. */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(39,46,27,0.62) 0%, rgba(39,46,27,0.48) 34%, rgba(39,46,27,0.58) 72%, rgba(39,46,27,0.86) 100%)",
          }}
        />
      </div>

      <div className="relative flex flex-col justify-end pb-0 pt-[120px]">
        <div className="pad-x">
          <p data-intro className="flex flex-wrap items-center gap-3 text-mint/80">
            <span className="h-2 w-2 shrink-0 rounded-full bg-terra" />
            <span className="text-[11px] uppercase tracking-[0.18em]">
              Essaouira · Bab Sbaa · Restaurant &amp; shop
            </span>
          </p>

          <h1
            className="mt-7 font-display text-[clamp(48px,10.5vw,186px)] leading-[0.86] text-paper"
            style={{ maxWidth: "15ch", letterSpacing: "-0.015em" }}
          >
            <span className="ch-mask block">
              <span data-ligne className="block">
                Né de la mer.
              </span>
            </span>
            <span className="ch-mask block">
              <span data-ligne className="block">
                Enraciné au jardin.
              </span>
            </span>
          </h1>

          <div className="mt-9 flex flex-wrap items-end justify-between gap-8">
            <p
              data-intro
              className="text-[15px] leading-[1.5] text-mint/85"
              style={{ maxWidth: "42ch" }}
            >
              Une maison cachée à la bordure de la médina. Cuisine à l'huile d'olive et au beurre,
              écrite chaque matin au retour du marché.
            </p>

            <div data-intro className="flex flex-wrap gap-3">
              <button
                onClick={() => scrollToId("reservation")}
                className="press rounded-full bg-mint px-[30px] py-4 font-display text-[16px] text-ink transition-colors duration-200 ease-editorial hover:bg-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-mint"
              >
                Réserver une table
              </button>
              <button
                onClick={() => scrollToId("carte")}
                className="press rounded-full border border-mint/50 px-[30px] py-4 font-display text-[16px] text-mint transition-colors duration-200 ease-editorial hover:border-mint hover:bg-mint/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-mint"
              >
                Voir la carte
              </button>
            </div>
          </div>
        </div>

        {/* Les filets de 1 px sont le fond de la grille, vu par les gouttieres. */}
        <dl
          data-intro
          className="mt-[clamp(36px,6vw,76px)] grid gap-px border-t border-mint/22 bg-mint/22"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))" }}
        >
          {FAITS.map((f) => (
            <div key={f.label} className="pad-x bg-forest/[0.55] py-5">
              <dt className="mb-1.5 text-[11px] uppercase tracking-[0.18em] text-mint/60">
                {f.label}
              </dt>
              <dd className="font-display text-[clamp(15px,1.5vw,21px)] text-paper">{f.valeur}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
