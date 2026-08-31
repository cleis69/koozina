import { useEffect, useState } from "react";
import { infos } from "@/data/menu";
import { scrollToId } from "./SmoothScroll";

/** Message pré-rempli, pour que l'équipe reçoive une demande lisible. */
const MOT = encodeURIComponent("Bonjour Koozina Garden, je souhaite réserver une table.");

/**
 * Accès permanents à la réservation.
 *
 * Sur mobile, une barre fixe en bas d'écran plutôt qu'une pastille unique :
 * la réservation est l'objectif commercial du site, et un touriste qui
 * découvre le lieu depuis Instagram doit pouvoir agir sans jamais chercher.
 * Deux entrées seulement — réserver, ou écrire — pour ne pas transformer le
 * bas de l'écran en barre d'outils.
 *
 * Les deux cibles font 52 px de haut, au-dessus du seuil du pouce, et la barre
 * respecte `env(safe-area-inset-bottom)` pour ne pas passer sous la barre
 * système des iPhone récents.
 *
 * Sur desktop, l'onglet latéral discret est conservé : le bandeau de
 * navigation porte déjà « Réserver ».
 */
export function WhatsAppTab() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.5);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Desktop : onglet latéral */}
      <a
        href={`${infos.whatsapp}?text=${MOT}`}
        target="_blank"
        rel="noreferrer"
        className={`fixed right-0 top-1/2 z-50 hidden -translate-y-1/2 bg-sage px-3 py-6 text-paper transition-[transform,opacity,background-color,color] duration-[600ms] ease-editorial hover:bg-[#25D366] hover:text-ink active:scale-[0.97] md:block ${
          visible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        }`}
        style={{ borderRadius: "4px 0 0 4px" }}
      >
        <span className="eyebrow block" style={{ writingMode: "vertical-rl" }}>
          Écrire sur WhatsApp
        </span>
      </a>

      {/* Mobile : barre d'action fixe */}
      <div
        className="fixed inset-x-0 bottom-0 z-50 flex gap-2 border-t border-paper/12 bg-forest/95 px-3 pt-2.5 backdrop-blur-md transition-transform duration-[420ms] ease-editorial md:hidden"
        /* La translation est pilotee ici, pas par `translate-y-full`.
           Tailwind v4 ecrit la propriete CSS independante `translate`, alors
           que la transition declaree porte sur `transform` : la valeur restait
           figee a 100% et la barre ne remontait jamais. Mesure : classes
           `translate-y-0`, `transform: none`, et pourtant
           `translate: 0px 100%`. */
        style={{
          transform: visible ? "translateY(0)" : "translateY(100%)",
          paddingBottom: "calc(10px + env(safe-area-inset-bottom, 0px))",
        }}
      >
        <button
          onClick={() => scrollToId("reservation")}
          className="flex h-[52px] flex-[3] items-center justify-center rounded-full bg-terra-ink font-display text-[15px] text-paper active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-peach"
        >
          Réserver une table
        </button>
        <a
          href={`${infos.whatsapp}?text=${MOT}`}
          target="_blank"
          rel="noreferrer"
          aria-label="Nous écrire sur WhatsApp"
          className="flex h-[52px] flex-1 items-center justify-center gap-2 rounded-full border border-paper/35 text-paper active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-peach"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
            <path d="M12 2a10 10 0 0 0-8.5 15.3L2 22l4.9-1.4A10 10 0 1 0 12 2Zm5.2 14.1c-.2.6-1.2 1.2-1.7 1.2-.5.1-1 .1-1.7-.1a11 11 0 0 1-5.9-5.1c-.4-.8-.6-1.6-.4-2.2.1-.5.8-1.3 1.3-1.4.3-.1.6 0 .8.4l.7 1.6c.1.3 0 .5-.2.7l-.4.5c-.2.2-.2.4-.1.6a7.4 7.4 0 0 0 3 2.9c.3.1.5.1.7-.1l.6-.7c.2-.2.4-.3.7-.2l1.6.8c.2.1.3.3.3.5 0 .2 0 .4-.1.6Z" />
          </svg>
          <span className="sr-only">WhatsApp</span>
        </a>
      </div>
    </>
  );
}
