import { useState } from "react";
import { infos, menu } from "@/data/menu";
import { scrollToId } from "./SmoothScroll";
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
 * Cinq onglets, plus neuf. Neuf onglets débordaient sur deux rangées et
 * faisaient lire trois fois le mot « boisson » : « Juices », « Smoothies » et
 * « Hot drinks » disaient la même famille, comme « Lunch », « Meat & match »
 * et « Fraîcheurs du jardin » disaient la même — un plat. Les familles sont
 * réunies (Plats, Boissons) et le détail redescend d'un cran, en intertitres
 * dans le panneau. Le lecteur choisit un moment du repas, puis lit la variante.
 *
 * Balisage : une <dl> par groupe, le nom du plat en <dt>, description et prix
 * en <dd>. C'est la structure qu'attend un lecteur d'écran sur une carte.
 */
export function Carte() {
  const [actif, setActif] = useState(0);

  return (
    <section
      id="carte"
      /* Respiration réduite : `sec` pose 187 px en haut et en bas, soit 374 px
         — plus d'un tiers d'un écran de 900 px. Une section conçue pour tenir
         dans la fenêtre ne peut pas s'offrir le rythme des autres. */
      style={{ ["--sec-y" as string]: "clamp(16px, 4.4vw, 84px)" }}
      className="sec flex min-h-[100svh] flex-col justify-center bg-forest text-paper"
    >
      <LogoMark className="pointer-events-none absolute -right-[10%] top-[10%] hidden w-[52vw] text-ink opacity-[0.07] lg:block" />

      <div className="pad-x relative z-10">
        <SectionHead
          poids="fort"
          num="02"
          label="La carte"
          title="Menu"
          accent="d'été"
          tone="dark"
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
          {/* Sous md : un selecteur natif.
              La barre de pastilles defilait horizontalement — c'est un
              defilement lateral, precisement ce qu'on ne veut pas. Un <select>
              tient sur une ligne de 48 px, ne deborde jamais, et ouvre le
              selecteur natif du telephone, plus rapide qu'un rail a faire
              glisser. Au-dela de md, les pastilles reviennent : elles tiennent
              sur deux rangees sans deborder. */}
          <div className="md:hidden">
            <label htmlFor="carte-categorie" className="sr-only">
              Choisir une catégorie de la carte
            </label>
            <select
              id="carte-categorie"
              value={actif}
              onChange={(e) => setActif(Number(e.target.value))}
              className="h-12 w-full rounded-full border-2 border-peach bg-transparent px-5 font-display text-[15px] text-peach focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-peach"
            >
              {menu.map((cat, i) => (
                <option key={cat.id} value={i} className="bg-forest text-paper">
                  {cat.title}
                </option>
              ))}
            </select>
          </div>

          <div
            role="tablist"
            aria-label="Catégories de la carte"
            className="hidden flex-wrap gap-2.5 md:flex"
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
                className={`tap press type-mass shrink-0 rounded-full border-2 px-5 py-3 text-[12.5px] transition-[color,background-color,border-color,transform] duration-200 ease-editorial hover:-translate-y-[2px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-peach ${
                  i === actif
                    ? "border-peach bg-peach text-forest"
                    : "border-paper/30 text-paper hover:border-paper"
                }`}
              >
                {cat.title}
              </button>
            ))}
          </div>

          {menu.map((cat, i) => {
            /* Un seul groupe sans titre : les plats coulent eux-memes sur deux
               colonnes, comme avant. Plusieurs groupes : ce sont les groupes
               qui coulent, et chacun reste d'un seul tenant — un intitule ne
               doit jamais se retrouver seul en pied de colonne. */
            const simple = cat.groups.length === 1 && !cat.groups[0]!.title;

            return (
              <div
                key={cat.id}
                id={`panneau-${cat.id}`}
                role="tabpanel"
                aria-labelledby={`onglet-${cat.id}`}
                hidden={i !== actif}
                className="mt-8 md:mt-10"
              >
                {cat.subtitle ? (
                  <p className="mb-6 text-right text-[11px] uppercase tracking-[0.18em] text-mint/50">
                    {cat.subtitle}
                  </p>
                ) : null}

                <div className={simple ? "" : "lg:columns-2 lg:gap-x-24"}>
                  {cat.groups.map((g) => (
                    <section key={g.title ?? cat.id} className="break-inside-avoid pb-9 last:pb-0">
                      {g.title ? (
                        <div className="mb-4 flex items-baseline gap-3 border-b border-paper/15 pb-2">
                          <h3 className="type-mass text-[clamp(17px,1.7vw,22px)] text-peach">
                            {g.title}
                          </h3>
                          {g.subtitle ? (
                            <span className="eyebrow text-[9.5px] text-mint/50">{g.subtitle}</span>
                          ) : null}
                        </div>
                      ) : null}

                      <dl className={simple ? "lg:columns-2 lg:gap-x-24" : ""}>
                        {g.dishes.map((d) => (
                          <div key={d.name} className="group/plat break-inside-avoid pb-4">
                            <div className="flex items-baseline gap-3">
                              {/* Le plat repond au survol : le nom avance d'un
                                  cheveu, le pointille se densifie, le prix
                                  monte d'un demi-pixel. Trois micro-decalages
                                  qui disent « ceci est une ligne », sans rien
                                  ajouter a l'ecran. */}
                              <dt className="font-display text-[clamp(15.5px,1.4vw,18.5px)] font-normal leading-snug text-paper transition-transform duration-300 ease-editorial group-hover/plat:translate-x-[3px]">
                                {d.name}
                              </dt>
                              <span
                                aria-hidden="true"
                                className="mb-[4px] min-w-4 flex-1 border-b border-dotted border-paper/25 transition-colors duration-300 ease-editorial group-hover/plat:border-peach/55"
                              />
                              <dd className="shrink-0 font-display text-[16px] tabular-nums text-peach transition-transform duration-300 ease-editorial group-hover/plat:-translate-y-[2px]">
                                {d.price != null ? (
                                  /* Prix colle a l'unite, comme la maquette : « 95dh ». */
                                  <>{d.price}dh</>
                                ) : (
                                  <span className="text-[11px] italic text-paper/70">
                                    {d.note ?? "—"}
                                  </span>
                                )}
                              </dd>
                            </div>
                            {d.desc ? (
                              <dd className="mt-1.5 max-w-[46ch] text-[12.5px] leading-[1.5] text-paper/70">
                                {d.desc}
                              </dd>
                            ) : null}
                          </div>
                        ))}
                      </dl>
                    </section>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Micro-CTA au point de decision : on vient de lire les plats et les
            prix, c'est la que l'envie de reserver se forme. */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            onClick={() => scrollToId("reservation")}
            className="pill bg-peach text-forest hover:bg-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-peach"
          >
            Réserver une table
          </button>
          <a
            href={`${infos.whatsapp}?text=${encodeURIComponent("Bonjour Koozina Garden, une question sur la carte :")}`}
            target="_blank"
            rel="noreferrer"
            className="pill border border-paper/35 text-paper hover:border-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-peach"
          >
            Une question ?
          </a>
        </div>

        <p className="mt-4 text-[12px] leading-relaxed text-paper/70">
          Prix en dirhams, service compris. Le menu du jour est affiché sur les tableaux.
        </p>
      </div>
    </section>
  );
}
