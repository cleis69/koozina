import { E, prefersReduced } from "./anim";

type Gsap = typeof import("gsap").gsap;
type ST = typeof import("gsap/ScrollTrigger").ScrollTrigger;
type Vars = Record<string, unknown>;

/**
 * Règle de sûreté du projet : **le contenu est visible par défaut**.
 *
 * L'erreur à ne pas reproduire (constatée sur la maquette, où les 51 blocs
 * `[data-fade]` restaient bloqués à `opacity: 0` sur mobile) vient de
 * `gsap.from({opacity: 0, scrollTrigger})` : `from` a `immediateRender: true`,
 * donc GSAP écrit l'état caché dès la création du tween. Si le trigger ne se
 * déclenche jamais — refresh manquant, viewport mobile, layout pas encore
 * stabilisé — la page reste blanche pour toujours.
 *
 * `fromTo` + `immediateRender: false` inverse la logique : rien n'est caché
 * tant que le trigger n'a pas décidé d'animer. Panne de GSAP, JS désactivé,
 * trigger muet : le pire cas est une apparition sans animation, jamais une
 * page vide.
 *
 * @param target  ce qui est animé (élément, liste d'éléments)
 * @param trigger ce qui décide du déclenchement — par défaut, la cible
 */
export function revealOnScroll(
  gsap: Gsap,
  _ScrollTrigger: ST,
  target: Element | ArrayLike<Element>,
  vars: Vars & { from: Vars },
  trigger?: Element,
) {
  const { from, ...to } = vars;
  const trig = trigger ?? firstOf(target);
  if (!trig) return null;

  // Déjà dans le viewport au montage : on n'anime pas. Cela évite le flash
  // « visible → caché → animé » que produit immediateRender: false, et laisse
  // l'intro du hero gérer sa propre chorégraphie.
  if (isInViewport(trig)) return null;

  const tw = gsap.fromTo(target, from, {
    ...to,
    immediateRender: false,
    scrollTrigger: { trigger: trig, start: "top 88%", once: true },
  });

  return () => {
    tw.scrollTrigger?.kill();
    tw.kill();
  };
}

function firstOf(t: Element | ArrayLike<Element>): Element | null {
  if (t instanceof Element) return t;
  return t.length ? (t[0] as Element) : null;
}

function isInViewport(el: Element) {
  const r = el.getBoundingClientRect();
  return r.top < window.innerHeight && r.bottom > 0;
}

/** Tempo de reveal standard, indexé sur la couleur de la section. */
export const revealVars = (tempo: keyof typeof E, delay = 0) => ({
  from: { opacity: 0, y: 44 },
  opacity: 1,
  y: 0,
  delay,
  duration: E[tempo].d,
  ease: E[tempo].ease,
});

/**
 * Un seul `ScrollTrigger.refresh()` global, après que les polices soient
 * posées et les images dimensionnées. Sans lui, les positions de départ sont
 * calculées sur un layout qui bouge encore — c'est le second facteur du bug
 * d'origine. Appelé une fois depuis le shell, jamais par composant.
 */
export function refreshWhenSettled(ScrollTrigger: ST) {
  if (prefersReduced()) return () => {};
  const refresh = () => ScrollTrigger.refresh();

  if (document.fonts) void document.fonts.ready.then(refresh);
  window.addEventListener("load", refresh, { once: true });
  // filet de sécurité si `load` a déjà eu lieu
  const t = window.setTimeout(refresh, 1200);
  return () => window.clearTimeout(t);
}
