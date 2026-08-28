export type Dish = {
  name: string;
  desc?: string;
  price?: number;
  note?: string;
};

export type MenuCategory = {
  id: string;
  title: string;
  subtitle?: string;
  dishes: Dish[];
};

export const menuNote = "Cuisine uniquement à l'huile d'olive et au beurre, hormis fritures.";

export const menu: MenuCategory[] = [
  {
    id: "brunch",
    title: "Brunch & breakfast",
    subtitle: "Servi de 10h à 13h",
    dishes: [
      {
        name: "Marrakech express",
        desc: "Œufs, khlii, pain maison, msemen, confitures du jardin",
        price: 95,
      },
      {
        name: "Granola bowl",
        desc: "Granola maison, yaourt fermier, fruits de saison, miel d'Essaouira",
        price: 75,
      },
      {
        name: "The avocado toast",
        desc: "Pain au levain, avocat, citron confit, graines torréfiées",
        price: 65,
      },
    ],
  },
  {
    id: "atlantes",
    title: "Lunch — Saveurs atlantes",
    subtitle: "De l'atlantique",
    dishes: [
      {
        name: "Keftas de sardines façon makful",
        desc: "Sardines du port, chermoula, herbes du jardin",
        price: 90,
      },
      {
        name: "Filet de St Pierre à la plancha",
        desc: "Légumes rôtis, huile d'olive citronnée",
        price: 120,
      },
      {
        name: "Pinçamars en chermoula",
        desc: "Pêche du jour, épices douces, coriandre",
        price: 110,
      },
      {
        name: "Tagine de crevette pilpil",
        desc: "Ail, piment doux, huile d'olive, pain maison",
        price: 95,
      },
      {
        name: "Bowl de sardines fumées et racines croquantes",
        desc: "Sardines fumées maison, racines, vinaigrette au citron confit",
        price: 95,
      },
    ],
  },
  {
    id: "meat",
    title: "Meat & match",
    subtitle: "Enraciné à la terre",
    dishes: [
      {
        name: "Samosas de bœuf",
        desc: "Épices du souk, salade d'herbes",
        price: 95,
      },
      {
        name: "Pastilla de poulet fermier M'rozia",
        desc: "Amandes, miel, cannelle",
        price: 130,
      },
      {
        name: "Brochettes de veau aux épices du souk",
        desc: "Légumes grillés, sauce au beurre d'herbes",
        price: 130,
      },
      { name: "Kids menu", desc: "Au choix, servi avec une boisson", price: 75 },
    ],
  },
  {
    id: "jardin",
    title: "Fraîcheurs du jardin",
    subtitle: "Végétarien",
    dishes: [
      {
        name: "Salade de chèvre chaud aux pêches grillées",
        desc: "Roquette, miel, amandes torréfiées",
        note: "Prix à confirmer",
      },
      {
        name: "Trio de briouates végétariennes",
        desc: "Légumes de saison, fromage frais, herbes",
        note: "Prix à confirmer",
      },
      {
        name: "Couscous d'orge aux sept légumes",
        desc: "Bouillon d'herbes, huile d'olive",
        note: "Prix à confirmer",
      },
    ],
  },
  {
    id: "jour",
    title: "Menu du jour",
    subtitle: "Selon le marché",
    dishes: [
      {
        name: "Affiché sur les tableaux",
        desc: "Présenté à table par Mehdi et Oussama",
      },
    ],
  },
  {
    id: "gourmandises",
    title: "Gourmandises",
    dishes: [
      { name: "Mousse au chocolat", price: 45 },
      { name: "Crumble aux pommes", price: 50 },
      { name: "Moelleux au chocolat", desc: "Et sa glace", price: 50 },
      { name: "Basboussa à l'orange", desc: "Et sa glace", price: 50 },
      { name: "Café ou thé gourmand", price: 65 },
    ],
  },
  {
    id: "juices",
    title: "Juices",
    dishes: [
      { name: "Ginger boost", price: 35 },
      { name: "Karkadé", price: 35 },
      { name: "Magh'ribi shake", price: 35 },
    ],
  },
  {
    id: "smoothies",
    title: "Smoothies",
    dishes: [
      { name: "Avocado bliss", price: 45 },
      { name: "Melon & mint", price: 45 },
      { name: "Cinnamon beats", price: 45 },
    ],
  },
  {
    id: "hot",
    title: "Hot drinks",
    dishes: [
      { name: "Coffee", price: 20 },
      { name: "Café latte", price: 25 },
      { name: "Mint tea", price: 25 },
      { name: "Royal tea with Moroccan spices", price: 25 },
      { name: "Verbena tea", price: 25 },
      { name: "Verbena & rose tea", price: 25 },
    ],
  },
];

export const infos = {
  name: "Koozina Garden",
  baseline: "Né de la mer, enraciné au jardin.",
  address: "Complexe Commercial Bin Al Aswar, Bab Sbaa — Médina d'Essaouira, 44000, Maroc",
  phone: "+212 707 059 002",
  phoneHref: "tel:+212707059002",
  whatsapp: "https://wa.me/212707059002",
  instagram: "https://www.instagram.com/koozinagarden_essaouira/",
  instagramHandle: "@koozinagarden_essaouira",
  hours: "10h — 21h",
  budget: "100 — 150 dh / personne",
  // Le nombre d'avis varie selon la source et la date (591, 688, 709 relevés) :
  // on n'affiche que la note, qui est stable et vérifiable.
  google: "4,8 ★ Google",
};
