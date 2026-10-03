export type Plan = { tag: string; title: string; price: number; featured?: boolean };

export const plans: Plan[] = [
  { tag: "Individual", title: "Mensal", price: 180, featured: true },
  { tag: "Treine em dupla", title: "2 amigos", price: 170 },
  { tag: "Treine em trio", title: "3 amigos", price: 160 },
  { tag: "Rotina flexível", title: "3x na semana", price: 130 },
];

export const planNote = "Pagamento em dinheiro tem desconto.";
