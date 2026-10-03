import { logoNovaCorumba, photos, type Photo } from "./photos";

// null = horário não confirmado; "closed" = fechado
export type Period = string[] | "closed" | null;

export type Unit = {
  id: string;
  shortName: string;
  name: string;
  city: string;
  location: string;
  street: string; // linha curta (cards, rodapé)
  address: string; // endereço completo
  mapQuery: string;
  contact?: { kind: "whatsapp" | "phone"; display: string; digits: string };
  instagram?: { label: string; url: string };
  week?: Period[]; // seg, ter, qua, qui, sex, sáb, dom
  hoursConfirmed?: boolean; // só habilita "Aberto agora" quando verificado
  hoursNote?: string;
  photo?: Photo;
  logo?: string;
};

export const dayNames = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];

const weekdays = (p: string[]): Period[] => [p, p, p, p, p];

export const units: Unit[] = [
  {
    id: "cabral",
    shortName: "Premium Cabral",
    name: "Central Academia Premium",
    city: "Corumbá - MS",
    location: "Rua Cabral · Centro",
    street: "Rua Cabral, s/n — Quadra A, Lote 2",
    address: "Rua Cabral, s/n — Quadra A, Lote 2, Centro, Corumbá - MS · CEP 79301-080",
    mapQuery: "Central Academia Premium, Rua Cabral, Centro, Corumbá - MS",
    contact: { kind: "whatsapp", display: "(67) 99960-3997", digits: "5567999603997" },
    instagram: { label: "@centralpremiumcabral", url: "https://www.instagram.com/centralpremiumcabral/" },
    week: [null, null, null, null, null, ["07:00 — 11:00"], "closed"],
    hoursNote: "Os horários de segunda a sexta estão em confirmação com a unidade.",
    photo: photos.salao,
  },
  {
    id: "centro",
    shortName: "Centro",
    name: "Central Academia — Centro",
    city: "Corumbá - MS",
    location: "Centro · Corumbá",
    street: "Rua Antônio Maria Coelho, 306",
    address: "Rua Antônio Maria Coelho, 306 — Centro, Corumbá - MS · CEP 79301-000",
    mapQuery: "Central Academia, Rua Antônio Maria Coelho, 306, Corumbá - MS",
    contact: { kind: "phone", display: "(67) 3231-8635", digits: "556732318635" },
    week: [...weekdays(["05:30 — 10:30", "14:00 — 21:30"]), ["07:00 — 11:00"], "closed"],
    hoursConfirmed: true,
  },
  {
    id: "nova-corumba",
    shortName: "Nova Corumbá",
    name: "Central Academia — Nova Corumbá",
    city: "Corumbá - MS",
    location: "Nova Corumbá · Corumbá",
    street: "Rua Paraíba, 7, Lote B",
    address: "Rua Paraíba, 7, Lote B — Nova Corumbá, Corumbá - MS · CEP 79321-856",
    mapQuery: "Central Academia, Rua Paraíba, 7, Nova Corumbá, Corumbá - MS",
    contact: { kind: "phone", display: "(67) 99166-6996", digits: "5567991666996" },
    logo: logoNovaCorumba,
  },
  {
    id: "aeroporto",
    shortName: "Aeroporto",
    name: "Central Academia — Aeroporto",
    city: "Corumbá - MS",
    location: "Aeroporto · Corumbá",
    street: "Rua Edu Rocha, s/n, Lote 27",
    address: "Rua Edu Rocha, s/n, Lote 27 — Aeroporto, Corumbá - MS · CEP 79320-130",
    mapQuery: "Central Academia, Rua Edu Rocha, Aeroporto, Corumbá - MS",
    contact: { kind: "whatsapp", display: "(67) 99659-0203", digits: "5567996590203" },
    week: [...weekdays(["05:00 — 10:00", "15:00 — 21:30"]), null, null],
    hoursNote: "Horário de fim de semana não divulgado. Consulte a unidade.",
  },
  {
    id: "ladario",
    shortName: "Ladário",
    name: "Central Academia — Ladário",
    city: "Ladário - MS",
    location: "Ladário · MS",
    street: "Rua Marcílio Dias, 400 — Setor 2",
    address: "Rua Marcílio Dias, 400 — Setor 2, Ladário - MS · CEP 79370-000",
    mapQuery: "Central Academia Ladário, Rua Marcílio Dias, 400, Ladário - MS",
    contact: { kind: "whatsapp", display: "(67) 99997-7089", digits: "5567999977089" },
    instagram: { label: "@gymladario", url: "https://www.instagram.com/gymladario/" },
    week: [...weekdays(["05:00 — 10:30", "14:00 — 21:30"]), ["07:00 — 11:00"], null],
    hoursNote: "Domingo não divulgado. Consulte a unidade.",
  },
];

export const cabral = units[0];
export const unitById = (id?: string) => units.find((unit) => unit.id === id);
