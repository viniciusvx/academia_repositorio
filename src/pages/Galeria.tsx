import Button from "../components/Button";
import { Photo } from "../components/Lightbox";
import PageHero from "../components/PageHero";
import { galleryPhotos, photos } from "../data/photos";
import { useMeta } from "../hooks/useMeta";
import { cabralWa } from "../lib/links";

export default function Galeria() {
  useMeta(
    "Galeria de fotos | Central Academia Premium · Corumbá-MS",
    "Fotos da Central Academia Premium, na Rua Cabral, em Corumbá-MS: salão, máquinas, halteres e área de cardio.",
    "/galeria",
  );
  return (
    <>
      <PageHero
        eyebrow="Galeria"
        title={
          <>
            Movimento. <em>Constância. Central.</em>
          </>
        }
        lead="Toque ou clique em uma foto para ampliar. Use as setas ou arraste para ver as próximas."
        photo={photos.maquinas}
      />
      <section className="section section--sand">
        <div className="wrap gallery">
          {galleryPhotos.map((photo, index) => (
            <Photo key={photo.id} photo={photo} group={galleryPhotos} className={`g-${index + 1}`} />
          ))}
        </div>
      </section>
      <section className="section final-strip">
        <div className="wrap final-strip__inner" data-reveal>
          <h2>
            Gostou do espaço?
            <br />
            <span>Venha treinar.</span>
          </h2>
          <div className="actions-row">
            <Button href={cabralWa("visita")} icon="whatsapp">
              Agendar uma visita
            </Button>
            <Button to="/planos" variant="outline-dark" icon="arrow" trailing>
              Ver os planos
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
