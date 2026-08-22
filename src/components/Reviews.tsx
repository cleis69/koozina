import { useEffect, useRef, useState } from "react";
import { fr, prefersReduced, useGsap } from "@/lib/anim";
import { Reveal } from "./primitives";

const CHIFFRES = [
  { to: 4.8, dec: 1, label: "Note Google", suffix: " ★" },
  { to: 709, dec: 0, label: "Avis Google", suffix: "" },
  { to: 4.9, dec: 1, label: "Tripadvisor", suffix: " ★" },
];

const AVIS = [
  {
    texte:
      "Une adresse qu'on garde pour soi. Le jardin est un secret en pleine médina, et l'assiette suit.",
    nom: "Camille R.",
    source: "Google",
  },
  {
    texte:
      "Les keftas de sardines valent le détour à eux seuls. Service attentif, sans être guindé.",
    nom: "Youssef B.",
    source: "Tripadvisor",
  },
  {
    texte:
      "Nous y sommes retournés trois fois en une semaine. Le menu du jour n'a jamais déçu.",
    nom: "Anna M.",
    source: "Google",
  },
] as const;

/** Compteur animé, format fr-FR, qui se contente d'afficher sa valeur si GSAP manque. */
function Compteur({ to, dec, suffix }: { to: number; dec: number; suffix: string }) {
  const el = useRef<HTMLSpanElement>(null);
  const format = (v: number) =>
    dec ? v.toFixed(dec).replace(".", ",") : fr(Math.round(v));

  useGsap(({ gsap, ScrollTrigger }) => {
    const node = el.current;
    if (!node) return;
    const o = { v: 0 };
    const tw = gsap.to(o, {
      v: to,
      duration: 1.5,
      ease: "power2.out",
      scrollTrigger: { trigger: node, start: "top 92%", once: true },
      onUpdate: () => {
        node.textContent = format(o.v) + suffix;
      },
    });
    return () => {
      tw.scrollTrigger?.kill();
      tw.kill();
    };
  }, []);

  // Valeur finale rendue côté serveur : lisible même sans JS.
  return <span ref={el}>{format(to) + suffix}</span>;
}

export function Reviews() {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (prefersReduced()) return;
    const t = window.setInterval(() => setI((v) => (v + 1) % AVIS.length), 6500);
    return () => window.clearInterval(t);
  }, []);

  return (
    <section aria-labelledby="avis-titre" className="sec bg-beige-2">
      <div className="pad-x">
        <h2 id="avis-titre" className="sr-only">
          Ce qu'on dit de nous
        </h2>

        <div className="grid gap-16 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <dl className="space-y-10">
              {CHIFFRES.map((c) => (
                <Reveal key={c.label}>
                  <div>
                    <dt className="eyebrow text-quiet">{c.label}</dt>
                    <dd className="mt-2 font-display text-[clamp(34px,4.4vw,58px)] font-light leading-none tracking-[-0.03em] text-ink">
                      <Compteur to={c.to} dec={c.dec} suffix={c.suffix} />
                    </dd>
                  </div>
                </Reveal>
              ))}
            </dl>
          </div>

          <div className="lg:col-span-7 lg:col-start-6">
            <Reveal delay={0.08}>
              {/* Hauteur réservée : la rotation des avis ne doit pas faire
                  sauter la mise en page (CLS). */}
              <blockquote className="relative min-h-[210px] md:min-h-[190px]">
                {AVIS.map((a, idx) => (
                  <div
                    key={a.nom}
                    aria-hidden={idx !== i}
                    className={`transition-opacity duration-[900ms] ease-editorial ${
                      idx === i ? "opacity-100" : "absolute inset-0 opacity-0"
                    }`}
                  >
                    <p className="font-display text-[clamp(20px,2.5vw,32px)] font-light leading-[1.35] tracking-[-0.02em] text-ink">
                      « {a.texte} »
                    </p>
                    <footer className="mt-6 flex items-center gap-3 text-[12.5px] text-quiet">
                      <cite className="not-italic">{a.nom}</cite>
                      <span aria-hidden="true" className="h-px w-6 bg-ink/25" />
                      <span>{a.source}</span>
                    </footer>
                  </div>
                ))}
              </blockquote>

              <div className="mt-8 flex gap-2.5" role="tablist" aria-label="Avis">
                {AVIS.map((a, idx) => (
                  <button
                    key={a.nom}
                    role="tab"
                    aria-selected={idx === i}
                    aria-label={`Avis de ${a.nom}`}
                    onClick={() => setI(idx)}
                    className="flex h-11 w-11 items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-poppy"
                  >
                    <span
                      className={`block h-[5px] rounded-full transition-all duration-[340ms] ease-editorial ${
                        idx === i ? "w-7 bg-poppy" : "w-[5px] bg-ink/25"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
