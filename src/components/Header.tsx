import { useEffect, useRef, useState } from "react";
import { LogoMark } from "./logo/LogoMark";
import { MenuOverlay } from "./MenuOverlay";
import { scrollToId } from "./SmoothScroll";
import { sections } from "./sections";
import { Dot } from "./primitives";

/**
 * Masthead éditorial : bandeau pleine largeur, filet 1px, fond beige opaque
 * après le hero. Pas de glassmorphism (exclu par la direction artistique).
 * Un rail d'index vertical marque la section courante.
 */
export function Header() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<string>("maison");
  const [dark, setDark] = useState(false);
  const burger = useRef<HTMLButtonElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const [origin, setOrigin] = useState({ x: 0, y: 0 });

  /**
   * Le header est présent sur 100 % du scroll : il ne doit rien coûter.
   *
   * Version précédente, par événement de scroll : 6 `getElementById`, 6 lectures
   * d'`offsetTop`, un `document.body.scrollHeight` — donc un reflow forcé — et
   * quatre `setState`, donc un rendu React à chaque frame.
   *
   * Ici les positions sont mesurées une fois (et re-mesurées au resize via
   * ResizeObserver), la lecture du scroll est groupée dans un rAF, la barre de
   * progression est écrite directement dans le DOM par un ref — hors de React —
   * et les trois états qui pilotent des classes ne re-rendent que s'ils changent
   * réellement de valeur.
   */
  useEffect(() => {
    type Mark = { id: string; top: number; dark: boolean };
    let marks: Mark[] = [];
    let max = 1;
    let ticking = false;

    const measure = () => {
      marks = sections.flatMap((s) => {
        const el = document.getElementById(s.id);
        if (!el) return [];
        const top = el.getBoundingClientRect().top + window.scrollY;
        return [{ id: s.id, top, dark: el.dataset["tone"] === "dark" }];
      });
      max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    };

    const read = () => {
      ticking = false;
      const y = window.scrollY;

      if (bar.current) {
        bar.current.style.transform = `scaleX(${Math.min(1, y / max)})`;
      }

      setSolid(y > window.innerHeight * 0.82);

      const mid = y + window.innerHeight * 0.4;
      let active = marks[0];
      for (const m of marks) if (m.top <= mid) active = m;
      if (active) {
        setCurrent(active.id);
        setDark(active.dark);
      }
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(read);
    };

    measure();
    read();

    window.addEventListener("scroll", onScroll, { passive: true });
    const ro = new ResizeObserver(() => {
      measure();
      onScroll();
    });
    ro.observe(document.documentElement);

    return () => {
      window.removeEventListener("scroll", onScroll);
      ro.disconnect();
    };
  }, []);

  const overHero = !solid;
  const tone = overHero || open ? "text-beige" : "text-ink";

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[66] transition-colors duration-[600ms] ease-editorial ${
          solid && !open ? "bg-beige/95 shadow-[0_1px_24px_rgba(21,20,15,.07)]" : ""
        } ${tone}`}
      >
        <div className="pad-x flex h-[68px] items-center justify-between md:h-[76px]">
          <button
            onClick={() => scrollToId("maison")}
            className="-my-2 flex h-11 items-center gap-3 py-2"
            aria-label="Koozina Garden — accueil"
          >
            <LogoMark className="h-7 w-7" />
            <span className="font-display text-[15px] tracking-[0.14em]">
              KOOZINA <span className="italic text-poppy">Garden</span>
            </span>
          </button>

          <nav className="hidden items-center gap-9 lg:flex">
            {sections.slice(0, 5).map((s) => (
              <button
                key={s.id}
                onClick={() => scrollToId(s.id)}
                className={`eyebrow link-underline transition-opacity duration-300 ${
                  current === s.id ? "opacity-100" : "opacity-60 hover:opacity-100"
                }`}
              >
                {s.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-6">
            <button
              onClick={() => scrollToId("reservation")}
              className="eyebrow group hidden items-center gap-2 sm:flex"
            >
              <Dot className="transition-transform duration-[340ms] ease-editorial group-hover:scale-[1.6]" />
              Réserver
            </button>
            <button
              ref={burger}
              aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={open}
              aria-controls="menu-principal"
              onClick={() => {
                const r = burger.current?.getBoundingClientRect();
                if (r) setOrigin({ x: r.x + r.width / 2, y: r.y + r.height / 2 });
                setOpen((v) => !v);
              }}
              className="flex h-11 w-11 flex-col items-end justify-center gap-[7px] lg:hidden"
            >
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="block h-px w-8 bg-current transition-transform duration-[420ms] ease-editorial"
                  style={
                    open
                      ? i === 0
                        ? { transform: "translateY(8px) rotate(45deg)" }
                        : i === 1
                          ? { opacity: 0, transform: "scaleX(0)" }
                          : { transform: "translateY(-8px) rotate(-45deg)" }
                      : undefined
                  }
                />
              ))}
            </button>
          </div>
        </div>
        <div
          className={`rule transition-opacity duration-500 ${solid && !open ? "opacity-100" : "opacity-0"}`}
        />
        <div
          ref={bar}
          aria-hidden="true"
          className="h-[2px] origin-left bg-poppy"
          style={{ transform: "scaleX(0)" }}
        />
      </header>

      {/* Rail d'index vertical */}
      <div
        className={`fixed left-[max(10px,calc(var(--pad)/3))] top-1/2 z-[62] hidden -translate-y-1/2 flex-col gap-4 xl:flex ${
          dark ? "text-beige" : "text-ink"
        } ${open ? "opacity-0" : "opacity-100"} transition-opacity duration-500`}
      >
        {sections.map((s) => (
          <button
            key={s.id}
            onClick={() => scrollToId(s.id)}
            aria-label={s.label}
            className={`font-display text-[11px] font-light transition-all duration-[340ms] ease-editorial ${
              current === s.id
                ? dark
                  ? "text-poppy-light"
                  : "text-poppy"
                : "opacity-40 hover:opacity-90"
            }`}
          >
            {s.num}
          </button>
        ))}
      </div>

      <MenuOverlay
        open={open}
        onClose={() => {
          setOpen(false);
          burger.current?.focus({ preventScroll: true });
        }}
        origin={origin}
      />
    </>
  );
}
