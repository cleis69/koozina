import { useEffect, useRef, useState } from "react";
import { infos } from "@/data/menu";
import { scrollToId } from "./SmoothScroll";
import { sections } from "./sections";

const images = [
  "cour-arcades",
  "table-vichy",
  "bowls-quinoa",
  "table-zellige",
  "tagine-cour",
  "desserts",
];

export function MenuOverlay({
  open,
  onClose,
  origin,
}: {
  open: boolean;
  onClose: () => void;
  origin: { x: number; y: number };
}) {
  const root = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState(0);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);

    // Le focus entre dans le menu à l'ouverture ; il repart au burger à la
    // fermeture (géré par Header), pour que le clavier ne perde jamais sa place.
    const first = root.current?.querySelector<HTMLElement>("nav button");
    first?.focus({ preventScroll: true });

    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <div
      ref={root}
      id="menu-principal"
      // `inert` retire réellement le sous-arbre du parcours clavier. Sans lui,
      // les six liens du menu fermé restaient tabulables : la tabulation
      // disparaissait dans un panneau invisible.
      // React 19 le type en booléen — pas en chaîne vide comme l'attribut HTML.
      inert={!open}
      aria-hidden={!open}
      className={`fixed inset-0 z-[65] bg-green-night transition-[clip-path,opacity] duration-[900ms] ease-editorial ${
        open ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
      style={{
        clipPath: open
          ? `circle(150% at ${origin.x}px ${origin.y}px)`
          : `circle(0% at ${origin.x}px ${origin.y}px)`,
      }}
    >
      <div className="pad-x relative flex h-full flex-col justify-between pb-10 pt-24 md:pt-32">
        <img
          src={`/photos/${images[hover] ?? "cour-arcades"}-1080.webp`}
          alt=""
          aria-hidden="true"
          width={1600}
          height={1200}
          loading="lazy"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.16] transition-opacity duration-700 ease-editorial"
        />

        <nav className="relative">
          {sections.map((s, i) => (
            <button
              key={s.id}
              onMouseEnter={() => setHover(i)}
              onClick={() => {
                onClose();
                setTimeout(() => scrollToId(s.id), 260);
              }}
              className="press group block w-full border-b border-beige/12 py-4 text-left transition-colors duration-[340ms] ease-editorial md:py-5"
              style={{
                transitionDelay: open ? `${i * 70 + 260}ms` : "0ms",
                opacity: open ? 1 : 0,
                transform: open ? "none" : "translateY(18px)",
                transitionProperty: "opacity, transform",
                transitionDuration: "700ms",
              }}
            >
              <span className="flex items-baseline gap-6">
                <span className="font-display text-[12px] font-light text-poppy-light">
                  {s.num}
                </span>
                <span className="h-display text-[clamp(26px,5.2vw,58px)] text-beige transition-colors duration-300 group-hover:text-poppy-light">
                  {s.label}
                </span>
              </span>
            </button>
          ))}
        </nav>

        <div className="relative flex flex-wrap items-end justify-between gap-6 text-beige/70">
          <p className="max-w-[34ch] text-[13px] leading-relaxed">{infos.address}</p>
          <div className="flex flex-col gap-2 text-[13px] md:items-end">
            <a href={infos.phoneHref} className="tap link-underline">
              {infos.phone}
            </a>
            <a
              href={infos.instagram}
              target="_blank"
              rel="noreferrer"
              className="tap link-underline"
            >
              Instagram ↗
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
