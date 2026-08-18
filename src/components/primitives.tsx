import { useRef, type ReactNode } from "react";
import { E, useGsap } from "@/lib/anim";

/* ── Titre découpé par caractères dans des masques ───────────────── */
export function SplitTitle({
  text,
  className = "",
  as = "h2",
  accent,
}: {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3";
  accent?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const Tag = as as "h2";

  useGsap(({ gsap, ScrollTrigger }) => {
    const el = ref.current;
    if (!el) return;
    const chars = el.querySelectorAll<HTMLElement>("[data-ch]");
    const tw = gsap.from(chars, {
      yPercent: 108,
      duration: E.ink.d,
      ease: E.ink.ease,
      stagger: 0.024,
      scrollTrigger: { trigger: el, start: "top 88%" },
    });
    return () => {
      tw.scrollTrigger?.kill();
      tw.kill();
      ScrollTrigger.refresh();
    };
  }, []);

  const render = (chunk: string, italic: boolean, offset: number) =>
    chunk.split(" ").map((word, wi) => (
      <span key={`${offset}-${wi}`} className="inline-block whitespace-nowrap">
        {word.split("").map((c, ci) => (
          <span key={ci} className="ch-mask">
            <span
              data-ch
              className={
                italic ? "inline-block italic text-poppy" : "inline-block"
              }
            >
              {c}
            </span>
          </span>
        ))}
        <span className="inline-block">&nbsp;</span>
      </span>
    ));

  return (
    <Tag ref={ref as React.Ref<HTMLHeadingElement>} className={className}>
      {render(text, false, 0)}
      {accent ? render(accent, true, 1) : null}
    </Tag>
  );
}

/* ── Image révélée par clip-path, zoom arrière ───────────────────── */
export function RevealImage({
  src,
  alt,
  width,
  height,
  className = "",
  imgClassName = "",
  eager,
  ratio,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  imgClassName?: string;
  eager?: boolean;
  ratio?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGsap(({ gsap }) => {
    const el = ref.current;
    if (!el) return;
    const img = el.querySelector("img");
    const tl = gsap.timeline({
      scrollTrigger: { trigger: el, start: "top 85%" },
    });
    tl.from(el, {
      clipPath: "inset(0 0 100% 0)",
      duration: 1.35,
      ease: E.ink.ease,
    }).from(img, { scale: 1.32, duration: 1.8, ease: E.ink.ease }, 0);
    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  return (
    <div
      ref={ref}
      data-cursor="view"
      className={`relative overflow-hidden rounded-[4px] bg-beige-3 ${className}`}
      style={ratio ? { aspectRatio: ratio } : undefined}
    >
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        className={`h-full w-full object-cover transition-transform duration-[1400ms] ease-editorial hover:scale-[1.045] ${imgClassName}`}
      />
    </div>
  );
}

/* ── Bloc qui monte au scroll ────────────────────────────────────── */
export function Reveal({
  children,
  tempo = "beige",
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  tempo?: keyof typeof E;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGsap(({ gsap }) => {
    const el = ref.current;
    if (!el) return;
    const tw = gsap.from(el, {
      y: 44,
      opacity: 0,
      delay,
      duration: E[tempo].d,
      ease: E[tempo].ease,
      scrollTrigger: { trigger: el, start: "top 90%" },
    });
    return () => {
      tw.scrollTrigger?.kill();
      tw.kill();
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/* ── En-tête de section, structure unique réutilisée partout ─────── */
export function SectionHead({
  num,
  label,
  title,
  accent,
  intro,
  tone = "light",
}: {
  num: string;
  label: string;
  title: string;
  accent?: string;
  intro?: string;
  tone?: "light" | "dark";
}) {
  const numColor = tone === "dark" ? "text-poppy-light" : "text-poppy";
  const labelColor = tone === "dark" ? "text-beige/70" : "text-quiet";
  const titleColor = tone === "dark" ? "text-beige" : "text-ink";

  return (
    <header className="relative">
      <div className={tone === "dark" ? "rule text-beige" : "rule text-ink"} />
      <div className="relative pt-6 md:pt-8">
        <div className="flex items-baseline gap-5 md:absolute md:left-0 md:top-8">
          <span className={`font-display text-[13px] font-light ${numColor}`}>
            {num}
          </span>
          <span className={`eyebrow ${labelColor}`}>{label}</span>
        </div>
        <div className="mt-5 md:mt-0 md:pl-[104px]">
          <SplitTitle
            text={title}
            accent={accent}
            className={`h-display ${titleColor} text-[clamp(28px,4.4vw,62px)]`}
          />
          {intro ? (
            <Reveal delay={0.12}>
              <p
                className={`mt-6 max-w-[46ch] text-[14px] leading-[1.75] md:text-[15.5px] ${
                  tone === "dark" ? "text-beige/72" : "text-quiet"
                }`}
              >
                {intro}
              </p>
            </Reveal>
          ) : null}
        </div>
      </div>
    </header>
  );
}

/* ── Ponctuation : point rouge de 5px ────────────────────────────── */
export function Dot({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-block h-[5px] w-[5px] shrink-0 rounded-full bg-poppy ${className}`}
    />
  );
}
