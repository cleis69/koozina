import { useEffect, useRef, useState } from "react";
import { menu } from "@/data/menu";
import { LogoMark } from "./logo/LogoMark";
import { Picture } from "./Picture";
import { Reveal, SectionHead } from "./primitives";

/** Là où la lecture s'aère : une photo vient rompre la colonne. */
const RESPIRATIONS: Record<number, { name: string; alt: string; ratio: string }> = {
  2: {
    name: "tagine-cour",
    alt: "Un tagine aux amandes servi dans la cour, les arcades en arrière-plan",
    ratio: "4 / 5",
  },
  5: {
    name: "desserts",
    alt: "Basboussa à l'orange et crumble aux pommes, servis sous les arbres",
    ratio: "4 / 3",
  },
};

/**
 * 02 · La carte.
 *
 * Composition en deux colonnes plutôt qu'en trois : neuf catégories alignées
 * sur trois colonnes égales produisent un mur de texte, pas un menu. Ici la
 * lecture descend en colonnes larges, les catégories respirent, et deux photos
 * viennent casser la verticalité aux tiers — c'est le rythme d'une carte
 * imprimée, pas d'un tableau.
 *
 * Balisage : une <dl> par catégorie, le nom du plat en <dt>, description et
 * prix en <dd>. C'est la structure qu'attend un lecteur d'écran sur une carte.
 */
export function Carte() {
  const [actif, setActif] = useState(0);
  const refs = useRef<Record<number, HTMLButtonElement>>({});

  // L'onglet choisi au clavier doit revenir dans le champ visible quand la
  // barre défile horizontalement.
  useEffect(() => {
    refs.current[actif]?.scrollIntoView({
      block: "nearest",
      inline: "center",
      behavior: "smooth",
    });
  }, [actif]);

  return (
    <section
      id="carte"
      /* Respiration réduite : `sec` pose 187 px en haut et en bas, soit 374 px
         — plus d'un tiers d'un écran de 900 px. Une section conçue pour tenir
         dans la fenêtre ne peut pas s'offrir le rythme des autres. */
      style={{ ["--sec-y" as string]: "clamp(40px, 6vw, 88px)" }}
      className="sec flex min-h-[100svh] flex-col justify-center bg-paper"
    >
      <LogoMark className="pointer-events-none absolute -right-[10%] top-[10%] hidden w-[52vw] text-ink opacity-[0.04] lg:block" />

      <div className="pad-x relative z-10">
        <SectionHead
          num="02"
          label="La carte"
          title="Menu"
          accent="d'été"
          intro="De l'atlantique aux jardins — et une seule règle : huile d'olive et beurre, hormis fritures."
        />

        {/* Une catégorie à la fois.
            La carte compte trente-trois plats : déroulée, elle faisait 5,7
            écrans de haut, et personne ne sait qu'il y a un petit-déjeuner
            sans avoir tout parcouru. Ici chaque catégorie est un panneau qui
            tient dans la fenêtre, et l'index devient une vraie barre d'onglets.

            Accessibilité : rôles tablist/tab/tabpanel, navigation aux flèches,
            et un seul panneau dans l'ordre de tabulation à la fois. Sans JS,
            React rend le premier panneau — la carte reste lisible. */}
        <div className="mt-8 md:mt-10">
          <div
            role="tablist"
            aria-label="Catégories de la carte"
            /* Rangée unique défilante sous md. Mesuré à 375 px : neuf onglets
               qui s'enroulent occupent 234 px sur 5 rangées — plus que les
               plats eux-mêmes (208 px). Le défilement horizontal ramène la
               barre à une rangée et rend la section à la fenêtre. */
            className="-mx-[var(--pad)] flex snap-x snap-mandatory gap-2.5 overflow-x-auto px-[var(--pad)] pb-1 [scrollbar-width:none] md:mx-0 md:flex-wrap md:overflow-visible md:px-0"
            onKeyDown={(e) => {
              const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
              if (!d) return;
              e.preventDefault();
              const n = (actif + d + menu.length) % menu.length;
              setActif(n);
              document.getElementById(`onglet-${menu[n]!.id}`)?.focus();
            }}
          >
            {menu.map((cat, i) => (
              <button
                key={cat.id}
                id={`onglet-${cat.id}`}
                role="tab"
                aria-selected={i === actif}
                aria-controls={`panneau-${cat.id}`}
                tabIndex={i === actif ? 0 : -1}
                onClick={() => setActif(i)}
                ref={(el) => {
                  if (el && i === actif) refs.current[i] = el;
                }}
                className={`tap press type-mass shrink-0 snap-start rounded-full border-2 px-5 py-3 text-[12.5px] transition-colors duration-200 ease-editorial focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-poppy ${
                  i === actif
                    ? "border-ink bg-ink text-paper"
                    : "border-ink/25 text-ink hover:border-ink"
                }`}
              >
                {cat.title}
              </button>
            ))}
          </div>

          {menu.map((cat, i) => (
            <div
              key={cat.id}
              id={`panneau-${cat.id}`}
              role="tabpanel"
              aria-labelledby={`onglet-${cat.id}`}
              hidden={i !== actif}
              className="mt-8 md:mt-10"
            >
              <div className="grid gap-x-16 gap-y-10 lg:grid-cols-2 lg:gap-x-24">
                {cat.subtitle ? (
                  <p className="eyebrow text-green-2 lg:col-span-2">{cat.subtitle}</p>
                ) : null}

                <dl className="space-y-7 lg:col-span-2 lg:columns-2 lg:gap-x-24 lg:space-y-0">
                  {cat.dishes.map((d) => (
                    <div key={d.name} className="break-inside-avoid pb-7">
                      <div className="flex items-baseline gap-3">
                        <dt className="font-display text-[clamp(15.5px,1.4vw,18.5px)] font-normal leading-snug text-ink">
                          {d.name}
                        </dt>
                        <span
                          aria-hidden="true"
                          className="mb-[4px] min-w-4 flex-1 border-b border-dotted border-ink/20"
                        />
                        <dd className="shrink-0 font-display text-[15px] font-light tabular-nums text-green-2">
                          {d.price != null ? (
                            <>
                              {d.price}
                              <span className="ml-1 text-[10.5px] text-quiet">dh</span>
                            </>
                          ) : (
                            <span className="text-[11px] italic text-quiet">{d.note ?? "—"}</span>
                          )}
                        </dd>
                      </div>
                      {d.desc ? (
                        <dd className="mt-2 max-w-[46ch] text-[13.5px] leading-[1.7] text-quiet">
                          {d.desc}
                        </dd>
                      ) : null}
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-7 text-[12px] leading-relaxed text-quiet">
          Prix en dirhams, service compris. Le menu du jour est affiché sur les tableaux.
        </p>
      </div>
    </section>
  );
}
