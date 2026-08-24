import { useEffect } from "react";
import { isCoarse, prefersReduced } from "@/lib/anim";

/**
 * Lenis en mode par défaut : il scrolle la fenêtre nativement.
 * Surtout PAS de wrapper `position:fixed` + `transform` — ça casse
 * `loading="lazy"`, `position:sticky` et le pin de ScrollTrigger.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (prefersReduced() || isCoarse()) return;
    let raf = 0;
    let lenis: import("lenis").default | null = null;
    let alive = true;

    void (async () => {
      const [{ default: Lenis }, { gsap }, { ScrollTrigger }] = await Promise.all([
        import("lenis"),
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (!alive) return;
      gsap.registerPlugin(ScrollTrigger);
      lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 1 });
      lenis.on("scroll", ScrollTrigger.update);
      const loop = (t: number) => {
        lenis?.raf(t);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
      ScrollTrigger.refresh();
      (window as unknown as { __lenis?: unknown }).__lenis = lenis;
    })();

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      lenis?.destroy();
      delete (window as unknown as { __lenis?: unknown }).__lenis;
    };
  }, []);

  return null;
}

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const lenis = (window as unknown as { __lenis?: { scrollTo: (t: Element) => void } }).__lenis;
  if (lenis) lenis.scrollTo(el);
  else el.scrollIntoView({ behavior: "smooth" });
}
