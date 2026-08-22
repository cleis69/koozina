#!/usr/bin/env node
/**
 * Génère tous les formats bitmap du logo à partir des SVG sources.
 *
 * Pourquoi un script et pas des fichiers versionnés : un seul SVG source, une
 * seule vérité. Quand le logo définitif du graphiste arrive, on remplace
 * `public/favicon.svg` et `public/brand/logo.svg`, on relance, et les 9
 * fichiers se régénèrent.
 *
 *   bun add -d sharp png-to-ico
 *   node scripts/icons.mjs
 *
 * Produit dans public/ :
 *   favicon-16.png · favicon-32.png · favicon-48.png · favicon.ico
 *   apple-touch-icon.png (180)  ·  icon-192.png  ·  icon-512.png
 *   icon-512-maskable.png (avec la marge de sécurité de 10 % exigée par Android)
 *   og-image.png (1200×630, pour les partages)
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const pub = resolve(root, "public");

let sharp, pngToIco;
try {
  ({ default: sharp } = await import("sharp"));
  ({ default: pngToIco } = await import("png-to-ico"));
} catch {
  console.error(
    "\n  Dépendances manquantes. Lance d'abord :\n" +
      "    bun add -d sharp png-to-ico\n",
  );
  process.exit(1);
}

const markSvg = await readFile(resolve(pub, "favicon.svg"));

const png = (size, input = markSvg) =>
  sharp(input, { density: 384 }).resize(size, size).png({ compressionLevel: 9 }).toBuffer();

const out = async (name, buf) => {
  await writeFile(resolve(pub, name), buf);
  console.log(`  ✓ public/${name}`);
};

await mkdir(pub, { recursive: true });
console.log("\nGénération des icônes…\n");

// Favicons classiques
for (const s of [16, 32, 48]) await out(`favicon-${s}.png`, await png(s));

// .ico multi-résolutions — encore nécessaire pour les vieux Safari et Windows
await out(
  "favicon.ico",
  await pngToIco([16, 32, 48].map((s) => resolve(pub, `favicon-${s}.png`))),
);

// iOS : pas de transparence, fond opaque obligatoire
await out(
  "apple-touch-icon.png",
  await sharp(markSvg, { density: 384 })
    .resize(180, 180)
    .flatten({ background: "#F7F1E6" })
    .png()
    .toBuffer(),
);

// PWA
await out("icon-192.png", await png(192));
await out("icon-512.png", await png(512));

// Maskable : la marque doit tenir dans le cercle sûr de 80 % → 10 % de marge
await out(
  "icon-512-maskable.png",
  await sharp({
    create: { width: 512, height: 512, channels: 4, background: "#F7F1E6" },
  })
    .composite([{ input: await png(410), gravity: "center" }])
    .png()
    .toBuffer(),
);

// Open Graph : 1200×630, la marque centrée sur le beige de la maison
await out(
  "og-image.png",
  await sharp({
    create: { width: 1200, height: 630, channels: 4, background: "#F7F1E6" },
  })
    .composite([{ input: await png(400), gravity: "center" }])
    .png()
    .toBuffer(),
);

console.log("\nTerminé.\n");
