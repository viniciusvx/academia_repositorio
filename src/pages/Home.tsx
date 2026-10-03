import { Link } from "react-router-dom";
import Button from "../components/Button";
import Icon from "../components/Icon";
import { Photo } from "../components/Lightbox";
import SectionHeading from "../components/SectionHeading";
import UnitCard from "../components/UnitCard";
import { galleryPhotos, photos } from "../data/photos";
import { plans, planNote } from "../data/plans";
import { cabral, units } from "../data/units";
import { useMeta } from "../hooks/useMeta";
import { cabralWa, mapsUrl } from "../lib/links";

const highlights = [
  ["Musculação", "Aparelhos diversos"],
  ["Cardio", "Equipamentos de cardio"],
  ["Climatizado", "Ambiente confortável"],
  ["Professores", "Acompanhamento qualificado"],
];

export default function Home() {
  useMeta(
    "Central Academia Premium | Academia na Rua Cabral, Corumbá - MS",
    "Central Academia Premium, na Rua Cabral, Centro de Corumbá-MS. Musculação em ambiente climatizado, equipamentos de cardio e professores qualificados. Fale pelo WhatsApp.",
    "/",
  );

  return (
    <>
      <section className="hero">
        <div className="hero__media">
          <picture>
            <source media="(max-width: 48rem)" srcSet={photos.halteres.src} />
            <img src={photos.salao.src} alt={photos.salao.alt} fetchPriority="high" />
          </picture>
          <div className="hero__shade" />
        </div>
        <div className="wrap hero__inner">
          <p className="eyebrow eyebrow--light hero__eyebrow">
            <span /> Rua Cabral · Centro · Corumbá-MS
          </p>
          <h1>
            <span>Central</span>
            <span>Academia</span>
            <em>Premium.</em>
          </h1>
          <p className="hero__lead">
            Musculação em ambiente climatizado, com amplo espaço, equipamentos de cardio e professores qualificados.
          </p>
          <div className="hero__actions">
            <Button href={cabralWa("planos")} icon="whatsapp">
              Conhecer os planos
            </Button>
            <Link className="text-link text-link--light" to="/estrutura">
              Ver a estrutura
            </Link>
          </div>
        </div>
        <ul className="wrap hero__facts" aria-label="Informações rápidas">
          <li>
            <Link to="/unidades/cabral#mapa">
              <small>Onde</small>
              <strong>Rua Cabral, Centro</strong>
              <span>Corumbá - MS · ver no mapa</span>
              <Icon name="arrow" size={18} />
            </Link>
          </li>
          <li>
            <Link to="/unidades/cabral#horarios">
              <small>Quando</small>
              <strong>Sáb 07:00 — 11:00</strong>
              <span>Seg a sex: confirme os horários</span>
              <Icon name="arrow" size={18} />
            </Link>
          </li>
          <li>
            <a href={cabralWa("duvidas")} target="_blank" rel="noopener noreferrer">
              <small>Contato</small>
              <strong>{cabral.contact?.display}</strong>
              <span>Chame no WhatsApp</span>
              <Icon name="arrow" size={18} />
            </a>
          </li>
        </ul>
      </section>

      <div className="ticker" aria-hidden="true">
        <div>
          Central Academia Premium <i /> Musculação <i /> Corumbá <i /> Rua Cabral <i /> Central Academia Premium <i />{" "}
          Musculação <i /> Corumbá <i /> Rua Cabral <i />
        </div>
      </div>

      <section className="section intro">
        <div className="wrap intro__grid">
          <div data-reveal>
            <p className="eyebrow">A Central</p>
            <h2>
              Uma rede feita
              <br />
              <span>em Corumbá.</span>
            </h2>
          </div>
          <div className="intro__copy" data-reveal>
            <p>
              A Central Academia reúne cinco unidades em Corumbá e Ladário. A Premium, na Rua Cabral, é a unidade com amplo
              espaço, aparelhos diversos, equipamentos de cardio, professores qualificados e ambiente climatizado.
            </p>
            <dl className="intro__stats">
              <div>
                <dt>05</dt>
                <dd>unidades</dd>
              </div>
              <div>
                <dt>02</dt>
                <dd>cidades: Corumbá e Ladário</dd>
              </div>
            </dl>
            <Link className="text-link" to="/unidades">
              Conhecer todas as unidades
            </Link>
          </div>
        </div>
      </section>

      <section className="section section--paper premium">
        <div className="wrap premium__grid">
          <div className="premium__media">
            <Photo photo={photos.halteres} group={galleryPhotos} caption={false} className="premium__a" />
            <Photo photo={photos.cardio} group={galleryPhotos} caption={false} className="premium__b" />
          </div>
          <div className="premium__copy" data-reveal>
            <p className="eyebrow">A Premium</p>
            <h2>
              Espaço para
              <br />
              <span>treinar de verdade.</span>
            </h2>
            <p>
              Um salão amplo e climatizado, com máquinas, cabos, halteres e cardio no mesmo ambiente. Monte o treino do seu
              jeito, com acompanhamento de professores qualificados.
            </p>
            <ul className="highlights">
              {highlights.map(([title, text]) => (
                <li key={title}>
                  <Icon name="check" size={20} />
                  <strong>{title}</strong>
                  <span>{text}</span>
                </li>
              ))}
            </ul>
            <Button to="/estrutura" variant="outline-dark" icon="arrow" trailing>
              Ver a estrutura
            </Button>
          </div>
        </div>
      </section>

      <section className="section section--dark units-teaser">
        <div className="wrap">
          <SectionHeading
            light
            eyebrow="Rede Central"
            title={
              <>
                Encontre sua
                <br />
                <span>Central.</span>
              </>
            }
            aside="Cinco unidades. Escolha uma para ver endereço, contato e horários."
          />
          <div className="unit-grid">
            {units.map((unit, index) => (
              <UnitCard key={unit.id} unit={unit} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="section plans-teaser">
        <div className="wrap">
          <SectionHeading
            eyebrow="Planos"
            title={
              <>
                A partir de
                <br />
                <span>R$ {Math.min(...plans.map((p) => p.price))}/mês.</span>
              </>
            }
            aside={`Valores mensais da Central Academia Premium. ${planNote}`}
          />
          <ul className="price-strip" data-reveal>
            {plans.map((plan) => (
              <li key={plan.title}>
                <span>{plan.title}</span>
                <strong>
                  <small>R$</small>
                  {plan.price}
                </strong>
              </li>
            ))}
          </ul>
          <div className="actions-row" data-reveal>
            <Button to="/planos" icon="arrow" trailing>
              Ver os planos
            </Button>
            <Button href={cabralWa("planos")} variant="outline-dark" icon="whatsapp">
              Consultar no WhatsApp
            </Button>
          </div>
        </div>
      </section>

      <section className="section section--sand gallery-teaser">
        <div className="wrap">
          <SectionHeading
            eyebrow="Galeria"
            title={
              <>
                Dentro da
                <br />
                <span>Central.</span>
              </>
            }
            aside="Toque em uma foto para ampliar."
          />
          <div className="gallery-teaser__grid">
            <Photo photo={photos.salao} group={galleryPhotos} className="gt-a" />
            <Photo photo={photos.maquinas} group={galleryPhotos} className="gt-b" />
            <Photo photo={photos.cardio} group={galleryPhotos} className="gt-c" />
          </div>
          <div className="actions-row" data-reveal>
            <Button to="/galeria" variant="outline-dark" icon="arrow" trailing>
              Ver a galeria completa
            </Button>
          </div>
        </div>
      </section>

      <section className="final-cta">
        <img src={photos.salao.src} alt="" loading="lazy" />
        <div className="final-cta__shade" />
        <div className="wrap final-cta__content" data-reveal>
          <p className="eyebrow eyebrow--light">Seu próximo treino</p>
          <h2>
            A Central Premium
            <br />
            <span>está esperando você.</span>
          </h2>
          <div className="actions-row">
            <Button href={cabralWa("visita")} icon="whatsapp">
              Agendar uma visita
            </Button>
            <Button href={mapsUrl(cabral)} variant="outline" icon="map">
              Como chegar
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
