import Button from "../components/Button";
import Icon from "../components/Icon";
import PageHero from "../components/PageHero";
import { plans, planNote } from "../data/plans";
import { photos } from "../data/photos";
import { useMeta } from "../hooks/useMeta";
import { cabralWa, planWa } from "../lib/links";

export default function Planos() {
  useMeta(
    "Planos e valores | Central Academia Premium · Corumbá-MS",
    "Planos da Central Academia Premium, em Corumbá-MS: mensal R$ 180, 2 amigos R$ 170, 3 amigos R$ 160 e 3x na semana R$ 130. Pagamento em dinheiro tem desconto.",
    "/planos",
  );
  return (
    <>
      <PageHero
        eyebrow="Planos e condições"
        title={
          <>
            Encontre o plano ideal <em>para sua rotina.</em>
          </>
        }
        lead={`Valores mensais da Central Academia Premium. ${planNote}`}
        photo={photos.cardio}
      />

      <section className="section">
        <div className="wrap">
          <div className="plan-grid">
            {plans.map((plan, index) => (
              <article
                className={`plan ${plan.featured ? "plan--featured" : ""}`}
                key={plan.title}
                data-reveal
                style={{ transitionDelay: `${index * 70}ms` }}
              >
                <span>{plan.tag}</span>
                <h2>{plan.title}</h2>
                <p className="plan__price">
                  <small>R$</small>
                  <strong>{plan.price}</strong>
                  <small>/mês</small>
                </p>
                <a href={planWa(plan.title, plan.price)} target="_blank" rel="noopener noreferrer">
                  Quero este plano <Icon name="arrow" size={16} />
                </a>
              </article>
            ))}
          </div>
          <p className="plans-note" data-reveal>
            <Icon name="check" size={18} /> {planNote}
          </p>
        </div>
      </section>

      <section className="section section--dark next-steps">
        <div className="wrap next-steps__grid" data-reveal>
          <div>
            <p className="eyebrow eyebrow--light">Próximo passo</p>
            <h2>
              Quer conhecer
              <br />
              <span>antes de decidir?</span>
            </h2>
            <p>Agende uma visita pela Rua Cabral, ou tire as dúvidas pelo WhatsApp.</p>
          </div>
          <div className="stack">
            <Button href={cabralWa("visita")} icon="whatsapp">
              Agendar uma visita
            </Button>
            <Button href={cabralWa("duvidas")} variant="outline" icon="phone">
              Tirar dúvidas
            </Button>
            <Button to="/unidades/cabral" variant="outline" icon="pin">
              Ver endereço e horários
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
