import { useState } from "react";
import { infos } from "@/data/menu";
import { Dot, Reveal, SectionHead } from "./primitives";

/**
 * 06 · Réservation — vert nuit, le seul moment sombre du parcours.
 *
 * Pas de backend : le formulaire compose un message WhatsApp pré-rempli. C'est
 * volontaire — le restaurant prend déjà ses réservations par WhatsApp, et cela
 * évite d'introduire un service tiers, un RGPD à gérer et un point de panne
 * pour une fonction que l'équipe traite au téléphone.
 *
 * Les libellés sont visibles (jamais de placeholder seul), les champs ont des
 * cibles de 48 px, et l'ensemble reste utilisable au clavier.
 */
export function Booking() {
  const [f, setF] = useState({
    nom: "",
    couverts: "2",
    date: "",
    heure: "19:30",
    mot: "",
  });

  const message = encodeURIComponent(
    [
      `Bonjour Koozina Garden,`,
      `Je souhaite réserver une table.`,
      ``,
      `Nom : ${f.nom || "—"}`,
      `Couverts : ${f.couverts}`,
      `Date : ${f.date || "—"}`,
      `Heure : ${f.heure}`,
      f.mot ? `Message : ${f.mot}` : ``,
    ]
      .filter(Boolean)
      .join("\n"),
  );

  const field =
    "mt-2 h-12 w-full rounded-[4px] border border-beige/28 bg-beige/8 px-4 text-[14.5px] text-beige placeholder:text-beige/35 transition-colors duration-[340ms] ease-editorial focus:border-beige/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-poppy-light";
  const label = "eyebrow text-beige/62";

  return (
    <section id="reservation" data-tone="dark" className="sec sec-dark bg-green-night text-beige">
      <div className="pad-x">
        <SectionHead
          num="06"
          label="Réservation"
          title="Une table"
          accent="au jardin"
          intro="Douze couverts à l'intérieur, une trentaine sous les arcades. Le plus simple reste WhatsApp — nous répondons dans la journée."
          tone="dark"
        />

        <div className="mt-10 grid gap-10 md:mt-14 lg:grid-cols-12 lg:gap-10">
          {/* Coordonnées */}
          <div className="lg:col-span-4">
            <Reveal tempo="green">
              <dl className="space-y-8">
                <div>
                  <dt className={label}>Adresse</dt>
                  <dd className="mt-2 max-w-[28ch] text-[14.5px] leading-[1.7] text-beige/85">
                    {infos.address}
                  </dd>
                </div>
                <div>
                  <dt className={label}>Horaires</dt>
                  <dd className="mt-2 text-[14.5px] text-beige/85">
                    Tous les jours · {infos.hours}
                  </dd>
                </div>
                <div>
                  <dt className={label}>Téléphone</dt>
                  <dd className="mt-2 text-[14.5px]">
                    <a href={infos.phoneHref} className="tap link-underline text-beige/85">
                      {infos.phone}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className={label}>Instagram</dt>
                  <dd className="mt-2 text-[14.5px]">
                    <a
                      href={infos.instagram}
                      target="_blank"
                      rel="noreferrer"
                      className="tap link-underline text-beige/85"
                    >
                      {infos.instagramHandle} ↗
                    </a>
                  </dd>
                </div>
              </dl>
            </Reveal>
          </div>

          {/* Formulaire */}
          <div className="lg:col-span-7 lg:col-start-6">
            <Reveal tempo="green" delay={0.08}>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  window.open(`${infos.whatsapp}?text=${message}`, "_blank", "noopener");
                }}
                className="grid gap-6 sm:grid-cols-2"
              >
                <div className="sm:col-span-2">
                  <label htmlFor="r-nom" className={label}>
                    Votre nom
                  </label>
                  <input
                    id="r-nom"
                    required
                    autoComplete="name"
                    value={f.nom}
                    onChange={(e) => setF({ ...f, nom: e.target.value })}
                    className={field}
                  />
                </div>

                <div>
                  <label htmlFor="r-couverts" className={label}>
                    Couverts
                  </label>
                  <select
                    id="r-couverts"
                    value={f.couverts}
                    onChange={(e) => setF({ ...f, couverts: e.target.value })}
                    className={field}
                  >
                    {["1", "2", "3", "4", "5", "6", "7", "8", "Plus de 8"].map((n) => (
                      <option key={n} value={n} className="text-ink">
                        {n}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="r-date" className={label}>
                    Date
                  </label>
                  <input
                    id="r-date"
                    type="date"
                    required
                    value={f.date}
                    onChange={(e) => setF({ ...f, date: e.target.value })}
                    className={field}
                  />
                </div>

                <div>
                  <label htmlFor="r-heure" className={label}>
                    Heure
                  </label>
                  <input
                    id="r-heure"
                    type="time"
                    value={f.heure}
                    onChange={(e) => setF({ ...f, heure: e.target.value })}
                    className={field}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="r-mot" className={label}>
                    Un mot (facultatif)
                  </label>
                  <textarea
                    id="r-mot"
                    rows={3}
                    value={f.mot}
                    onChange={(e) => setF({ ...f, mot: e.target.value })}
                    placeholder="Allergies, occasion, table à l'ombre…"
                    className={`${field} h-auto py-3`}
                  />
                </div>

                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    className="pill group bg-poppy text-paper hover:bg-beige hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-beige"
                  >
                    <Dot className="bg-paper transition-transform duration-[340ms] ease-editorial group-hover:scale-[1.6]" />
                    Envoyer sur WhatsApp
                  </button>
                  <p className="mt-4 text-[12.5px] leading-relaxed text-beige/55">
                    Le formulaire ouvre WhatsApp avec votre demande déjà écrite. Rien n'est
                    enregistré sur ce site.
                  </p>
                </div>
              </form>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
