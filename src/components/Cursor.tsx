import { useEffect, useRef } from "react";
import { isCoarse, lerp, prefersReduced } from "@/lib/anim";

/** Point + anneau en lerp 0.16 · 64px sur les liens · 104px « Voir » sur les images */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isCoarse() || prefersReduced()) return;
    // Le curseur de remplacement est `hidden md:block`. Masquer le curseur
    // système en dehors de cette plage laissait l'utilisateur sans aucun
    // curseur entre 0 et 768px sur pointeur fin (fenêtre réduite).
    const fine = window.matchMedia("(min-width: 768px) and (pointer: fine)");
    if (!fine.matches) return;

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const pos = { ...target };
    let raf = 0;
    let mode: "" | "link" | "view" = "";

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      const el = (e.target as HTMLElement | null)?.closest?.(
        "[data-cursor], a, button",
      ) as HTMLElement | null;
      const next = (el?.dataset?.["cursor"] as "view" | undefined) ?? (el ? "link" : "");
      if (next !== mode) {
        mode = next;
        const r = ring.current;
        if (!r) return;
        r.dataset["mode"] = mode;
      }
    };

    const loop = () => {
      pos.x = lerp(pos.x, target.x, 0.16);
      pos.y = lerp(pos.y, target.y, 0.16);
      if (dot.current)
        dot.current.style.transform = `translate3d(${target.x}px,${target.y}px,0) translate(-50%,-50%)`;
      if (ring.current)
        ring.current.style.transform = `translate3d(${pos.x}px,${pos.y}px,0) translate(-50%,-50%)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(loop);

    // `cursor: none` sur <html> masquait aussi le curseur texte des champs du
    // formulaire de réservation : on le rétablit explicitement là où il porte
    // une information.
    const style = document.createElement("style");
    style.textContent =
      "html{cursor:none}" + "input,textarea,select,[contenteditable]{cursor:auto}";
    document.head.appendChild(style);

    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
      style.remove();
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[70] hidden md:block">
      <div ref={dot} className="absolute left-0 top-0 h-[5px] w-[5px] rounded-full bg-terra-ink" />
      <div
        ref={ring}
        data-mode=""
        className="group absolute left-0 top-0 flex h-[26px] w-[26px] items-center justify-center rounded-full border border-ink/40 transition-[width,height,background-color,border-color] duration-[340ms] ease-editorial data-[mode=link]:h-16 data-[mode=link]:w-16 data-[mode=view]:h-[104px] data-[mode=view]:w-[104px] data-[mode=view]:border-transparent data-[mode=view]:bg-terra-ink"
      >
        <span className="eyebrow scale-0 text-paper opacity-0 transition duration-[340ms] ease-editorial group-data-[mode=view]:scale-100 group-data-[mode=view]:opacity-100">
          Voir
        </span>
      </div>
    </div>
  );
}
