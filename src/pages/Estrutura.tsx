import Button from "../components/Button";
import Icon from "../components/Icon";
import { Photo } from "../components/Lightbox";
import PageHero from "../components/PageHero";
import SectionHeading from "../components/SectionHeading";
import { galleryPhotos, photos } from "../data/photos";
import { useMeta } from "../hooks/useMeta";
import { cabralWa } from "../lib/links";

const features = [
  {
    photo: photos.maquinas,
    tag: "01 / Musculação",
    title: "Aparelhos diversos para cada grupo muscular.",
    text: "Máquinas, cabos e bancos distribuídos em um salão amplo e climatizado.",
  },
  {
    photo: photos.cardio,
    tag: "02 / Cardio",
    title: "Cardio ao lado da musculação.",
    text: "Equipamentos de cardio no mesmo ambiente, para montar o treino do seu jeito.",
  },
  {
    photo: photos.halteres,
    tag: "03 / Halteres",
    title: "Halteres à mão, em rack organizado.",
    text: "Uma área de halteres entre os pilares vermelhos que são a marca do salão.",
  },
];

const offers = [
  ["Musculação", "Aparelhos diversos"],
  ["Cardio", "Equipamentos de cardio"],
  ["Professores", "Acompanhamento qualificado"],
  ["Ambiente climatizado", "Conforto para treinar"],
  ["Amplo espaço", "Circulação livre entre os aparelhos"],
];

export default function Estrutura() {
  useMeta(
    "Estrutura | Central Academia Premium · Rua Cabral, Corumbá-MS",
    "Conheça a estrutura da Central Academia Premium: salão amplo e climatizado, aparelhos de musculação, cardio e professores qualificados, na Rua Cabral, em Corumbá-MS.",
    "/estrutura",
  );
  return (
    <>
      <PageHero
        eyebrow="Estrutura"
        title={
          <>
            Espaço para <em>treinar de verdade.</em>
          </>
        }
        lead="Um salão amplo e climatizado, com aparelhos diversos, cardio e professores qualificados, no Centro de Corumbá."
        photo={photos.salao}
      >
        <Button href={cabralWa("visita")} icon="whatsapp">
          Agendar uma visita
        </Button>
        <Button to="/galeria" variant="outline" icon="arrow" trailing>
          Ver a galeria
        </Button>
      </PageHero>

      <section className="section">
        <div className="wrap features">
          {features.map((feature, index) => (
            <article className={`feature ${index % 2 ? "feature--reverse" : ""}`} key={feature.tag}>
              <Photo photo={feature.photo} group={galleryPhotos} caption={false} className="feature__photo" />
              <div className="feature__copy" data-reveal>
                <span>{feature.tag}</span>
                <h2>{feature.title}</h2>
                <p>{feature.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section section--dark offers">
        <div className="wrap">
          <SectionHeading
            light
            eyebrow="O que a Premium oferece"
            title={
              <>
                Tudo no
                <br />
                <span>mesmo lugar.</span>
              </>
            }
          />
          <ul className="offer-list">
            {offers.map(([title, text], index) => (
              <li key={title} data-reveal style={{ transitionDelay: `${index * 60}ms` }}>
                <Icon name="check" size={22} />
                <strong>{title}</strong>
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section ask">
        <div className="wrap ask__box" data-reveal>
          <div>
            <p className="eyebrow">Ficou com dúvida?</p>
            <h2>
              Personal, avaliação física
              <br />
              <span>ou convênios?</span>
            </h2>
            <p>Pergunte direto para a unidade pelo WhatsApp. Eles respondem o que está disponível hoje.</p>
          </div>
          <Button href={cabralWa("servicos")} icon="whatsapp">
            Perguntar no WhatsApp
          </Button>
        </div>
      </section>
    </>
  );
}
