import { Link, NavLink, Navigate, useParams } from "react-router-dom";
import Button from "../components/Button";
import HoursTable from "../components/HoursTable";
import Icon from "../components/Icon";
import { Photo } from "../components/Lightbox";
import PageHero from "../components/PageHero";
import SectionHeading from "../components/SectionHeading";
import UnitCard from "../components/UnitCard";
import { galleryPhotos } from "../data/photos";
import { photos } from "../data/photos";
import { unitById, units } from "../data/units";
import { useMeta } from "../hooks/useMeta";
import { mapEmbedUrl, mapsUrl, unitContactHref } from "../lib/links";

export function UnidadesIndex() {
  useMeta(
    "Unidades | Rede Central Academia · Corumbá e Ladário",
    "Cinco unidades da Central Academia: Premium Cabral, Centro, Nova Corumbá, Aeroporto (Corumbá-MS) e Ladário. Endereço, contato e horários.",
    "/unidades",
  );
  return (
    <>
      <PageHero
        eyebrow="Rede Central"
        title={
          <>
            Encontre sua <em>Central.</em>
          </>
        }
        lead="Cinco unidades em Corumbá e Ladário. Escolha uma para ver endereço, contato, horários e mapa."
        photo={photos.salao}
      />
      <section className="section section--dark units-teaser">
        <div className="wrap">
          <div className="unit-grid">
            {units.map((unit, index) => (
              <UnitCard key={unit.id} unit={unit} index={index} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export function UnidadeDetalhe() {
  const { id } = useParams();
  const unit = unitById(id);
  useMeta(
    unit ? `${unit.name} | ${unit.city}` : "Unidade | Central Academia",
    unit
      ? `${unit.name}: ${unit.address}. Contato, horários e mapa.`
      : "Unidade da rede Central Academia.",
    `/unidades/${id ?? ""}`,
  );
  if (!unit) return <Navigate to="/unidades" replace />;

  const contactHref = unitContactHref(unit);
  const index = units.findIndex((u) => u.id === unit.id);
  const next = units[(index + 1) % units.length];

  return (
    <>
      <PageHero
        eyebrow={unit.location}
        title={unit.id === "cabral" ? <>Central Academia <em>Premium.</em></> : unit.name}
        lead={unit.address}
        photo={unit.photo}
        logo={unit.logo}
        crumb={{ to: "/unidades", label: "Todas as unidades" }}
      >
        <Button href={mapsUrl(unit)} icon="map">
          Como chegar
        </Button>
        {contactHref && (
          <Button href={contactHref} variant="outline" icon={unit.contact?.kind === "whatsapp" ? "whatsapp" : "phone"}>
            {unit.contact?.kind === "whatsapp" ? "Falar no WhatsApp" : `Ligar ${unit.contact?.display}`}
          </Button>
        )}
      </PageHero>

      <nav className="unit-tabs wrap" aria-label="Trocar de unidade">
        {units.map((u) => (
          <NavLink key={u.id} to={`/unidades/${u.id}`} replace>
            {u.shortName}
          </NavLink>
        ))}
      </nav>

      <section className="section unit-info">
        <div className="wrap unit-info__grid">
          <div data-reveal>
            <p className="eyebrow">Informações</p>
            <ul className="facts">
              <li>
                <Icon name="pin" />
                <span>
                  <small>Endereço</small>
                  {unit.address}
                </span>
              </li>
              <li>
                <Icon name={unit.contact?.kind === "whatsapp" ? "whatsapp" : "phone"} />
                <span>
                  <small>{unit.contact?.kind === "whatsapp" ? "WhatsApp" : "Telefone"}</small>
                  {unit.contact?.display ?? "Consulte a unidade."}
                </span>
              </li>
              {unit.instagram && (
                <li>
                  <Icon name="instagram" />
                  <span>
                    <small>Instagram</small>
                    <a href={unit.instagram.url} target="_blank" rel="noopener noreferrer">
                      {unit.instagram.label}
                    </a>
                  </span>
                </li>
              )}
            </ul>
            {unit.photo && (
              <Photo photo={unit.photo} group={galleryPhotos} className="unit-info__photo" caption={false} />
            )}
          </div>
          <div id="horarios" className="hours-block" data-reveal>
            <p className="eyebrow eyebrow--light">Horários</p>
            <h2>
              Treine no
              <br />
              <span>seu horário.</span>
            </h2>
            <HoursTable unit={unit} />
            <p className="hours-block__notice">Sujeitos a alterações em feriados. Confirme com a unidade antes da visita.</p>
          </div>
        </div>
      </section>

      <section className="section section--sand map-section" id="mapa">
        <div className="wrap">
          <SectionHeading
            eyebrow="Localização"
            title={
              <>
                Como
                <br />
                <span>chegar.</span>
              </>
            }
            aside={unit.address}
          />
          <div className="map-frame" data-reveal>
            <iframe
              title={`Mapa: ${unit.name}`}
              src={mapEmbedUrl(unit)}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <a className="map-frame__link" href={mapsUrl(unit)} target="_blank" rel="noopener noreferrer">
              Abrir no Google Maps <Icon name="arrow" size={18} />
            </a>
          </div>
        </div>
      </section>

      <section className="section section--dark next-unit">
        <div className="wrap next-unit__inner" data-reveal>
          <p className="eyebrow eyebrow--light">Próxima unidade</p>
          <Link to={`/unidades/${next.id}`}>
            {next.shortName} <Icon name="arrow" size={36} />
          </Link>
        </div>
      </section>
    </>
  );
}
