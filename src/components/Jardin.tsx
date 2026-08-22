import { useRef } from "react";
import { isCoarse, prefersReduced, useGsap } from "@/lib/anim";
import { SectionHead } from "./primitives";
import terrace from "@/assets/gallery-terrace.jpg";
import herbs from "@/assets/garden-herbs.jpg";
import table from "@/assets/gallery-table.jpg";
import chef from "@/assets/gallery-chef.jpg";
import pastilla from "@/assets/gallery-pastilla.jpg";
import sardines from "@/assets/dish-sardines.jpg";

/** Cinq formats alternés : l'allure d'un reportage, pas d'une grille. */
const TILES = [
  { src: terrace, alt: "La terrasse ombragée sous les arbres", ratio: "3 / 4", w: 900, h: 1200 },
  { src: herbs, alt: "Les herbes du jardin, cueillies le matin", ratio: "4 / 5", w: 1000, h: 1250 },
  { src: table, alt: "Une table dressée, nappe vichy et vaisselle de la maison", ratio: "3 / 2", w: 1200, h: 800 },
  { src: chef, alt: "En cuisine, au retour du marché", ratio: "1 / 1", w: 1000, h: 1000 },
  { src: pastilla, alt: "Pastilla de poulet fermier M'rozia", ratio: "4 / 5", w: 1000, h: 1250 },
  { src: sardines, alt: "Keftas de sardines façon makful, chermoula et herbes", ratio: "16 / 9", w: 1600, h: 900 },
];

/**
 * 03 · Le jardin — le moment végétal, seule section vert profond.
 *
 * Galerie horizontale pinnée au scroll sur grand écran. Sur pointeur grossier,
 * en mouvement réduit, ou si GSAP ne charge pas, elle reste **un simple rail
 * à défilement horizontal natif** : c'est le même DOM, sans pin. Aucun état
 * n'est caché en CSS, donc l'échec du JS dégrade au lieu de casser.
 */
export function Jardin() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLSpanElement>(null);

  useGsap(({ gsap, ScrollTrigger }) => {
    const sec = section.current;
    const tr = track.current;
    if (!sec || !tr) return;
    if (isCoarse() || prefersReduced()) return;
    if (!window.matchMedia("(min-width: 1024px)").matches) return;

    const distance = () => Math.max(0, tr.scrollWidth - window.innerWidth + 96);

    const st = ScrollTrigger.create({
      trigger: sec,
      start: "top top",
      end: () => `+=${distance()}`,
      pin: true,
      scrub: 0.6,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        gsap.set(tr, { x: -distance() * self.progress });
        if (bar.current) bar.current.style.transform = `scaleX(${self.progress})`;
      },
    });

    return () => {
      st.kill();
      gsap.set(tr, { x: 0 });
    };
  }, []);

  return (
    <section
      ref={section}
      id="jardin"
      data-tone="dark"
      className="sec sec-dark bg-green-deep text-beige"
    >
      <div className="pad-x">
        <SectionHead
          num="03"
          label="Le jardin"
          title="Derrière"
          accent="le mur"
          intro="Un jardin caché à la bordure de la médina : les arcades, les nappes vichy, les herbes qui poussent à deux pas des fourneaux."
          tone="dark"
        />
      </div>

      {/* Rail : `overflow-x: auto` en base — le pin GSAP le pilote en plus,
          il ne le remplace pas. */}
      <div className="mt-14 overflow-x-auto pb-4 md:mt-20 lg:overflow-visible [scrollbar-width:thin]">
        <div
          ref={track}
          className="flex w-max gap-5 pl-[var(--pad)] pr-[var(--pad)] md:gap-8"
        >
          {TILES.map((t, i) => (
            <figure
              key={t.src}
              className="w-[68vw] shrink-0 sm:w-[44vw] lg:w-[30vw] xl:w-[26vw]"
              style={{ marginTop: i % 2 ? "clamp(20px,4vw,64px)" : undefined }}
            >
              <div
                data-cursor="view"
                className="overflow-hidden rounded-[4px] bg-green-night"
                style={{ aspectRatio: t.ratio }}
              >
                <img
                  src={t.src}
                  alt={t.alt}
                  width={t.w}
                  height={t.h}
                  loading="lazy"
                  decoding="async"
                  sizes="(max-width: 640px) 68vw, (max-width: 1024px) 44vw, 28vw"
                  className="h-full w-full object-cover transition-transform duration-[1400ms] ease-editorial hover:scale-[1.045]"
                />
              </div>
              <figcaption className="mt-3 flex items-baseline gap-3">
                <span className="font-display text-[11px] font-light text-rose">
                  Fig. {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-[12.5px] leading-snug text-beige/75">
                  {t.alt}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      <div className="pad-x mt-10 hidden lg:block">
        <span className="block h-px w-full bg-beige/20">
          <span
            ref={bar}
            aria-hidden="true"
            className="block h-px origin-left bg-poppy-light"
            style={{ transform: "scaleX(0)" }}
          />
        </span>
      </div>
    </section>
  );
}
