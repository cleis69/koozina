import { infos } from "@/data/menu";
import { Picture } from "./Picture";
import { Dot, Reveal, SectionHead } from "./primitives";

/**
 * 04 · Le shop — fond rose poudré, la surprise chromatique du parcours.
 *
 * ⚠️ CONTENU À COMPLÉTER PAR LE CLIENT.
 * L'enseigne du lieu porte bien « Shop & Events » (visible sur la photo de la
 * cour), mais l'assortiment réel n'est pas connu. La version précédente
 * affichait quatre produits inventés — conserves, céramique, douceurs, linge —
 * illustrés par des images générées. Tout cela est retiré : on ne fait pas
 * commerce d'un catalogue imaginaire.
 *
 * Dès que Koozina fournit la liste et les photos, remplacer ce bloc par la
 * grille échelonnée prévue (colonnes 1–4 / 6–8 / 10–12 / 3–6, quatre ratios
 * distincts) — la structure éditoriale est déjà décrite dans le README §3.
 */
export function Shop() {
  return (
    <section id="shop" className="sec bg-rose-wash">
      <div className="pad-x">
        <SectionHead
          num="04"
          label="Le shop"
          title="À emporter"
          accent="du jardin"
          intro="Le lieu n'est pas qu'une table : l'enseigne annonce aussi un shop et des événements, dans la cour même."
        />

        <div className="mt-16 grid gap-12 md:mt-24 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5 lg:col-start-1">
            <Reveal tempo="rose">
              <p className="text-[15px] leading-[1.8] text-quiet md:text-[16px]">
                Le shop occupe les arcades au fond de la cour, sous l'enseigne
                verte. On y trouve ce que la maison fabrique et ce qu'elle
                chine à Essaouira.
              </p>
              <p className="mt-6 text-[14px] leading-[1.75] text-quiet">
                Il ouvre aux mêmes heures que le restaurant. Pour savoir ce qui
                est disponible, ou réserver une pièce, le plus simple est
                d'écrire sur WhatsApp.
              </p>

              <a
                href={infos.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="group mt-10 inline-flex h-12 items-center gap-3 rounded-[4px] border border-ink/25 px-7 text-ink transition-colors duration-[340ms] ease-editorial hover:border-ink hover:bg-ink hover:text-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-poppy"
              >
                <Dot className="transition-transform duration-[340ms] ease-editorial group-hover:scale-[1.6]" />
                <span className="eyebrow">Demander sur WhatsApp</span>
              </a>
            </Reveal>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <Picture
              name="cour-arcades"
              alt="Les arcades du fond de la cour, où l'enseigne « Koozina · Shop & Events » surmonte la porte verte"
              ratio="3 / 2"
              sizes="(max-width: 1024px) 100vw, 48vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
