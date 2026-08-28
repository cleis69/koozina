/**
 * Prefixe un chemin statique par la base de deploiement.
 *
 * En dev et sur un hebergement a la racine, `BASE_URL` vaut « / » et la
 * fonction ne change rien. Sur GitHub Pages, le site vit sous
 * « /koozina/ » : sans ce prefixe, toutes les photos, la marque et les
 * favicons renvoient 404, y compris ceux charges paresseusement depuis le
 * bundle — que reecrire le HTML final n'aurait pas corriges.
 */
export function asset(chemin: string): string {
  const base = import.meta.env.BASE_URL || "/";
  return `${base.replace(/\/$/, "")}/${chemin.replace(/^\//, "")}`;
}
