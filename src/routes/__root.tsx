import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

const TITLE = "Koozina Garden — Restaurant & Shop · Médina d'Essaouira";
const DESCRIPTION =
  "Né de la mer, enraciné au jardin. Cuisine à l'huile d'olive et au beurre, " +
  "écrite chaque matin au retour du marché. Bab Sbaa, médina d'Essaouira — " +
  "ouvert tous les jours de 10h à 21h.";

/**
 * Données structurées : c'est le balisage le plus rentable pour un restaurant
 * (horaires, note, gamme de prix et bouton d'appel directement dans les
 * résultats Google). Rien ici n'est décoratif.
 */
const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: "Koozina Garden",
  description: DESCRIPTION,
  servesCuisine: ["Marocaine", "Méditerranéenne", "Poissons et fruits de mer"],
  priceRange: "100–150 MAD",
  telephone: "+212707059002",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Complexe Commercial Bin Al Aswar, Bab Sbaa",
    addressLocality: "Essaouira",
    postalCode: "44000",
    addressCountry: "MA",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "10:00",
      closes: "21:00",
    },
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    reviewCount: "709",
  },
  sameAs: ["https://www.instagram.com/koozinagarden_essaouira/"],
};

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { name: "author", content: "Koozina Garden" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "restaurant.restaurant" },
      { property: "og:locale", content: "fr_MA" },
      { property: "og:site_name", content: "Koozina Garden" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
      { property: "og:image", content: "/brand/koozina-logo-1024.png" },
      { property: "og:image:alt", content: "Logo de Koozina Garden" },
      { name: "twitter:image", content: "/brand/koozina-logo-1024.png" },
      // Vert profond de la maison plutôt que l'olive du logo (#929261) : la
      // barre du navigateur jouxte le hero, qui est sombre.
      { name: "theme-color", content: "#38422A" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      // Kit de marque livré par le graphiste (public/). SVG d'abord : net à
      // toute taille ; le .ico et les PNG servent de repli aux navigateurs qui
      // ne lisent pas le SVG. Le 16 px utilise le poulpe simplifié — le badge
      // complet devient illisible à cette taille.
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "icon", href: "/favicon.ico", sizes: "any" },
      { rel: "icon", href: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { rel: "icon", href: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png", sizes: "180x180" },
      { rel: "mask-icon", href: "/safari-pinned-tab.svg", color: "#929261" },
      { rel: "manifest", href: "/site.webmanifest" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <HeadContent />
        <script
          type="application/ld+json"
          // Contenu statique défini dans ce fichier — aucune donnée externe.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
