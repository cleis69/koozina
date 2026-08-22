import { infos } from "@/data/menu";
import { LogoBadge } from "./logo/LogoBadge";
import { scrollToId } from "./SmoothScroll";
import { sections } from "./sections";

export function Footer() {
  return (
    <footer className="relative bg-beige-3 pb-10 pt-[clamp(72px,9vw,140px)]">
      <div className="pad-x">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <LogoBadge className="w-[min(58vw,232px)]" />
            <p className="mt-8 max-w-[30ch] font-display text-[clamp(17px,1.7vw,21px)] font-light italic leading-[1.4] text-ink">
              {infos.baseline}
            </p>
          </div>

          <nav aria-label="Sections du site" className="lg:col-span-3 lg:col-start-6">
            <h2 className="eyebrow text-green-2">Le site</h2>
            <ul className="mt-5 space-y-3">
              {sections.map((s) => (
                <li key={s.id}>
                  <button
                    onClick={() => scrollToId(s.id)}
                    className="tap link-underline text-[14px] text-quiet transition-colors duration-300 hover:text-ink"
                  >
                    {s.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-4 lg:col-start-9">
            <h2 className="eyebrow text-green-2">Nous trouver</h2>
            <address className="mt-5 space-y-3 text-[14px] not-italic leading-[1.7] text-quiet">
              <p className="max-w-[30ch]">{infos.address}</p>
              <p>Tous les jours · {infos.hours}</p>
              <p>
                <a href={infos.phoneHref} className="tap link-underline hover:text-ink">
                  {infos.phone}
                </a>
              </p>
              <p className="flex flex-wrap gap-x-5 gap-y-2">
                <a
                  href={infos.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="tap link-underline hover:text-ink"
                >
                  Instagram ↗
                </a>
                <a
                  href={infos.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  className="tap link-underline hover:text-ink"
                >
                  WhatsApp ↗
                </a>
              </p>
            </address>
          </div>
        </div>

        {/* Le vichy des nappes en séparateur — le seul motif autorisé. */}
        <div
          aria-hidden="true"
          className="vichy mt-16 h-[6px] w-full opacity-[0.16]"
        />

        <div className="mt-7 flex flex-col gap-3 text-[12px] text-quiet sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Koozina Garden — Essaouira, Maroc.</p>
          <p className="flex items-center gap-2">
            Cuisine à l'huile d'olive et au beurre, hormis fritures.
          </p>
        </div>
      </div>
    </footer>
  );
}
