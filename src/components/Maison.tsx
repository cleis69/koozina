import { Reveal, SectionHead } from "./primitives";
import { Picture } from "./Picture";

const VALEURS = [
  {
    titre: "Huile d'olive et beurre",
    texte:
      "Toute la cuisine, hormis les fritures. C'est écrit en tête de notre carte, et peu de tables d'Essaouira peuvent l'écrire.",
  },
  {
    titre: "Le marché décide",
    texte:
      "Nous partons au marché chaque matin. Ce que nous trouvons devient la carte du jour — rien de plus, rien de moins.",
  },
  {
    titre: "Du port au jardin",
    texte:
      "Le poisson vient du port à cinq minutes. Les herbes viennent du jardin qui pousse derrière le mur.",
  },
];

/**
 * 01 · La maison — le manifeste.
 *
 * Composition éditoriale : le texte tient les colonnes 1–5, l'image 8–12.
 *
 * L'image ne déborde plus hors de la marge droite. Mesuré à 1440 px, elle
 * filait jusqu'au bord de l'écran (1440) quand la photo du shop et celle des
 * événements s'arrêtaient toutes deux à 1386, sur la marge. Un seul bloc de
 * la page sortait donc du cadre : ce n'était plus un parti pris, c'était une
 * exception. Les trois photos partagent désormais le même bord droit.
 *
 * Format : 5/4 au lieu de 4/5. En portrait la photo faisait 732 px de haut
 * contre 431 pour le shop — près du double, pour un propos secondaire. Le
 * paysage la ramène à hauteur de texte, et la section tient dans l'écran.
 */
export function Maison() {
  return (
    <section id="maison" className="sec bg-paper">
      <div className="pad-x relative">
        <SectionHead
          poids="fort"
          num="01"
          label="La maison"
          title="Le poulpe"
          accent="et le coquelicot"
          intro="Notre emblème dit tout du lieu : un poulpe pour le port et l'Atlantique à cinq minutes, des coquelicots pour le jardin qui pousse derrière le mur."
        />

        <div className="mt-10 grid gap-10 md:mt-14 lg:grid-cols-12 lg:gap-x-10">
          <div // Colonne 1, pas 2 : c'etait le dernier bloc a flotter a 183 px
            // quand tout le reste tient la marge a 72.
            className="lg:col-span-5 lg:col-start-1"
          >
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
              <p className="mt-10 border-l-2 border-terra pl-5 font-display text-[clamp(19px,2vw,26px)] font-light italic leading-[1.35] text-ink">
                Une cuisine intuitive, joyeuse et poétique.
              </p>
            </Reveal>
          </div>

          {/* Colonnes 8–12 : le bord droit de l'image tombe exactement sur la
              marge, comme le titre et comme les autres photos de la page. */}
          <div className="lg:col-span-5 lg:col-start-8">
            <div className="relative">
              <Picture
                name="tagine-cour"
                alt="Un tagine aux amandes servi dans la cour, les arcades rayées en arrière-plan"
                ratio="5 / 4"
                sizes="(max-width: 1024px) 100vw, 38vw"
              />
              {/* Pastille : rose poudré, la couleur des fleurs — jamais le rouge,
                  qui reste réservé à l'action.
                  Elle tenait à -40 px hors du cadre, dans la gouttière : c'est
                  ce décalage qu'on lisait comme un défaut d'alignement. Elle
                  revient dans l'image, calée sur son coin. */}
              <div className="absolute bottom-5 left-5 flex h-[92px] w-[92px] flex-col items-center justify-center rounded-full bg-terra-ink text-center md:bottom-6 md:left-6 md:h-[112px] md:w-[112px]">
                <span className="eyebrow text-[8.5px] text-paper/90">Fait</span>
                <span className="font-display text-[21px] font-light leading-none text-paper md:text-[25px]">
                  100%
                </span>
                <span className="eyebrow text-[8.5px] text-paper/90">Maison</span>
              </div>
            </div>
          </div>
        </div>

        {/* Les trois valeurs.
            Les chiffres romains sont retires : ils occupaient une ligne
            chacun sans rien apprendre, le titre suffit a numeroter le propos.
            Respiration et echelle resserrees dans la foulee. */}
        <div className="mt-10 grid gap-x-10 gap-y-7 border-t border-ink/12 pt-7 md:mt-12 md:grid-cols-3">
          {VALEURS.map((v, i) => (
            <Reveal key={v.titre} tempo="green" delay={i * 0.08}>
              <article className="group">
                <h3 className="flex items-baseline gap-2 font-display text-[clamp(17px,1.6vw,21px)] tracking-[-0.02em] text-ink transition-transform duration-300 ease-editorial group-hover:translate-x-[3px]">
                  {/* Le point rouge sort de la marge au survol : la
                      ponctuation du site, rendue vivante. */}
                  <span
                    aria-hidden="true"
                    className="inline-block h-[5px] w-[5px] shrink-0 -translate-x-1 rounded-full bg-terra-ink opacity-0 transition-[opacity,transform] duration-300 ease-editorial group-hover:translate-x-0 group-hover:opacity-100"
                  />
                  {v.titre}
                </h3>
                <p className="mt-2.5 max-w-[34ch] text-[13.5px] leading-[1.65] text-quiet">
                  {v.texte}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
