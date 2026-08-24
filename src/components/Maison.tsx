import { Reveal, SectionHead } from "./primitives";
import { Picture } from "./Picture";

const VALEURS = [
  {
    n: "i",
    titre: "Huile d'olive et beurre",
    texte:
      "Toute la cuisine, hormis les fritures. C'est écrit en tête de notre carte, et peu de tables d'Essaouira peuvent l'écrire.",
  },
  {
    n: "ii",
    titre: "Le marché décide",
    texte:
      "Nous partons au marché chaque matin. Ce que nous trouvons devient la carte du jour — rien de plus, rien de moins.",
  },
  {
    n: "iii",
    titre: "Du port au jardin",
    texte:
      "Le poisson vient du port à cinq minutes. Les herbes viennent du jardin qui pousse derrière le mur.",
  },
];

/**
 * 01 · La maison — le manifeste.
 *
 * Composition éditoriale : le texte tient les colonnes 2–6, l'image occupe
 * 8–13 et déborde volontairement hors de la marge droite (`-mr-[var(--pad)]`).
 * L'asymétrie est décidée, pas subie : la colonne du numéro reste vide.
 */
export function Maison() {
  return (
    <section id="maison" className="sec bg-beige">
      <div className="pad-x relative">
        <SectionHead
          num="01"
          label="La maison"
          title="Le poulpe"
          accent="et le coquelicot"
          intro="Notre emblème dit tout du lieu : un poulpe pour le port et l'Atlantique à cinq minutes, des coquelicots pour le jardin qui pousse derrière le mur."
        />

        <div className="mt-16 grid gap-12 md:mt-24 lg:grid-cols-12 lg:gap-x-10">
          <div className="lg:col-span-5 lg:col-start-2">
            <Reveal>
              <div className="space-y-6 text-[14.5px] leading-[1.8] text-quiet md:text-[15.5px]">
                <p>
                  Petit-déjeuner, brunch, déjeuner ou goûter : le jardin vous accueille toute la
                  journée, sous les arcades et les nappes vichy.
                </p>
                <p>
                  Une cuisine entre Maroc et Méditerranée, faite de petites portions à partager et
                  de gourmandises créatives. Le menu du jour est affiché sur les tableaux, et
                  présenté à table par Mehdi et Oussama.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="mt-10 border-l-2 border-poppy pl-5 font-display text-[clamp(19px,2vw,26px)] font-light italic leading-[1.35] text-ink">
                Une cuisine intuitive, joyeuse et poétique.
              </p>
            </Reveal>
          </div>

          {/* L'image déborde hors de la marge : c'est ce débord qui donne
              l'échelle éditoriale. Sur mobile elle revient dans la grille. */}
          <div className="lg:col-span-5 lg:col-start-8 lg:-mr-[var(--pad)]">
            <div className="relative">
              <Picture
                name="tagine-cour"
                alt="Un tagine aux amandes servi dans la cour, les arcades rayées en arrière-plan"
                ratio="4 / 5"
                sizes="(max-width: 1024px) 100vw, 42vw"
              />
              {/* Pastille : rose poudré, la couleur des fleurs — jamais le rouge,
                  qui reste réservé à l'action. */}
              <div className="absolute -bottom-7 left-6 flex h-[104px] w-[104px] flex-col items-center justify-center rounded-full bg-rose-wash text-center md:-left-10 md:h-[128px] md:w-[128px]">
                <span className="eyebrow text-[8.5px] text-rose-ink">Fait</span>
                <span className="font-display text-[22px] font-light leading-none text-ink md:text-[27px]">
                  100%
                </span>
                <span className="eyebrow text-[8.5px] text-rose-ink">Maison</span>
              </div>
            </div>
          </div>
        </div>

        {/* Les trois valeurs : le vert entre en scène. */}
        <div className="mt-28 grid gap-x-10 gap-y-12 border-t border-ink/12 pt-14 md:mt-36 md:grid-cols-3">
          {VALEURS.map((v, i) => (
            <Reveal key={v.n} tempo="green" delay={i * 0.08}>
              <article>
                <span className="font-display text-[15px] font-light italic text-green-2">
                  {v.n}
                </span>
                <h3 className="mt-4 font-display text-[clamp(18px,1.8vw,23px)] font-light tracking-[-0.02em] text-ink">
                  {v.titre}
                </h3>
                <p className="mt-3 max-w-[38ch] text-[14px] leading-[1.75] text-quiet">{v.texte}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
