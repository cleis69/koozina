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
  accentClass = "text-terra-ink",
  stack = false,
}: {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3";
  accent?: string | undefined;
  /** l'accent descend sur sa propre ligne, en italique et plus petit */
  stack?: boolean;
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
          // 128 et non 108 : `ch-mask` porte desormais 0.2em de padding bas
          // pour laisser passer les jambages, soit ~23% d'une boite a 0.88em.
          // A 108% une amorce de glyphe restait visible sous le masque.
          from: { yPercent: 128 },
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
              className={italic ? `inline-block italic ${accentClass}` : "inline-block"}
            >
              {c}
            </span>
          </span>
        ))}
        {wi < chunk.split(" ").length - 1 ? <span className="inline-block">&nbsp;</span> : null}
      </span>
    ));

  return (
    <Tag ref={ref as React.Ref<HTMLHeadingElement>} className={className} aria-label={label}>
      <span aria-hidden="true">
        {render(text, false, 0)}
        {accent ? (
          stack ? (
            /* L'accent descend sur sa propre ligne, en bas de casse et deux
               fois plus petit. C'est ce contraste — masse capitale au-dessus,
               italique menu en dessous — qui donne sa forme au titre, sans
               ajouter la moindre police. */
            <span className="mt-1 block text-[0.42em] normal-case tracking-[-0.01em]">
              {render(accent, true, 1)}
            </span>
          ) : (
            <>
              <span className="inline-block">&nbsp;</span>
              {render(accent, true, 1)}
            </>
          )
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
      className={`relative overflow-hidden rounded-[28px] bg-sand ${className}`}
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
  poids = "moyen",
}: {
  num: string;
  label: string;
  title: string;
  accent?: string | undefined;
  intro?: string | undefined;
  /**
   * `light`  fonds beige et papier
   * `dark`   fonds vert profond et vert nuit
   * `solid`  aplats saturés (coquelicot) — troisième cas necessaire : le rose
   *          de l'accent tombe a 2,24 sur le coquelicot, et le blanc casse
   *          n'y tient que par sa clarte. Numero et accent passent en papier.
   */
  tone?: "light" | "dark" | "solid";
  /**
   * Poids de la section dans le recit. La maquette module l'echelle des titres
   * — 132 px pour la carte, 72 px pour les avis — au lieu de les aligner tous
   * sur une meme valeur, ce qui aplatissait la hierarchie.
   */
  poids?: "fort" | "moyen" | "discret";
}) {
  const ECHELLE = {
    fort: "text-[clamp(36px,8vw,132px)]",
    moyen: "text-[clamp(38px,5.4vw,84px)]",
    discret: "text-[clamp(34px,4.6vw,72px)]",
  } as const;
  // 13px = petit texte, seuil 4,5. Sur fond clair le coquelicot pur ne fait
  // que 3,7–4,2 selon la nuance de beige ; sur fond sombre poppy-light fait 2,5.
  const clair = tone !== "light";
  const numColor =
    tone === "solid" ? "text-paper" : tone === "dark" ? "text-peach" : "text-terra-ink";
  const accentColor =
    tone === "solid" ? "text-paper/85" : tone === "dark" ? "text-peach" : "text-terra-ink";
  const labelColor =
    tone === "solid" ? "text-paper/80" : tone === "dark" ? "text-paper/70" : "text-quiet";
  const titleColor = clair ? (tone === "solid" ? "text-paper" : "text-paper") : "text-ink";

  return (
    <header className="relative">
      <div className={clair ? "rule text-paper" : "rule text-ink"} />
      {/* Un seul bord gauche.
          La version precedente posait le numero en marge et decalait le titre
          de 104 px. Mesure a 1440 px : trois bords distincts coexistaient sur
          la meme page — 72 pour le numero, 176 pour le titre, 72 ou 183 pour
          le corps selon la section. Un ecart de 7 px n'est pas un parti pris,
          c'est une gouttiere qui a fui. Numero, titre, intro et corps
          partagent desormais la marge : rien ne peut plus deriver. */}
      <div className="pt-5 md:pt-6">
        <div className="flex items-baseline gap-4">
          <span className={`font-display text-[12px] font-light ${numColor}`}>{num}</span>
          <span className={`eyebrow ${labelColor}`}>{label}</span>
        </div>

        <SplitTitle
          text={title}
          accent={accent}
          accentClass={accentColor}
          className={`type-mass mt-4 ${titleColor} ${ECHELLE[poids]}`}
          stack
        />

        {intro ? (
          <Reveal delay={0.12}>
            <p
              className={`mt-5 hidden max-w-[46ch] text-[14px] leading-[1.7] md:block md:text-[15px] ${
                tone === "solid"
                  ? "text-paper/85"
                  : tone === "dark"
                    ? "text-paper/72"
                    : "text-quiet"
              }`}
            >
              {intro}
            </p>
          </Reveal>
        ) : null}
      </div>
    </header>
  );
}

/* ── Ponctuation : point rouge de 5px ────────────────────────────── */
export function Dot({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-block h-[5px] w-[5px] shrink-0 rounded-full bg-terra-ink ${className}`}
    />
  );
}
