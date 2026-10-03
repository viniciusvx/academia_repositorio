import { useEffect, useMemo, useState } from "react";

type Period = string[] | "closed" | null; // null = horário não confirmado

type Unit = {
  id: string;
  shortName: string;
  name: string;
  location: string;
  address: string;
  mapQuery: string;
  contact?: { kind: "whatsapp" | "phone"; display: string; digits: string };
  instagram?: { label: string; url: string };
  week?: Period[]; // seg, ter, qua, qui, sex, sáb, dom
  hoursConfirmed?: boolean; // só habilita "Aberto agora" quando verificado
  hoursNote?: string;
  image?: string;
  imageAlt?: string;
  imagePosition?: string;
};

const weekdays = (p: string[]): Period[] => [p, p, p, p, p];
const dayNames = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];

const units: Unit[] = [
  {
    id: "cabral",
    shortName: "Premium Cabral",
    name: "Central Academia Premium — Cabral",
    location: "Rua Cabral · Centro",
    address: "Rua Cabral, s/n — Quadra A, Lote 2, Centro, Corumbá - MS · CEP 79301-080",
    mapQuery: "Central Academia Premium, Rua Cabral, Centro, Corumbá - MS",
    contact: { kind: "whatsapp", display: "(67) 99960-3997", digits: "5567999603997" },
    instagram: { label: "@centralpremiumcabral", url: "https://www.instagram.com/centralpremiumcabral/" },
    week: [null, null, null, null, null, ["07:00 — 11:00"], "closed"],
    hoursNote: "Os horários de segunda a sexta estão em confirmação com a unidade. Chame no WhatsApp.",
    image: "/assets/salao.webp",
    imageAlt: "Salão de musculação da Central Academia Premium com máquinas vermelhas e iluminação de LED",
    imagePosition: "center 40%",
  },
  {
    id: "centro",
    shortName: "Centro",
    name: "Central Academia — Centro",
    location: "Centro · Corumbá",
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
    location: "Nova Corumbá · Corumbá",
    address: "Rua Paraíba, 7, Lote B — Nova Corumbá, Corumbá - MS · CEP 79321-856",
    mapQuery: "Central Academia, Rua Paraíba, 7, Nova Corumbá, Corumbá - MS",
    contact: { kind: "phone", display: "(67) 99166-6996", digits: "5567991666996" },
    image: "/assets/logo-nova-corumba.webp",
    imageAlt: "Logo da Central Academia Nova Corumbá",
    imagePosition: "center",
  },
  {
    id: "aeroporto",
    shortName: "Aeroporto",
    name: "Central Academia — Aeroporto",
    location: "Aeroporto · Corumbá",
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
    location: "Ladário · MS",
    address: "Rua Marcílio Dias, 400 — Setor 2, Ladário - MS · CEP 79370-000",
    mapQuery: "Central Academia Ladário, Rua Marcílio Dias, 400, Ladário - MS",
    contact: { kind: "whatsapp", display: "(67) 99997-7089", digits: "5567999977089" },
    instagram: { label: "@gymladario", url: "https://www.instagram.com/gymladario/" },
    week: [...weekdays(["05:00 — 10:30", "14:00 — 21:30"]), ["07:00 — 11:00"], null],
    hoursNote: "Domingo não divulgado. Consulte a unidade.",
  },
];

const cabral = units[0];

const plans = [
  { tag: "Individual", title: "Mensal", price: 180, featured: true },
  { tag: "Treine em dupla", title: "2 amigos", price: 170 },
  { tag: "Treine em trio", title: "3 amigos", price: 160 },
  { tag: "Rotina flexível", title: "3x na semana", price: 130 },
];

const navItems = [
  ["Início", "inicio"],
  ["Premium", "premium"],
  ["Estrutura", "estrutura"],
  ["Unidades", "unidades"],
  ["Horários", "horarios"],
  ["Localização", "localizacao"],
  ["Contato", "contato"],
];

const toMinutes = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

// Estado "aberto agora" no fuso de Corumbá (America/Campo_Grande).
function openStatus(unit: Unit, now: Date): { open: boolean; label: string } | null {
  if (!unit.hoursConfirmed || !unit.week) return null;
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Campo_Grande",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(now);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  const dayIdx = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].indexOf(get("weekday"));
  const minutes = (Number(get("hour")) % 24) * 60 + Number(get("minute"));
  for (let offset = 0; offset < 8; offset++) {
    const day = unit.week[(dayIdx + offset) % 7];
    if (!Array.isArray(day)) continue;
    for (const period of day) {
      const [from, to] = period.split("—").map((s) => toMinutes(s.trim()));
      if (offset === 0 && minutes >= from && minutes < to) {
        return { open: true, label: `Aberto agora · até ${period.split("—")[1].trim()}` };
      }
      if (offset > 0 || minutes < from) {
        const when = offset === 0 ? "hoje" : offset === 1 ? "amanhã" : dayNames[(dayIdx + offset) % 7].toLowerCase();
        return { open: false, label: `Fechado agora · abre ${when} às ${period.split("—")[0].trim()}` };
      }
    }
  }
  return null;
}

const waLink = (digits: string, text: string) => `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
const cabralMessages = {
  planos: "Olá! Vi o site da Central Academia Premium e gostaria de conhecer os planos disponíveis.",
  visita: "Olá! Vi o site da Central Academia Premium e gostaria de agendar uma visita.",
  duvidas: "Olá! Vi o site da Central Academia Premium e gostaria de tirar algumas dúvidas.",
  horarios: "Olá! Vi o site da Central Academia Premium e gostaria de confirmar os horários de funcionamento.",
};
const cabralWa = (key: keyof typeof cabralMessages) => waLink(cabral.contact!.digits, cabralMessages[key]);
const mapsUrl = (unit: Unit) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(unit.mapQuery)}`;

const Icon = ({
  name,
  size = 20,
}: {
  name: "arrow" | "clock" | "check" | "instagram" | "map" | "menu" | "phone" | "pin" | "tiktok" | "whatsapp" | "x";
  size?: number;
}) => {
  const paths = {
    arrow: <path d="M5 12h14m-5-5 5 5-5 5" />,
    check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
    clock: (
      <>
        <circle cx="12" cy="12" r="8" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    instagram: (
      <>
        <rect x="4" y="4" width="16" height="16" rx="5" />
        <circle cx="12" cy="12" r="3.5" />
        <path d="M17.5 6.5h.01" />
      </>
    ),
    map: (
      <>
        <path d="m3 6 5-2 8 2 5-2v14l-5 2-8-2-5 2Z" />
        <path d="M8 4v14m8-12v14" />
      </>
    ),
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    phone: <path d="M7 3H4.5A1.5 1.5 0 0 0 3 4.5 16.5 16.5 0 0 0 19.5 21a1.5 1.5 0 0 0 1.5-1.5V17l-4-1.5-1.2 2a13 13 0 0 1-9.3-9.3l2-1.2Z" />,
    pin: (
      <>
        <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    tiktok: <path d="M15 4c.6 2.2 2 3.6 4 4v3a8 8 0 0 1-4-1v5.2A5.8 5.8 0 1 1 10 9.5v3.2a2.8 2.8 0 1 0 2 2.6V4Z" />,
    whatsapp: (
      <>
        <path d="M20 11.5a8 8 0 0 1-11.7 7L4 20l1.4-4.2A8 8 0 1 1 20 11.5Z" />
        <path d="M8.2 8.1c.7 3.5 2.3 5.1 5.8 5.8" />
      </>
    ),
    x: <path d="m6 6 12 12M18 6 6 18" />,
  };

  return (
    <svg
      aria-hidden="true"
      fill="none"
      height={size}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.7"
      viewBox="0 0 24 24"
      width={size}
    >
      {paths[name]}
    </svg>
  );
};

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <span className={`brand ${compact ? "brand--compact" : ""}`} aria-label="Central Academia Premium">
      <span className="brand__mark" aria-hidden="true">
        <i />
      </span>
      <span className="brand__type">
        <strong>Central</strong>
        <small>Academia Premium</small>
      </span>
    </span>
  );
}

function ContactButton({ unit, className = "button button--outline" }: { unit: Unit; className?: string }) {
  if (!unit.contact) return null;
  const isWa = unit.contact.kind === "whatsapp";
  const href = isWa
    ? waLink(unit.contact.digits, `Olá! Vi o site da Central Academia e gostaria de falar com a unidade ${unit.shortName}.`)
    : `tel:+${unit.contact.digits}`;
  return (
    <a className={className} href={href} {...(isWa ? { target: "_blank", rel: "noreferrer" } : {})}>
      <Icon name={isWa ? "whatsapp" : "phone"} />
      {isWa ? "Falar no WhatsApp" : `Ligar ${unit.contact.display}`}
    </a>
  );
}

function InstagramLink({ unit }: { unit: Unit }) {
  if (!unit.instagram) return null;
  return (
    <div className="social-links">
      <a href={unit.instagram.url} target="_blank" rel="noreferrer" aria-label={`Instagram ${unit.instagram.label}`}>
        <Icon name="instagram" size={18} />
        <span>{unit.instagram.label}</span>
      </a>
    </div>
  );
}

function App() {
  const [selectedId, setSelectedId] = useState("cabral");
  const [menuOpen, setMenuOpen] = useState(false);
  const [showFab, setShowFab] = useState(false);
  const [now, setNow] = useState(() => new Date());
  const selectedUnit = useMemo(() => units.find((unit) => unit.id === selectedId) ?? units[0], [selectedId]);
  const status = openStatus(selectedUnit, now);
  const mapEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(selectedUnit.mapQuery)}&output=embed`;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("is-visible")),
      { threshold: 0.12 },
    );
    document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 60000);
    return () => window.clearInterval(timer);
  }, []);

  // Parallax discreto no hero (desktop, sem prefers-reduced-motion) + botão flutuante de WhatsApp.
  useEffect(() => {
    const img = document.querySelector<HTMLElement>(".hero__visual img");
    const allowParallax = window.matchMedia("(min-width: 62rem) and (prefers-reduced-motion: no-preference)").matches;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        setShowFab(window.scrollY > window.innerHeight * 0.6);
        if (allowParallax && img && window.scrollY < window.innerHeight) {
          img.style.setProperty("--parallax", `${window.scrollY * 0.12}px`);
        }
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="site-shell">
      <header className="header">
        <a className="header__brand" href="#inicio" aria-label="Central Academia Premium — início">
          <Brand />
        </a>
        <nav className="desktop-nav" aria-label="Navegação principal">
          {navItems.map(([label, id]) => (
            <a href={`#${id}`} key={id}>
              {label}
            </a>
          ))}
        </nav>
        <a className="button button--red header__cta" href={cabralWa("planos")} target="_blank" rel="noreferrer">
          <Icon name="whatsapp" size={18} />
          Falar no WhatsApp
        </a>
        <button
          className="menu-button"
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
        >
          <Icon name={menuOpen ? "x" : "menu"} />
        </button>
        <div className={`mobile-menu ${menuOpen ? "is-open" : ""}`} id="mobile-menu">
          <div className="mobile-menu__inner">
            <span className="eyebrow">Menu</span>
            {navItems.map(([label, id], index) => (
              <a href={`#${id}`} key={id} onClick={() => setMenuOpen(false)}>
                <span>0{index + 1}</span>
                {label}
              </a>
            ))}
            <a className="button button--red" href={cabralWa("planos")} target="_blank" rel="noreferrer">
              <Icon name="whatsapp" size={18} />
              Falar no WhatsApp
            </a>
          </div>
        </div>
      </header>

      <main>
        <section className="hero" id="inicio">
          <div className="hero__visual">
            <picture>
              <source media="(max-width: 48rem)" srcSet="/assets/halteres.webp" />
              <img
                src="/assets/salao.webp"
                alt="Salão de musculação da Central Academia Premium, em Corumbá, com máquinas vermelhas e pretas"
                fetchPriority="high"
              />
            </picture>
            <div className="hero__shade" />
          </div>
          <div className="hero__grid">
            <div className="hero__content reveal">
              <p className="eyebrow eyebrow--light">
                <span />
                Rua Cabral · Centro · Corumbá-MS
              </p>
              <h1>
                Central Academia
                <br />
                <em>Premium.</em>
              </h1>
              <p className="hero__lead">
                Musculação em ambiente climatizado, com amplo espaço, equipamentos de cardio e professores qualificados.
              </p>
              <div className="hero__actions">
                <a className="button button--red" href={cabralWa("planos")} target="_blank" rel="noreferrer">
                  <Icon name="whatsapp" />
                  Conhecer os planos
                </a>
                <a className="text-link text-link--light" href="#estrutura">
                  Ver a estrutura
                </a>
              </div>
            </div>
            <div className="hero__side-note">
              <span>05</span>
              <p>
                unidades da rede Central
                <br />
                em Corumbá e Ladário
              </p>
            </div>
          </div>
          <div className="hero__ticker" aria-hidden="true">
            <div>
              Central Academia Premium <i /> Musculação <i /> Corumbá <i /> Rua Cabral <i /> Central Academia Premium
            </div>
          </div>
        </section>

        <section className="about section" id="premium">
          <div className="section-wrap about__grid reveal">
            <div>
              <p className="eyebrow">A Premium</p>
              <h2>
                Feita em Corumbá.
                <br />
                <span>Pensada para o seu treino.</span>
              </h2>
            </div>
            <div className="about__copy">
              <p>
                A Central Academia Premium fica na Rua Cabral, no Centro de Corumbá. É a unidade da rede Central com
                amplo espaço, aparelhos diversos de musculação, equipamentos de cardio, professores qualificados e
                ambiente climatizado.
              </p>
              <a className="text-link" href="#unidades">
                Conhecer as outras unidades da Central
              </a>
            </div>
          </div>
          <div className="section-wrap highlights reveal">
            {[
              ["Musculação", "Aparelhos diversos"],
              ["Cardio", "Equipamentos de cardio"],
              ["Climatizado", "Ambiente confortável"],
              ["Professores", "Acompanhamento qualificado"],
            ].map(([title, text]) => (
              <div className="highlight" key={title}>
                <Icon name="check" size={22} />
                <strong>{title}</strong>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="structure section" id="estrutura">
          <div className="section-wrap">
            <div className="section-heading reveal">
              <div>
                <p className="eyebrow">Estrutura</p>
                <h2>
                  Espaço para
                  <br />
                  <span>treinar de verdade.</span>
                </h2>
              </div>
              <p>Veja o ambiente onde você vai treinar.</p>
            </div>
            <div className="structure-grid reveal">
              <article className="structure-feature">
                <div className="structure-feature__image mask-reveal">
                  <img
                    src="/assets/maquinas.webp"
                    alt="Máquinas de musculação em vermelho e preto na Central Academia Premium"
                    loading="lazy"
                    width="723"
                    height="780"
                  />
                </div>
                <div>
                  <span>01 / Musculação</span>
                  <h3>Aparelhos diversos para cada grupo muscular.</h3>
                  <p>Máquinas, cabos e bancos distribuídos em um salão amplo e climatizado.</p>
                </div>
              </article>
              <article className="structure-feature structure-feature--reverse">
                <div className="structure-feature__image mask-reveal">
                  <img
                    src="/assets/cardio.webp"
                    alt="Bikes de spinning e esteira na área de cardio da Central Academia Premium"
                    loading="lazy"
                    width="1192"
                    height="670"
                  />
                </div>
                <div>
                  <span>02 / Cardio</span>
                  <h3>Cardio ao lado da musculação.</h3>
                  <p>Equipamentos de cardio no mesmo ambiente, para montar o treino do seu jeito.</p>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="gallery section" aria-labelledby="galeria-title">
          <div className="section-wrap">
            <div className="gallery__heading reveal">
              <p className="eyebrow">Dentro da Central</p>
              <h2 id="galeria-title">
                Movimento.
                <br />
                <span>Constância. Central.</span>
              </h2>
            </div>
            <div className="gallery-grid gallery-grid--editorial reveal">
              <figure className="gallery-grid__a mask-reveal">
                <img src="/assets/salao.webp" alt="Visão geral do salão de treino" loading="lazy" />
                <figcaption>O salão</figcaption>
              </figure>
              <figure className="gallery-grid__b mask-reveal">
                <img src="/assets/halteres.webp" alt="Rack de halteres coloridos e pilares vermelhos" loading="lazy" />
                <figcaption>Halteres</figcaption>
              </figure>
              <figure className="gallery-grid__c mask-reveal">
                <img src="/assets/cardio.webp" alt="Área de cardio com bikes e estações de cabos" loading="lazy" />
                <figcaption>Cardio e cabos</figcaption>
              </figure>
              <figure className="gallery-grid__d mask-reveal">
                <img src="/assets/maquinas.webp" alt="Máquinas de musculação com TV ao fundo" loading="lazy" />
                <figcaption>Máquinas</figcaption>
              </figure>
            </div>
          </div>
        </section>

        <section className="plans section" id="planos" aria-labelledby="plans-title">
          <div className="section-wrap reveal">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Planos e condições</p>
                <h2 id="plans-title">
                  Encontre o plano ideal
                  <br />
                  <span>para sua rotina.</span>
                </h2>
              </div>
              <p>Valores mensais da Central Academia Premium. Pagamento em dinheiro tem desconto.</p>
            </div>
            <div className="plan-grid">
              {plans.map((plan) => (
                <article className={`plan ${plan.featured ? "plan--featured" : ""}`} key={plan.title}>
                  <span>{plan.tag}</span>
                  <h3>{plan.title}</h3>
                  <p className="plan__price">
                    <small>R$</small>
                    <strong>{plan.price}</strong>
                    <small>/mês</small>
                  </p>
                  <a
                    href={waLink(cabral.contact!.digits, `Olá! Vi o site da Central Academia Premium e tenho interesse no plano ${plan.title} (R$ ${plan.price}).`)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Quero este plano <Icon name="arrow" size={16} />
                  </a>
                </article>
              ))}
            </div>
            <p className="plans__note">
              <Icon name="check" size={18} /> Pagamento em dinheiro tem desconto.
            </p>
            <div className="plans__actions">
              <a className="button button--red" href={cabralWa("planos")} target="_blank" rel="noreferrer">
                <Icon name="whatsapp" /> Consultar planos
              </a>
              <a className="button button--outline-dark" href={cabralWa("visita")} target="_blank" rel="noreferrer">
                <Icon name="pin" /> Agendar uma visita
              </a>
              <a className="button button--outline-dark" href={cabralWa("duvidas")} target="_blank" rel="noreferrer">
                <Icon name="phone" /> Tirar dúvidas
              </a>
            </div>
          </div>
        </section>

        <section className="units section section--dark" id="unidades">
          <div className="section-wrap reveal">
            <div className="section-heading section-heading--light">
              <div>
                <p className="eyebrow eyebrow--light">Rede Central</p>
                <h2>
                  Encontre sua
                  <br />
                  <span>Central.</span>
                </h2>
              </div>
              <p>Cinco unidades. Escolha uma para ver endereço, contato e horários.</p>
            </div>

            <div className="unit-selector" role="tablist" aria-label="Escolha uma unidade">
              {units.map((unit, index) => (
                <button
                  className={selectedUnit.id === unit.id ? "is-active" : ""}
                  key={unit.id}
                  onClick={() => setSelectedId(unit.id)}
                  role="tab"
                  type="button"
                  aria-selected={selectedUnit.id === unit.id}
                >
                  <span>0{index + 1}</span>
                  {unit.shortName}
                </button>
              ))}
            </div>

            <div className="unit-detail" role="tabpanel" key={selectedUnit.id}>
              <div className={`unit-detail__image ${selectedUnit.image ? "" : "unit-detail__image--brand"}`}>
                {selectedUnit.image ? (
                  <img
                    src={selectedUnit.image}
                    alt={selectedUnit.imageAlt}
                    style={{ objectPosition: selectedUnit.imagePosition }}
                    loading="lazy"
                  />
                ) : (
                  <Brand />
                )}
                <span>{selectedUnit.location}</span>
              </div>
              <div className="unit-detail__content">
                <p className="eyebrow eyebrow--red">{selectedUnit.id === "cabral" ? "Unidade em destaque" : "Unidade"}</p>
                <h3>{selectedUnit.name}</h3>
                <div className="unit-facts">
                  <div>
                    <Icon name="pin" />
                    <span>
                      <small>Endereço</small>
                      {selectedUnit.address}
                    </span>
                  </div>
                  <div>
                    <Icon name="phone" />
                    <span>
                      <small>{selectedUnit.contact?.kind === "whatsapp" ? "WhatsApp" : "Telefone"}</small>
                      {selectedUnit.contact?.display ?? "Consulte a unidade."}
                    </span>
                  </div>
                </div>
                <InstagramLink unit={selectedUnit} />
                <div className="unit-detail__actions">
                  <a className="button button--red" href={mapsUrl(selectedUnit)} target="_blank" rel="noreferrer">
                    <Icon name="map" />
                    Como chegar
                  </a>
                  <ContactButton unit={selectedUnit} />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="hours section section--red" id="horarios">
          <div className="section-wrap reveal">
            <div className="section-heading section-heading--light">
              <div>
                <p className="eyebrow eyebrow--light">Horários</p>
                <h2>
                  Treine no
                  <br />
                  <span>seu horário.</span>
                </h2>
              </div>
              <p>Cada unidade tem sua rotina. Selecione para consultar.</p>
            </div>
            <div className="hours-layout">
              <div className="hours-nav">
                {units.map((unit) => (
                  <button
                    type="button"
                    key={unit.id}
                    className={selectedUnit.id === unit.id ? "is-active" : ""}
                    onClick={() => setSelectedId(unit.id)}
                  >
                    <span>{unit.shortName}</span>
                    <Icon name="arrow" />
                  </button>
                ))}
              </div>
              <div className="hours-panel">
                <p>{selectedUnit.name}</p>
                {status && (
                  <span className={`open-badge ${status.open ? "is-open" : ""}`} role="status">
                    <i aria-hidden="true" />
                    {status.label}
                  </span>
                )}
                {selectedUnit.week ? (
                  <div className="hours-panel__rows">
                    {selectedUnit.week.map((day, index) => (
                      <div key={dayNames[index]}>
                        <span>{dayNames[index]}</span>
                        <strong>
                          {Array.isArray(day) ? (
                            day.map((period) => <span key={period}>{period}</span>)
                          ) : day === "closed" ? (
                            <span>Fechado</span>
                          ) : (
                            <span className="is-unknown">A confirmar</span>
                          )}
                        </strong>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="hours-panel__empty">
                    <Icon name="clock" size={34} />
                    <h3>Horário em confirmação</h3>
                    <p>Fale com a unidade antes de sair para treinar.</p>
                  </div>
                )}
                {(selectedUnit.hoursNote || !selectedUnit.week) && selectedUnit.contact && (
                  <p className="hours-panel__note">
                    {selectedUnit.hoursNote ?? "Ainda não temos os horários desta unidade."}{" "}
                    {selectedUnit.id === "cabral" ? (
                      <a href={cabralWa("horarios")} target="_blank" rel="noreferrer">
                        Perguntar no WhatsApp <Icon name="arrow" size={16} />
                      </a>
                    ) : null}
                  </p>
                )}
              </div>
            </div>
            <p className="hours__notice">Sujeitos a alterações em feriados. Confirme com a unidade antes da visita.</p>
          </div>
        </section>

        <section className="locations section" id="localizacao" aria-labelledby="locations-title">
          <div className="section-wrap">
            <div className="section-heading reveal">
              <div>
                <p className="eyebrow">Localização</p>
                <h2 id="locations-title">
                  Perto do seu
                  <br />
                  <span>caminho.</span>
                </h2>
              </div>
              <p>Selecione uma unidade e abra a rota direto no Google Maps.</p>
            </div>
            <div className="map-layout reveal">
              <div className="map-list">
                {units.map((unit, index) => (
                  <button
                    type="button"
                    key={unit.id}
                    className={selectedUnit.id === unit.id ? "is-active" : ""}
                    onClick={() => setSelectedId(unit.id)}
                  >
                    <span>0{index + 1}</span>
                    <div>
                      <strong>{unit.shortName}</strong>
                      <small>{unit.address.split(" · ")[0]}</small>
                    </div>
                    <Icon name="arrow" />
                  </button>
                ))}
              </div>
              <div className="map-frame">
                <iframe
                  key={selectedUnit.id}
                  title={`Mapa da ${selectedUnit.name}`}
                  src={mapEmbedUrl}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <div className="map-frame__label">
                  <span>{selectedUnit.shortName}</span>
                  <a href={mapsUrl(selectedUnit)} target="_blank" rel="noreferrer">
                    Como chegar <Icon name="arrow" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="social-section section section--dark" aria-labelledby="social-title">
          <div className="section-wrap social-section__grid reveal">
            <div>
              <p className="eyebrow eyebrow--light">Acompanhe a Central</p>
              <h2 id="social-title">
                O treino
                <br />
                <span>continua no feed.</span>
              </h2>
              <p>Novidades e rotina direto no Instagram das unidades.</p>
            </div>
            <div className="social-directory">
              {units
                .filter((unit) => unit.instagram)
                .map((unit) => (
                  <div key={unit.id}>
                    <strong>{unit.shortName}</strong>
                    <InstagramLink unit={unit} />
                  </div>
                ))}
            </div>
          </div>
        </section>

        <section className="final-cta" id="contato">
          <img src="/assets/salao.webp" alt="" loading="lazy" />
          <div className="final-cta__shade" />
          <div className="final-cta__content section-wrap reveal">
            <p className="eyebrow eyebrow--light">Seu próximo treino</p>
            <h2>
              A Central Premium
              <br />
              <span>está esperando você.</span>
            </h2>
            <div className="hero__actions">
              <a className="button button--red" href={cabralWa("visita")} target="_blank" rel="noreferrer">
                <Icon name="whatsapp" />
                Agendar uma visita
              </a>
              <a className="button button--outline-light" href={mapsUrl(cabral)} target="_blank" rel="noreferrer">
                <Icon name="map" />
                Como chegar
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="section-wrap footer__top">
          <div>
            <Brand />
            <p>{cabral.address.split(" · ")[0]}</p>
            <p>WhatsApp {cabral.contact?.display}</p>
          </div>
          <div className="footer__links">
            <div>
              <span>Navegue</span>
              {navItems.slice(0, 5).map(([label, id]) => (
                <a href={`#${id}`} key={id}>
                  {label}
                </a>
              ))}
            </div>
            <div>
              <span>Unidades</span>
              {units.map((unit) => (
                <a href="#unidades" key={unit.id} onClick={() => setSelectedId(unit.id)}>
                  {unit.shortName}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="section-wrap footer__bottom">
          <p>© {new Date().getFullYear()} Central Academia. Todos os direitos reservados.</p>
          <p>Horários sujeitos a alterações. Confirme com a unidade antes da visita.</p>
        </div>
      </footer>

      <a
        className={`fab ${showFab ? "is-visible" : ""}`}
        href={cabralWa("planos")}
        target="_blank"
        rel="noreferrer"
        aria-label="Falar com a Central Academia Premium no WhatsApp"
        tabIndex={showFab ? 0 : -1}
      >
        <Icon name="whatsapp" size={26} />
        <span>WhatsApp</span>
      </a>
    </div>
  );
}

export default App;
