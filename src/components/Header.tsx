import { useEffect, useRef, useState } from "react";
import { LogoMark } from "./logo/LogoMark";
import { MenuOverlay } from "./MenuOverlay";
import { scrollToId } from "./SmoothScroll";
import { sections } from "./sections";

/**
 * Header — capsule flottante, d'apres la maquette.
 *
 * La navigation vit dans une pastille translucide (`rgba(39,46,27,0.42)` +
 * `blur(14px)`), avec le wordmark empile a gauche et un bouton Reserver
 * terracotta a droite.
 *
 * Responsive : la capsule ne porte les liens qu'au-dessus de `lg`. En dessous,
 * elle se reduit au bouton Reserver et au burger — empiler sept liens dans une
 * pastille sur 375 px la ferait deborder.
 */
export function Header() {
  const [solide, setSolide] = useState(false);
  const [ouvert, setOuvert] = useState(false);
  const [courante, setCourante] = useState("maison");
  const burger = useRef<HTMLButtonElement>(null);
  const [origine, setOrigine] = useState({ x: 0, y: 0 });

  useEffect(() => {
    type Repere = { id: string; haut: number };
    let reperes: Repere[] = [];
    let ticking = false;

    const mesurer = () => {
      reperes = sections.flatMap((s) => {
        const el = document.getElementById(s.id);
        if (!el) return [];
        return [{ id: s.id, haut: el.getBoundingClientRect().top + window.scrollY }];
      });
    };

    const lire = () => {
      ticking = false;
      const y = window.scrollY;
      setSolide(y > window.innerHeight * 0.6);
      const mi = y + window.innerHeight * 0.4;
      let active = reperes[0];
      for (const r of reperes) if (r.haut <= mi) active = r;
      if (active) setCourante(active.id);
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(lire);
    };

    mesurer();
    lire();
    window.addEventListener("scroll", onScroll, { passive: true });
    const ro = new ResizeObserver(() => {
      mesurer();
      onScroll();
    });
    ro.observe(document.documentElement);
    return () => {
      window.removeEventListener("scroll", onScroll);
      ro.disconnect();
    };
  }, []);

  return (
    <>
      <header className="pad-x fixed inset-x-0 top-0 z-[80] flex items-center justify-between gap-4 py-[18px]">
        <button
          onClick={() => scrollToId("top")}
          className="tap press flex shrink-0 items-center gap-3"
          aria-label="Koozina Garden — haut de page"
        >
          <LogoMark
            className="h-[38px] shrink-0 text-ink drop-shadow-[0_2px_8px_rgba(32,30,29,0.35)] sm:h-[42px]"
            interactive
          />
          {/* Wordmark empile : KOOZINA creme, GARDEN peche. */}
          <span className="hidden flex-col leading-none drop-shadow-[0_2px_10px_rgba(32,30,29,0.45)] sm:flex">
            <span className="font-display text-[19px] tracking-[0.02em] text-paper">KOOZINA</span>
            <span className="font-display text-[19px] tracking-[0.02em] text-peach">GARDEN</span>
          </span>
        </button>

        <div
          className="flex items-center gap-[clamp(10px,1.6vw,26px)] rounded-full border border-mint/15 py-[9px] pl-5 pr-[10px] transition-colors duration-300 ease-editorial"
          style={{
            background: solide ? "rgba(39,46,27,0.72)" : "rgba(39,46,27,0.42)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
          }}
        >
          <nav className="hidden items-center gap-[clamp(10px,1.6vw,26px)] lg:flex">
            {sections.slice(0, 5).map((s) => (
              <button
                key={s.id}
                onClick={() => scrollToId(s.id)}
                className={`press whitespace-nowrap font-display text-[14px] leading-tight transition-opacity duration-200 ease-editorial ${
                  courante === s.id
                    ? "text-peach opacity-100"
                    : "text-mint opacity-80 hover:opacity-100"
                }`}
              >
                {s.label}
              </button>
            ))}
          </nav>

          <button
            onClick={() => scrollToId("reservation")}
            className="tap press shrink-0 whitespace-nowrap rounded-full bg-terra-ink px-5 py-[10px] font-display text-[14px] text-sand-2 transition-colors duration-200 ease-editorial hover:bg-terra focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint"
          >
            Réserver
          </button>

          <button
            ref={burger}
            aria-label={ouvert ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={ouvert}
            aria-controls="menu-principal"
            onClick={() => {
              const r = burger.current?.getBoundingClientRect();
              if (r) setOrigine({ x: r.x + r.width / 2, y: r.y + r.height / 2 });
              setOuvert((v) => !v);
            }}
            className="press flex h-11 w-11 shrink-0 flex-col items-center justify-center gap-[6px] lg:hidden"
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="block h-px w-5 bg-mint transition-transform duration-[420ms] ease-editorial"
                style={
                  ouvert
                    ? i === 0
                      ? { transform: "translateY(7px) rotate(45deg)" }
                      : i === 1
                        ? { opacity: 0, transform: "scaleX(0)" }
                        : { transform: "translateY(-7px) rotate(-45deg)" }
                    : undefined
                }
              />
            ))}
          </button>
        </div>
      </header>

      <MenuOverlay
        open={ouvert}
        onClose={() => {
          setOuvert(false);
          burger.current?.focus({ preventScroll: true });
        }}
        origin={origine}
      />
    </>
  );
}
