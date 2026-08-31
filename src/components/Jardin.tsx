import { SectionHead } from "./primitives";
import { Picture } from "./Picture";

/**
 * Uniquement des photos réelles du lieu, vérifiées une à une.
 *
 * Tous les visuels partagent désormais le même cadre 4/5 et la même largeur :
 * les formats alternés donnaient un rail bancal, où l'œil butait sur chaque
 * changement de hauteur au lieu de suivre le défilement.
 */
const TILES = [
  {
    name: "cour-arcades",
    alt: "La cour et ses arcades rayées, la fresque du poulpe sur le mur",
  },
  { name: "table-vichy", alt: "Une table dressée sous les nappes vichy noir et blanc" },
  { name: "bowls-quinoa", alt: "Bols de quinoa, avocat et œuf poché servis en terre cuite" },
  {
    name: "table-zellige",
    alt: "Table en zellige vert : tagine de crevettes, brochettes et mezze",
  },
  { name: "tagine-cour", alt: "Tagine aux amandes, la cour en arrière-plan" },
  { name: "desserts", alt: "Basboussa à l'orange et crumble aux pommes" },
];

/**
 * 03 · Le jardin — encre, pour ne pas prolonger le vert-noir de la carte.
 *
 * Le rail défile seul, à la même vitesse et au même format sur mobile comme
 * sur grand écran. La piste est dupliquée et translatée de la moitié de sa
 * largeur : à mi-parcours, la seconde copie occupe exactement la position de
 * la première, la boucle est donc invisible.
 *
 * L'animation est en CSS, pas en JS : elle tourne hors du fil principal et
 * continue pendant que la page charge. Le duplicata est masqué aux lecteurs
 * d'écran, qui ne doivent entendre les six légendes qu'une fois.
 *
 * Sous `prefers-reduced-motion`, le défilement s'arrête et le rail redevient
 * une bande à faire glisser à la main — le contenu reste entièrement joignable.
 */
export function Jardin() {
  return (
    <section id="jardin" data-tone="dark" className="sec sec-dark bg-ink text-paper">
      <div className="pad-x">
        <SectionHead
          num="03"
          label="Le jardin"
          poids="moyen"
          title="Derrière"
          accent="le mur"
          intro="Un jardin caché à la bordure de la médina : les arcades, les nappes vichy, les herbes qui poussent à deux pas des fourneaux."
          tone="dark"
        />
      </div>

      <div
        className="carrousel mt-9 overflow-hidden md:mt-12"
        style={{ ["--duree" as string]: "48s" }}
      >
        <div className="carrousel-piste flex w-max gap-4 md:gap-6">
          {[0, 1].map((copie) =>
            TILES.map((t) => (
              <figure
                key={`${copie}-${t.name}`}
                /* Largeur unique : « de la meme taille » sur mobile comme sur
                   grand ecran, sans palier responsive. */
                className="w-[280px] shrink-0"
                {...(copie === 1 ? { "aria-hidden": "true" } : {})}
              >
                <Picture name={t.name} alt={copie === 1 ? "" : t.alt} ratio="4 / 5" sizes="300px" />
                <figcaption className="mt-3 text-[12.5px] leading-snug text-paper/70">
                  {t.alt}
                </figcaption>
              </figure>
            )),
          )}
        </div>
      </div>
    </section>
  );
}
