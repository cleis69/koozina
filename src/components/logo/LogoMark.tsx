/**
 * Le poulpe seul — la version qui reste lisible sous 40 px (header, onglet
 * WhatsApp). Fichier de marque : `public/brand/koozina-mark-simple.svg`.
 *
 * Rendu par `mask-image` plutôt que par `<img>` : le tracé est monochrome
 * (#211F1B en dur dans le fichier), or le header change de couleur selon qu'il
 * survole le hero (beige) ou repose sur le bandeau opaque (encre). Le masque
 * fait porter la couleur par `currentColor`, donc la marque suit le thème sans
 * dupliquer le fichier ni recolorer le logo.
 *
 * Le tracé fait 30 Ko : il reste un fichier externe mis en cache, jamais inliné
 * dans le bundle.
 */
export function LogoMark({
  className = "",
  title,
}: {
  className?: string;
  title?: string;
}) {
  const mask = "url(/brand/koozina-mark-simple.svg)";
  return (
    // Le tracé n'est pas carré (viewBox 305,2 × 228) : le ratio est porté par
    // le composant, sinon un appelant qui ne fixe que la largeur obtient une
    // boîte de hauteur nulle — donc rien à l'écran.
    <span
      className={`inline-block aspect-[305.2/228] bg-current ${className}`}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : "true"}
      style={{
        WebkitMaskImage: mask,
        maskImage: mask,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
        WebkitMaskSize: "contain",
        maskSize: "contain",
      }}
    />
  );
}
