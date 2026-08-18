# Koozina 

# Koozina Garden — brief de production Lovable

Document de passation : de la maquette HTML (`koozina-garden-maquette.html`) vers un projet React + Tailwind + shadcn/ui sur Lovable, puis GitHub.

---

## 1. Le client en une page

| | |
|---|---|
| **Nom** | Koozina Garden — Restaurant & Shop |
| **Lieu** | Complexe Commercial Bin Al Aswar, Bab Sbaa — Médina d'Essaouira, 44000, Maroc |
| **Téléphone / WhatsApp** | +212 707 059 002 |
| **Instagram** | [@koozinagarden_essaouira](https://www.instagram.com/koozinagarden_essaouira/) — 1 315 abonnés |
| **Horaires** | 10h — 21h *(à confirmer : Google indique 21h, leur Facebook 17h)* |
| **Budget** | 100 — 150 dh par personne |
| **Réputation** | Google 4,8 ★ (709 avis) · Tripadvisor 4,9 ★ |
| **Équipe citée sur la carte** | Mehdi et Oussama (service) |

**Positionnement.** « Né de la mer, enraciné au jardin. » Le logo dit tout : un poulpe (le port d'Essaouira, l'Atlantique) et des coquelicots (le jardin). La carte est bâtie sur cet axe — « De l'atlantique aux jardins ».

**Argument différenciant à ne pas perdre** : *cuisine uniquement à l'huile d'olive et au beurre, hormis fritures*. C'est écrit en tête de leur carte. Peu de restaurants d'Essaouira peuvent le revendiquer.

**Contexte concurrentiel.** Les tables haut de gamme d'Essaouira (Umia, La Table by Madada) n'ont pas de site officiel — réservations par téléphone ou DM Instagram. Un site avec réservation en ligne les place au-dessus du marché local, pas à son niveau.

---

## 2. Design system

Concept directeur : **Mediterranean Botanical Editorial**. Maison + jardin + magazine gastronomique. Le luxe vient de l'espace, des proportions et de la précision — jamais de l'ostentation.

### Couleurs — une narration, pas une palette

Chaque couleur porte un sens, et ce sens décide de son emploi. C'est la règle qui empêche les cinq couleurs d'être utilisées ensemble.

| Couleur | Rôle narratif | Part |
|---|---|---|
| **Beige** | la maison — papier, terre, lumière, architecture | 60 % |
| **Vert** | le jardin — plantes, herbes, fraîcheur | 25 % |
| **Noir chaud** | l'éditorial — la typographie, le contraste | 10 % |
| **Rouge coquelicot** | la cuisine — le feu, les épices, le vivant | 5 % |
| **Rose poudré** | les fleurs — bougainvilliers, lumière du soir | (compris dans les 5 %) |

```js
// tailwind.config.ts — theme.extend.colors
colors: {
  // MATIÈRE — la maison (dominante, jamais plate)
  paper:  '#FDFBF6',   beige:  '#F7F1E6',
  beige2: '#F2EADB',   beige3: '#EDE2CE',
  // JARDIN — structurel
  green:  '#7E8C50',   green2: '#5C6A38',
  greenDeep:'#38422A', greenNight:'#28301D',
  // CUISINE — signature, rare
  poppy:  '#D33B2C',   poppyDark:'#AE2A1D',
  poppyLight:'#D74B3D', // sur fonds sombres, pour le contraste
  // FLEURS — atmosphérique
  rose:   '#D9A6A0',   roseWash:'#F3E4E0', roseDeep:'#AD7068',
  // ÉDITORIAL
  ink:    '#15140F',   ink2:  '#2A2820',   muted: '#6E675A',
}
```

**Le beige n'est jamais plat.** Chaque section change de nuance (`beige` → `paper` → `beige3`), et un voile radial blanc très faible traverse chaque section en haut à droite. C'est ce qui empêche l'aplat mort.

### Chaque section porte une couleur

Le fond raconte où l'on se trouve dans la maison :

| Section | Fond | Accent |
|---|---|---|
| Hero | photographie + noir chaud | coquelicot sur le seul CTA |
| 01 · La maison | `beige` | rose sur la pastille, le vert entre avec les trois valeurs |
| 02 · La carte | `paper` | coquelicot sur les catégories, vert sur les sous-titres |
| 03 · Le jardin | `greenDeep` — **le moment végétal** | photos en pleine lumière |
| 04 · Le shop | `roseWash` — **la surprise** | rose profond sur les numéros |
| 05 · Événements | `beige3` | vert comme encre, filet coquelicot au survol |
| 06 · Réservation | `greenNight` — **le moment sombre, unique** | coquelicot sur le CTA |
| Footer | `beige3` | vert sur les intitulés |

Rythme voulu : clair → clair → vert sombre → rose → beige → vert nuit → beige. Une seule section vraiment sombre, une seule vraiment rose.

### Contrastes vérifiés

Le beige est clair : le gris chaud d'origine (`#7C7466`) tombait à 4,11 sur beige et 3,74 sur rose — sous le seuil AA. Corrigé à `#6E675A` (4,98 / 4,53). De même, le coquelicot pur ne tenait que 2,90 sur le vert nuit : les numéros de section sur fonds sombres utilisent `poppyLight` (3,24, suffisant pour du grand texte). Le rose profond est passé de `#B9857E` à `#AD7068` pour la même raison.

| Paire | Ratio |
|---|---|
| ink / beige · paper · beige3 · roseWash | 16,4 · 17,8 · 14,4 · 14,9 |
| muted / beige · roseWash | 4,98 · 4,53 |
| beige / greenNight · greenDeep | 12,2 · 9,4 |
| poppy / paper — blanc / poppy | 4,58 · 4,74 |

### Typographie

**Une seule famille display : `Zilla Slab`** — c'est la police du logo. Ne pas y substituer un Playfair ou un Cormorant, ça casse la reconnaissance de marque.

```js
fontFamily: {
  display: ['Zilla Slab', 'Rockwell', 'Roboto Slab', 'Georgia', 'serif'],
  sans:    ['Jost', 'Avenir Next', 'Helvetica Neue', 'Arial', 'sans-serif'],
}
```

Poids à charger : `Zilla Slab` ital 0,300..700 + 1,300..600 ; `Jost` 300/400/500.

| Usage | Fonte | Réglage |
|---|---|---|
| H1 hero | display 500 | `clamp(34px,6.5vw,96px)` / `leading-none` / `tracking-[-0.03em]` |
| H2 sections | display 500 | `clamp(28px,4.4vw,62px)` / `tracking-[-0.018em]` |
| Accent dans un titre | display 500 **italic**, couleur `poppy` | |
| Catégories de la carte | display 500 italic, `poppy` | `clamp(19px,2vw,25px)` |
| Noms de plats | display 500 | `clamp(14.5px,1.3vw,17px)` |
| Descriptions, corps, UI | sans 300 | 11.5px → 16px |
| Eyebrows, labels, boutons | sans 400 | 9.5–10.5px, `tracking-[0.3em]`, uppercase |

### Motifs de marque

- **Le poulpe** en filigrane géant (opacité 5 %) derrière la section carte.
- **Le vichy noir et blanc** de leurs nappes — motif signature, exploitable en séparateur ou fond de badge : deux `repeating-linear-gradient` croisés à 8 px.
- **Les arcades rayées** crème/ocre de la cour, déjà en photo hero.

### Divers

Rayon des angles : `4px` partout (jamais de `rounded-xl`). Grain SVG en overlay `mix-blend-multiply` opacité .3. Easing unique : `cubic-bezier(.16,1,.3,1)`.

---

## 3. Architecture des composants

```
src/
├─ components/
│  ├─ Preloader.tsx        // logo SVG qui se dessine + compteur + rideau
│  ├─ Cursor.tsx           // point + anneau, états link / view
│  ├─ Header.tsx           // capsule flottante (voir §4)
│  ├─ MenuOverlay.tsx      // plein écran, clip-path circulaire
│  ├─ WhatsAppTab.tsx      // onglet latéral droit
│  ├─ Hero.tsx
│  ├─ Marquee.tsx          // vitesse indexée sur la vélocité de scroll
│  ├─ Maison.tsx           // manifeste + 3 valeurs
│  ├─ Carte.tsx            // ← données dans data/menu.ts
│  ├─ GalleryHorizontal.tsx// section pinnée, scroll horizontal
│  ├─ Shop.tsx
│  ├─ Events.tsx           // aperçu image qui suit le curseur
│  ├─ Reviews.tsx          // carrousel + compteurs animés
│  ├─ Booking.tsx          // formulaire
│  └─ Footer.tsx
├─ components/logo/
│  ├─ LogoBadge.tsx        // version complète : anneau + poulpe + coquelicots + wordmark
│  └─ LogoMark.tsx         // poulpe seul, monochrome `currentColor` (header)
├─ data/menu.ts
└─ lib/useScroll.ts        // vélocité + progression, partagé
```

**Le SVG du logo est déjà vectorisé dans la maquette** — récupérer les `<path>` tels quels dans `LogoBadge` / `LogoMark`. Le poulpe seul (viewBox `18 18 156 134`) est la version lisible en dessous de 40 px.

---

### Mise en page éditoriale

Grille de **12 colonnes invisible mais stricte** — l'asymétrie doit sembler décidée, pas accidentelle.

En-tête de section, structure unique réutilisée partout :

```
──────────────────────────────────────  filet 1px
01   LA MAISON                          numéro en absolu + label
     Le poulpe                          titre décalé de 104px
     et le coquelicot                   → la colonne du numéro reste vide
     Une cuisine intuitive…             intro à 46ch max
```

Décalages en vigueur : texte du manifeste sur les colonnes 2–6, image sur 8–13 **débordant hors de la marge droite** (`margin-right: calc(-1 * var(--pad))`). Le shop échelonne ses quatre produits sur 1–4 / 6–8 / 10–12 / 3–6 avec des retraits verticaux différents et **quatre ratios d'image distincts** (4:5, 3:4, 1:1, 16:11). La galerie du jardin alterne cinq formats (`p34`, `p45`, `l32`, `sq`, `l169`) pour donner l'allure d'un reportage plutôt que d'une grille.

Respiration : `--sec-y: clamp(96px, 13vw, 210px)`. Ne jamais remplir un vide — c'est lui qui fait le haut de gamme.

### Langage graphique

Discret et fonctionnel, jamais décoratif : filets de 1 px, point rouge de 5 px en ponctuation avant les CTA, numéros de section en Zilla Slab light, chiffres romains sur les valeurs (`i`, `ii`, `iii`), index chiffré sur chaque photo de galerie (`Fig. 01`), flèches `↗` sur les liens sortants, tiret court avant chaque catégorie de carte. Le motif **vichy** de leurs nappes est réduit à une texture de 3 px disponible en classe `.vichy`, et le poulpe sert de filigrane à 4,5 % derrière la carte.

### Typographie

Zilla Slab en **300 (light)** pour tout le display — c'est ce qui donne l'air éditorial plutôt que robuste. Jost 300 pour l'information. Titres jusqu'à `clamp(34px, 6.2vw, 92px)` avec `letter-spacing: -0.035em`, italique pour l'accent.

---

## 4. Le header — deux options documentées

**Option retenue : masthead éditorial.** La capsule Ballena reposait sur `backdrop-filter: blur(25px)` — du glassmorphism, exclu par la direction artistique. Remplacée par un bandeau pleine largeur : logo à gauche, navigation en labels espacés, « ● Réserver » à droite, filet de 1 px en dessous, fond beige opaque après le hero. Un **rail d'index vertical** (01 → 06) sur le bord gauche marque la section courante en coquelicot et s'inverse sur les fonds sombres.

**Option d'origine (conservée pour mémoire) : la capsule Ballena.**

Repris de [ballenacabo.com](https://ballenacabo.com), **valeurs relevées au DevTools sur leur site** — à respecter au pixel, c'est ce qui fait la signature :

```css
/* la capsule */
position: fixed; top: 14px; left: 50%; transform: translateX(-50%);
width: min(630px, calc(100% - 24px)); height: 53px;
padding: 2.625px;              /* crée le liseré intérieur */
border-radius: 5.25px;
background: rgba(21,20,15,.19); /* Ballena : rgba(3,9,13,.19) */
backdrop-filter: blur(25px) saturate(1.3);
z-index: 1000;
```

Contenu en `flex justify-between` sur 47 px de haut :

| Zone | Spec Ballena |
|---|---|
| **Bouton gauche** | `height:47px; padding:0 15.75px; border-radius:2.625px;` **fond transparent** (pas de pastille), `font-size:10.5px; font-weight:500; letter-spacing:.05em; text-transform:uppercase` |
| **Logo** | `position:absolute; left:50%; translateX(-50%)` — hors du flux, donc parfaitement centré quelle que soit la largeur des deux autres blocs |
| **Burger droite** | **3 filets** de `32×1px`, `gap:7px`, alignés à droite, `padding-right:15.75px` |

Pièges à éviter — ce sont les erreurs que j'ai faites au premier jet :

- Le bouton gauche n'a **pas** de fond au repos. Une pastille translucide alourdit tout de suite la capsule.
- Le letter-spacing du bouton est serré (`.05em`), pas un `tracking-[0.2em]` de label. C'est du texte de bouton, pas un eyebrow.
- Le burger a **trois** filets fins de 1 px, pas deux traits épais.

Ouverture du menu : filet 1 → `translateY(8px) rotate(45deg)`, filet 2 → `opacity:0; scaleX(0)`, filet 3 → `translateY(-8px) rotate(-45deg)`.

Deux états : translucide sombre sur le hero, puis `bg-paper/88` + ombre portée au-delà de 82 % de la hauteur du viewport. Fin liseré `poppy` en bas = progression de lecture.

---

## 5. Animations

### Dépendances

```bash
npm i lenis gsap three vanta
# et pour les composants d'effet :
npx jsrepo add https://reactbits.dev/ts/tailwind/...
```

| Lib | Rôle | CDN vérifié (maquette) |
|---|---|---|
| **lenis** `1.1.18` | smooth scroll | `cdn.jsdelivr.net/npm/lenis@1.1.18/dist/lenis.min.js` |
| **gsap + ScrollTrigger** `3.12.5` | reveals, parallaxe, pin | `cdnjs…/gsap/3.12.5/{gsap,ScrollTrigger}.min.js` |
| **three** `r134` | requis par Vanta | `cdnjs…/three.js/r134/three.min.js` |
| **vanta** `0.5.24` | fond WebGL | `cdnjs…/vanta/0.5.24/vanta.waves.min.js` |

> ⚠️ Vanta impose **three r134**. Une version plus récente casse le shader — ne pas laisser Lovable mettre à jour three tout seul.

### Piège majeur — c'est ce qui a fait disparaître les photos au premier jet

Ma première version utilisait un conteneur `position:fixed` + `transform` pour le smooth scroll (façon Locomotive). Deux conséquences :

1. **`loading="lazy"` ne se déclenche jamais** — le navigateur calcule la proximité du viewport avant le transform, conclut que rien n'est visible, et ne charge aucune image.
2. `position:sticky` et le pin de ScrollTrigger deviennent inopérants, d'où mon pin « émulé » à la main.

**Lenis en mode par défaut scrolle la fenêtre nativement, sans wrapper transformé.** Lazy-loading, sticky et pin fonctionnent normalement. C'est la seule configuration à retenir.

Corollaire de méthode : **aucun état caché en CSS.** Tout est visible par défaut, et ce sont `gsap.from()` / `gsap.fromTo()` qui posent l'état de départ. Si le CDN tombe ou si GSAP plante, le site reste entièrement lisible au lieu d'afficher une page blanche.

### Le détail des effets

| Effet | Détail |
|---|---|
| Preloader | Anneau tracé (`stroke-dashoffset` 560→0, 1,5 s), poulpe en fondu, coquelicots qui éclosent en `back.out`, wordmark, compteur 0→100 sur 2,1 s, puis le calque remonte en `translateY(-100%)` |
| Smooth scroll | Lenis, lerp ≈ 0.085 |
| Titres | Découpe par caractères dans des masques `overflow-hidden`, `translateY(108%)→0`, stagger 24 ms |
| Images | `clip-path: inset(0 0 100% 0)` → `inset(0)` sur 1,35 s, image intérieure `scale(1.32)→1` sur 1,8 s |
| Parallaxe | Hero et section réservation, facteur 0.22 / 0.16 |
| Galerie | Section pinnée, translation horizontale du track indexée sur la progression, lerp 0.14, barre de progression |
| Marquee | Vitesse de base + vélocité de scroll, `skewX` borné à ±8° |
| Menu | `clip-path: circle()` depuis la position du burger, liens en cascade de 70 ms, image de fond qui change au survol |
| Curseur | Point + anneau en lerp 0.16 ; anneau à 64 px sur les liens, 104 px plein avec le mot « Voir » sur les images ; boutons magnétiques (0.22 / 0.3) |
| Compteurs | `easeOutCubic` sur 1,5 s, format `fr-FR` |

**Non négociable** : tout se coupe sous `prefers-reduced-motion` et sur pointeur grossier (curseur custom masqué, scroll natif, galerie en grille).

### Les timings suivent la palette

C'est le point qui fait qu'un site paraît *dessiné* et non *animé* : chaque couleur a son tempo.

```js
const E = {
  beige: {ease:'power2.out', d:1.25},  // doux, long — les blocs de texte
  green: {ease:'power3.out', d:1.05},  // organique — le jardin, les liens
  poppy: {ease:'power2.out', d:0.34},  // rapide, net — CTA, hover, magnétisme
  rose : {ease:'sine.out',   d:1.50},  // atmosphérique — le shop
  ink  : {ease:'expo.out',   d:1.15},  // éditorial — les titres, les images
};
```

Concrètement : les blocs du shop apparaissent en `sine.out` sur 1,5 s (rose = atmosphère) tandis que les mêmes blocs ailleurs montent en `power2.out` sur 1,25 s. Les boutons réagissent en 0,34 s. Les titres se révèlent en `expo.out`.

### 3D — retirée

Une version précédente embarquait Vanta.WAVES en fond de réservation et des cartes tiltées ±14°. **Supprimé** : décoration sans fonction, contraire à la direction artistique. `three` et `vanta` ne sont plus des dépendances. La section réservation est un aplat `greenNight` et les images se contentent d'un `scale(1.045)` très lent au survol.

Si le sujet revient : la seule 3D défendable ici serait une matière (grain, papier, tissu), jamais un objet en mouvement.

### Correspondance ReactBits

ReactBits ne s'installe pas comme une dépendance : on copie les composants dans le projet. Ceux qui correspondent aux effets ci-dessus :

| Effet de la maquette | Composant ReactBits |
|---|---|
| Titres lettre par lettre | `SplitText` |
| Blocs qui montent au scroll | `ScrollReveal` / `AnimatedContent` |
| Cartes 3D avec reflet | `TiltedCard` |
| Boutons magnétiques | `Magnet` |
| Marquee à vitesse variable | `ScrollVelocity` |
| Compteurs | `CountUp` |
| Menu plein écran | `StaggeredMenu` |
| Marquee à vitesse variable | `ScrollVelocity` |

Ne pas prendre `Silk`, `Aurora`, `Threads`, `Ballpit` ni `Orb` : ce sont des fonds WebGL décoratifs, hors sujet pour cette identité.

### Interdits

Pas de glassmorphism. Pas de dégradés saturés. Pas de doré. Pas de rose vif ni de vert néon. Pas d'arabesques ni de motifs marocains génériques — le seul motif autorisé est le vichy de leurs propres nappes. Pas de rouge en aplat sur une section entière. Pas de « boho chic » ni de « Maroc touristique ». Contemporain mais enraciné.

---

## 6. Contenus

### Carte — « Menu d'été »

*Cuisine uniquement à l'huile d'olive et au beurre (hormis fritures)*

**Brunch & breakfast** — Marrakech express 95 · Granola bowl 75 · The avocado toast 65
**Lunch — Saveurs atlantes** — Keftas de sardines façon makful 90 · Filet de St Pierre à la plancha 120 · Pinçamars en chermoula 110 · Tagine de crevette pilpil 95 · Bowl de sardines fumées et racines croquantes 95
**Meat & match** — Samosas de bœuf 95 · Pastilla de poulet fermier M'rozia 130 · Brochettes de veau aux épices du souk 130 · Kids menu 75
**Fraîcheurs du jardin (végétarien)** — Salade de chèvre chaud aux pêches grillées · Trio de briouates végétariennes · Couscous d'orge aux sept légumes *(prix non lisibles sur la carte photographiée — à récupérer)*
**Menu du jour** — affiché sur les tableaux, présenté par Mehdi et Oussama
**Gourmandises** — Mousse au chocolat 45 · Crumble aux pommes 50 · Moelleux au chocolat + glace 50 · Basboussa à l'orange + glace 50 · Café ou thé gourmand 65
**Juices** — Ginger boost 35 · Karkadé 35 · Magh'ribi shake 35
**Smoothies** — Avocado bliss 45 · Melon & mint 45 · Cinnamon beats 45
**Hot drinks** — Coffee 20 · Café latte 25 · Mint tea 25 · Royal tea with Moroccan spices 25 · Verbena tea 25 · Verbena & rose tea 25

Les descriptions complètes sont dans la maquette, section `#carte`. À sortir dans `data/menu.ts` pour que le client puisse les mettre à jour sans toucher au code.

### Photos

La maquette utilise 16 photos de leur fiche Google (`lh3.googleusercontent.com`). **Elles sont hébergées par Google et postées par des clients** — parfait pour la maquette, à remplacer par leurs fichiers avant mise en ligne. Prévoir un dossier `public/photos/` et demander les originaux.

---

## 7. Prompt initial pour Lovable

> Construis un site vitrine one-page pour **Koozina Garden**, restaurant & shop à Essaouira au Maroc. React + TypeScript + Tailwind + shadcn/ui. Objectif : niveau Awwwards, très animé, mais sobre — jamais gadget.
>
> **Identité.** Le logo est un poulpe noir avec des coquelicots rouges dans un anneau olive. Palette : crème `#F7F1E6` en fond, `#FDFBF6` pour les blocs, noir `#15140F` pour le texte et les sections sombres, rouge coquelicot `#D33B2C` en accent uniquement, olive `#7E8C50` pour le CTA WhatsApp et les prix. Police unique en display : **Zilla Slab** (celle du logo), avec ses italiques ; **Jost** 300 pour le corps et l'interface. Angles à 4 px. Grain SVG léger en overlay. Baseline : « Né de la mer, enraciné au jardin. »
>
> **Header.** Une capsule flottante fixe, centrée, `width: min(630px, 100% - 24px)`, `height: 53px`, `top: 14px`, `padding: 2.625px`, `border-radius: 5.25px`, `background: rgba(21,20,15,.19)`, `backdrop-filter: blur(25px) saturate(1.3)` — reprise de ballenacabo.com. À l'intérieur, en flex `justify-between` sur 47 px : à gauche un bouton « Réserver » **sans fond**, `padding: 0 15.75px`, `border-radius: 2.625px`, `font-size: 10.5px`, `font-weight: 500`, `letter-spacing: .05em`, uppercase, qui se remplit de rouge coquelicot au survol ; au centre le logo en `position: absolute; left: 50%; translateX(-50%)` ; à droite un burger de **trois filets** de 32×1 px espacés de 7 px. Après le hero, la capsule passe en crème `rgba(253,251,246,.88)` avec ombre portée. Un liseré rouge de progression de lecture court en bas de la capsule.
>
> **Sections.** Hero plein écran avec photo en parallaxe et titre révélé lettre par lettre — bandeau d'infos en bas (horaires, cuisine, budget, note Google). Marquee sombre. Manifeste « Le poulpe et le coquelicot » avec photo en révélation par clip-path et pastille rouge « 100 % fait maison ». Trois valeurs. **La carte** sur fond papier, trois colonnes, titres de catégorie en italique rouge, filigrane du poulpe à 5 % derrière. Galerie horizontale pinnée au scroll. Shop sur fond noir. Événements en liste, avec aperçu photo qui suit le curseur au survol. Avis en carrousel avec compteurs animés. Réservation : coordonnées à gauche, formulaire à droite, sur photo assombrie. Footer avec le logo complet.
>
> **Animations.** Utilise `lenis` (mode par défaut, scroll natif — **surtout pas** de wrapper `position:fixed` + `transform`, ça casse le lazy-loading des images et le pin) et `gsap` + `ScrollTrigger`. Règle absolue : aucun état caché en CSS, tous les états de départ sont posés par `gsap.from()`, pour que le site reste lisible si le CDN tombe.
>
> Preloader où le logo se dessine (anneau tracé en `stroke-dashoffset`, poulpe en fondu, coquelicots qui éclosent en `back.out`) avec compteur 0→100, puis rideau qui remonte. Curseur personnalisé point + anneau, qui grossit sur les liens et affiche « Voir » sur les images. Boutons magnétiques. Titres découpés par caractères dans des masques. Images révélées par `clip-path` avec zoom arrière. Galerie horizontale **pinnée avec `ScrollTrigger.pin`**, barre de progression, tuiles qui pivotent de `rotateY:8°` à `-8°` en traversant. Marquee dont la vitesse et l'inclinaison suivent `getVelocity()`. Menu plein écran en clip-path circulaire depuis le burger, liens en cascade, image de fond qui change au survol. Easing unique : `cubic-bezier(.16,1,.3,1)`.
>
> **3D.** `three` en **r134** (imposé par Vanta) + `vanta` : `VANTA.WAVES` en fond de la section réservation, `color: 0x1e2a1c`, `waveHeight: 15`, `waveSpeed: .55`, `zoom: .92`, `mouseControls: true` — une surface d'eau animée, avec une photo en secours dessous si WebGL manque. Cartes 3D façon ReactBits `TiltedCard` sur les tuiles de galerie et les produits : `rotateX/rotateY` ±14° suivant la souris, `transformPerspective: 900`, retour `elastic.out(1,.55)`, reflet radial suivant le curseur.
>
> Tout se désactive sous `prefers-reduced-motion` et sur pointeur grossier.
>
> **Un onglet WhatsApp** fixe sur le bord droit, texte vertical « Réserver par WhatsApp », fond olive qui passe au vert WhatsApp au survol, qui glisse depuis la droite après 60 % du hero. Sur mobile il devient une pastille flottante en bas à droite. Lien : `https://wa.me/212707059002`.
>
> Mets tout le contenu de la carte dans `src/data/menu.ts`. Je te fournis le texte juste après.

Enchaîner ensuite avec : le contenu du §6, puis les vraies photos, puis les ajustements.

---

## 8. À faire confirmer avec le client

1. **Horaires réels** — Google dit 21h, Facebook 17h.
2. **Prix des trois plats végétariens** — illisibles sur la photo de la carte.
3. **Jour de fermeture** — Google n'en indique aucun.
4. **Photos** — obtenir les originaux, les Google Photos appartiennent à leurs auteurs.
5. **Le shop** — quatre produits inventés dans la maquette (conserves, céramique, douceurs, linge de table). Demander le vrai assortiment.
6. **Les événements** — quatre dates inventées, à remplacer par leur vrai calendrier.
7. **Fiche Google** — pendant qu'on y est : ajouter le lien du site, les photos pro, et le menu.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/ae3ed90a-7e78-4e0b-9f97-a534bfcf749a).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
