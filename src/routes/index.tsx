import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

import { Preloader } from "@/components/Preloader";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Cursor } from "@/components/Cursor";
import { Grain } from "@/components/Grain";
import { Header } from "@/components/Header";
import { WhatsAppTab } from "@/components/WhatsAppTab";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { Maison } from "@/components/Maison";
import { Carte } from "@/components/Carte";
import { Jardin } from "@/components/Jardin";
import { Shop } from "@/components/Shop";
import { Events } from "@/components/Events";
import { Reviews } from "@/components/Reviews";
import { Booking } from "@/components/Booking";
import { Footer } from "@/components/Footer";
import { prefersReduced } from "@/lib/anim";
import { refreshWhenSettled } from "@/lib/reveal";

// Pas de head() ici : la route racine porte le title/description/og.
export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  // Un seul refresh global de ScrollTrigger, une fois les polices posées et
  // les images dimensionnées — cf. src/lib/reveal.ts.
  useEffect(() => {
    if (prefersReduced()) return;
    let dispose: (() => void) | undefined;
    void import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
      dispose = refreshWhenSettled(ScrollTrigger);
    });
    return () => dispose?.();
  }, []);

  return (
    <>
      <Preloader />
      <SmoothScroll />
      <Cursor />
      <Grain />

      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[90] focus:rounded-[4px] focus:bg-ink focus:px-4 focus:py-3 focus:text-paper"
      >
        Aller au contenu
      </a>

      <Header />

      <main id="contenu">
        <Hero />
        <Marquee />
        <Maison />
        <Carte />
        <Jardin />
        <Shop />
        <Events />
        <Reviews />
        <Booking />
      </main>

      <Footer />

      <WhatsAppTab />
    </>
  );
}
