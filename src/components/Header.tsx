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
  const [progress, setProgress] = useState(0);
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<string>("maison");
  const [dark, setDark] = useState(false);
  const burger = useRef<HTMLButtonElement>(null);
  const [origin, setOrigin] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setSolid(y > window.innerHeight * 0.82);
      const max = document.body.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? y / max : 0);

      const mid = y + window.innerHeight * 0.4;
      let active = sections[0].id as string;
      let onDark = false;
      for (const s of sections) {
        const el = document.getElementById(s.id);
        if (el && el.offsetTop <= mid) {
          active = s.id;
          onDark = el.dataset["tone"] === "dark";
        }
      }
      setCurrent(active);
      setDark(onDark);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
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
            className="flex items-center gap-3"
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
              onClick={() => {
                const r = burger.current?.getBoundingClientRect();
                if (r) setOrigin({ x: r.x + r.width / 2, y: r.y + r.height / 2 });
                setOpen((v) => !v);
              }}
              className="flex h-8 w-8 flex-col items-end justify-center gap-[7px]"
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
          className="h-[2px] origin-left bg-poppy transition-transform duration-150 ease-linear"
          style={{ transform: `scaleX(${progress})` }}
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

      <MenuOverlay open={open} onClose={() => setOpen(false)} origin={origin} />
    </>
  );
}
