import { useEffect, useRef, useState } from "react";
import { LogoBadge } from "./logo/LogoBadge";
import { prefersReduced } from "@/lib/anim";

/** Au-delà, on rend la main quoi qu'il arrive. */
const HARD_TIMEOUT = 3200;
const SEEN_KEY = "kz-preloader-seen";
/** 2πr pour r = 170,3 — le rayon exact de l'anneau du fichier de marque. */
const RING = 1070;

/**
 * L'anneau du logo se trace, le badge apparaît dedans, puis le rideau remonte.
 *
 * Deux garde-fous, parce qu'un preloader est le seul composant capable de
 * rendre un site entièrement inaccessible :
 *   1. `finish()` est appelé par un `setTimeout` de sécurité **et** par la fin
 *      de la timeline. Si l'import de GSAP échoue, la page se débloque quand
 *      même.
 *   2. Il ne se joue qu'une fois par session : revenir sur le site ne coûte
 *      pas 3 s de LCP à chaque fois.
 */
export function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const ring = useRef<SVGCircleElement>(null);
  const badge = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const alreadySeen =
      typeof sessionStorage !== "undefined" && sessionStorage.getItem(SEEN_KEY) === "1";

    if (prefersReduced() || alreadySeen) {
      setGone(true);
      return;
    }

    document.body.style.overflow = "hidden";
    let alive = true;
    let tl: { kill: () => void } | null = null;

    const finish = () => {
      document.body.style.overflow = "";
      try {
        sessionStorage.setItem(SEEN_KEY, "1");
      } catch {
        /* mode privé : on se contente de ne pas mémoriser */
      }
      if (alive) setGone(true);
    };

    const failsafe = window.setTimeout(finish, HARD_TIMEOUT);

    void (async () => {
      try {
        const { gsap } = await import("gsap");
        if (!alive || !root.current) return;

        const counter = { v: 0 };
        const timeline = gsap.timeline({
          onComplete: () => {
            window.clearTimeout(failsafe);
            finish();
          },
        });
        tl = timeline;

        if (ring.current) {
          timeline.fromTo(
            ring.current,
            { strokeDasharray: RING, strokeDashoffset: RING },
            { strokeDashoffset: 0, duration: 1.2, ease: "power2.inOut" },
            0,
          );
        }
        timeline
          .fromTo(
            badge.current,
            { opacity: 0, scale: 0.94 },
            { opacity: 1, scale: 1, duration: 0.9, ease: "power2.out" },
            0.45,
          )
          .to(
            counter,
            {
              v: 100,
              duration: 1.6,
              ease: "power1.inOut",
              onUpdate: () => alive && setCount(Math.round(counter.v)),
            },
            0,
          )
          .to(root.current, {
            yPercent: -100,
            duration: 0.9,
            ease: "expo.inOut",
          });
      } catch {
        // GSAP indisponible : on n'insiste pas, le failsafe fait le travail.
        window.clearTimeout(failsafe);
        finish();
      }
    })();

    return () => {
      alive = false;
      window.clearTimeout(failsafe);
      tl?.kill();
      document.body.style.overflow = "";
    };
  }, []);

  if (gone) return null;

  return (
    <div
      ref={root}
      // Rideau décoratif : le contenu réel est déjà dans le DOM derrière lui.
      aria-hidden="true"
      className="fixed inset-0 z-[80] flex flex-col items-center justify-center bg-beige"
    >
      <div ref={badge} className="w-[min(58vw,300px)]">
        <LogoBadge ringRef={ring} priority />
      </div>
      <div className="mt-10 flex items-baseline gap-3">
        <span className="eyebrow text-quiet">Chargement</span>
        <span className="font-display text-[15px] font-light tabular-nums text-ink">
          {String(count).padStart(3, "0")}
        </span>
      </div>
    </div>
  );
}
