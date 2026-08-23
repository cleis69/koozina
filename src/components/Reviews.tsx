import { useEffect, useState } from "react";
import { useGsap } from "@/lib/anim";
import { useRef } from "react";
import { Reveal } from "./primitives";

/**
 * Avis — **uniquement des témoignages réels, attribués**.
 *
 * La version précédente affichait trois citations inventées signées de noms
 * inventés. Elles sont retirées : on ne fabrique pas de témoignage pour un
 * commerce réel.
 *
 * Ceux-ci sont des avis Google publics, repris mot pour mot, avec le nom
 * affiché par leur auteur et la date. Ils sont en anglais parce qu'ils ont été
 * écrits en anglais — traduire un témoignage sans le dire serait le falsifier.
 *
 * Source : agrégateur public Wanderlog (fiche Google du restaurant),
 * consulté le 22 août 2026.
 */
const AVIS = [
  {
    texte:
      "The crispy octopus on creamy mashed potatoes is a dish worth reordering—dressed with vibrant herbs and juicy tomatoes.",
    nom: "Claire J.",
    date: "janvier 2026",
  },
  {
    texte:
      "The chicken pastilla was absolutely outstanding, perfectly balanced, delicately spiced, crispy on the outside and wonderfully tender inside.",
    nom: "Berdah M.",
    date: "janvier 2026",
  },
  {
    texte:
      "The sardine meatball keftas are perfectly seasoned and melt-in-the-mouth delicious, showcasing the best of local provenance.",
    nom: "Jamie M.",
    date: "octobre 2025",
  },
  {
    texte:
      "We had the most delicious John Dory. The plate was a work of art and every morsel was delicious.",
    nom: "Bl K.",
    date: "février 2026",
  },
] as const;

function Compteur({ to, dec, suffix }: { to: number; dec: number; suffix: string }) {
  const el = useRef<HTMLSpanElement>(null);
  const format = (v: number) =>
    dec ? v.toFixed(dec).replace(".", ",") : String(Math.round(v));

  useGsap(({ gsap }) => {
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
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (m.matches) return;
    const t = window.setInterval(() => setI((v) => (v + 1) % AVIS.length), 7000);
    return () => window.clearInterval(t);
  }, []);

  return (
    <section aria-labelledby="avis-titre" className="sec bg-beige-2">
      <div className="pad-x">
        <h2 id="avis-titre" className="sr-only">
          Ce qu'en disent les clients
        </h2>

        <div className="grid gap-16 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-3">
            <Reveal>
              <dl className="flex gap-12 lg:flex-col lg:gap-10">
                <div>
                  <dt className="eyebrow text-quiet">Google</dt>
                  <dd className="mt-2 font-display text-[clamp(36px,4.6vw,62px)] font-light leading-none tracking-[-0.03em] text-ink">
                    <Compteur to={4.8} dec={1} suffix="" />
                    <span
                      aria-hidden="true"
                      className="ml-2 align-top text-[0.42em] text-poppy-dark"
                    >
                      ★
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className="eyebrow text-quiet">Tripadvisor</dt>
                  <dd className="mt-2 font-display text-[clamp(36px,4.6vw,62px)] font-light leading-none tracking-[-0.03em] text-ink">
                    <Compteur to={4.9} dec={1} suffix="" />
                    <span
                      aria-hidden="true"
                      className="ml-2 align-top text-[0.42em] text-poppy-dark"
                    >
                      ★
                    </span>
                  </dd>
                </div>
              </dl>
            </Reveal>
          </div>

          <div className="lg:col-span-8 lg:col-start-5">
            <Reveal delay={0.08}>
              {/* Hauteur réservée : la rotation ne doit pas faire sauter la page. */}
              <blockquote className="relative min-h-[260px] sm:min-h-[220px] md:min-h-[200px]">
                {AVIS.map((a, idx) => (
                  <div
                    key={a.nom}
                    aria-hidden={idx !== i}
                    /* La citation active est opaque sans transition : elle ne
                       dépend d'aucune animation pour exister. Seules les
                       sortantes s'effacent. Mesuré : quand le moteur de frames
                       est gelé (onglet en arrière-plan, économie d'énergie),
                       un fondu d'entrée n'avance jamais — la citation annoncée
                       aux lecteurs d'écran serait restée invisible. */
                    className={
                      idx === i
                        ? "opacity-100"
                        : "absolute inset-0 opacity-0 transition-opacity duration-[900ms] ease-editorial"
                    }
                  >
                    <p
                      lang="en"
                      className="font-display text-[clamp(19px,2.4vw,31px)] font-light italic leading-[1.4] tracking-[-0.02em] text-ink"
                    >
                      « {a.texte} »
                    </p>
                    <footer className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12.5px] text-quiet">
                      <cite className="not-italic">{a.nom}</cite>
                      <span aria-hidden="true" className="h-px w-6 bg-ink/25" />
                      <span>Avis Google · {a.date}</span>
                    </footer>
                  </div>
                ))}
              </blockquote>

              <div className="mt-8 flex gap-1" role="tablist" aria-label="Avis clients">
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
