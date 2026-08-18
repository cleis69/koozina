import { useEffect, useRef, useState } from "react";
import { infos } from "@/data/menu";
import { scrollToId } from "./SmoothScroll";
import { sections } from "./sections";
import gardenHerbs from "@/assets/garden-herbs.jpg";
import courtyard from "@/assets/hero-courtyard.jpg";
import pastilla from "@/assets/gallery-pastilla.jpg";
import terrace from "@/assets/gallery-terrace.jpg";
import shopCeramique from "@/assets/shop-ceramique.jpg";
import eventTable from "@/assets/event-table.jpg";

const images = [
  courtyard,
  pastilla,
  gardenHerbs,
  shopCeramique,
  eventTable,
  terrace,
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
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <div
      ref={root}
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
          src={images[hover] ?? courtyard}
          alt=""
          aria-hidden="true"
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
              className="group block w-full border-b border-beige/12 py-4 text-left transition-colors duration-[340ms] ease-editorial md:py-5"
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
          <p className="max-w-[34ch] text-[13px] leading-relaxed">
            {infos.address}
          </p>
          <div className="flex flex-col gap-2 text-[13px] md:items-end">
            <a href={infos.phoneHref} className="link-underline">
              {infos.phone}
            </a>
            <a
              href={infos.instagram}
              target="_blank"
              rel="noreferrer"
              className="link-underline"
            >
              Instagram ↗
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
