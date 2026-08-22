import { useRef } from "react";
import { infos } from "@/data/menu";
import { E, useGsap } from "@/lib/anim";
import { scrollToId } from "./SmoothScroll";
import { Dot } from "./primitives";
import courtyard from "@/assets/hero-courtyard.jpg";

const facts = [
  { label: "Ouvert", value: infos.hours },
  { label: "Cuisine", value: "Atlantique & jardins" },
  { label: "Budget", value: infos.budget.replace(" / personne", "") },
  { label: "Avis Google", value: infos.google.replace(" ★", " ★") },
];

/**
 * Le hero décide de la perception du site en deux secondes.
 *
 * Point non négociable : **la lisibilité ne dépend jamais de la photo.**
 * Le conteneur porte un aplat `ink` et un voile dégradé fixe. Si la photo est
 * lente, absente ou remplacée par une image claire, le titre reste lisible —
 * c'est exactement ce qui cassait sur la maquette, où le titre beige devenait
 * invisible dès que la photo tombait.
 */
export function Hero() {
  const root = useRef<HTMLElement>(null);

  useGsap(({ gsap }) => {
    const el = root.current;
    if (!el) return;

    /**
     * Intro du hero — même exigence que reveal.ts : **rien n'est caché tant
     * qu'on n'a pas la preuve que l'animation peut réellement tourner.**
     *
     * `fromTo` écrit son état de départ dès la création, même sur une timeline
     * en pause. Avec `immediateRender: false`, il n'écrit rien avant `play()`,
     * et `play()` n'est appelé que depuis une vraie frame rAF. Onglet en
     * arrière-plan, rAF gelé, GSAP muet : le hero reste lisible au lieu de se
     * vider — c'est exactement ce qui figeait la maquette.
     */
    const tl = gsap.timeline({ paused: true, delay: 0.15 });
    const chars = el.querySelectorAll("[data-ch]");

    tl.fromTo(
      chars,
      { yPercent: 110 },
      {
        yPercent: 0,
        duration: E.ink.d,
        ease: E.ink.ease,
        stagger: 0.024,
        immediateRender: false,
      },
      0,
    ).fromTo(
      el.querySelectorAll("[data-intro]"),
      { opacity: 0, y: 22 },
      {
        opacity: 1,
        y: 0,
        duration: E.beige.d,
        ease: E.beige.ease,
        stagger: 0.09,
        immediateRender: false,
      },
      0.35,
    );

    let started = false;
    const start = () => {
      if (started) return;
      started = true;
      tl.play();
    };

    // Une frame réelle a été peinte : l'animation peut jouer.
    const raf = requestAnimationFrame(start);
    // L'onglet revient au premier plan après être resté caché.
    const onVisible = () => document.visibilityState === "visible" && start();
    document.addEventListener("visibilitychange", onVisible);

    // Parallaxe douce sur la photo seule (facteur 0.22 du brief).
    const media = el.querySelector("[data-hero-media]");
    let killParallax: (() => void) | undefined;
    if (media) {
      void import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);
        const tw = gsap.fromTo(
          media,
          { yPercent: 0 },
          {
            yPercent: 22,
            ease: "none",
            immediateRender: false,
            scrollTrigger: {
              trigger: el,
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          },
        );
        killParallax = () => {
          tw.scrollTrigger?.kill();
          tw.kill();
        };
      });
    }

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVisible);
      killParallax?.();
      tl.kill();
    };
  }, []);

  const title = "Né de la mer.";
  const accent = "Enraciné au jardin.";

  return (
    <section
      ref={root}
      id="top"
      className="relative flex min-h-[100svh] flex-col justify-end overflow-clip bg-ink pb-10 pt-28 md:pb-14"
    >
      {/* Photo — la seule image chargée en priorité (candidat LCP).
          z-index positifs uniquement : la section est `position: relative` avec
          `z-index: auto`, donc elle ne crée pas de contexte d'empilement — un
          enfant en z négatif passerait DERRIÈRE le `bg-ink` de la section et
          deviendrait invisible. */}
      <div data-hero-media className="absolute inset-0 z-0 scale-[1.12]">
        <img
          src={courtyard}
          alt="La cour de Koozina Garden, ses arcades rayées et ses tables sous les arbres"
          width={1600}
          height={1067}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="h-full w-full object-cover"
        />
      </div>

      {/* Voile : contraste garanti quelle que soit la photo.
          ink 72 % en bas → transparent au tiers haut, plus un voile latéral
          gauche pour le bloc de titre. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-[1]"
        style={{
          backgroundImage: [
            // bande haute : protège la navigation, qui passe sur les arcades
            // en plein soleil — c'est là que le contraste tombait le plus bas
            "linear-gradient(to bottom, rgba(21,20,15,.68) 0%, rgba(21,20,15,.22) 14%, transparent 26%)",
            // colonne de gauche : densifie le fond du bloc titre + sous-titre
            "linear-gradient(to right, rgba(21,20,15,.62) 0%, rgba(21,20,15,.28) 42%, transparent 68%)",
            // remontée depuis le bas : titre, CTA et bandeau de faits
            "linear-gradient(to top, rgba(21,20,15,.92) 0%, rgba(21,20,15,.74) 26%, rgba(21,20,15,.42) 55%, transparent 80%)",
          ].join(","),
        }}
      />

      <div className="pad-x relative z-[2] w-full">
        <p
          data-intro
          className="eyebrow flex flex-wrap items-center gap-x-3 gap-y-2 text-beige/72"
        >
          <Dot />
          <span>Essaouira</span>
          <span aria-hidden="true" className="text-beige/35">
            ·
          </span>
          <span>Bab Sbaa</span>
          <span aria-hidden="true" className="text-beige/35">
            ·
          </span>
          <span>Restaurant &amp; shop</span>
        </p>

        <h1
          aria-label={`${title} ${accent}`}
          className="h-display mt-7 max-w-[16ch] text-[clamp(38px,7.4vw,104px)] text-beige"
        >
          <span aria-hidden="true">
            <Line text={title} />
            <span className="block italic">
              <Line text={accent} />
            </span>
          </span>
        </h1>

        <div className="mt-9 flex flex-col gap-9 md:mt-12 md:flex-row md:items-end md:justify-between">
          <p
            data-intro
            className="max-w-[42ch] text-[14.5px] leading-[1.75] text-beige/78 md:text-[15.5px]"
          >
            Une maison cachée à la bordure de la médina. Cuisine à l'huile
            d'olive et au beurre, écrite chaque matin au retour du marché.
          </p>

          <div data-intro className="flex flex-wrap gap-3">
            <button
              onClick={() => scrollToId("reservation")}
              className="group inline-flex h-12 items-center gap-2.5 rounded-[4px] bg-poppy px-7 text-paper transition-colors duration-[340ms] ease-editorial hover:bg-poppy-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-paper"
            >
              <span className="eyebrow">Réserver une table</span>
            </button>
            <button
              onClick={() => scrollToId("carte")}
              className="inline-flex h-12 items-center rounded-[4px] border border-beige/35 px-7 text-beige transition-colors duration-[340ms] ease-editorial hover:border-beige hover:bg-beige/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-paper"
            >
              <span className="eyebrow">Voir la carte</span>
            </button>
          </div>
        </div>

        {/* Bandeau de faits — `gap` explicite : sans lui les colonnes se touchent
            et « Atlantique & jardins » vient coller « 100 — 150 dh ». */}
        <dl
          data-intro
          className="mt-12 grid grid-cols-2 gap-x-8 gap-y-7 border-t border-beige/20 pt-7 sm:gap-x-12 md:mt-16 md:grid-cols-4"
        >
          {facts.map((f) => (
            <div key={f.label}>
              <dt className="eyebrow text-beige/50">{f.label}</dt>
              <dd className="mt-2 font-display text-[clamp(15px,1.5vw,21px)] font-light tracking-[-0.01em] text-beige">
                {f.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

/** Découpe en caractères masqués — le texte accessible est porté par le <h1>. */
function Line({ text }: { text: string }) {
  return (
    <>
      {text.split(" ").map((word, wi, all) => (
        <span key={wi} className="inline-block whitespace-nowrap">
          {word.split("").map((c, ci) => (
            <span key={ci} className="ch-mask">
              <span data-ch className="inline-block">
                {c}
              </span>
            </span>
          ))}
          {wi < all.length - 1 ? <span className="inline-block">&nbsp;</span> : null}
        </span>
      ))}
    </>
  );
}
