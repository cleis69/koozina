import { infos } from "@/data/menu";
import { Picture } from "./Picture";
import { Dot, Reveal, SectionHead } from "./primitives";

/**
 * 05 · Événements.
 *
 * ⚠️ CONTENU À COMPLÉTER PAR LE CLIENT.
 * La version précédente annonçait quatre rendez-vous datés — table d'hôtes du
 * vendredi, brunch du premier dimanche, atelier, privatisation — entièrement
 * inventés (README §8.6). Annoncer des dates qui n'existent pas expose le
 * restaurant à recevoir des clients pour un service qu'il ne tient pas.
 *
 * Ce qui reste est vérifiable : l'enseigne du lieu porte « Shop & Events », et
 * la cour se prête aux grandes tablées. Le reste attend leur calendrier réel.
 */

export function Events() {
  return (
    <section id="evenements" data-tone="dark" className="sec sec-dark bg-poppy text-paper">
      <div className="pad-x">
        <SectionHead
          num="05"
          label="Événements"
          title="Le jardin"
          accent="se réserve"
          intro="Tables d'hôtes, brunchs, ateliers, privatisations. Le lieu se prête aux occasions qui demandent de la place et du calme."
          tone="solid"
        />
        <div className="mt-16 grid gap-12 md:mt-24 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <Reveal tempo="green">
              <p className="text-[15px] leading-[1.8] text-paper/90 md:text-[16px]">
                La cour se privatise : grandes tablées, anniversaires, réceptions. L'enseigne
                annonce d'ailleurs autant les événements que la table.
              </p>
              <p className="mt-6 text-[14px] leading-[1.75] text-paper/85">
                Le calendrier des rendez-vous réguliers est en cours de confirmation. Pour une date
                précise ou une privatisation, le plus direct reste WhatsApp — l'équipe répond dans
                la journée.
              </p>
            </Reveal>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <Picture
              name="table-zellige"
              alt="Une grande tablée dressée dans la cour : tagine de crevettes, brochettes et mezze partagés"
              ratio="16 / 10"
              sizes="(max-width: 1024px) 100vw, 48vw"
            />
          </div>
        </div>

        <Reveal delay={0.1}>
          <p className="mt-12 flex items-center gap-3 text-[13.5px] text-paper/90">
            <Dot />
            Écrivez-nous sur WhatsApp au {infos.phone} pour toute demande.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
