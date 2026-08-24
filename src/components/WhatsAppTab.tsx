import { useEffect, useState } from "react";
import { infos } from "@/data/menu";

/** Onglet latéral droit, pastille flottante sur mobile. */
export function WhatsAppTab() {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <a
        href={infos.whatsapp}
        target="_blank"
        rel="noreferrer"
        className={`fixed right-0 top-1/2 z-50 hidden -translate-y-1/2 bg-sage px-3 py-6 text-paper transition-[transform,opacity,background-color,color] duration-[600ms] ease-editorial hover:bg-[#25D366] hover:text-ink active:scale-[0.97] md:block ${
          shown ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        }`}
        style={{ borderRadius: "4px 0 0 4px" }}
      >
        <span className="eyebrow block" style={{ writingMode: "vertical-rl" }}>
          Réserver par WhatsApp
        </span>
      </a>

      <a
        href={infos.whatsapp}
        target="_blank"
        rel="noreferrer"
        aria-label="Réserver par WhatsApp"
        className={`fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-sage text-paper shadow-lg transition-[transform,opacity] duration-[600ms] ease-editorial active:scale-[0.94] md:hidden ${
          shown ? "translate-y-0 opacity-100" : "translate-y-24 opacity-0"
        }`}
      >
        <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current">
          <path d="M12 2a10 10 0 0 0-8.5 15.3L2 22l4.9-1.4A10 10 0 1 0 12 2Zm5.2 14.1c-.2.6-1.2 1.2-1.7 1.2-.5.1-1 .1-1.7-.1a11 11 0 0 1-5.9-5.1c-.4-.8-.6-1.6-.4-2.2.1-.5.8-1.3 1.3-1.4.3-.1.6 0 .8.4l.7 1.6c.1.3 0 .5-.2.7l-.4.5c-.2.2-.2.4-.1.6a7.4 7.4 0 0 0 3 2.9c.3.1.5.1.7-.1l.6-.7c.2-.2.4-.3.7-.2l1.6.8c.2.1.3.3.3.5 0 .2 0 .4-.1.6Z" />
        </svg>
      </a>
    </>
  );
}
