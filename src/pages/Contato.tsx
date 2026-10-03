import Button from "../components/Button";
import Icon from "../components/Icon";
import PageHero from "../components/PageHero";
import SectionHeading from "../components/SectionHeading";
import { photos } from "../data/photos";
import { cabral, units } from "../data/units";
import { useMeta } from "../hooks/useMeta";
import { cabralWa, mapEmbedUrl, mapsUrl, unitContactHref } from "../lib/links";

const reasons = [
  { key: "planos", title: "Conhecer os planos", text: "Valores e condições da Premium." },
  { key: "visita", title: "Agendar uma visita", text: "Conheça o espaço antes de começar." },
  { key: "duvidas", title: "Tirar dúvidas", text: "Pergunte o que quiser sobre a academia." },
  { key: "horarios", title: "Confirmar horários", text: "Segunda a sexta, feriados e mais." },
] as const;

export default function Contato() {
  useMeta(
    "Contato | Central Academia Premium · WhatsApp e endereço, Corumbá-MS",
    "Fale com a Central Academia Premium pelo WhatsApp (67) 99960-3997. Rua Cabral, Centro, Corumbá-MS. Contatos de todas as unidades da rede.",
    "/contato",
  );
  return (
    <>
      <PageHero
        eyebrow="Contato"
        title={
          <>
            Vamos <em>conversar?</em>
          </>
        }
        lead="A forma mais rápida de falar com a Central Academia Premium é pelo WhatsApp."
        photo={photos.halteres}
      >
        <Button href={cabralWa("planos")} icon="whatsapp">
          {cabral.contact?.display}
        </Button>
        <Button href={cabral.instagram?.url} variant="outline" icon="instagram">
          {cabral.instagram?.label}
        </Button>
      </PageHero>

      <section className="section">
        <div className="wrap">
          <SectionHeading
            eyebrow="WhatsApp da Premium"
            title={
              <>
                Escolha o
                <br />
                <span>assunto.</span>
              </>
            }
            aside="Cada botão abre o WhatsApp com a mensagem já escrita."
          />
          <div className="reason-grid">
            {reasons.map((reason, index) => (
              <a
                key={reason.key}
                className="reason"
                href={cabralWa(reason.key)}
                target="_blank"
                rel="noopener noreferrer"
                data-reveal
                style={{ transitionDelay: `${index * 60}ms` }}
              >
                <Icon name="whatsapp" size={24} />
                <h3>{reason.title}</h3>
                <p>{reason.text}</p>
                <span>
                  Abrir conversa <Icon name="arrow" size={16} />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--dark contact-units">
        <div className="wrap">
          <SectionHeading
            light
            eyebrow="Todas as unidades"
            title={
              <>
                Contato por
                <br />
                <span>unidade.</span>
              </>
            }
          />
          <ul className="contact-list">
            {units.map((unit) => {
              const href = unitContactHref(unit);
              return (
                <li key={unit.id} data-reveal>
                  <div>
                    <h3>{unit.shortName}</h3>
                    <p>{unit.address}</p>
                  </div>
                  <div className="contact-list__actions">
                    {href && (
                      <Button
                        href={href}
                        variant="outline"
                        icon={unit.contact?.kind === "whatsapp" ? "whatsapp" : "phone"}
                      >
                        {unit.contact?.kind === "whatsapp" ? `WhatsApp ${unit.contact.display}` : `Ligar ${unit.contact?.display}`}
                      </Button>
                    )}
                    <Button href={mapsUrl(unit)} variant="ghost" icon="map">
                      Como chegar
                    </Button>
                    {unit.instagram && (
                      <Button href={unit.instagram.url} variant="ghost" icon="instagram">
                        {unit.instagram.label}
                      </Button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="section section--sand map-section">
        <div className="wrap">
          <SectionHeading
            eyebrow="Premium Cabral"
            title={
              <>
                Venha
                <br />
                <span>nos visitar.</span>
              </>
            }
            aside={cabral.address}
          />
          <div className="map-frame" data-reveal>
            <iframe
              title="Mapa: Central Academia Premium"
              src={mapEmbedUrl(cabral)}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <a className="map-frame__link" href={mapsUrl(cabral)} target="_blank" rel="noopener noreferrer">
              Abrir no Google Maps <Icon name="arrow" size={18} />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
