import { useEffect } from "react";

/** Les timings suivent la palette — chaque couleur a son tempo. */
export const E = {
  beige: { ease: "power2.out", d: 1.25 },
  green: { ease: "power3.out", d: 1.05 },
  poppy: { ease: "power2.out", d: 0.34 },
  rose: { ease: "sine.out", d: 1.5 },
  ink: { ease: "expo.out", d: 1.15 },
} as const;

export const prefersReduced = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const isCoarse = () =>
  typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;

type GsapCtx = {
  gsap: typeof import("gsap").gsap;
  ScrollTrigger: typeof import("gsap/ScrollTrigger").ScrollTrigger;
};

/**
 * Charge gsap + ScrollTrigger côté client uniquement.
 * Règle absolue : aucun état caché en CSS — tous les états de départ sont
 * posés ici, pour que le site reste lisible si gsap ne charge pas.
 */
export function useGsap(cb: (ctx: GsapCtx) => void | (() => void), deps: unknown[] = []) {
  useEffect(() => {
    if (prefersReduced()) return;
    let alive = true;
    let cleanup: void | (() => void);

    void (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      gsap.registerPlugin(ScrollTrigger);
      if (!alive) return;
      cleanup = cb({ gsap, ScrollTrigger });
    })();

    return () => {
      alive = false;
      if (typeof cleanup === "function") cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const fr = (n: number) => new Intl.NumberFormat("fr-FR").format(n);
