import { useRef, useState } from "react";
import { isCoarse } from "@/lib/anim";
import { infos } from "@/data/menu";
import { Dot, Reveal, SectionHead } from "./primitives";

/**
 * 05 · Événements — liste éditoriale, aperçu photo qui suit le curseur.
 *
 * ⚠️ Dates fictives issues de la maquette, à remplacer par le vrai calendrier
 * (cf. README §8.6).
 *
 * L'aperçu au curseur est un enrichissement : sur pointeur grossier il n'existe
 * pas, et l'information (titre, date, texte) reste entièrement dans le DOM.
 */
const EVENTS = [
  {
    date: "Chaque vendredi",
    titre: "Table d'hôtes",
    desc: "Un menu unique en cinq services, écrit le matin même. Douze couverts.",
    img: "table-vichy",
    alt: "Grande table dressée pour un dîner",
  },
  {
    date: "Premier dimanche",
    titre: "Brunch au jardin",
    desc: "Buffet de la maison sous les arcades, de 10h à 14h.",
    img: "cour-arcades",
    alt: "La terrasse au petit matin",
  },
  {
    date: "Sur demande",
    titre: "Atelier cuisine",
    desc: "Marché avec le chef, puis cuisine à quatre mains. Quatre personnes.",
    img: "table-zellige",
    alt: "Le chef en cuisine",
  },
  {
    date: "Privatisation",
    titre: "Le jardin pour vous",
    desc: "Anniversaires, tournages, réceptions. Jusqu'à quarante personnes.",
    img: "tagine-cour",
    alt: "Le jardin et ses herbes",
  },
] as const;

export function Events() {
  const [hover, setHover] = useState<number | null>(null);
  const preview = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent) => {
    if (isCoarse() || !preview.current) return;
    preview.current.style.transform = `translate3d(${e.clientX + 28}px, ${e.clientY - 130}px, 0)`;
  };

  return (
    <section
      id="evenements"
      className="sec bg-beige-3"
      onMouseMove={onMove}
      onMouseLeave={() => setHover(null)}
    >
      <div className="pad-x">
        <SectionHead
          num="05"
          label="Événements"
          title="Le jardin"
          accent="se réserve"
          intro="Tables d'hôtes, brunchs, ateliers, privatisations. Le lieu se prête aux occasions qui demandent de la place et du calme."
        />

        <ul className="mt-16 md:mt-24">
          {EVENTS.map((ev, i) => (
            <li key={ev.titre}>
              <Reveal tempo="green" delay={i * 0.05}>
                <a
                  href={infos.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  onMouseEnter={() => setHover(i)}
                  onFocus={() => setHover(i)}
                  onBlur={() => setHover(null)}
                  className="group grid grid-cols-1 items-baseline gap-2 border-t border-ink/14 py-7 transition-colors duration-[340ms] ease-editorial hover:border-poppy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-poppy md:grid-cols-12 md:gap-8 md:py-9"
                >
                  <span className="eyebrow text-green-2 md:col-span-3">
                    {ev.date}
                  </span>
                  <h3 className="font-display text-[clamp(21px,2.6vw,34px)] font-light tracking-[-0.025em] text-ink transition-colors duration-[340ms] group-hover:text-poppy md:col-span-4">
                    {ev.titre}
                  </h3>
                  <p className="max-w-[42ch] text-[13.5px] leading-[1.7] text-quiet md:col-span-4">
                    {ev.desc}
                  </p>
                  <span
                    aria-hidden="true"
                    className="hidden text-right text-ink/65 transition-all duration-[340ms] ease-editorial group-hover:translate-x-1 group-hover:text-poppy md:col-span-1 md:block"
                  >
                    ↗
                  </span>
                </a>
              </Reveal>
            </li>
          ))}
        </ul>

        <Reveal delay={0.1}>
          <p className="mt-12 flex items-center gap-3 text-[13.5px] text-quiet">
            <Dot />
            Écrivez-nous sur WhatsApp au {infos.phone} pour toute demande.
          </p>
        </Reveal>
      </div>

      {/* Aperçu au curseur — décoratif, jamais porteur d'information seule. */}
      <div
        ref={preview}
        aria-hidden="true"
        className={`pointer-events-none fixed left-0 top-0 z-[55] hidden w-[260px] overflow-hidden rounded-[4px] transition-opacity duration-[340ms] ease-editorial lg:block ${
          hover === null ? "opacity-0" : "opacity-100"
        }`}
      >
        {EVENTS.map((ev, i) => (
          <img
            key={ev.titre}
            src={`/photos/${ev.img}-640.webp`}
            alt=""
            width={640}
            height={800}
            loading="lazy"
            decoding="async"
            className={`h-[325px] w-full object-cover ${hover === i ? "block" : "hidden"}`}
          />
        ))}
      </div>
    </section>
  );
}
