import { useEffect, useRef, useState } from "react";
import { LogoBadge } from "./logo/LogoBadge";
import { prefersReduced } from "@/lib/anim";

export function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const ring = useRef<SVGCircleElement>(null);
  const [count, setCount] = useState(0);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    if (prefersReduced()) {
      setGone(true);
      document.body.style.overflow = "";
      return;
    }
    document.body.style.overflow = "hidden";
    let alive = true;
    let tl: { kill: () => void } | null = null;

    void (async () => {
      const { gsap } = await import("gsap");
      if (!alive) return;
      const el = root.current;
      if (!el) return;
      const octopus = el.querySelector("[data-logo-octopus]");
      const poppies = el.querySelectorAll("[data-logo-poppies] > g");
      const wordmark = el.querySelector("[data-logo-wordmark]");
      const counter = { v: 0 };

      tl = gsap.timeline({
        onComplete: () => {
          document.body.style.overflow = "";
          setGone(true);
        },
      });

      if (ring.current) {
        tl.fromTo(
          ring.current,
          { strokeDasharray: 560, strokeDashoffset: 560 },
          { strokeDashoffset: 0, duration: 1.5, ease: "power2.inOut" },
          0,
        );
      }
      tl.from(octopus, { opacity: 0, duration: 0.9, ease: "power2.out" }, 0.35)
        .from(
          poppies,
          {
            scale: 0,
            opacity: 0,
            transformOrigin: "center",
            duration: 0.8,
            ease: "back.out(2.2)",
            stagger: 0.12,
          },
          0.85,
        )
        .from(
          wordmark,
          { opacity: 0, y: 12, duration: 0.8, ease: "power2.out" },
          1.15,
        )
        .to(
          counter,
          {
            v: 100,
            duration: 2.1,
            ease: "power1.inOut",
            onUpdate: () => setCount(Math.round(counter.v)),
          },
          0,
        )
        .to(root.current, {
          yPercent: -100,
          duration: 1.1,
          ease: "expo.inOut",
        });
    })();

    return () => {
      alive = false;
      tl?.kill();
      document.body.style.overflow = "";
    };
  }, []);

  if (gone) return null;

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[80] flex flex-col items-center justify-center bg-beige"
    >
      <LogoBadge className="w-[min(58vw,300px)]" drawRef={ring} />
      <div className="mt-10 flex items-baseline gap-3">
        <span className="eyebrow text-quiet">Chargement</span>
        <span className="font-display text-[15px] font-light text-ink tabular-nums">
          {String(count).padStart(3, "0")}
        </span>
      </div>
    </div>
  );
}
