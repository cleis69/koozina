import { useRef, type ReactNode } from "react";
import { E, useGsap } from "@/lib/anim";
import { revealOnScroll, revealVars } from "@/lib/reveal";

/* ── Titre découpé par caractères dans des masques ─────────────────
 * Accessibilité : les lecteurs d'écran épellent un titre dont chaque
 * lettre est un élément séparé. Le texte complet est donc porté par
 * `aria-label`, et toute la découpe est masquée par `aria-hidden`.
 */
export function SplitTitle({
  text,
  className = "",
  as = "h2",
  accent,
  accentClass = "text-poppy",
}: {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3";
  accent?: string | undefined;
  /** le coquelicot pur tombe à 2,24 sur vert profond : sur fond sombre
   *  l'accent passe au rose, qui tient 7:1. */
  accentClass?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const Tag = as as "h2";
  const label = accent ? `${text} ${accent}` : text;

  useGsap(({ gsap, ScrollTrigger }) => {
    const el = ref.current;
    if (!el) return;
    const chars = el.querySelectorAll<HTMLElement>("[data-ch]");
    if (!chars.length) return;

    // le tween porte sur les caractères, le trigger sur le titre entier
    return (
      revealOnScroll(
        gsap,
        ScrollTrigger,
        chars,
        {
          from: { yPercent: 108 },
          yPercent: 0,
          duration: E.ink.d,
          ease: E.ink.ease,
          stagger: 0.024,
        },
        el,
      ) ?? undefined
    );
  }, []);

  const render = (chunk: string, italic: boolean, offset: number) =>
    chunk.split(" ").map((word, wi) => (
      <span key={`${offset}-${wi}`} className="inline-block whitespace-nowrap">
        {word.split("").map((c, ci) => (
          <span key={ci} className="ch-mask">
            <span
              data-ch
              className={
                italic ? `inline-block italic ${accentClass}` : "inline-block"
              }
            >
              {c}
            </span>
          </span>
        ))}
        {wi < chunk.split(" ").length - 1 ? (
          <span className="inline-block">&nbsp;</span>
        ) : null}
      </span>
    ));

  return (
    <Tag
      ref={ref as React.Ref<HTMLHeadingElement>}
      className={className}
      aria-label={label}
    >
      <span aria-hidden="true">
        {render(text, false, 0)}
        {accent ? (
          <>
            <span className="inline-block">&nbsp;</span>
            {render(accent, true, 1)}
          </>
        ) : null}
      </span>
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
  sizes,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  imgClassName?: string;
  eager?: boolean | undefined;
  ratio?: string | undefined;
  sizes?: string | undefined;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGsap(({ gsap, ScrollTrigger }) => {
    const el = ref.current;
    if (!el) return;
    const img = el.querySelector("img");

    const volet = revealOnScroll(gsap, ScrollTrigger, el, {
      from: { clipPath: "inset(0 0 100% 0)" },
      clipPath: "inset(0 0 0% 0)",
      duration: 1.35,
      ease: E.ink.ease,
    });
    const zoom = img
      ? revealOnScroll(
          gsap,
          ScrollTrigger,
          img,
          {
            from: { scale: 1.32 },
            scale: 1,
            duration: 1.8,
            ease: E.ink.ease,
          },
          el,
        )
      : null;

    return () => {
      volet?.();
      zoom?.();
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
        {...(sizes ? { sizes } : {})}
        loading={eager ? "eager" : "lazy"}
        {...(eager ? { fetchPriority: "high" as const } : {})}
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

  useGsap(({ gsap, ScrollTrigger }) => {
    const el = ref.current;
    if (!el) return;
    return revealOnScroll(gsap, ScrollTrigger, el, revealVars(tempo, delay)) ?? undefined;
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
  accent?: string | undefined;
  intro?: string | undefined;
  tone?: "light" | "dark";
}) {
  // 13px = petit texte, seuil 4,5. Sur fond clair le coquelicot pur ne fait
  // que 3,7–4,2 selon la nuance de beige ; sur fond sombre poppy-light fait 2,5.
  const numColor = tone === "dark" ? "text-rose" : "text-poppy-dark";
  const accentColor = tone === "dark" ? "text-rose" : "text-poppy";
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
            accentClass={accentColor}
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
