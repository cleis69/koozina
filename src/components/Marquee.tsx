import { useRef } from "react";
import { useGsap } from "@/lib/anim";

const WORDS = [
  "De l'atlantique aux jardins",
  "Huile d'olive & beurre",
  "Marché du matin",
  "Médina d'Essaouira",
  "Restaurant & shop",
];

/**
 * Bandeau sombre entre le hero et la maison : il coupe la photo, pose le noir
 * éditorial, et énonce en une ligne ce que le hero ne dit pas.
 *
 * La vitesse suit la vélocité du scroll (brief §5), mais l'inclinaison est
 * bornée à ±8° et le défilement de base ne s'arrête jamais — sans JS, le CSS
 * seul assure déjà le mouvement.
 */
export function Marquee() {
  const track = useRef<HTMLDivElement>(null);

  useGsap(({ gsap, ScrollTrigger }) => {
    const el = track.current;
    if (!el) return;

    const half = el.scrollWidth / 2;
    const tw = gsap.to(el, {
      x: -half,
      duration: 26,
      ease: "none",
      repeat: -1,
      modifiers: { x: (v) => `${parseFloat(v) % half}px` },
    });

    const st = ScrollTrigger.create({
      onUpdate: (self) => {
        const v = self.getVelocity();
        tw.timeScale(gsap.utils.clamp(0.4, 5, 1 + Math.abs(v) / 1400));
        gsap.to(el, {
          skewX: gsap.utils.clamp(-8, 8, v / -260),
          duration: 0.5,
          ease: "power2.out",
        });
      },
    });

    return () => {
      st.kill();
      tw.kill();
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="relative z-[4] overflow-hidden bg-ink py-4 text-beige"
    >
      <div ref={track} className="flex w-max will-change-transform">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0">
            {WORDS.map((w) => (
              <span
                key={w}
                className="flex items-center gap-9 whitespace-nowrap pr-9 font-display text-[clamp(15px,1.6vw,20px)] font-light italic opacity-90"
              >
                {w}
                <span className="h-1 w-1 shrink-0 rounded-full bg-poppy" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
