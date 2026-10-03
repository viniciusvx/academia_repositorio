import salao from "../assets/photos/salao.webp";
import halteres from "../assets/photos/halteres.webp";
import cardio from "../assets/photos/cardio.webp";
import maquinas from "../assets/photos/maquinas.webp";
import logoNova from "../assets/photos/logo-nova-corumba.webp";

export type Photo = {
  id: string;
  src: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
  position?: string; // object-position usado nos recortes (cover)
};

export const photos = {
  salao: {
    id: "salao",
    src: salao,
    width: 1032,
    height: 774,
    alt: "Salão de musculação da Central Academia Premium com máquinas vermelhas e iluminação de LED",
    caption: "O salão",
    position: "center 40%",
  },
  halteres: {
    id: "halteres",
    src: halteres,
    width: 574,
    height: 1020,
    alt: "Rack de halteres coloridos entre pilares vermelhos na Central Academia Premium",
    caption: "Halteres",
    position: "center 35%",
  },
  cardio: {
    id: "cardio",
    src: cardio,
    width: 1192,
    height: 670,
    alt: "Área de cardio com bikes de spinning e estações de cabos",
    caption: "Cardio e cabos",
    position: "center",
  },
  maquinas: {
    id: "maquinas",
    src: maquinas,
    width: 723,
    height: 780,
    alt: "Máquinas de musculação em vermelho e preto, com TV ao fundo",
    caption: "Máquinas",
    position: "center",
  },
} satisfies Record<string, Photo>;

export const galleryPhotos: Photo[] = [photos.salao, photos.halteres, photos.cardio, photos.maquinas];

export const logoNovaCorumba = logoNova;
