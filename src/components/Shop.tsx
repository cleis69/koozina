import { Reveal, RevealImage, SectionHead } from "./primitives";
import conserves from "@/assets/shop-conserves.jpg";
import ceramique from "@/assets/shop-ceramique.jpg";
import douceurs from "@/assets/shop-douceurs.jpg";
import linge from "@/assets/shop-linge.jpg";

/**
 * 04 · Le shop — fond rose poudré, la surprise chromatique du parcours.
 *
 * Quatre produits échelonnés sur des colonnes et des ratios différents
 * (4:5 · 3:4 · 1:1 · 16:11) avec des retraits verticaux distincts : c'est ce
 * décalage qui empêche la grille de ressembler à un catalogue.
 *
 * ⚠️ Contenu à confirmer — les quatre produits viennent de la maquette et ne
 * sont pas l'assortiment réel (cf. README §8.5).
 */
const PRODUITS = [
  {
    n: "01",
    nom: "Conserves du jardin",
    desc: "Confitures, citrons confits, chermoula — mis en pot à la cuisine.",
    src: conserves,
    alt: "Bocaux de conserves maison alignés sur une étagère",
    ratio: "4 / 5",
    w: 1000,
    h: 1250,
    col: "lg:col-start-1 lg:col-span-4",
    up: "lg:mt-0",
  },
  {
    n: "02",
    nom: "Céramique d'Essaouira",
    desc: "Les pièces que nous utilisons en salle, tournées dans la région.",
    src: ceramique,
    alt: "Assiettes et bols en céramique émaillée",
    ratio: "3 / 4",
    w: 1000,
    h: 1333,
    col: "lg:col-start-6 lg:col-span-3",
    up: "lg:mt-24",
  },
  {
    n: "03",
    nom: "Douceurs",
    desc: "Basboussa, amandes au miel, biscuits de la maison à emporter.",
    src: douceurs,
    alt: "Assortiment de douceurs marocaines sur un plateau",
    ratio: "1 / 1",
    w: 1100,
    h: 1100,
    col: "lg:col-start-10 lg:col-span-3",
    up: "lg:mt-8",
  },
  {
    n: "04",
    nom: "Linge de table",
    desc: "Le vichy noir et blanc de nos nappes, tissé et coupé sur place.",
    src: linge,
    alt: "Nappes en vichy noir et blanc pliées",
    ratio: "16 / 11",
    w: 1600,
    h: 1100,
    col: "lg:col-start-3 lg:col-span-5",
    up: "lg:mt-16",
  },
] as const;

export function Shop() {
  return (
    <section id="shop" className="sec bg-rose-wash">
      <div className="pad-x">
        <SectionHead
          num="04"
          label="Le shop"
          title="À emporter"
          accent="du jardin"
          intro="Ce que vous goûtez à table se rapporte à la maison. Une petite sélection, renouvelée au fil des saisons."
        />

        <div className="mt-16 grid gap-x-8 gap-y-16 md:mt-24 md:grid-cols-2 lg:grid-cols-12 lg:gap-y-24">
          {PRODUITS.map((p, i) => (
            <article key={p.n} className={`${p.col} ${p.up}`}>
              {/* tempo `rose` : sine.out sur 1,5 s — l'atmosphère, pas l'efficacité */}
              <Reveal tempo="rose" delay={i * 0.05}>
                <RevealImage
                  src={p.src}
                  alt={p.alt}
                  width={p.w}
                  height={p.h}
                  ratio={p.ratio}
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 30vw"
                />
                <div className="mt-5 flex items-baseline gap-4">
                  <span className="font-display text-[13px] font-light text-rose-ink">
                    {p.n}
                  </span>
                  <div>
                    <h3 className="font-display text-[clamp(17px,1.7vw,22px)] font-light tracking-[-0.02em] text-ink">
                      {p.nom}
                    </h3>
                    <p className="mt-2 max-w-[34ch] text-[13.5px] leading-[1.7] text-quiet">
                      {p.desc}
                    </p>
                  </div>
                </div>
              </Reveal>
            </article>
          ))}
        </div>

        <Reveal tempo="rose" delay={0.1}>
          <p className="mt-20 max-w-[46ch] text-[13.5px] leading-[1.75] text-quiet">
            Le shop est ouvert aux mêmes heures que le restaurant. Pour réserver
            une pièce ou commander en quantité, écrivez-nous sur WhatsApp.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
