import { cabral, type Unit } from "../data/units";

export const waLink = (digits: string, text: string) => `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;

export const cabralMessages = {
  planos: "Olá! Vi o site da Central Academia Premium e gostaria de conhecer os planos disponíveis.",
  visita: "Olá! Vi o site da Central Academia Premium e gostaria de agendar uma visita.",
  duvidas: "Olá! Vi o site da Central Academia Premium e gostaria de tirar algumas dúvidas.",
  horarios: "Olá! Vi o site da Central Academia Premium e gostaria de confirmar os horários de funcionamento.",
  servicos:
    "Olá! Vi o site da Central Academia Premium e gostaria de saber sobre personal, avaliação física e convênios.",
};

export const cabralWa = (key: keyof typeof cabralMessages) => waLink(cabral.contact!.digits, cabralMessages[key]);

export const planWa = (title: string, price: number) =>
  waLink(cabral.contact!.digits, `Olá! Vi o site da Central Academia Premium e tenho interesse no plano ${title} (R$ ${price}).`);

export const mapsUrl = (unit: Unit) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(unit.mapQuery)}`;

export const mapEmbedUrl = (unit: Unit) => `https://www.google.com/maps?q=${encodeURIComponent(unit.mapQuery)}&output=embed`;

export const unitContactHref = (unit: Unit) => {
  if (!unit.contact) return undefined;
  return unit.contact.kind === "whatsapp"
    ? waLink(unit.contact.digits, `Olá! Vi o site da Central Academia e gostaria de falar com a unidade ${unit.shortName}.`)
    : `tel:+${unit.contact.digits}`;
};
