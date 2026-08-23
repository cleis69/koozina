import { menu, menuNote } from "@/data/menu";
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
  return (
    <section id="carte" className="sec bg-paper">
      <LogoMark className="pointer-events-none absolute -right-[10%] top-[10%] hidden w-[52vw] text-ink opacity-[0.04] lg:block" />

      <div className="pad-x relative z-10">
        <SectionHead
          num="02"
          label="La carte"
          title="Menu"
          accent="d'été"
          intro="De l'atlantique aux jardins. Le menu du jour est affiché sur les tableaux et présenté à table."
        />

        {/* La signature de la maison, traitée comme une déclaration et non
            comme une note de bas de page : c'est l'argument que peu de tables
            d'Essaouira peuvent écrire. */}
        <Reveal delay={0.06}>
          <p className="mt-14 max-w-[24ch] font-display text-[clamp(22px,3.2vw,42px)] font-light italic leading-[1.25] tracking-[-0.025em] text-ink md:mt-20">
            {menuNote.replace(/\.$/, "")}
            <span className="text-poppy">.</span>
          </p>
        </Reveal>

        {/* Index des catégories.
            Neuf catégories et trente-trois plats : sans point d'entrée, le
            lecteur doit tout parcourir pour savoir s'il y a un petit-déjeuner.
            Ces pastilles sont des ancres — elles n'ajoutent aucune information,
            elles rendent la carte navigable. */}
        <nav aria-label="Catégories de la carte" className="mt-14 md:mt-16">
          <ul className="flex flex-wrap gap-3">
            {menu.map((cat) => (
              <li key={cat.id}>
                <a
                  href={`#cat-${cat.id}`}
                  className="tap type-mass inline-flex items-center rounded-full border-2 border-ink px-5 py-3 text-[13px] text-ink transition-colors duration-[340ms] ease-editorial hover:bg-ink hover:text-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-poppy"
                >
                  {cat.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-16 grid gap-x-16 gap-y-20 md:mt-20 lg:grid-cols-2 lg:gap-x-24">
          {menu.map((cat, i) => (
            <div key={cat.id} className="break-inside-avoid">
              <Reveal delay={(i % 2) * 0.05}>
                <section aria-labelledby={`cat-${cat.id}`}>
                  <header className="border-t border-ink/14 pt-5">
                    <h3
                      id={`cat-${cat.id}`}
                      /* La marge de defilement porte sur l element que le lien
                         cible reellement (le titre, pas la section), sinon
                         l ancre atterrit sous le header fixe. */
                      className="scroll-mt-28 md:scroll-mt-36 font-display text-[clamp(24px,2.9vw,40px)] font-light italic leading-[1.05] tracking-[-0.03em] text-poppy"
                    >
                      {cat.title}
                    </h3>
                    {cat.subtitle ? (
                      <p className="eyebrow mt-2.5 text-green-2">{cat.subtitle}</p>
                    ) : null}
                  </header>

                  <dl className="mt-7 space-y-6">
                    {cat.dishes.map((d) => (
                      <div key={d.name}>
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
                              <span className="text-[11px] italic text-quiet">
                                {d.note ?? "—"}
                              </span>
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
                </section>
              </Reveal>

              {RESPIRATIONS[i] ? (
                <div className="mt-16">
                  <Picture
                    name={RESPIRATIONS[i].name}
                    alt={RESPIRATIONS[i].alt}
                    ratio={RESPIRATIONS[i].ratio}
                    sizes="(max-width: 1024px) 100vw, 42vw"
                  />
                </div>
              ) : null}
            </div>
          ))}
        </div>

        <Reveal delay={0.08}>
          <p className="mt-20 max-w-[52ch] border-t border-ink/14 pt-7 text-[13.5px] leading-[1.75] text-quiet">
            Les prix sont en dirhams, service compris. Trois plats végétariens
            attendent encore leur tarif — ils sont annoncés à table.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
