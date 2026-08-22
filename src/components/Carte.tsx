import { menu, menuNote } from "@/data/menu";
import { LogoMark } from "./logo/LogoMark";
import { Reveal, SectionHead } from "./primitives";

/**
 * 02 · La carte — fond papier, filigrane du poulpe, trois colonnes.
 *
 * Le contenu vient de `data/menu.ts` : le client met la carte à jour sans
 * toucher au code. Les prix sont en dirhams et alignés à droite sur un filet
 * pointillé — la convention de lecture d'un menu, pas une invention.
 *
 * Balisage : une <dl> par catégorie. Le nom du plat est le terme, la
 * description et le prix la définition. C'est la structure qu'attend un
 * lecteur d'écran sur une carte.
 */
export function Carte() {
  return (
    <section id="carte" className="sec bg-paper">
      {/* Filigrane : 4,5 % d'opacité, décoratif, hors du flux et hors du
          parcours d'accessibilité. */}
      <LogoMark
        aria-hidden="true"
        className="pointer-events-none absolute -right-[8%] top-[14%] -z-0 hidden w-[46vw] text-ink opacity-[0.045] md:block"
      />

      <div className="pad-x relative z-10">
        <SectionHead
          num="02"
          label="La carte"
          title="Menu"
          accent="d'été"
          intro="De l'atlantique aux jardins. Le menu du jour est affiché sur les tableaux et présenté à table."
        />

        <Reveal delay={0.08}>
          <p className="mt-10 inline-flex items-center gap-3 rounded-[4px] bg-beige-2 px-5 py-3 text-[13px] leading-snug text-ink md:text-[13.5px]">
            <span className="h-[5px] w-[5px] shrink-0 rounded-full bg-poppy" />
            {menuNote}
          </p>
        </Reveal>

        <div className="mt-16 grid gap-x-14 gap-y-16 md:mt-24 md:grid-cols-2 xl:grid-cols-3">
          {menu.map((cat, i) => (
            <Reveal key={cat.id} delay={(i % 3) * 0.06}>
              <section aria-labelledby={`cat-${cat.id}`} className="break-inside-avoid">
                <header>
                  <h3
                    id={`cat-${cat.id}`}
                    className="flex items-baseline gap-3 font-display text-[clamp(19px,2vw,25px)] font-light italic text-poppy"
                  >
                    <span aria-hidden="true" className="h-px w-5 bg-poppy/50" />
                    {cat.title}
                  </h3>
                  {cat.subtitle ? (
                    <p className="eyebrow mt-2 pl-8 text-green-2">{cat.subtitle}</p>
                  ) : null}
                </header>

                <dl className="mt-6 space-y-5">
                  {cat.dishes.map((d) => (
                    <div key={d.name}>
                      <div className="flex items-baseline gap-3">
                        <dt className="font-display text-[clamp(14.5px,1.3vw,17px)] font-normal text-ink">
                          {d.name}
                        </dt>
                        <span
                          aria-hidden="true"
                          className="mb-[3px] min-w-4 flex-1 border-b border-dotted border-ink/22"
                        />
                        <dd className="shrink-0 font-display text-[14.5px] font-light tabular-nums text-green-2">
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
                        <dd className="mt-1.5 max-w-[42ch] text-[13px] leading-[1.65] text-quiet">
                          {d.desc}
                        </dd>
                      ) : null}
                    </div>
                  ))}
                </dl>
              </section>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
