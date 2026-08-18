# Koozina Garden — site

Site vitrine de Koozina Garden, restaurant & shop à Essaouira.
**HTML5 + CSS3 + JavaScript vanilla.** Aucun build, aucun framework, aucune dépendance à installer.

```
koozina-garden/
├─ index.html          # structure, contenu, SEO, données structurées
├─ css/styles.css      # tout le style — tokens en tête de fichier
├─ js/main.js          # animations et interactions, en modules commentés
└─ README.md
```

Pour travailler dessus : ouvrez `index.html` dans un navigateur. C'est tout.

---

## Le principe à ne pas casser

**Rien n'est caché en CSS.** Tous les états de départ des animations sont posés par `gsap.from()` / `gsap.fromTo()` dans `js/main.js`. Si les CDN tombent, si le JavaScript plante, si l'utilisateur a coupé les animations — le site reste **entièrement lisible et navigable**. Ne jamais ajouter d'`opacity: 0` ou de `clip-path` masquant dans la feuille de style.

Corollaire : **pas de wrapper `position: fixed` + `transform`** pour le smooth scroll. Lenis tourne en mode natif. Un conteneur transformé casse le `loading="lazy"` (le navigateur ne charge jamais les images), `position: sticky` et le pin de ScrollTrigger.

---

## Dépendances (CDN, chargées en `defer`)

| Lib | Rôle | Version |
|---|---|---|
| GSAP + ScrollTrigger | révélations, parallaxe, épinglage | 3.12.5 |
| Lenis | smooth scroll, mode natif | 1.1.18 |

Le carrousel, l'éventail, le curseur et le menu sont en JavaScript natif — pas de lib.

---

## Le système de couleur

Chaque couleur porte un sens, et ce sens décide de son emploi. C'est la règle qui empêche les quatre couleurs d'être utilisées ensemble partout.

| Couleur | Rôle | Part |
|---|---|---|
| Beige `#F7F1E6` | la maison — papier, terre, lumière | 60 % |
| Vert `#7E8C50` → `#28301D` | le jardin | 25 % |
| Noir chaud `#15140F` | l'éditorial, la typographie | 10 % |
| Coquelicot `#D33B2C` | la cuisine — **rare**, ponctuation | 5 % |
| Rose `#D9A6A0` / `#F3E4E0` | les fleurs — atmosphérique | (dans les 5 %) |

Les tokens sont en tête de `styles.css`. **Le beige n'est jamais plat** : trois nuances alternent d'une section à l'autre, plus un voile radial très faible en haut à droite de chaque bloc.

### Transitions entre sections

Chaque section porte `data-bg` et `data-theme`. Un calque `#backdrop` en `position: fixed` prend la couleur de la section active et se fond sur 0,9 s — au lieu de couper net. `data-theme="dark"` bascule `body.on-dark`, qui redéfinit `--fg`, `--fg-soft` et `--fg-line` : tout le texte suit.

Pour ajouter une section, il suffit de lui donner ces deux attributs — le reste est automatique.

---

## Les timings suivent la palette

```js
beige → power2.out 1.25s   // doux, long — les blocs de texte
green → power3.out 1.05s   // organique — le jardin, les liens
poppy → power2.out 0.34s   // rapide, net — CTA, hover, magnétisme
rose  → sine.out   1.50s   // atmosphérique — le shop
ink   → expo.out   1.15s   // éditorial — titres, images
```

C'est ce qui fait qu'un site paraît *dessiné* et non *animé*.

---

## SEO

Présent dans `index.html` : `title`, `meta description`, `canonical`, Open Graph complet, Twitter card, balises `geo`, `robots`, et un bloc **JSON-LD `Restaurant`** avec adresse, coordonnées GPS, horaires, note agrégée, et le menu complet en `hasMenu` (6 sections, prix en MAD).

Règles à tenir :

- **un seul `<h1>`**, il contient le nom de la marque ;
- tous les plats et leurs descriptions sont dans le HTML, pas dans le JavaScript ;
- chaque image porte un `alt` descriptif — les seules exceptions sont les images purement décoratives (`alt=""`) ;
- structure sémantique : `<main>`, `<section>`, `<article>`, `<address>`, `<blockquote>`, `<nav>` ;
- lien d'évitement en tête de page.

`https://koozinagarden.com/` est un **domaine de substitution** dans le canonical, les Open Graph et le JSON-LD. À remplacer avant mise en ligne.

---

## Accessibilité

`prefers-reduced-motion` coupe animations, curseur personnalisé et épinglage. Focus visible en coquelicot. Contrastes vérifiés au ratio WCAG AA : texte 14,4 à 17,8 selon le fond, gris chaud 4,98 sur beige, beige 12,2 sur vert nuit. Le coquelicot pur ne passant pas sur le vert nuit (2,90), les fonds sombres utilisent `--poppy-l` `#D74B3D`.

---

## Points ouverts

1. **Photographies** — les images pointent vers `lh3.googleusercontent.com`, c'est-à-dire la fiche Google du restaurant. Elles appartiennent à leurs auteurs. À remplacer par les fichiers du client dans un dossier `img/` avant mise en ligne, avec des `<picture>` en AVIF/WebP.
2. **Horaires** — Google indique 21 h, leur Facebook 17 h. À confirmer.
3. **Prix des trois plats végétariens** — illisibles sur la photo de la carte, affichés « à l'ardoise » en attendant.
4. **Shop et événements** — assortiment et dates inventés pour la maquette.
5. **Formulaire de réservation** — démonstration seule, aucun envoi. À brancher sur un service ou un lien WhatsApp pré-rempli.
